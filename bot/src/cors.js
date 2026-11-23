// Allow the widget to be embedded on other sites. Set ALLOWED_ORIGINS="https://exomindmiamibeach.com,https://www.agingbiohacking.com"
const own = ['https://innovativemedicalwellness.com', 'https://www.innovativemedicalwellness.com'];

export function allowedOrigins() {
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const dev = process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000'];
  return [...own, ...extra, ...dev];
}

export function originAllowed(origin) {
  return Boolean(origin) && allowedOrigins().includes(origin);
}

export function corsHeaders(origin) {
  const h = { Vary: 'Origin' };
  if (originAllowed(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type';
    h['Access-Control-Max-Age'] = '86400';
  }
  return h;
}
