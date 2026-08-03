import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

describe('ux copy and deploy readiness', () => {
  it('shows footer copyright and legal links in bottom navigation', () => {
    const source = read('src/components/BottomNav.tsx');

    expect(source).toContain("t('footer.copyright')");
    expect(source).toContain("to=\"/terms\"");
    expect(source).toContain("to=\"/ka/privacy\"");
  });

  it('uses npm-based Vercel build defaults compatible with this repository', () => {
    const vercel = read('vercel.json');

    expect(vercel).toContain('"installCommand": "npm ci"');
    expect(vercel).toContain('"buildCommand": "npm run build"');
    expect(vercel).toContain('"outputDirectory": "dist"');
  });

  it('documents required environment variables for Vercel deploy', () => {
    const readme = read('README.md');

    expect(readme).toContain('VITE_SUPABASE_URL');
    expect(readme).toContain('VITE_SUPABASE_ANON_KEY');
    expect(readme).toContain('SUPABASE_SERVICE_ROLE_KEY');
    expect(readme).toContain('ADMIN_SESSION_SECRET');
  });

  it('serves SEO surfaces: pet pages, guides, sitemap, and social previews', () => {
    const app = read('src/App.tsx');
    const vercel = read('vercel.json');

    expect(app).toContain('path="/pet/:id"');
    expect(app).toContain('path="/guide/dzaglis-ayvana"');
    expect(app).toContain('path="/guide/dakarguli-cxoveli"');
    expect(app).toContain('path="/guide/miusafari-cxovelis-daxmareba"');
    expect(vercel).toContain('"destination": "/api/sitemap"');
    expect(vercel).toContain('"destination": "/api/pet-share?id=:id"');
    expect(read('api/sitemap.ts')).toContain('/guide/dzaglis-ayvana');
    expect(read('api/pet-share.ts')).toContain('og:image');
    expect(read('api/notify-telegram.ts')).toContain('TELEGRAM_BOT_TOKEN');
    expect(read('src/pages/AddDog.tsx')).toContain("fetch('/api/notify-telegram'");
    expect(read('index.html')).toContain('application/ld+json');
  });

  it('exposes free public API integrations in the UI', () => {
    expect(read('src/components/AnimalTip.tsx')).toContain('catfact.ninja');
    expect(read('src/pages/Index.tsx')).toContain('<AnimalTip />');
    expect(read('src/lib/sharePet.ts')).toContain('t.me/share/url');
    expect(read('src/pages/PetPage.tsx')).toContain('telegramShareUrl');
    expect(read('api/notify-telegram.ts')).toContain('api.telegram.org');
  });

  it('keeps the production visitor counter and bank support details', () => {
    const support = read('src/components/SupportBankDetails.tsx');
    const nav = read('src/components/BottomNav.tsx');
    const visitors = read('src/components/MonthlyVisitors.tsx');

    expect(support).toContain('GE81BG0000000604690174');
    expect(support).toContain('Bank of Georgia');
    expect(nav).toContain('SupportBankDetails');
    expect(nav).not.toContain('/missions');
    expect(visitors).toContain("fetch('/api/visitor-count')");
    expect(read('src/pages/Index.tsx')).toContain('<MonthlyVisitors />');
    expect(read('api/visitor-count.ts')).toContain('VERCEL_ANALYTICS_TOKEN');
  });
});
