import { readFileSync } from 'fs'
import { join } from 'path'

// Utility function for HTML escaping
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Template loader with caching
class TemplateLoader {
  private templates: Map<string, string> = new Map()
  private templatesDir = join(process.cwd(), 'lib', 'email', 'templates')

  private loadTemplate(templateName: string): string {
    if (this.templates.has(templateName)) {
      return this.templates.get(templateName)!
    }

    try {
      const templatePath = join(this.templatesDir, `${templateName}.html`)
      const template = readFileSync(templatePath, 'utf-8')
      this.templates.set(templateName, template)
      return template
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error)
      throw new Error(`Template ${templateName} not found`)
    }
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      result = result.replace(new RegExp(placeholder, 'g'), escapeHtml(value))
    }
    return result
  }

  renderApplicationConfirmation(data: { name: string; university: string }): string {
    const template = this.loadTemplate('application-confirmation')
    return this.replaceVariables(template, {
      name: data.name,
      university: data.university,
    })
  }

  renderApplicationNotification(data: {
    name: string
    email: string
    school_name: string
    major: string
    telegram_id: string
    student_status: string
    contribution_areas?: string[]
    how_know_us?: string[]
    why_join_xuedao: string
  }): string {
    const template = this.loadTemplate('application-notification')
    
    // Generate tags HTML
    const contributionAreasTags = data.contribution_areas?.length
      ? data.contribution_areas.map(area => `<span class="tag">${escapeHtml(area)}</span>`).join('')
      : '<span class="tag" style="background: #fed7d7; color: #c53030;">Not specified</span>'

    const howKnowUsTags = data.how_know_us?.length
      ? data.how_know_us.map(source => `<span class="tag">${escapeHtml(source)}</span>`).join('')
      : '<span class="tag" style="background: #fed7d7; color: #c53030;">Not specified</span>'

    return this.replaceVariables(template, {
      name: data.name,
      email: data.email,
      school_name: data.school_name,
      major: data.major,
      telegram_id: data.telegram_id,
      student_status: data.student_status,
      contribution_areas_tags: contributionAreasTags,
      how_know_us_tags: howKnowUsTags,
      why_join_xuedao: data.why_join_xuedao,
    })
  }
}

// Export singleton instance
export const templateLoader = new TemplateLoader()