import { Heart, Map, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardFooterActionsProps {
  disabled?: boolean;
  onLike: () => void;
  onMap: () => void;
  onNope: () => void;
  labels: {
    like: string;
    map: string;
    nope: string;
  };
}

/**
 * სვაიპ-ეკრანის ქვედა მოქმედებები — მრგვალი glass ღილაკები (Tinder-style).
 * Like ოდნავ დიდია განზრახ (აქცენტი მოსიყვარულე მოქმედებაზე).
 */
export function CardFooterActions({ disabled, onLike, onMap, onNope, labels }: CardFooterActionsProps) {
  return (
    <div className="flex items-center gap-4 flex-shrink-0">
      <motion.div whileTap={{ scale: 0.94 }}>
        <button
          type="button"
          disabled={disabled}
          onClick={onNope}
          className="glass flex h-[52px] w-[52px] items-center justify-center rounded-full text-destructive transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={labels.nope}
        >
          <X className="h-6 w-6" />
        </button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.94 }}>
        <button
          type="button"
          disabled={disabled}
          onClick={onMap}
          className="glass inline-flex h-[52px] items-center gap-1.5 rounded-full bg-primary/10 px-4 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          aria-label={labels.map}
        >
          <Map className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{labels.map}</span>
        </button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.94 }}>
        <button
          type="button"
          disabled={disabled}
          onClick={onLike}
          className="glass flex h-[60px] w-[60px] items-center justify-center rounded-full text-accent transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={labels.like}
        >
          <Heart className="h-7 w-7" fill="currentColor" />
        </button>
      </motion.div>
    </div>
  );
}
