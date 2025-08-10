export function adminApplicationNotificationHtml(params: { name: string; email: string; university: string }) {
  const { name, email, university } = params
  return `
  <p>A new application has been submitted.</p>
  <ul>
    <li><strong>Name:</strong> ${escapeHtml(name)}</li>
    <li><strong>Email:</strong> ${escapeHtml(email)}</li>
    <li><strong>University:</strong> ${escapeHtml(university)}</li>
  </ul>
  `
}

export function adminApplicationNotificationText(params: { name: string; email: string; university: string }) {
  const { name, email, university } = params
  return `A new application has been submitted.\n\nName: ${name}\nEmail: ${email}\nUniversity: ${university}`
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
} 