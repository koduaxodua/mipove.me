import type { Species } from '@/data/dogs';

export type BreedOption = { en: string; ka: string };

/** ხშირი ჯიშების ქართული სახელები — autocomplete-ისთვის. */
const KA_LABELS: Record<string, string> = {
  mix: 'ნარევი',
  labrador: 'ლაბრადორი',
  'golden retriever': 'ოქროსფერი რეტრივერი',
  'german shepherd': 'გერმანული ნაგაზი',
  husky: 'ჰასკი',
  bulldog: 'ბულდოგი',
  'french bulldog': 'ფრანგული ბულდოგი',
  poodle: 'პუდელი',
  chihuahua: 'ჩიხუახუა',
  beagle: 'ბიგლი',
  rottweiler: 'როტვეილერი',
  dachshund: 'ტაქსა',
  boxer: 'ბოქსერი',
  doberman: 'დობერმანი',
  'caucasian ovcharka': 'კავკასიური ნაგაზი',
  'border collie': 'ბორდერ კოლი',
  'cocker spaniel': 'კოკერ სპანიელი',
  spitz: 'შპიცი',
  'japanese spitz': 'იაპონური შპიცი',
  maltese: 'მალთეზი',
  pug: 'პაგი',
  'shih tzu': 'შიჰ ძუ',
  'yorkshire terrier': 'იორკშირ ტერიერი',
  akita: 'აკიტა',
  'siberian husky': 'ციმბირული ჰასკი',
  pomeranian: 'პომერანელი',
  corgi: 'კორგი',
  dalmatian: 'დალმატინი',
  'saint bernard': 'სენბერნარი',
  mastiff: 'მასტიფი',
  'persian': 'სპარსული',
  'british shorthair': 'ბრიტანული მოკლებეწვიანი',
  'maine coon': 'მეინ კუნი',
  siamese: 'სიამური',
  bengal: 'ბენგალური',
  ragdoll: 'რეგდოლი',
  sphynx: 'სფინქსი',
  'russian blue': 'რუსული ლურჯი',
  'scottish fold': 'შოტლანდიური ფოლდი',
  'american shorthair': 'ამერიკული მოკლებეწვიანი',
  abyssinian: 'აბისინიური',
  birman: 'ბირმანული',
  'norwegian forest': 'ნორვეგიული ტყის',
};

function titleCase(value: string): string {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function withKa(en: string): BreedOption {
  const key = en.toLowerCase();
  return { en, ka: KA_LABELS[key] || en };
}

function flattenDogCeo(message: Record<string, string[]>): BreedOption[] {
  const out: BreedOption[] = [withKa('Mix')];
  for (const [breed, sub] of Object.entries(message)) {
    if (!sub.length) {
      out.push(withKa(titleCase(breed)));
      continue;
    }
    for (const s of sub) {
      out.push(withKa(titleCase(`${s} ${breed}`)));
    }
  }
  return out;
}

let dogCache: BreedOption[] | null = null;
let catCache: BreedOption[] | null = null;

/** ძაღლის ჯიშები — dog.ceo (უფასო, გასაღები არ სჭირდება). */
export async function fetchDogBreeds(): Promise<BreedOption[]> {
  if (dogCache) return dogCache;
  try {
    const res = await fetch('https://dog.ceo/api/breeds/list/all');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { message?: Record<string, string[]> };
    dogCache = flattenDogCeo(data.message ?? {});
    console.log('[breeds] dog list loaded', { count: dogCache.length });
    return dogCache;
  } catch (error) {
    console.warn('[breeds] dog.ceo unavailable', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    dogCache = [
      withKa('Mix'),
      withKa('Labrador'),
      withKa('German Shepherd'),
      withKa('Golden Retriever'),
      withKa('Husky'),
      withKa('Caucasian Ovcharka'),
    ];
    return dogCache;
  }
}

/** კატის ჯიშები — TheCatAPI breeds list (უფასო). */
export async function fetchCatBreeds(): Promise<BreedOption[]> {
  if (catCache) return catCache;
  try {
    const res = await fetch('https://api.thecatapi.com/v1/breeds');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Array<{ name?: string }>;
    catCache = [
      withKa('Mix'),
      ...data
        .map(row => row.name?.trim())
        .filter((name): name is string => Boolean(name))
        .map(withKa),
    ];
    console.log('[breeds] cat list loaded', { count: catCache.length });
    return catCache;
  } catch (error) {
    console.warn('[breeds] thecatapi unavailable', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    catCache = [
      withKa('Mix'),
      withKa('Persian'),
      withKa('British Shorthair'),
      withKa('Maine Coon'),
      withKa('Siamese'),
      withKa('Bengal'),
    ];
    return catCache;
  }
}

export async function fetchBreeds(species: Species): Promise<BreedOption[]> {
  return species === 'cat' ? fetchCatBreeds() : fetchDogBreeds();
}

export function breedLabel(option: BreedOption, locale: string): string {
  return locale === 'ka' ? option.ka : option.en;
}
