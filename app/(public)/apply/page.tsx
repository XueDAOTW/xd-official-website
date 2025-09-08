import { Metadata } from 'next'
import ApplicationFormI18n from '@/features/applications/components/application-form-i18n'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import Navbar from '@/components/navbar'
import { LanguageProvider } from '@/lib/contexts/language-context'

export const metadata: Metadata = {
  title: 'Apply to Join XueDAO',
  description: 'Apply to become part of Taiwan\'s first student-led blockchain development community.',
}

export default function ApplyPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-hero to-hero2">
        <Navbar />
        <div className="pt-20"> {/* Account for fixed navbar */}
          <SectionWrapper
            backgroundClass="bg-transparent"
            containerClass="container px-4 md:px-6 max-w-4xl mx-auto"
          >
            <ApplicationFormI18n />
          </SectionWrapper>
        </div>
      </div>
    </LanguageProvider>
  )
}