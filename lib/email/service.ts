import { Resend } from 'resend'
import { templateLoader } from './template-loader'

// Centralized email configuration
const EMAIL_CONFIG = {
  fromName: process.env.MAIL_FROM_NAME || 'XueDAO',
  fromAddress: process.env.MAIL_FROM_ADDRESS || 'onboarding@resend.dev',
  adminEmails: (process.env.ADMIN_EMAILS || 'albert2367593@gmail.com')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean),
} as const

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
type NewApplicationData = {
  name: string
  email: string
  university: string
  major: string
  telegram_id: string
  student_status: string
  years_since_graduation?: number | null
  contribution_areas?: string[]
  how_know_us?: string[]
  motivation: string
  web3_interests: string
  skills_bringing: string
  web3_journey: string
  referrer_name?: string | null
  last_words?: string | null
}

// Email template helpers
const EMAIL_TEMPLATES = {
  applicationReceived: {
    subject: 'We received your XueDAO application! 🚀',
    text: (data: NewApplicationData) =>
      `Hi ${data.name},

Thanks for applying to join XueDAO. We have received your application and will review it shortly.

Here's a summary of your application:
- School: ${data.university}
- Major: ${data.major}
- Telegram: ${data.telegram_id}
- Student Status: ${data.student_status}

Why you want to join: ${data.motivation}

We'll be in touch soon!

Best,
XueDAO Team`,
    html: (data: NewApplicationData) => 
      templateLoader.renderApplicationConfirmation(data),
  },


  applicationApproved: {
    subject: 'Welcome to XueDAO! Your application has been approved 🎉',
    text: (name: string, telegramId: string) =>
      `Hi ${name},

Congratulations! We're thrilled to welcome you as an official member of the XueDAO community!

After careful review of your application, we're excited to let you know that you've been accepted into XueDAO.

Next Steps:
- Join our Telegram group (we'll contact you at ${telegramId})
- Attend our next community meeting
- Complete your member profile
- Explore collaboration opportunities

We're looking forward to seeing the amazing contributions you'll make to XueDAO and the broader Web3 ecosystem!

Welcome to the team!
XueDAO Team 🚀`,
    html: (name: string, telegramId: string) => 
      templateLoader.renderApplicationApproved({ name, telegram_id: telegramId }),
  },

  applicationRejected: {
    subject: 'XueDAO Application Update',
    text: (name: string) =>
      `Hi ${name},

Thank you so much for taking the time to apply for XueDAO membership. We genuinely appreciate your interest in joining our community.

After careful consideration, we won't be able to move forward with your application at this time. Please know that this decision doesn't reflect your potential or value.

We encourage you to:
- Stay connected with our community
- Continue building your Web3 knowledge
- Apply again in future application cycles
- Join our public events and workshops

We truly wish you the best in your Web3 journey and hope our paths cross again in the future.

Best of luck,
XueDAO Team 🚀`,
    html: (name: string) => 
      templateLoader.renderApplicationRejected({ name }),
  },
}

// High-level email service functions
export const EmailService = {
  /**
   * Send application confirmation email to applicant with CC to admin
   * This combines both confirmation and notification into a single email
   */
  async sendApplicationConfirmationWithNotification(
    applicationData: NewApplicationData
  ): Promise<void> {
    try {
      await sendEmail({
        to: applicationData.email,
        bcc: EMAIL_CONFIG.adminEmails,
        subject: EMAIL_TEMPLATES.applicationReceived.subject,
        text: EMAIL_TEMPLATES.applicationReceived.text(applicationData),
        html: EMAIL_TEMPLATES.applicationReceived.html(applicationData),
      })
    } catch (error) {
      console.error('Failed to send application confirmation with notification:', error)
      throw error
    }
  },

  /**
   * Send application approval email to applicant
   */
  async sendApplicationApproval(
    name: string,
    email: string,
    telegramId: string
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.applicationApproved

    try {
      await sendEmail({
        to: email,
        subject: template.subject,
        text: template.text(name, telegramId),
        html: template.html(name, telegramId),
      })
    } catch (error) {
      console.error('Failed to send application approval email:', error)
      throw error
    }
  },

  /**
   * Send application rejection email to applicant
   */
  async sendApplicationRejection(
    name: string,
    email: string
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.applicationRejected

    try {
      await sendEmail({
        to: email,
        subject: template.subject,
        text: template.text(name),
        html: template.html(name),
      })
    } catch (error) {
      console.error('Failed to send application rejection email:', error)
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