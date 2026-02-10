'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface DemandePrix {
  id: number
  reference: string
  demande_achat_id: number
  demande_achat_reference: string
  fournisseur_id: number
  fournisseur_nom: string
  date_envoi: string
  date_reponse: string | null
  date_limite_reponse: string
  prix_total: number | null
  statut: string
  delai_livraison: string | null
  evaluation_qualite: number | null
  conditions: string | null
  worker_nom: string | null
  bus_number: string | null
  articles_count: number
  created_at: string
}

export default function DemandesPrixPage() {
  const [demandesPrix, setDemandesPrix] = useState<DemandePrix[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchDemandesPrix()
  }, [])

  const fetchDemandesPrix = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/demandes-prix')
      const data = await response.json()
      
      if (data.demandesPrix) {
        setDemandesPrix(data.demandesPrix)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des demandes de prix')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'envoyee':
        return 'bg-blue-100 text-blue-800'
      case 'reponse_recue':
        return 'bg-green-100 text-green-800'
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-800'
      case 'convertie':
        return 'bg-purple-100 text-purple-800'
      case 'rejete':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'envoyee':
        return 'Envoyée'
      case 'reponse_recue':
        return 'Réponse Reçue'
      case 'en_cours':
        return 'En Cours'
      case 'convertie':
        return 'Convertie en BC'
      case 'rejete':
        return 'Rejetée'
      default:
        return statut
    }
  }

  const getEvaluationColor = (evaluation: number | null) => {
    if (!evaluation) return 'bg-gray-100 text-gray-800'
    if (evaluation >= 4.5) return 'bg-green-100 text-green-800'
    if (evaluation >= 3.5) return 'bg-blue-100 text-blue-800'
    if (evaluation >= 2.5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getEvaluationLabel = (evaluation: number | null) => {
    if (!evaluation) return 'Non évaluée'
    if (evaluation >= 4.5) return 'Excellent'
    if (evaluation >= 3.5) return 'Bon'
    if (evaluation >= 2.5) return 'Moyen'
    return 'Faible'
  }

  const handleConvertToBC = async (demandePrixId: number) => {
    try {
      const response = await fetch(`/api/demandes-prix/${demandePrixId}/convert-to-bc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Demande de prix convertie en bon de commande avec succès!')
        fetchDemandesPrix()
      } else {
        alert('Erreur lors de la conversion')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la conversion')
    }
  }

  const filteredDemandes = demandesPrix.filter(demande => {
    const matchesFilter = filter === '' || 
      demande.reference.toLowerCase().includes(filter.toLowerCase()) ||
      demande.fournisseur_nom.toLowerCase().includes(filter.toLowerCase()) ||
      demande.demande_achat_reference.toLowerCase().includes(filter.toLowerCase())
    
    const matchesStatus = statusFilter === '' || demande.statut === statusFilter
    
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
                <p className="mt-4 text-gray-600">Chargement des demandes de prix...</p>
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
              <Button onClick={fetchDemandesPrix} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Demandes de Prix</h1>
              <p className="text-gray-600 mt-2">Suivi ISO 9001 - Demandes de prix envoyées aux fournisseurs</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/achats/demandes-achat/nouvelle'}>
                Nouvelle Demande d'Achat
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Envoyées</p>
                  <p className="text-2xl font-bold text-blue-600">{demandesPrix.length}</p>
                </div>
                <div className="text-3xl">📤</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réponses Reçues</p>
                  <p className="text-2xl font-bold text-green-600">
                    {demandesPrix.filter(d => d.statut === 'reponse_recue').length}
                  </p>
                </div>
                <div className="text-3xl">📥</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {demandesPrix.filter(d => d.statut === 'envoyee').length}
                  </p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Converties</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {demandesPrix.filter(d => d.statut === 'convertie').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Réponse</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {demandesPrix.length > 0 
                      ? Math.round((demandesPrix.filter(d => d.statut === 'reponse_recue').length / demandesPrix.length) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="text-3xl">📊</div>
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
                    <option value="envoyee">Envoyées</option>
                    <option value="reponse_recue">Réponses Reçues</option>
                    <option value="en_cours">En Cours</option>
                    <option value="convertie">Converties</option>
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
                      DA Originale
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
                      Évaluation
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
                  {filteredDemandes.map((demande) => (
                    <tr key={demande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {demande.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{demande.demande_achat_reference}</div>
                          {demande.worker_nom && (
                            <div className="text-xs text-gray-400">
                              {demande.worker_nom} - {demande.bus_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.fournisseur_nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(demande.date_envoi).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.date_reponse 
                          ? new Date(demande.date_reponse).toLocaleDateString('fr-FR')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.prix_total 
                          ? `${demande.prix_total.toLocaleString()} DA`
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.delai_livraison || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getEvaluationColor(demande.evaluation_qualite)}`}>
                          {getEvaluationLabel(demande.evaluation_qualite)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatutColor(demande.statut)}`}>
                          {getStatutLabel(demande.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 font-medium">
                            Voir
                          </button>
                          {demande.statut === 'reponse_recue' && (
                            <button 
                              onClick={() => handleConvertToBC(demande.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Convertir en BC
                            </button>
                          )}
                          {demande.statut === 'convertie' && (
                            <span className="text-purple-600 font-medium">
                              Déjà convertie
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
