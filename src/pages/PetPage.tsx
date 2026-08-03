import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Heart, MapPin, Phone, Share2, Shield } from 'lucide-react';
import { AdaptivePetPhoto } from '@/components/AdaptivePetPhoto';
import { fetchDogById } from '@/hooks/useDogs';
import { sharePetLink } from '@/lib/sharePet';
import { SocialShareRow } from '@/components/SocialShareRow';
import { WeatherChip } from '@/components/WeatherChip';
import { setCanonical, setNamedMeta, setPropertyMeta } from '@/lib/seo';
import { toast } from '@/hooks/use-toast';
import { useLocale, useT } from '@/contexts/Locale';
import type { Dog } from '@/data/dogs';

/**
 * ცხოველის საჯარო გვერდი — /pet/:id
 * ეს ლინკი იდება Instagram ვიდეოს აღწერაში, Telegram-სა და Facebook-ზე.
 * Google-იც ამ გვერდებს აინდექსებს (sitemap-შიც შედის).
 */
export default function PetPage() {
  const { id } = useParams<{ id: string }>();
  const t = useT();
  const { locale } = useLocale();
  const [dog, setDog] = useState<Dog | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setState('missing');
      return;
    }
    setState('loading');
    fetchDogById(id)
      .then(found => {
        if (cancelled) return;
        if (found) {
          console.log('[pet-page] loaded', { id });
          setDog(found);
          setState('ready');
        } else {
          console.warn('[pet-page] not found', { id });
          setState('missing');
        }
      })
      .catch(() => {
        if (!cancelled) setState('missing');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // SEO: title/description/og — Google JS-ს ასრულებს და ამ ტეგებს ხედავს.
  useEffect(() => {
    if (!dog) return;
    const title = `${dog.name} · ${dog.location || 'საქართველო'} — mipove.me`;
    const summary = [dog.breed, dog.age, dog.location].filter(Boolean).join(' · ');
    const description =
      `${summary}${summary && dog.description ? ' — ' : ''}${dog.description}`.slice(0, 200) ||
      'ცხოველის განცხადება mipove.me-ზე';

    document.title = title;
    setNamedMeta('description', description);
    setCanonical(`https://mipove.me/pet/${dog.id}`);
    setPropertyMeta('og:title', title);
    setPropertyMeta('og:description', description);
    setPropertyMeta('og:url', `https://mipove.me/pet/${dog.id}`);
    if (dog.photo.startsWith('http')) setPropertyMeta('og:image', dog.photo);
  }, [dog]);

  const genderLabel =
    dog && locale === 'en'
      ? dog.gender === 'მამრობითი'
        ? t('addDog.gender.value.male')
        : t('addDog.gender.value.female')
      : dog?.gender ?? '';

  const mapLat = dog?.publicLat ?? dog?.lat;
  const mapLng = dog?.publicLng ?? dog?.lng;

  const handleShare = async () => {
    if (!dog) return;
    const result = await sharePetLink(dog, locale);
    if (result === 'copied') {
      toast({ title: locale === 'en' ? 'Link copied' : 'ლინკი დაკოპირდა' });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/brand/logo-dark.png" alt="mipove.me" className="h-9 w-9 rounded-xl object-contain" />
            <span className="text-base font-bold">mipove.me</span>
          </Link>
          <Link
            to="/"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {locale === 'en' ? 'Open App' : 'აპის გახსნა'}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pb-16 pt-4">
        {state === 'loading' && (
          <div className="glass mt-6 animate-pulse rounded-3xl p-8 text-center text-sm text-muted-foreground">
            {locale === 'en' ? 'Loading profile…' : 'იტვირთება…'}
          </div>
        )}

        {state === 'missing' && (
          <div className="glass mt-6 rounded-3xl p-8 text-center">
            <span className="text-5xl">🐾</span>
            <h1 className="mt-3 text-lg font-semibold text-foreground">
              {locale === 'en' ? 'Listing not found' : 'განცხადება ვერ მოიძებნა'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === 'en'
                ? 'It may have found a home already or the listing was removed.'
                : 'შესაძლოა ცხოველმა უკვე იპოვა ოჯახი ან განცხადება მოიხსნა.'}
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              {locale === 'en' ? 'Browse pets' : 'სხვა ცხოველების ნახვა'}
            </Link>
          </div>
        )}

        {state === 'ready' && dog && (
          <article className="space-y-3">
            <AdaptivePetPhoto src={dog.photo} alt={dog.name} mode="detail" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground">{dog.name}</h1>
                {dog.location && <p className="mt-0.5 text-sm text-muted-foreground">{dog.location}</p>}
                <div className="mt-2">
                  <WeatherChip lat={mapLat} lng={mapLng} />
                </div>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="glass flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-primary transition hover:scale-105 active:scale-95"
                aria-label={locale === 'en' ? 'Share' : 'გაზიარება'}
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoChip icon={<Calendar className="h-4 w-4" />} label={t('detail.label.age')} value={dog.age} />
              <InfoChip icon={<Heart className="h-4 w-4" />} label={t('detail.label.gender')} value={genderLabel} />
              <InfoChip icon={<MapPin className="h-4 w-4" />} label={t('detail.label.location')} value={dog.location} />
              <InfoChip icon={<Shield className="h-4 w-4" />} label={t('detail.label.breed')} value={dog.breed} />
            </div>

            {dog.description && (
              <div className="glass rounded-xl p-4 space-y-1.5">
                <h2 className="text-sm font-semibold text-foreground">{t('detail.section.description')}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{dog.description}</p>
              </div>
            )}

            {dog.personality && (
              <div className="glass rounded-xl p-4 space-y-1.5">
                <h2 className="text-sm font-semibold text-foreground">{t('detail.section.personality')}</h2>
                <p className="text-xs text-muted-foreground">{dog.personality}</p>
              </div>
            )}

            {dog.health && (
              <div className="glass rounded-xl p-4 space-y-1.5">
                <h2 className="text-sm font-semibold text-foreground">{t('detail.section.health')}</h2>
                <p className="text-xs text-muted-foreground">{dog.health}</p>
              </div>
            )}

            <div className="glass rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-1.5">{t('detail.section.caretaker')}</h2>
              {dog.caretakerName && <p className="text-xs text-muted-foreground">{dog.caretakerName}</p>}
              {dog.caretakerPhone ? (
                <a
                  href={`tel:${dog.caretakerPhone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {dog.caretakerPhone}
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Contact phone is not public.' : 'საკონტაქტო ნომერი საჯაროდ მითითებული არ არის.'}
                </p>
              )}
            </div>

            {typeof mapLat === 'number' && typeof mapLng === 'number' && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${mapLat}&mlon=${mapLng}#map=15/${mapLat}/${mapLng}`}
                target="_blank"
                rel="noreferrer"
                className="glass flex w-full items-center gap-3 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 transition hover:border-primary/45"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {locale === 'en' ? 'Show approximate area on map' : 'დაახლოებითი ადგილის ნახვა რუკაზე'}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">OpenStreetMap</span>
                </span>
              </a>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
              >
                <Share2 className="h-4 w-4" />
                {locale === 'en' ? 'Share this profile' : 'პროფილის გაზიარება'}
              </button>
              <SocialShareRow dog={dog} />
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-secondary/70 text-sm font-semibold text-foreground transition hover:bg-secondary"
              >
                {locale === 'en' ? 'See more pets' : 'სხვა ცხოველების ნახვა'}
              </Link>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="glass rounded-xl p-3 flex items-start gap-2">
      <span className="text-primary mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground leading-tight">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
