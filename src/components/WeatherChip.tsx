import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/Locale';

type WeatherKind = 'sun' | 'cloud-sun' | 'cloud' | 'rain';

type WeatherData = {
  temp: number;
  kind: WeatherKind;
};

function kindFromCode(code: number): WeatherKind {
  if (code === 0) return 'sun';
  if (code <= 2) return 'cloud-sun';
  if (code <= 48) return 'cloud';
  return 'rain';
}

function WeatherIcon({ kind }: { kind: WeatherKind }) {
  if (kind === 'sun') {
    return (
      <span className="relative grid h-8 w-8 place-items-center" aria-hidden>
        <span className="h-4 w-4 animate-[spin_12s_linear_infinite] rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" />
      </span>
    );
  }

  if (kind === 'cloud-sun') {
    return (
      <span className="relative h-8 w-8" aria-hidden>
        <span className="absolute right-0 top-0.5 h-3 w-3 animate-[spin_14s_linear_infinite] rounded-full bg-amber-400" />
        <span className="absolute bottom-1 left-0.5 h-3.5 w-5 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-slate-300/90" />
      </span>
    );
  }

  if (kind === 'cloud') {
    return (
      <span className="relative grid h-8 w-8 place-items-center" aria-hidden>
        <span className="h-3.5 w-6 animate-[pulse_3.2s_ease-in-out_infinite] rounded-full bg-slate-300/90" />
      </span>
    );
  }

  return (
    <span className="relative h-8 w-8 overflow-hidden" aria-hidden>
      <span className="absolute left-1 top-1 h-3 w-5 rounded-full bg-slate-300/90" />
      <span className="absolute left-2 top-4 h-1.5 w-0.5 animate-[bounce_0.9s_infinite] rounded-full bg-sky-400" />
      <span className="absolute left-3.5 top-4 h-1.5 w-0.5 animate-[bounce_1.1s_infinite] rounded-full bg-sky-400" style={{ animationDelay: '120ms' }} />
      <span className="absolute left-5 top-4 h-1.5 w-0.5 animate-[bounce_1s_infinite] rounded-full bg-sky-400" style={{ animationDelay: '240ms' }} />
    </span>
  );
}

/**
 * Open-Meteo (უფასო) — ტემპერატურა + პატარა ამინდის ანიმაცია ლოკაციის მიხედვით.
 */
export function WeatherChip({ lat, lng }: { lat?: number; lng?: number }) {
  const { locale } = useLocale();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      setWeather(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude', String(lat));
        url.searchParams.set('longitude', String(lng));
        url.searchParams.set('current', 'temperature_2m,weather_code');
        const res = await fetch(url);
        if (!res.ok) return;
        const body = (await res.json()) as {
          current?: { temperature_2m?: number; weather_code?: number };
        };
        const temp = body.current?.temperature_2m;
        const code = body.current?.weather_code;
        if (cancelled || typeof temp !== 'number' || typeof code !== 'number') return;
        console.log('[weather] loaded', { lat, lng, temp, code });
        setWeather({ temp: Math.round(temp), kind: kindFromCode(code) });
      } catch (error) {
        console.warn('[weather] open-meteo unavailable', {
          message: error instanceof Error ? error.message : 'unknown',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  if (!weather) return null;

  return (
    <div
      className="glass inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5"
      title={locale === 'en' ? 'Approximate area weather' : 'დაახლოებითი ადგილის ამინდი'}
    >
      <WeatherIcon kind={weather.kind} />
      <span className="text-sm font-semibold text-foreground">{weather.temp}°</span>
      <span className="text-[10px] text-muted-foreground">
        {locale === 'en' ? 'now' : 'ახლა'}
      </span>
    </div>
  );
}
