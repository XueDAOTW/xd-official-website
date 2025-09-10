import { readFileSync } from 'fs'
import { join } from 'path'

// Utility function for HTML escaping
function escapeHtml(input: string | undefined | null): string {
  if (!input) return ''
  return String(input)
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

  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template
    
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      // Handle arrays specially
      if (Array.isArray(value)) {
        result = result.replace(new RegExp(placeholder, 'g'), value.join(', ') || '')
      } else {
        result = result.replace(new RegExp(placeholder, 'g'), escapeHtml(value))
      }
    }
    
    // Handle conditional sections {{#field}}...{{/field}}
    result = result.replace(/\{\{#(\w+)\}\}(.*?)\{\{\/\1\}\}/gs, (match, fieldName, content) => {
      const fieldValue = variables[fieldName]
      return fieldValue && (Array.isArray(fieldValue) ? fieldValue.length > 0 : fieldValue) ? content : ''
    })
    
    return result
  }

  renderApplicationConfirmation(data: {
    name: string
    email: string
    school_name: string
    major: string
    telegram_id: string
    student_status: string
    years_since_graduation?: number | null
    contribution_areas?: string[]
    how_know_us?: string[]
    why_join_xuedao: string
    web3_interests: string
    skills_bringing: string
    web3_journey: string
    referrer_name?: string | null
    last_words?: string | null
  }): string {
    const template = this.loadTemplate('application-confirmation')
    return this.replaceVariables(template, {
      name: data.name,
      email: data.email,
      school_name: data.school_name,
      major: data.major,
      telegram_id: data.telegram_id,
      student_status: data.student_status,
      years_since_graduation: data.years_since_graduation,
      why_join_xuedao: data.why_join_xuedao,
      web3_interests: data.web3_interests,
      skills_bringing: data.skills_bringing,
      web3_journey: data.web3_journey,
      referrer_name: data.referrer_name,
      last_words: data.last_words,
      contribution_areas: data.contribution_areas,
      how_know_us: data.how_know_us,
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