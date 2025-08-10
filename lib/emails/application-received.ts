export function applicationReceivedHtml(params: { name: string; university: string }) {
  const { name, university } = params
  return `
  <p>Hi ${escapeHtml(name)},</p>
  <p>Thanks for applying to join <strong>XueDAO</strong>. We have received your application and will review it shortly.</p>
  <p><strong>University:</strong> ${escapeHtml(university)}</p>
  <p>Best,<br/>XueDAO Team</p>
  `
}

export function applicationReceivedText(params: { name: string; university: string }) {
  const { name, university } = params
  return `Hi ${name},\n\nThanks for applying to join XueDAO. We have received your application and will review it shortly.\n\nUniversity: ${university}\n\nBest,\nXueDAO Team`
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
} 