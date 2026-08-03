import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/Locale';

const REFRESH_INTERVAL_MS = 300 * 1000;

type VisitorData = {
  visitors: number;
  updatedAt: string;
};

function formatUpdatedAt(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'ka-GE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * აჩვენებს ბოლო 30 დღის ვიზიტორების რაოდენობას /api/visitor-count-იდან.
 * სანამ მონაცემი არ მოვა (ან API მიუწვდომელია), საერთოდ არ ჩანს.
 */
export function MonthlyVisitors() {
  const { locale } = useLocale();
  const [data, setData] = useState<VisitorData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/visitor-count');
        if (!res.ok || res.status === 204) {
          console.warn('[visitors] Visitor count unavailable', { status: res.status });
          return;
        }
        const body = (await res.json()) as Partial<VisitorData>;
        if (!cancelled && Number.isFinite(body.visitors) && typeof body.updatedAt === 'string') {
          setData(body as VisitorData);
        }
      } catch (error) {
        console.warn('[visitors] Visitor count unavailable', {
          message: error instanceof Error ? error.message : 'unknown',
        });
      }
    };

    load();
    const intervalId = window.setInterval(() => void load(), REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  if (!data) return null;

  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ka-GE').format(data.visitors);
  const label =
    locale === 'en'
      ? `30 days · ${formatted} ${data.visitors === 1 ? 'visitor' : 'visitors'}`
      : `30 დღე · ${formatted} სტუმარი`;
  const updatedAt = formatUpdatedAt(data.updatedAt, locale);

  return (
    <span
      className="mt-1 inline-flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground sm:text-[10px]"
      title={updatedAt ? (locale === 'en' ? `Updated at ${updatedAt}` : `განახლდა ${updatedAt}-ზე`) : undefined}
      aria-label={
        locale === 'en'
          ? `${formatted} visitors in the last 30 days`
          : `ბოლო 30 დღეში ${data.visitors} სტუმარი`
      }
      aria-live="polite"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
      {label}
    </span>
  );
}
