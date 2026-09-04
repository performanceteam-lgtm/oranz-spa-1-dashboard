import { supabaseAdmin } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const db = supabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await db.from("settings").select("*").eq("key", "whatsapp_message_template").maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ whatsapp_message_template: data?.value || null });
  }

  if (req.method === "POST") {
    const { whatsapp_message_template } = req.body;
    if (!whatsapp_message_template) return res.status(400).json({ error: "Message template required" });

    const { error } = await db
      .from("settings")
      .upsert({ key: "whatsapp_message_template", value: whatsapp_message_template }, { onConflict: "key" });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
