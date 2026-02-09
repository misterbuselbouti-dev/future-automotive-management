interface PrioriteBadgeProps {
  priorite: string
}

export function PrioriteBadge({ priorite }: PrioriteBadgeProps) {
  const getPrioriteInfo = () => {
    switch (priorite) {
      case 'URGENTE':
        return { color: 'bg-red-100 text-red-800', label: 'Urgente' }
      case 'NORMAL':
        return { color: 'bg-blue-100 text-blue-800', label: 'Normal' }
      case 'BASSE':
        return { color: 'bg-gray-100 text-gray-800', label: 'Basse' }
      default:
        return { color: 'bg-gray-100 text-gray-800', label: priorite }
    }
  }

  const { color, label } = getPrioriteInfo()

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
      {label}
    </span>
  )
}
