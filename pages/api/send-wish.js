import { supabaseAdmin } from "../../lib/supabaseClient";
import { sendWhatsAppWish } from "../../lib/twilio";

// Called when someone clicks the WhatsApp icon next to a client in the dashboard.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { clientId } = req.body;
  const db = supabaseAdmin();
  const { data: client, error } = await db.from("clients").select("*").eq("id", clientId).single();
  if (error || !client) return res.status(404).json({ error: "Client not found" });

  try {
    await sendWhatsAppWish(client.whatsapp || client.phone, client.name);
    await db.from("wish_log").upsert(
      { client_id: client.id, channel: "whatsapp", wish_date: new Date().toISOString().slice(0, 10) },
      { onConflict: "client_id,channel,wish_date" }
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
