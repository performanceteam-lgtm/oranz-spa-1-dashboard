import { supabaseAdmin } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  const db = supabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await db.from("clients").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const b = req.body;
    if (!b.name || !b.dob) return res.status(400).json({ error: "Full name and date of birth are required" });

    const { count } = await db.from("clients").select("*", { count: "exact", head: true });
    const client_code = `OBS-${1001 + (count || 0)}`;

    const { data, error } = await db
      .from("clients")
      .insert({
        client_code,
        name: b.name,
        phone: b.mobile,
        whatsapp: b.whatsapp || b.mobile,
        email: b.email,
        dob: b.dob,
        gender: b.gender,
        city: b.city,
        membership: b.membership || "Silver",
        branch: b.branch || "Agra",
        anniversary: b.anniversary || null,
        notes: b.notes,
        status: "Active",
        vip: false,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
