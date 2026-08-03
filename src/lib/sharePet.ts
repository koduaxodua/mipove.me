import type { Dog } from '@/data/dogs';

export function petShareUrl(id: string): string {
  return `${window.location.origin}/pet/${id}`;
}

/**
 * აზიარებს ცხოველის ლინკს: ჯერ ნატიური share მენიუთი (მობილურზე),
 * თუ არაა — კოპირებს ბუფერში. აბრუნებს რა მოხდა, რომ UI-მ toast აჩვენოს.
 */
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
      // share sheet ვერ გაიხსნა — გადავდივართ კოპირებაზე
    }
  }

  await navigator.clipboard.writeText(url);
  return 'copied';
}
