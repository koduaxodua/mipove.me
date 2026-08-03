import type { ApiRequest, ApiResponse } from './_admin.js';
import { sendJson, sendMethodNotAllowed } from './_admin.js';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_PROJECT_ID = 'prj_Hz7Ms5ENsMllqDXBuFRtv3Wk8YBv';
const DEFAULT_TEAM_ID = 'team_y3ATAMDEJseIqhHB2hurABMu';

type AnalyticsResult = {
  count?: unknown;
  value?: unknown;
  visitors?: unknown;
  data?: {
    count?: unknown;
    value?: unknown;
    visitors?: unknown;
  };
};

function getCount(result: AnalyticsResult): number | null {
  const candidates = [
    result.count,
    result.value,
    result.visitors,
    result.data?.count,
    result.data?.value,
    result.data?.visitors,
  ];

  for (const candidate of candidates) {
    const count = Number(candidate);
    if (Number.isFinite(count) && count >= 0) return Math.round(count);
  }

  return null;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    sendMethodNotAllowed(res, ['GET']);
    return;
  }

  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  if (!token) {
    res.statusCode = 204;
    res.end();
    return;
  }

  const now = new Date();
  const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
  url.searchParams.set('teamId', process.env.VERCEL_ANALYTICS_TEAM_ID || process.env.VERCEL_ORG_ID || DEFAULT_TEAM_ID);
  url.searchParams.set('projectId', process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID || DEFAULT_PROJECT_ID);
  url.searchParams.set('since', new Date(now.getTime() - THIRTY_DAYS_MS).toISOString());
  url.searchParams.set('until', now.toISOString());
  url.searchParams.set('filter', "environment eq 'production'");

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error('[visitor-count] Vercel Analytics request failed', { status: response.status });
      sendJson(res, 503, { error: 'analytics_unavailable' });
      return;
    }

    const visitors = getCount(await response.json() as AnalyticsResult);
    if (visitors === null) {
      console.error('[visitor-count] Vercel Analytics returned an unsupported response');
      sendJson(res, 503, { error: 'analytics_unavailable' });
      return;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    sendJson(res, 200, { visitors, updatedAt: now.toISOString() });
  } catch (error) {
    console.error('[visitor-count] Vercel Analytics request failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    sendJson(res, 503, { error: 'analytics_unavailable' });
  }
}
