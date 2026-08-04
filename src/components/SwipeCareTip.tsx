import { ArrowRight, BookOpen, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/contexts/Locale';

const TIPS = {
  ka: [
    'თუ ქუჩაში უცნობ ცხოველს შეამჩნევ, უსაფრთხო დისტანციიდან ფოტო და ზუსტი ადგილი დააფიქსირე.',
    'ცხოველთან ახლოს მისვლამდე დააკვირდი მის ქცევას. შეშინებულს სივრცე და მშვიდი მოძრაობა სჭირდება.',
    'თუ დახმარება ადგილზე ვერ შეგიძლია, ერთი ფოტო და ლოკაცია მაინც შეიძლება გადამწყვეტი ინფორმაცია გახდეს.',
  ],
  en: [
    'If you spot an unfamiliar animal, take a photo from a safe distance and record the exact location.',
    'Observe an animal before approaching. A frightened animal needs space and calm movement.',
    'If you cannot help on the spot, one photo and a location can still be the key piece of information.',
  ],
} as const;

export function SwipeCareTip({ index, onContinue }: { index: number; onContinue: () => void }) {
  const { locale } = useLocale();
  const isEnglish = locale === 'en';
  const tips = TIPS[locale];
  const tip = tips[index % tips.length];

  return (
    <section
      data-testid="swipe-care-tip"
      className="glass-strong flex h-full w-full flex-col justify-between rounded-3xl border border-primary/25 p-6 text-left shadow-xl"
      aria-label={isEnglish ? 'Practical animal care tip' : 'ცხოველის დახმარების რჩევა'}
    >
      <div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Lightbulb className="h-5 w-5" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-primary">
          {isEnglish ? 'Quick tip' : 'მოკლე რჩევა'}
        </p>
        <p className="mt-3 text-xl font-semibold leading-relaxed text-foreground sm:text-2xl">{tip}</p>
      </div>

      <div className="space-y-3">
        <Link to="/guide" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <BookOpen className="h-4 w-4" />
          {isEnglish ? 'Open guides' : 'გზამკვლევების ნახვა'}
        </Link>
        <button
          type="button"
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
        >
          {isEnglish ? 'Continue swiping' : 'სვაიპის გაგრძელება'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
