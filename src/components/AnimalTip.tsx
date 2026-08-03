import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/Locale';
import { translate } from '@/lib/translate';

/**
 * უფასო public API (catfact.ninja) — მოკლე ცნობა ცხოველებზე.
 * ქართულ ლოკალზე MyMemory-ით ითარგმნება; თუ API მიუწვდომელია, იშლება.
 */
export function AnimalTip() {
  const { locale } = useLocale();
  const [fact, setFact] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setFact(null);

    (async () => {
      try {
        const res = await fetch('https://catfact.ninja/fact');
        if (!res.ok) return;
        const body = (await res.json()) as { fact?: string };
        if (!body.fact) return;

        const display =
          locale === 'ka' ? await translate(body.fact, 'ka') : body.fact;

        if (!cancelled) {
          console.log('[animal-tip] loaded', { locale, translated: locale === 'ka' });
          setFact(display);
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
  }, [locale]);

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
