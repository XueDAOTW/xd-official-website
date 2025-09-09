import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface SettingInputProps {
  config: {
    key: string
    label: string
    type?: string
  }
  value: string
  onChange: (value: string) => void
}

export function SettingInput({ config, value, onChange }: SettingInputProps) {
  switch (config.type) {
    case 'textarea':
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${config.label.toLowerCase()}`}
          rows={3}
        />
      )
    case 'boolean':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="true">Open</option>
          <option value="false">Closed</option>
        </select>
      )
    default:
      return (
        <Input
          type={config.type || 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${config.label.toLowerCase()}`}
        />
      )
  }
}