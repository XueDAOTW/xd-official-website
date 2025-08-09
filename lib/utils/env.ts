export function getURL(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // production canonical URL
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Vercel preview URL (host)
    'http://localhost:3000/'

  // If provided as host only (e.g., my-app.vercel.app), prefix https
  url = url.startsWith('http') ? url : `https://${url}`
  // Ensure trailing slash
  url = url.endsWith('/') ? url : `${url}/`
  return url
}

// Backwards-compatible alias used elsewhere
export function getBaseUrl(): string {
  const url = getURL()
  // strip trailing slash for path joining with explicit leading slash
  return url.replace(/\/$/, '')
} 