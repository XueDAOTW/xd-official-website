import { Metadata } from 'next'
import ApplicationForm from '@/features/applications/components/application-form'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Apply to Join XueDAO',
  description: 'Apply to become part of Taiwan\'s first student-led blockchain development community.',
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-hero to-hero2">
      <Navbar />
      <div className="pt-20"> {/* Account for fixed navbar */}
        <SectionWrapper
          backgroundClass="bg-transparent"
          containerClass="container px-4 md:px-6 max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join XueDAO Community
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Be part of Taiwan's first student-led blockchain development community. 
              Connect with fellow developers, learn cutting-edge technologies, and build the future together.
            </p>
          </div>
          
          <ApplicationForm />
        </SectionWrapper>
      </div>
    </div>
  )
}