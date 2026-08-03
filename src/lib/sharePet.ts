import type { Dog } from '@/data/dogs';

export function petShareUrl(id: string): string {
  return `${window.location.origin}/pet/${id}`;
}

function shareText(name: string, locale: string): string {
  return locale === 'en' ? `Help ${name} find a home 🐾` : `დაეხმარე ${name}-ს ოჯახის პოვნაში 🐾`;
}

/** უფასო Telegram Share — ტოკენი არ სჭირდება (t.me/share). */
export function telegramShareUrl(dog: { id: string; name: string }, locale: string): string {
  const url = petShareUrl(dog.id);
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText(dog.name, locale))}`;
}

/** უფასო WhatsApp Share. */
export function whatsappShareUrl(dog: { id: string; name: string }, locale: string): string {
  const url = petShareUrl(dog.id);
  const text = `${shareText(dog.name, locale)}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** უფასო Facebook Share. */
export function facebookShareUrl(dog: { id: string }): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(petShareUrl(dog.id))}`;
}

/** ნატიური share ან clipboard კოპირება. */
export async function sharePetLink(dog: Dog, locale: string): Promise<'shared' | 'copied' | 'dismissed'> {
  const url = petShareUrl(dog.id);
  const title = `${dog.name} — mipove.me`;
  const text = shareText(dog.name, locale);
  console.log('[share] pet link', { id: dog.id, url });

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'dismissed';
    }
  }

  await navigator.clipboard.writeText(url);
  return 'copied';
}
