import Twilio from "twilio";

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export function whatsappTemplate(name) {
  return `Dear ${name},\n\nWishing you a very Happy Birthday from Oranz Body Spa.\nMay your year be filled with happiness, good health, relaxation, and success.\n\nThank you for being a valued client.\n\nWarm Regards,\nOranz Body Spa`;
}

export async function sendWhatsAppWish(toNumber, name) {
  const to = toNumber.startsWith("whatsapp:") ? toNumber : `whatsapp:${toNumber}`;
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to,
    body: whatsappTemplate(name),
  });
}
