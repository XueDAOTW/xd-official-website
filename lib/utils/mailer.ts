import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(apiKey)
}

export type SendMailParams = {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendMail(params: SendMailParams) {
  const fromName = process.env.MAIL_FROM_NAME || 'XueDAO'
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'onboarding@resend.dev'
  const from = params.from || `${fromName} <${fromAddress}>`

  const resend = getResendClient()
  const emailOptions: SendEmailOptions = {
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  }
  return resend.emails.send(emailOptions)
} 