interface StatutBadgeProps {
  statut: string
  type: 'demande' | 'demandePrix' | 'bon'
}

export function StatutBadge({ statut, type }: StatutBadgeProps) {
  const getStatutInfo = () => {
    switch (type) {
      case 'demande':
        switch (statut) {
          case 'EN_ATTENTE':
            return { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' }
          case 'APPROUVEE':
            return { color: 'bg-green-100 text-green-800', label: 'Approuvée' }
          case 'REJETEE':
            return { color: 'bg-red-100 text-red-800', label: 'Rejetée' }
          case 'TRAITEE':
            return { color: 'bg-blue-100 text-blue-800', label: 'Traitée' }
          default:
            return { color: 'bg-gray-100 text-gray-800', label: statut }
        }
      
      case 'demandePrix':
        switch (statut) {
          case 'ENVOYE':
            return { color: 'bg-blue-100 text-blue-800', label: 'Envoyée' }
          case 'RECU':
            return { color: 'bg-green-100 text-green-800', label: 'Reçue' }
          case 'SELECTIONNE':
            return { color: 'bg-purple-100 text-purple-800', label: 'Sélectionnée' }
          case 'REJETE':
            return { color: 'bg-red-100 text-red-800', label: 'Rejetée' }
          default:
            return { color: 'bg-gray-100 text-gray-800', label: statut }
        }
      
      case 'bon':
        switch (statut) {
          case 'EN_ATTENTE':
            return { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' }
          case 'APPROUVE':
            return { color: 'bg-green-100 text-green-800', label: 'Approuvé' }
          case 'REJETE':
            return { color: 'bg-red-100 text-red-800', label: 'Rejeté' }
          case 'LIVRE':
            return { color: 'bg-blue-100 text-blue-800', label: 'Livré' }
          case 'RECU':
            return { color: 'bg-purple-100 text-purple-800', label: 'Reçu' }
          default:
            return { color: 'bg-gray-100 text-gray-800', label: statut }
        }
      
      default:
        return { color: 'bg-gray-100 text-gray-800', label: statut }
    }
  }

  const { color, label } = getStatutInfo()

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${color}`}>
      {label}
    </span>
  )
}
