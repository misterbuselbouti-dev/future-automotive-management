'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface BonCommande {
  id: number
  reference: string
  demande_prix: string
  fournisseur: string
  date: string
  date_livraison: string
  statut: string
  montant_total: number
  conditions: string
  created_at: string
  updated_at: string
}

export default function BonsCommandePage() {
  const [bonsCommande, setBonsCommande] = useState<BonCommande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchBonsCommande()
  }, [])

  const fetchBonsCommande = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/achats-data')
      const data = await response.json()
      
      if (data.bonsCommande) {
        setBonsCommande(data.bonsCommande)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des bons de commande')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBonCommande = () => {
    alert('إضافة أمر شراء - قيد التطوير')
  }

  const handleViewBonCommande = (bonId: number) => {
    alert(`عرض تفاصيل أمر الشراء ${bonId} - قيد التطوير`)
  }

  const handleEditBonCommande = (bonId: number) => {
    alert(`تعديل أمر الشراء ${bonId} - قيد التطوير`)
  }

  const handleDeleteBonCommande = (bonId: number) => {
    if (confirm(`هل أنت متأكد من حذف أمر الشراء ${bonId}؟`)) {
      setBonsCommande(prev => prev.filter(b => b.id !== bonId))
      alert(`تم حذف أمر الشراء ${bonId} بنجاح!`)
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'APPROUVE':
        return 'bg-green-100 text-green-800'
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJETEE':
        return 'bg-red-100 text-red-800'
      case 'LIVRE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'APPROUVE':
        return 'Approuvé'
      case 'EN_ATTENTE':
        return 'En attente'
      case 'REJETEE':
        return 'Rejeté'
      case 'LIVRE':
        return 'Livré'
      default:
        return statut
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des bons de commande...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
          <main className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button onClick={fetchBonsCommande} className="mt-3">
                Réessayer
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
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
            <Button onClick={handleAddBonCommande}>Nouveau Bon de Commande</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bons</p>
                  <p className="text-2xl font-bold text-blue-600">{bonsCommande.length}</p>
                </div>
                <div className="text-3xl">📋</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bonsCommande.filter(b => b.statut === 'EN_ATTENTE').length}
                  </p>
                </div>
                <div className="text-3xl">⏳️</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approuvés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bonsCommande.filter(b => b.statut === 'APPROUVE').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Livrés</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bonsCommande.filter(b => b.statut === 'LIVRE').length}
                  </p>
                </div>
                <div className="text-3xl">🚚</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liste des Bons de Commande</h2>
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
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant Total
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
                        {bon.demande_prix}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bon.fournisseur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(bon.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.date_livraison ? new Date(bon.date_livraison).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bon.statut)}`}>
                          {getStatutLabel(bon.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {bon.montant_total.toLocaleString()} DA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewBonCommande(bon.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditBonCommande(bon.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteBonCommande(bon.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Supprimer
                          </button>
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
