import { useEffect, useMemo, useState } from 'react';
import { breedLabel, fetchBreeds, type BreedOption } from '@/lib/breeds';
import type { Species } from '@/data/dogs';
import { useLocale } from '@/contexts/Locale';

type Props = {
  species: Species;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
};

/**
 * ჯიშის ველი autocomplete-ით — dog.ceo / TheCatAPI სიებიდან.
 * ქართულ UI-ზე ჩანს ქართული სახელი (თუ გვაქვს), ინგლისურზე — ინგლისური.
 */
export function BreedAutocomplete({ species, value, onChange, label, placeholder }: Props) {
  const { locale } = useLocale();
  const [options, setOptions] = useState<BreedOption[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBreeds(species).then(list => {
      if (!cancelled) setOptions(list);
    });
    return () => {
      cancelled = true;
    };
  }, [species]);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options.slice(0, 8);
    return options
      .filter(opt => opt.en.toLowerCase().includes(q) || opt.ka.toLowerCase().includes(q))
      .slice(0, 8);
  }, [options, value]);

  return (
    <div className="glass relative rounded-2xl p-4">
      <label htmlFor="pet-breed" className="mb-2 block text-sm font-medium text-primary-foreground">
        {label}
      </label>
      <input
        id="pet-breed"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full bg-transparent text-sm text-primary-foreground placeholder:text-muted-foreground outline-none"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute left-2 right-2 top-full z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-border/60 bg-background/95 py-1 shadow-xl backdrop-blur">
          {filtered.map(opt => {
            const shown = breedLabel(opt, locale);
            return (
              <li key={`${opt.en}-${opt.ka}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground hover:bg-primary/10"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    onChange(shown);
                    setOpen(false);
                    console.log('[breeds] selected', { species, value: shown });
                  }}
                >
                  <span>{shown}</span>
                  {locale === 'ka' && opt.ka !== opt.en && (
                    <span className="text-[10px] text-muted-foreground">{opt.en}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
