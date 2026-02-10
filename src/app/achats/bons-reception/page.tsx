import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function BonsReceptionPage() {
  const bonsReception = [
    {
      id: 1,
      reference: 'BR-2024-001',
      bonCommande: 'BC-2024-003',
      date: '10/02/2024',
      statut: 'RECU',
      controleQualite: true,
      recuPar: 'Ahmed Benali',
      observation: 'Articles conformes et en bon état'
    },
    {
      id: 2,
      reference: 'BR-2024-002',
      bonCommande: 'BC-2024-001',
      date: '11/02/2024',
      statut: 'EN_ATTENTE',
      controleQualite: false,
      recuPar: null,
      observation: null
    },
    {
      id: 3,
      reference: 'BR-2024-003',
      bonCommande: 'BC-2024-005',
      date: '09/02/2024',
      statut: 'RECU',
      controleQualite: true,
      recuPar: 'Mohamed Karim',
      observation: 'Quantité conforme, qualité vérifiée'
    }
  ]

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800'
      case 'APPROUVE': return 'bg-green-100 text-green-800'
      case 'REJETE': return 'bg-red-100 text-red-800'
      case 'LIVRE': return 'bg-blue-100 text-blue-800'
      case 'RECU': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente'
      case 'APPROUVE': return 'Approuvé'
      case 'REJETE': return 'Rejeté'
      case 'LIVRE': return 'Livré'
      case 'RECU': return 'Reçu'
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
              <h1 className="text-3xl font-bold text-gray-900">Bons de Réception</h1>
              <p className="text-gray-600 mt-2">Gestion des réceptions de marchandises</p>
            </div>
            <Button>Nouveau Bon de Réception</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reçus Aujourd'hui</p>
                  <p className="text-2xl font-bold text-green-600">3</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contrôle Qualité</p>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                <div className="text-3xl">🔍</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Semaine</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
                <div className="text-3xl">📦</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Bons de Réception</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous les statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="APPROUVE">Approuvés</option>
                    <option value="REJETE">Rejetés</option>
                    <option value="LIVRE">Livrés</option>
                    <option value="RECU">Reçus</option>
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
                      Bon de Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reçu par
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrôle Qualité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Observation
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
                  {bonsReception.map((bon) => (
                    <tr key={bon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bon.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.bonCommande}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.recuPar || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bon.controleQualite ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Effectué
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {bon.observation || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutColor(bon.statut)}`}>
                          {getStatutLabel(bon.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                          {bon.statut === 'EN_ATTENTE' && (
                            <>
                              <button className="text-green-600 hover:text-green-900">Valider</button>
                              <button className="text-orange-600 hover:text-orange-900">Contrôle</button>
                            </>
                          )}
                          <button className="text-purple-600 hover:text-purple-900">Imprimer</button>
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
