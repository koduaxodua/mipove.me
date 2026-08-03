import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { sampleDogs, petRowToDog, type Dog } from '@/data/dogs';
import { supabase, isSupabaseConfigured, ensureAnonAuth } from '@/lib/supabase';
import { uploadPetPhoto } from '@/lib/uploadPetPhoto';
import { jitterCoordinates } from '@/lib/geo';

const CUSTOM_DOGS_KEY = 'pawswipe_custom_dogs';
const VISIBLE_SAMPLE_DOG_IDS = new Set(['1']); // Keep only Bob from the starter fake profiles.
export const PUBLIC_PET_COLUMNS = [
  'id',
  'species',
  'name',
  'age',
  'breed',
  'gender',
  'personality',
  'health',
  'location',
  'public_lat',
  'public_lng',
  'photo_url',
  'caretaker_name',
  'caretaker_phone',
  'description',
  'created_at',
].join(',');
const BASE_PET_PUBLIC_COLUMNS = PUBLIC_PET_COLUMNS.replace('location', 'location:public_location');

export function useDogs() {
  const [customDogs, setCustomDogs] = useState<Dog[]>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_DOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [remoteDogs, setRemoteDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    localStorage.setItem(CUSTOM_DOGS_KEY, JSON.stringify(customDogs));
  }, [customDogs]);

  // Fetch from Supabase on mount when configured
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      let { data, error } = await supabase
        .from('pets_public')
        .select(PUBLIC_PET_COLUMNS)
        .order('created_at', { ascending: false });

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('[useDogs] pets_public unavailable, falling back to pets RLS');
        }

        const fallback = await supabase
          .from('pets')
          .select(BASE_PET_PUBLIC_COLUMNS)
          .eq('status', 'available')
          .order('created_at', { ascending: false });
        data = fallback.data;
        error = fallback.error;
      }

      if (cancelled) return;
      if (error) {
        if (import.meta.env.DEV) {
          console.error('[useDogs] fetch failed');
        }
      } else if (data) {
        setRemoteDogs(data.map(petRowToDog));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const dogs = useMemo(() => {
    const visibleSampleDogs = sampleDogs.filter(dog => VISIBLE_SAMPLE_DOG_IDS.has(dog.id));

    if (isSupabaseConfigured) {
      // Supabase is the source of truth; sample dogs are a starter showcase only
      return [...visibleSampleDogs, ...remoteDogs];
    }
    return [...visibleSampleDogs, ...customDogs];
  }, [customDogs, remoteDogs]);

  const addDog = useCallback(async (dog: Omit<Dog, 'id' | 'addedDate'>): Promise<Dog> => {
    // Local fallback when Supabase isn't configured
    if (!supabase) {
      const publicCoords =
        typeof dog.lat === 'number' && typeof dog.lng === 'number'
          ? jitterCoordinates(dog.lat, dog.lng)
          : null;
      const newDog: Dog = {
        ...dog,
        publicLat: publicCoords?.lat,
        publicLng: publicCoords?.lng,
        id: Date.now().toString(),
        addedDate: new Date().toISOString().split('T')[0],
      };
      setCustomDogs(prev => [...prev, newDog]);
      return newDog;
    }

    const userId = await ensureAnonAuth();
    if (!userId) throw new Error('ავტენტიფიკაცია ვერ მოხერხდა');

    // If photo is a base64 data URL, upload to Storage first
    let photoUrl = dog.photo;
    if (photoUrl.startsWith('data:')) {
      photoUrl = await uploadPetPhoto(photoUrl);
    }

    const { data, error } = await supabase
      .from('pets')
      .insert({
        species: dog.species ?? 'dog',
        name: dog.name,
        age: dog.age || null,
        breed: dog.breed || null,
        gender: dog.gender,
        personality: dog.personality || null,
        health: dog.health || null,
        location: dog.location || null,
        lat: dog.lat ?? null,
        lng: dog.lng ?? null,
        photo_url: photoUrl,
        caretaker_phone: dog.caretakerPhone || null,
        caretaker_name: dog.caretakerName || null,
        description: dog.description || null,
        contact_consent_acknowledged_at: dog.contactConsentAcknowledgedAt ?? null,
        created_by: userId,
      })
      .select(PUBLIC_PET_COLUMNS)
      .single();

    if (error) throw error;
    const newDog = petRowToDog(data);
    setRemoteDogs(prev => [newDog, ...prev]);
    return newDog;
  }, []);

  return { dogs, addDog, loading };
}

const UUID_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** ერთი ცხოველის წამოღება /pet/:id გვერდისთვის — Supabase, ან sample/localStorage fallback. */
export async function fetchDogById(id: string): Promise<Dog | null> {
  if (supabase && UUID_ID_RE.test(id)) {
    let { data, error } = await supabase
      .from('pets_public')
      .select(PUBLIC_PET_COLUMNS)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      const fallback = await supabase
        .from('pets')
        .select(BASE_PET_PUBLIC_COLUMNS)
        .eq('status', 'available')
        .eq('id', id)
        .maybeSingle();
      data = fallback.data;
      error = fallback.error;
    }

    if (!error && data) return petRowToDog(data);
    if (error) console.warn('[pet-page] fetch by id failed', { id });
    return null;
  }

  const sample = sampleDogs.find(dog => dog.id === id);
  if (sample) return sample;

  try {
    const stored = localStorage.getItem(CUSTOM_DOGS_KEY);
    const custom: Dog[] = stored ? JSON.parse(stored) : [];
    return custom.find(dog => dog.id === id) ?? null;
  } catch {
    return null;
  }
}
