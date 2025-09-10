import { CompanyLogo as BaseCompanyLogo } from '@/components/ui/company-logo'

interface CompanyLogoProps {
  company: string
  size?: 'sm' | 'md' | 'lg'
}

export function CompanyLogo({ company, size = 'md' }: CompanyLogoProps) {
  return <BaseCompanyLogo companyName={company} size={size} variant="minimal" />
}