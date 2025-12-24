import { Instagram, Zap } from 'lucide-react'

export const settingsConfig = [
  // Instagram Posts Configuration
  {
    key: 'instagram_post_1_url',
    label: 'Instagram Post 1 URL',
    description: 'First featured Instagram post URL',
    type: 'url',
    icon: Instagram,
    category: 'Instagram Posts',
  },
  {
    key: 'instagram_post_2_url',
    label: 'Instagram Post 2 URL',
    description: 'Second featured Instagram post URL',
    type: 'url',
    icon: Instagram,
    category: 'Instagram Posts',
  },
  {
    key: 'instagram_post_3_url',
    label: 'Instagram Post 3 URL',
    description: 'Third featured Instagram post URL',
    type: 'url',
    icon: Instagram,
    category: 'Instagram Posts',
  },
  // General Settings
  {
    key: 'applications_open',
    label: 'Applications Open',
    description: 'Whether new applications are being accepted',
    type: 'boolean',
    icon: Zap,
    category: 'General',
  },
]