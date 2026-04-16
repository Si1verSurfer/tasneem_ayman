/**
 * Vercel Serverless: يجلب العدّ من hits.dwyl (بدون CORS من المتصفح).
 * المسار: GET /api/visit → { value: number }
 */
const DWYL_JSON =
  process.env.DWYL_HITS_JSON ||
  'https://hits.dwyl.com/Si1verSurfer/tasneem_ayman.json'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    return res.status(204).end()
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const r = await fetch(DWYL_JSON, { cache: 'no-store' })
    if (!r.ok) return res.status(502).json({ error: true })
    const data = await r.json()
    const raw = data?.message ?? data?.value
    const n = parseInt(String(raw).replace(/[^\d]/g, ''), 10)
    if (!Number.isFinite(n)) return res.status(502).json({ error: true })
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'no-store, max-age=0')
    return res.status(200).json({ value: n })
  } catch {
    return res.status(500).json({ error: true })
  }
}
