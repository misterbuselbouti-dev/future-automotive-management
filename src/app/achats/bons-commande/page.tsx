import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function BonsCommandePage() {
  const bonsCommande = [
    {
      id: 1,
      reference: 'BC-2024-001',
      demandePrix: 'DP-2024-003',
      fournisseur: 'FuelSupply',
      date: '09/02/2024',
      dateLivraison: '11/02/2024',
      statut: 'APPROUVE',
      montantTotal: 24500,
      conditions: 'Paiement 30 jours'
    },
    {
      id: 2,
      reference: 'BC-2024-002',
      demandePrix: 'DP-2024-001',
      fournisseur: 'AutoParts SARL',
      date: '09/02/2024',
      dateLivraison: '14/02/2024',
      statut: 'EN_ATTENTE',
      montantTotal: 14500,
      conditions: 'Paiement comptant'
    },
    {
      id: 3,
      reference: 'BC-2024-003',
      demandePrix: 'DP-2024-005',
      fournisseur: 'MecaPro',
      date: '08/02/2024',
      dateLivraison: '10/02/2024',
      statut: 'LIVRE',
      montantTotal: 18500,
      conditions: 'Paiement 60 jours'
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
              <h1 className="text-3xl font-bold text-gray-900">Bons de Commande</h1>
              <p className="text-gray-600 mt-2">Gestion des bons de commande</p>
            </div>
            <Button>Nouveau Bon de Commande</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approuvés</p>
                  <p className="text-2xl font-bold text-green-600">5</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Livrés</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <div className="text-3xl">🚚</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Mois</p>
                  <p className="text-2xl font-bold text-purple-600">125.5K</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Bons de Commande</h2>
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
                      Demande de Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Livraison
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conditions
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
                  {bonsCommande.map((bon) => (
                    <tr key={bon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bon.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.demandePrix}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.fournisseur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.dateLivraison}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.montantTotal.toLocaleString()} DA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.conditions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutColor(bon.statut)}`}>
                          {getStatutLabel(bon.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                          <button className="text-green-600 hover:text-green-900">Imprimer</button>
                          {bon.statut === 'LIVRE' && (
                            <button className="text-purple-600 hover:text-purple-900">Réception</button>
                          )}
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
