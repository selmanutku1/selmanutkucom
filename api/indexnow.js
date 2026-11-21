const INDEXNOW_KEY = '7c9e6679742540de944b0e07fc1f90ae';

const CANONICAL_PATHS = [
  '/',
  '/tr',
  '/projects/sporttech-turkiye',
  '/projeler/sporttech-turkiye',
  '/projects/sporsepeti',
  '/projeler/sporsepeti',
  '/projects/sportsfly',
  '/projeler/sportsfly',
  '/research/strategic-role-of-business-analysis-in-digital-transformation',
  '/arastirma/kurumsal-dijital-donusumde-is-analizinin-stratejik-rolu',
  '/research/ai-powered-business-workflows-and-institutional-productivity',
  '/arastirma/yapay-zeka-destekli-is-surecleri-ve-kurumsal-verimlilik',
  '/research/digital-management-architecture-for-sports-clubs-and-facilities',
  '/arastirma/spor-kulubleri-ve-tesisler-icin-dijital-yonetim-mimarisi',
  '/research/technology-strategy-from-tool-selection-to-value-architecture',
  '/arastirma/teknoloji-stratejisi-arac-seciminden-deger-mimarisine',
  '/research/product-development-and-entrepreneurship-in-sporttech',
  '/arastirma/sporttech-ekosisteminde-urun-gelistirme-ve-girisimcilik',
  '/research/building-an-internal-innovation-culture-for-sustainable-change',
  '/arastirma/kurum-ici-inovasyon-kulturu-ve-surdurulebilir-degisim',
  '/llms.txt',
  '/llms-full.txt',
  '/knowledge-graph.json',
];

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const host = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    req.headers['x-forwarded-host'] ||
    req.headers.host ||
    'www.selmanutku.com'
  )
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '');

  const origin = `https://${host}`;
  const urlList = CANONICAL_PATHS.map((p) => `${origin}${p}`);

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    const text = await response.text();
    return res.status(response.ok ? 200 : 502).json({
      ok: response.ok,
      status: response.status,
      host,
      submittedCount: urlList.length,
      urlList,
      providerResponse: text || 'Accepted',
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'IndexNow submission failed',
    });
  }
}
