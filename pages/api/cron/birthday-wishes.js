import { supabaseAdmin } from "../../../lib/supabaseClient";
import { sendWhatsAppWish } from "../../../lib/twilio";

// Vercel calls this automatically every day (see vercel.json for the schedule).
// It finds everyone whose birthday is today and sends them a WhatsApp wish,
// skipping anyone already wished today (so redeploys/retries never double-send).
export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = supabaseAdmin();
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = today.toISOString().slice(0, 10);

  // Supabase doesn't filter month/day directly, so pull active clients and filter in code.
  const { data: clients, error } = await db.from("clients").select("*").eq("status", "Active");
  if (error) return res.status(500).json({ error: error.message });

  const birthdayClients = clients.filter((c) => c.dob && c.dob.slice(5, 7) === mm && c.dob.slice(8, 10) === dd);

  const results = [];
  for (const client of birthdayClients) {
    const { data: already } = await db
      .from("wish_log")
      .select("id")
      .eq("client_id", client.id)
      .eq("channel", "whatsapp")
      .eq("wish_date", todayStr)
      .maybeSingle();

    if (already) {
      results.push({ client: client.name, status: "already sent today" });
      continue;
    }

    try {
      await sendWhatsAppWish(client.whatsapp || client.phone, client.name);
      await db.from("wish_log").insert({ client_id: client.id, channel: "whatsapp", wish_date: todayStr });
      results.push({ client: client.name, status: "sent" });
    } catch (e) {
      results.push({ client: client.name, status: "failed", error: e.message });
    }
  }

  return res.status(200).json({ date: todayStr, totalBirthdaysToday: birthdayClients.length, results });
}
