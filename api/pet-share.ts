import type { ApiRequest, ApiResponse } from './_admin.js';
import { isUuid, sendMethodNotAllowed, supabaseRest } from './_admin.js';

const SITE_ORIGIN = 'https://mipove.me';
const FALLBACK_IMAGE = `${SITE_ORIGIN}/brand/og-image.jpg`;
const FALLBACK_TITLE = 'mipove.me - იპოვე და დაეხმარე ცხოველს';
const FALLBACK_DESCRIPTION =
  'იპოვე, გააზიარე ან დაამატე მიუსაფარი, დაკარგული და გასაჩუქებელი ცხოველის განცხადება საქართველოში.';

type PetShareRow = {
  id: string;
  name: string;
  age: string | null;
  breed: string | null;
  location: string | null;
  photo_url: string | null;
  description: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * სოციალური ბოტებისთვის (Facebook, Telegram, WhatsApp...) აბრუნებს HTML-ს,
 * სადაც og ტეგები კონკრეტული ცხოველისაა — ლინკის preview-ში ცხოველის ფოტო ჩანს.
 * ჩვეულებრივი მომხმარებლები ამ ფუნქციას ვერ ხვდებიან (vercel.json user-agent წესი).
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    sendMethodNotAllowed(res, ['GET']);
    return;
  }

  const url = new URL(req.url ?? '/', SITE_ORIGIN);
  const id = url.searchParams.get('id') ?? '';
  const petUrl = `${SITE_ORIGIN}/pet/${encodeURIComponent(id)}`;

  let pet: PetShareRow | null = null;
  if (isUuid(id)) {
    try {
      const { data, error } = await supabaseRest<PetShareRow[]>(
        `pets_public?id=eq.${id}&select=id,name,age,breed,location,photo_url,description&limit=1`
      );
      if (error) {
        console.error('[pet-share] lookup failed', { status: error.status });
      }
      pet = data?.[0] ?? null;
    } catch (error) {
      console.error('[pet-share] lookup failed', {
        message: error instanceof Error ? error.message : 'unknown',
      });
    }
  }

  const summary = pet ? [pet.breed, pet.age, pet.location].filter(Boolean).join(' · ') : '';
  const title = pet ? `${pet.name} · ${pet.location || 'საქართველო'} — mipove.me` : FALLBACK_TITLE;
  const description = pet
    ? `${summary}${summary && pet.description ? ' — ' : ''}${pet.description ?? ''}`.slice(0, 200) ||
      FALLBACK_DESCRIPTION
    : FALLBACK_DESCRIPTION;
  const image = pet?.photo_url && /^https?:\/\//.test(pet.photo_url) ? pet.photo_url : FALLBACK_IMAGE;

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(petUrl);

  const html = `<!doctype html>
<html lang="ka">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:site_name" content="mipove.me" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:locale" content="ka_GE" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
    <meta http-equiv="refresh" content="0;url=${safeUrl}" />
  </head>
  <body>
    <p><a href="${safeUrl}">${safeTitle}</a></p>
  </body>
</html>
`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.end(html);
}
