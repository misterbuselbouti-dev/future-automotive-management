import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function DemandesAchatPage() {
  const demandes = [
    {
      id: 1,
      reference: 'DA-2024-001',
      date: '09/02/2024',
      demandeur: 'Ahmed Benali',
      departement: 'Maintenance',
      motif: 'Pièces détachées pour bus #12',
      statut: 'EN_ATTENTE',
      priorite: 'URGENTE',
      montant: 15000
    },
    {
      id: 2,
      reference: 'DA-2024-002',
      date: '08/02/2024',
      demandeur: 'Mohamed Karim',
      departement: 'Exploitation',
      motif: 'Carburant et lubrifiants',
      statut: 'APPROUVEE',
      priorite: 'NORMAL',
      montant: 25000
    },
    {
      id: 3,
      reference: 'DA-2024-003',
      date: '07/02/2024',
      demandeur: 'Fatima Zahra',
      departement: 'Administration',
      motif: 'Matériel de bureau',
      statut: 'TRAITEE',
      priorite: 'BASSE',
      montant: 3500
    }
  ]

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800'
      case 'APPROUVEE': return 'bg-green-100 text-green-800'
      case 'REJETEE': return 'bg-red-100 text-red-800'
      case 'TRAITEE': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'URGENTE': return 'bg-red-100 text-red-800'
      case 'NORMAL': return 'bg-blue-100 text-blue-800'
      case 'BASSE': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente'
      case 'APPROUVEE': return 'Approuvée'
      case 'REJETEE': return 'Rejetée'
      case 'TRAITEE': return 'Traitée'
      default: return statut
    }
  }

  const getPrioriteLabel = (priorite: string) => {
    switch (priorite) {
      case 'URGENTE': return 'Urgente'
      case 'NORMAL': return 'Normal'
      case 'BASSE': return 'Basse'
      default: return priorite
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
        
        <main className="flex-1 p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demandes d'Achat</h1>
              <p className="text-gray-600 mt-2">Gestion des demandes d'achat</p>
            </div>
            <Link href="/achats/demandes-achat/nouvelle">
              <Button>Nouvelle Demande</Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Demandes</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous les statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="APPROUVEE">Approuvée</option>
                    <option value="REJETEE">Rejetée</option>
                    <option value="TRAITEE">Traitée</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demandeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Département
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motif
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priorité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {demandes.map((demande) => (
                    <tr key={demande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {demande.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.demandeur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.departement}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {demande.motif}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPrioriteColor(demande.priorite)}`}>
                          {getPrioriteLabel(demande.priorite)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutColor(demande.statut)}`}>
                          {getStatutLabel(demande.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                          <button className="text-green-600 hover:text-green-900">Approuver</button>
                          <button className="text-red-600 hover:text-red-900">Rejeter</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
