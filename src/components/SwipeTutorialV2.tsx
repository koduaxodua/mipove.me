import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Map, X } from 'lucide-react';
import { useLocale } from '@/contexts/Locale';

const TUTORIAL_KEY = 'pawswipe_tutorial_seen_v3';

export function SwipeTutorialV2() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(() =>
    typeof window !== 'undefined' && !localStorage.getItem(TUTORIAL_KEY)
  );

  const close = () => {
    localStorage.setItem(TUTORIAL_KEY, '1');
    setOpen(false);
  };

  const isEnglish = locale === 'en';

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/75 px-5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={close}
    >
      <div className="flex h-full items-center justify-center">
        <motion.div
          className="max-w-sm rounded-3xl border border-white/15 bg-background/90 p-5 text-center shadow-2xl"
          initial={{ y: 20, scale: 0.96 }}
          animate={{ y: 0, scale: 1 }}
          onPointerDown={event => event.stopPropagation()}
        >
          <h2 className="text-xl font-bold">{isEnglish ? 'How it works' : 'როგორ გამოიყენო'}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isEnglish
              ? 'Swipe left to skip, or swipe right to save a pet. The buttons below do the same thing.'
              : 'მარცხნივ გადასმა გამოტოვებაა, მარჯვნივ გადასმა კი ცხოველის მოწონება. ქვედა ღილაკებიც ზუსტად იმავეს აკეთებს.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3" aria-label={isEnglish ? 'Swipe controls' : 'სვაიპის კონტროლები'}>
            <div className="glass flex h-[52px] w-[52px] items-center justify-center rounded-full text-destructive">
              <X className="h-6 w-6" />
            </div>
            <div className="glass inline-flex h-[52px] items-center gap-1.5 rounded-full bg-primary/10 px-4 text-primary">
              <Map className="h-4 w-4" />
              <span className="text-sm font-semibold">{isEnglish ? 'Map' : 'რუკა'}</span>
            </div>
            <div className="glass flex h-[60px] w-[60px] items-center justify-center rounded-full text-accent">
              <Heart className="h-7 w-7" fill="currentColor" />
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            {isEnglish
              ? 'Map shows the pet\'s approximate location. Saved pets are always available in Liked.'
              : 'რუკა ცხოველის მიახლოებით ადგილს გაჩვენებს. მოწონებული ცხოველები ყოველთვის „მოწონებულებში“ დაგხვდება.'}
          </p>

          <button
            type="button"
            onClick={close}
            className="mt-5 h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground"
          >
            {isEnglish ? 'Got it' : 'გასაგებია'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
