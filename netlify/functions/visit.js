/**
 * Netlify Function: نفس منطق Vercel — GET /.netlify/functions/visit
 * إعادة توجيه /api/visit → هذه الدالة في netlify.toml
 */
const DWYL_JSON =
  process.env.DWYL_HITS_JSON ||
  'https://hits.dwyl.com/Si1verSurfer/tasneem_ayman.json'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    }
  }
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: true }),
    }
  }
  try {
    const r = await fetch(DWYL_JSON, { cache: 'no-store' })
    if (!r.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: true }),
      }
    }
    const data = await r.json()
    const raw = data?.message ?? data?.value
    const n = parseInt(String(raw).replace(/[^\d]/g, ''), 10)
    if (!Number.isFinite(n)) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: true }),
      }
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
      body: JSON.stringify({ value: n }),
    }
  } catch {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: true }),
    }
  }
}
