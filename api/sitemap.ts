import type { ApiRequest, ApiResponse } from './_admin.js';
import { sendMethodNotAllowed, supabaseRest } from './_admin.js';

const SITE = 'https://mipove.me';

const STATIC_PATHS = [
  '/',
  '/about',
  '/safety',
  '/how-it-works',
  '/2',
  '/2/about',
  '/2/safety',
  '/2/how-it-works',
  '/guide/dzaglis-ayvana',
  '/guide/dakarguli-cxoveli',
  '/guide/miusafari-cxovelis-daxmareba',
];

type PetRow = { id: string; created_at: string };

/**
 * დინამიური sitemap.xml — სტატიკური გვერდები + ყველა აქტიური ცხოველის /pet/:id.
 * vercel.json აკეთებს rewrite-ს: /sitemap.xml → /api/sitemap
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  // Googlebot ხშირად ჯერ HEAD-ს ამოწმებს — 405 = "Couldn't fetch" Search Console-ში.
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendMethodNotAllowed(res, ['GET', 'HEAD']);
    return;
  }

  let pets: PetRow[] = [];
  try {
    const { data, error } = await supabaseRest<PetRow[]>(
      'pets_public?select=id,created_at&order=created_at.desc&limit=1000'
    );
    if (error) {
      console.error('[sitemap] pets fetch failed', { status: error.status });
    }
    pets = data ?? [];
  } catch (error) {
    console.error('[sitemap] pets fetch failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
  }

  const urls = [
    ...STATIC_PATHS.map(path => `  <url><loc>${SITE}${path}</loc></url>`),
    ...pets.map(
      pet => `  <url><loc>${SITE}/pet/${pet.id}</loc><lastmod>${pet.created_at.slice(0, 10)}</lastmod></url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  console.log('[sitemap] generated', { staticPaths: STATIC_PATHS.length, pets: pets.length, method: req.method });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  if (req.method === 'HEAD') {
    res.setHeader('Content-Length', Buffer.byteLength(xml, 'utf8'));
    res.end();
    return;
  }
  res.end(xml);
}
