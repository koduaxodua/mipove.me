import type { Dog } from '@/data/dogs';

export function petShareUrl(id: string): string {
  return `${window.location.origin}/pet/${id}`;
}

/** უფასო Telegram Share — ტოკენი არ სჭირდება (t.me/share). */
export function telegramShareUrl(dog: { id: string; name: string }, locale: string): string {
  const url = petShareUrl(dog.id);
  const text =
    locale === 'en' ? `Help ${dog.name} find a home 🐾` : `დაეხმარე ${dog.name}-ს ოჯახის პოვნაში 🐾`;
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/** ნატიური share ან clipboard კოპირება. */
export async function sharePetLink(dog: Dog, locale: string): Promise<'shared' | 'copied' | 'dismissed'> {
  const url = petShareUrl(dog.id);
  const title = `${dog.name} — mipove.me`;
  const text = locale === 'en' ? `Help ${dog.name} find a home 🐾` : `დაეხმარე ${dog.name}-ს ოჯახის პოვნაში 🐾`;
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
