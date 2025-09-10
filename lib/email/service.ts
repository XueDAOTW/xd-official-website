import { Resend } from 'resend'

// Centralized email configuration
const EMAIL_CONFIG = {
  fromName: process.env.MAIL_FROM_NAME || 'XueDAO',
  fromAddress: process.env.MAIL_FROM_ADDRESS || 'onboarding@resend.dev',
  adminEmails: (process.env.ADMIN_EMAILS || 'albert2367593@gmail.com')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean),
} as const

// Utility function for HTML escaping
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Email client singleton
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(apiKey)
}

// Base email sending function with CC support
type EmailOptions = {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  subject: string
  text: string
  html?: string
  from?: string
}

async function sendEmail(options: EmailOptions) {
  const from = options.from || `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromAddress}>`
  const resend = getResendClient()

  return resend.emails.send({
    from,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })
}

// Application data types
type LegacyApplicationData = {
  name: string
  email: string
  university: string
}

type NewApplicationData = {
  name: string
  email: string
  school_name: string
  major: string
  telegram_id: string
  student_status: string
  contribution_areas?: string[]
  how_know_us?: string[]
  why_join_xuedao: string
}

// Email templates
const EMAIL_TEMPLATES = {
  applicationReceived: {
    subject: 'We received your XueDAO application! 🚀',
    text: (data: { name: string; university: string }) =>
      `Hi ${data.name},

Thanks for applying to join XueDAO. We have received your application and will review it shortly.

University: ${data.university}

Best,
XueDAO Team`,
    html: (data: { name: string; university: string }) => `
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thanks for applying to join <strong>XueDAO</strong>. We have received your application and will review it shortly.</p>
      <p><strong>University:</strong> ${escapeHtml(data.university)}</p>
      <p>Best,<br/>XueDAO Team</p>
    `,
  },

  legacyApplicationNotification: {
    subject: (name: string) => `New XueDAO Application: ${name}`,
    text: (data: LegacyApplicationData) =>
      `New application received from ${data.name}

Name: ${data.name}
Email: ${data.email}
University: ${data.university}

Please log into the admin dashboard to review the full application.`,
    html: (data: LegacyApplicationData) => `
      <h2>New XueDAO Application Received! 🎉</h2>
      <h3>Applicant: ${escapeHtml(data.name)}</h3>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(data.name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
        <li><strong>University:</strong> ${escapeHtml(data.university)}</li>
      </ul>
      <p><em>Please log into the admin dashboard to review the full application.</em></p>
    `,
  },

  newApplicationNotification: {
    subject: (name: string) => `New XueDAO Application: ${name}`,
    text: (data: NewApplicationData) =>
      `New application received from ${data.name}

School: ${data.school_name}
Major: ${data.major}
Telegram: ${data.telegram_id}
Student Status: ${data.student_status}

Contribution Areas: ${data.contribution_areas?.join(', ') || 'Not specified'}
How they found us: ${data.how_know_us?.join(', ') || 'Not specified'}

Why join XueDAO: ${data.why_join_xuedao}

Please log into the admin dashboard to review the full application.`,
    html: (data: NewApplicationData) => `
      <h2>New XueDAO Application Received! 🎉</h2>
      <h3>Applicant: ${escapeHtml(data.name)}</h3>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>School:</strong> ${escapeHtml(data.school_name)}</p>
      <p><strong>Major:</strong> ${escapeHtml(data.major)}</p>
      <p><strong>Telegram:</strong> ${escapeHtml(data.telegram_id)}</p>
      <p><strong>Student Status:</strong> ${escapeHtml(data.student_status)}</p>
      
      <h4>Contribution Areas:</h4>
      <ul>${data.contribution_areas?.map(area => `<li>${escapeHtml(area)}</li>`).join('') || '<li>Not specified</li>'}</ul>
      
      <h4>How they found us:</h4>
      <ul>${data.how_know_us?.map(source => `<li>${escapeHtml(source)}</li>`).join('') || '<li>Not specified</li>'}</ul>
      
      <h4>Why join XueDAO:</h4>
      <p>${escapeHtml(data.why_join_xuedao)}</p>
      
      <p><em>Please log into the admin dashboard to review the full application.</em></p>
    `,
  },
}

// High-level email service functions
export const EmailService = {
  /**
   * Send application confirmation email to applicant with CC to admin
   * This combines both confirmation and notification into a single email
   */
  async sendApplicationConfirmationWithNotification(
    applicantData: LegacyApplicationData,
    isLegacy: boolean = false
  ): Promise<void> {
    const university = isLegacy 
      ? applicantData.university 
      : (applicantData as any).school_name || 'your institution'

    try {
      await sendEmail({
        to: applicantData.email,
        cc: EMAIL_CONFIG.adminEmails,
        subject: EMAIL_TEMPLATES.applicationReceived.subject,
        text: EMAIL_TEMPLATES.applicationReceived.text({ 
          name: applicantData.name, 
          university 
        }),
        html: EMAIL_TEMPLATES.applicationReceived.html({ 
          name: applicantData.name, 
          university 
        }),
      })
    } catch (error) {
      console.error('Failed to send application confirmation with notification:', error)
      throw error
    }
  },

  /**
   * Send detailed application notification to admin only
   * Use this when you need a detailed admin notification separate from user confirmation
   */
  async sendDetailedApplicationNotification(
    applicationData: LegacyApplicationData | NewApplicationData,
    isLegacy: boolean = false
  ): Promise<void> {
    const template = isLegacy 
      ? EMAIL_TEMPLATES.legacyApplicationNotification
      : EMAIL_TEMPLATES.newApplicationNotification

    try {
      await sendEmail({
        to: EMAIL_CONFIG.adminEmails,
        subject: template.subject(applicationData.name),
        text: template.text(applicationData as any),
        html: template.html(applicationData as any),
      })
    } catch (error) {
      console.error('Failed to send detailed application notification:', error)
      throw error
    }
  },

  /**
   * Send custom email with optional CC
   */
  async sendCustomEmail(options: EmailOptions): Promise<void> {
    try {
      await sendEmail(options)
    } catch (error) {
      console.error('Failed to send custom email:', error)
      throw error
    }
  },
}

// Legacy exports for backward compatibility (if needed)
export type SendMailParams = EmailOptions
export const sendMail = EmailService.sendCustomEmail