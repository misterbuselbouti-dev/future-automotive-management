'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface BonEntree {
  id: number
  reference: string
  bon_commande_id: number
  bon_commande_reference: string
  fournisseur_nom: string
  date_entree: string
  statut: string
  controle_qualite: boolean
  resultats_controle: string | null
  recu_par: string | null
  observation: string | null
  articles_recus: any[]
  non_conformites: string | null
  articles_count: number
  total_value: number
  created_at: string
}

export default function BonsEntreePage() {
  const [bonsEntree, setBonsEntree] = useState<BonEntree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchBonsEntree()
  }, [])

  const fetchBonsEntree = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bons-entree')
      const data = await response.json()
      
      if (data.bonsEntree) {
        setBonsEntree(data.bonsEntree)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des bons d\'entrée')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'controle_qualite':
        return 'bg-blue-100 text-blue-800'
      case 'valide':
        return 'bg-green-100 text-green-800'
      case 'rejete':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'En Attente'
      case 'controle_qualite':
        return 'Contrôle Qualité'
      case 'valide':
        return 'Validé'
      case 'rejete':
        return 'Rejeté'
      default:
        return statut
    }
  }

  const handleValiderBonEntree = async (bonEntreeId: number) => {
    try {
      const response = await fetch(`/api/bons-entree/${bonEntreeId}/valider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Bon d\'entrée validé avec succès! Le stock a été mis à jour automatiquement.')
        fetchBonsEntree()
      } else {
        alert('Erreur lors de la validation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la validation')
    }
  }

  const handleControleQualite = async (bonEntreeId: number) => {
    try {
      const response = await fetch(`/api/bons-entree/${bonEntreeId}/controle-qualite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Contrôle qualité démarré avec succès!')
        fetchBonsEntree()
      } else {
        alert('Erreur lors du démarrage du contrôle qualité')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du démarrage du contrôle qualité')
    }
  }

  const filteredBons = bonsEntree.filter(bon => {
    const matchesFilter = filter === '' || 
      bon.reference.toLowerCase().includes(filter.toLowerCase()) ||
      bon.bon_commande_reference.toLowerCase().includes(filter.toLowerCase()) ||
      bon.fournisseur_nom.toLowerCase().includes(filter.toLowerCase())
    
    const matchesStatus = statusFilter === '' || bon.statut === statusFilter
    
    return matchesFilter && matchesStatus
  })

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
                <p className="mt-4 text-gray-600">Chargement des bons d'entrée...</p>
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
              <Button onClick={fetchBonsEntree} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Bons d'Entrée</h1>
              <p className="text-gray-600 mt-2">ISO 9001 - Gestion des entrées en entrepôt</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/achats/bons-commande'}>
                Voir les Bons de Commande
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entrées</p>
                  <p className="text-2xl font-bold text-blue-600">{bonsEntree.length}</p>
                </div>
                <div className="text-3xl">📦</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bonsEntree.filter(b => b.statut === 'en_attente').length}
                  </p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contrôle Qualité</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bonsEntree.filter(b => b.statut === 'controle_qualite').length}
                  </p>
                </div>
                <div className="text-3xl">🔍</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Validées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bonsEntree.filter(b => b.statut === 'valide').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {bonsEntree.reduce((sum, bon) => sum + bon.total_value, 0).toLocaleString()} DA
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Bons d'Entrée</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="en_attente">En Attente</option>
                    <option value="controle_qualite">Contrôle Qualité</option>
                    <option value="valide">Validées</option>
                    <option value="rejete">Rejetées</option>
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
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Entrée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrôle Qualité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reçu par
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
                  {filteredBons.map((bon) => (
                    <tr key={bon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bon.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.bon_commande_reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.fournisseur_nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(bon.date_entree).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.articles_count} article{bon.articles_count > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.total_value.toLocaleString()} DA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bon.controle_qualite ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Effectué
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bon.recu_par || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutColor(bon.statut)}`}>
                          {getStatutLabel(bon.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                          {bon.statut === 'en_attente' && (
                            <>
                              <button 
                                onClick={() => handleControleQualite(bon.id)}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                Contrôle
                              </button>
                            </>
                          )}
                          {bon.statut === 'controle_qualite' && (
                            <button 
                              onClick={() => handleValiderBonEntree(bon.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Valider
                            </button>
                          )}
                          {bon.statut === 'valide' && (
                            <span className="text-purple-600 font-medium">
                              Stock mis à jour
                            </span>
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
