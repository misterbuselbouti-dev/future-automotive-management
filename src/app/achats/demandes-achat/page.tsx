'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface DemandeAchat {
  id: number
  reference: string
  date_demande: string
  demandeur: string
  service: string
  worker_nom: string | null
  bus_number: string | null
  description: string
  statut: string
  priorite: string
  total: number
  auto_approve: boolean
  justification: string | null
  articles_count: number
  dp_count: number
  bc_count: number
  created_at: string
  updated_at: string
}

export default function DemandesAchatPage() {
  const [demandes, setDemandes] = useState<DemandeAchat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchDemandes()
  }, [])

  const fetchDemandes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/demandes-achat')
      const data = await response.json()
      
      if (data.demandesAchat) {
        setDemandes(data.demandesAchat)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des demandes d\'achat')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'dp_genere':
        return 'bg-blue-100 text-blue-800'
      case 'approuve':
        return 'bg-green-100 text-green-800'
      case 'rejete':
        return 'bg-red-100 text-red-800'
      case 'traite':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return 'En Attente'
      case 'dp_genere':
        return 'DP Généré'
      case 'approuve':
        return 'Approuvée'
      case 'rejete':
        return 'Rejetée'
      case 'traite':
        return 'Traitée'
      default:
        return statut
    }
  }

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente':
        return 'bg-red-100 text-red-800'
      case 'normale':
        return 'bg-blue-100 text-blue-800'
      case 'basse':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priorite: string) => {
    switch (priorite) {
      case 'urgente':
        return 'Urgente'
      case 'normale':
        return 'Normale'
      case 'basse':
        return 'Basse'
      default:
        return priorite
    }
  }

  const handleAutoApprove = async (demandeId: number) => {
    try {
      const response = await fetch(`/api/demandes-achat/${demandeId}/auto-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Demande approuvée automatiquement! Les DP seront générées.')
        fetchDemandes()
      } else {
        alert('Erreur lors de l\'approbation automatique')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'approbation automatique')
    }
  }

  const filteredDemandes = demandes.filter(demande => {
    const matchesFilter = filter === '' || 
      demande.reference.toLowerCase().includes(filter.toLowerCase()) ||
      demande.demandeur.toLowerCase().includes(filter.toLowerCase()) ||
      demande.service.toLowerCase().includes(filter.toLowerCase()) ||
      (demande.worker_nom && demande.worker_nom.toLowerCase().includes(filter.toLowerCase()))
    
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
                <p className="mt-4 text-gray-600">Chargement des demandes d\'achat...</p>
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
              <Button onClick={fetchDemandes} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Demandes d'Achat</h1>
              <p className="text-gray-600 mt-2">ISO 9001 - Gestion des demandes d'achat avec approbation automatique</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/achats/demandes-achat/nouvelle'}>
                Nouvelle Demande
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Demandes</p>
                  <p className="text-2xl font-bold text-blue-600">{demandes.length}</p>
                </div>
                <div className="text-3xl">📋</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {demandes.filter(d => d.statut === 'en_attente').length}
                  </p>
                </div>
                <div className="text-3xl">⏳️</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">DP Générées</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {demandes.filter(d => d.statut === 'dp_genere').length}
                  </p>
                </div>
                <div className="text-3xl">📤</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approuvées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {demandes.filter(d => d.statut === 'approuve').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Montant Total</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {demandes.reduce((sum, d) => sum + d.total, 0).toLocaleString()} DA
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Demandes d'Achat</h2>
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
                    <option value="dp_genere">DP Générées</option>
                    <option value="approuve">Approuvées</option>
                    <option value="rejete">Rejetées</option>
                    <option value="traite">Traitées</option>
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
                      Service/Worker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Articles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priorité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
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
                        {new Date(demande.date_demande).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {demande.demandeur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{demande.service}</div>
                          {demande.worker_nom && (
                            <div className="text-xs text-gray-400">
                              {demande.worker_nom} - {demande.bus_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {demande.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-center">
                          <div className="font-medium">{demande.articles_count}</div>
                          <div className="text-xs text-gray-400">
                            {demande.dp_count} DP / {demande.bc_count} BC
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(demande.statut)}`}>
                          {getStatusLabel(demande.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(demande.priorite)}`}>
                          {getPriorityLabel(demande.priorite)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {demande.total.toLocaleString()} DA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 font-medium">
                            Voir
                          </button>
                          {demande.statut === 'en_attente' && demande.auto_approve && (
                            <button 
                              onClick={() => handleAutoApprove(demande.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Approuver Auto
                            </button>
                          )}
                          {demande.statut === 'dp_genere' && (
                            <span className="text-purple-600 font-medium">
                              DP envoyées
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
