import { CompanyLogo as BaseCompanyLogo } from '@/components/ui/company-logo'

interface CompanyLogoProps {
  companyName: string
}

export function CompanyLogo({ companyName }: CompanyLogoProps) {
  return <BaseCompanyLogo companyName={companyName} size="lg" />
}