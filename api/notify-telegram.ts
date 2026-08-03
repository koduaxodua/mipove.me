import type { ApiRequest, ApiResponse } from './_admin.js';
import { isUuid, readJson, sendJson, sendMethodNotAllowed, supabaseRest } from './_admin.js';

const SITE = 'https://mipove.me';
// მხოლოდ ახლახან დამატებული ცხოველის გამოცხადება შეიძლება — ძველი პროფილებით სპამი არ გამოვა.
const MAX_PET_AGE_MS = 15 * 60 * 1000;

type PetRow = {
  id: string;
  name: string;
  age: string | null;
  breed: string | null;
  location: string | null;
  photo_url: string | null;
  description: string | null;
  created_at: string;
};

/**
 * ახალი ცხოველის ავტო-პოსტი Telegram არხზე (უფასო Bot API).
 * ჩართვა: Vercel-ზე TELEGRAM_BOT_TOKEN და TELEGRAM_CHANNEL_ID ცვლადების დამატება.
 * სანამ ცვლადები არ არის — ფუნქცია ჩუმად ითიშება (204).
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    sendMethodNotAllowed(res, ['POST']);
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  if (!token || !chatId) {
    res.statusCode = 204;
    res.end();
    return;
  }

  let petId: unknown;
  try {
    ({ petId } = await readJson<{ petId?: unknown }>(req));
  } catch {
    sendJson(res, 400, { error: 'invalid_json' });
    return;
  }
  if (!isUuid(petId)) {
    sendJson(res, 400, { error: 'invalid_pet_id' });
    return;
  }

  const { data, error } = await supabaseRest<PetRow[]>(
    `pets_public?id=eq.${petId}&select=id,name,age,breed,location,photo_url,description,created_at&limit=1`
  );
  const pet = data?.[0];
  if (error || !pet) {
    sendJson(res, 404, { error: 'pet_not_found' });
    return;
  }

  if (Date.now() - new Date(pet.created_at).getTime() > MAX_PET_AGE_MS) {
    sendJson(res, 409, { error: 'pet_too_old' });
    return;
  }

  const detailsLine = [pet.breed, pet.age, pet.location].filter(Boolean).join(' · ');
  const caption = [
    `🐾 ${pet.name}`,
    detailsLine,
    (pet.description ?? '').slice(0, 300),
    `👉 ${SITE}/pet/${pet.id}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const hasPhoto = Boolean(pet.photo_url && /^https?:\/\//.test(pet.photo_url));
  const endpoint = hasPhoto ? 'sendPhoto' : 'sendMessage';
  const payload = hasPhoto
    ? { chat_id: chatId, photo: pet.photo_url, caption }
    : { chat_id: chatId, text: caption };

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!tgRes.ok) {
      console.error('[telegram] send failed', { status: tgRes.status });
      sendJson(res, 502, { error: 'telegram_failed' });
      return;
    }
  } catch (error) {
    console.error('[telegram] send failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    sendJson(res, 502, { error: 'telegram_failed' });
    return;
  }

  console.log('[telegram] pet announced', { petId: pet.id });
  sendJson(res, 200, { ok: true });
}
