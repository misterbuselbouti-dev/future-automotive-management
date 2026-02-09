import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function DemandesPrixPage() {
  const demandesPrix = [
    {
      id: 1,
      reference: 'DP-2024-001',
      demandeAchat: 'DA-2024-001',
      fournisseur: 'AutoParts SARL',
      dateEnvoi: '08/02/2024',
      dateReponse: '09/02/2024',
      statut: 'RECU',
      prixTotal: 14500,
      delaiLivraison: '5 jours'
    },
    {
      id: 2,
      reference: 'DP-2024-002',
      demandeAchat: 'DA-2024-001',
      fournisseur: 'MecaPro',
      dateEnvoi: '08/02/2024',
      dateReponse: null,
      statut: 'ENVOYE',
      prixTotal: null,
      delaiLivraison: null
    },
    {
      id: 3,
      reference: 'DP-2024-003',
      demandeAchat: 'DA-2024-002',
      fournisseur: 'FuelSupply',
      dateEnvoi: '07/02/2024',
      dateReponse: '08/02/2024',
      statut: 'SELECTIONNE',
      prixTotal: 24500,
      delaiLivraison: '2 jours'
    }
  ]

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'ENVOYE': return 'bg-blue-100 text-blue-800'
      case 'RECU': return 'bg-green-100 text-green-800'
      case 'SELECTIONNE': return 'bg-purple-100 text-purple-800'
      case 'REJETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'ENVOYE': return 'Envoyée'
      case 'RECU': return 'Reçue'
      case 'SELECTIONNE': return 'Sélectionnée'
      case 'REJETE': return 'Rejetée'
      default: return statut
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
              <h1 className="text-3xl font-bold text-gray-900">Demandes de Prix</h1>
              <p className="text-gray-600 mt-2">Suivi des demandes de prix envoyées aux fournisseurs</p>
            </div>
            <Button>Nouvelle Demande de Prix</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Envoyées</p>
                  <p className="text-2xl font-bold text-blue-600">15</p>
                </div>
                <div className="text-3xl">📤</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réponses Reçues</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <div className="text-3xl">📥</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sélectionnées</p>
                  <p className="text-2xl font-bold text-purple-600">5</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Demandes de Prix</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous les statuts</option>
                    <option value="ENVOYE">Envoyées</option>
                    <option value="RECU">Reçues</option>
                    <option value="SELECTIONNE">Sélectionnées</option>
                    <option value="REJETE">Rejetées</option>
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
                      Demande d'Achat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Envoi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Réponse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Délai Livraison
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
                  {demandesPrix.map((demande) => (
                    <tr key={demande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {demande.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.demandeAchat}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.fournisseur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.dateEnvoi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.dateReponse || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.prixTotal ? `${demande.prixTotal.toLocaleString()} DA` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.delaiLivraison || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutColor(demande.statut)}`}>
                          {getStatutLabel(demande.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                          {demande.statut === 'RECU' && (
                            <button className="text-green-600 hover:text-green-900">Sélectionner</button>
                          )}
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
