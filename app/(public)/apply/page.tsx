import { Metadata } from 'next'
import { ApplicationForm } from '@/features/applications'
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
        <div className="pt-20 pb-20"> {/* Account for fixed navbar and add bottom padding */}
          <SectionWrapper
            backgroundClass="bg-transparent"
            containerClass="container px-6 md:px-8 lg:px-12 max-w-4xl mx-auto"
          >
            <ApplicationForm />
          </SectionWrapper>
        </div>
      </div>
    </LanguageProvider>
  )
}