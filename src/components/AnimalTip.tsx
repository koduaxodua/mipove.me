import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/Locale';

/**
 * უფასო public API (catfact.ninja) — მოკლე ცნობა ცხოველებზე.
 * ჩანს სვაიპის ბოლოს; თუ API მიუწვდომელია, უბრალოდ იშლება.
 */
export function AnimalTip() {
  const { locale } = useLocale();
  const [fact, setFact] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://catfact.ninja/fact');
        if (!res.ok) return;
        const body = (await res.json()) as { fact?: string };
        if (!cancelled && typeof body.fact === 'string' && body.fact.length > 0) {
          console.log('[animal-tip] loaded free catfact.ninja fact');
          setFact(body.fact);
        }
      } catch (error) {
        console.warn('[animal-tip] free API unavailable', {
          message: error instanceof Error ? error.message : 'unknown',
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!fact) return null;

  return (
    <p className="mt-4 max-w-xs text-center text-[11px] leading-relaxed text-muted-foreground">
      <span className="font-semibold text-foreground/80">
        {locale === 'en' ? 'Fun fact · ' : 'ცნობისთვის · '}
      </span>
      {fact}
    </p>
  );
}
