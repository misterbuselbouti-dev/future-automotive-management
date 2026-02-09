'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface DemandeAchat {
  id: number
  reference: string
  date: string
  demandeur: string
  service: string
  description: string
  statut: string
  priorite: string
  montant_total: number
  created_at: string
  updated_at: string
}

export default function DemandesAchatPage() {
  const [demandes, setDemandes] = useState<DemandeAchat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchDemandes()
  }, [])

  const fetchDemandes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/achats-data')
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

  const handleAddDemande = () => {
    window.location.href = '/achats/demandes-achat/nouvelle'
  }

  const handleViewDemande = (demandeId: number) => {
    alert(`عرض تفاصيل طلب الشراء ${demandeId} - قيد التطوير`)
  }

  const handleEditDemande = (demandeId: number) => {
    alert(`تعديل طلب الشراء ${demandeId} - قيد التطوير`)
  }

  const handleDeleteDemande = (demandeId: number) => {
    if (confirm(`هل أنت متأكد من حذف طلب الشراء ${demandeId}؟`)) {
      setDemandes(prev => prev.filter(d => d.id !== demandeId))
      alert(`تم حذف طلب الشراء ${demandeId} بنجاح!`)
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'APPROUVEE':
        return 'bg-green-100 text-green-800'
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJETEE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'URGENT':
        return 'bg-red-100 text-red-800'
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800'
      case 'FAIBLE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioriteLabel = (priorite: string) => {
    switch (priorite) {
      case 'URGENT':
        return 'Urgente'
      case 'NORMAL':
        return 'Normal'
      case 'FAIBLE':
        return 'Basse'
      default:
        return priorite
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente'
      case 'APPROUVEE':
        return 'Approuvée'
      case 'REJETEE':
        return 'Rejetée'
      case 'TRAITEE':
        return 'Traitée'
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
                <p className="mt-4 text-gray-600">Chargement des demandes d'achat...</p>
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
              <p className="text-gray-600 mt-2">Gestion des demandes d'achat</p>
            </div>
            <Button onClick={handleAddDemande}>Nouvelle Demande</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    {demandes.filter(d => d.statut === 'EN_ATTENTE').length}
                  </p>
                </div>
                <div className="text-3xl">⏳️</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approuvées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {demandes.filter(d => d.statut === 'APPROUVEE').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejetées</p>
                  <p className="text-2xl font-bold text-red-600">
                    {demandes.filter(d => d.statut === 'REJETEE').length}
                  </p>
                </div>
                <div className="text-3xl">❌</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liste des Demandes d'Achat</h2>
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
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
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
                  {demandes.map((demande) => (
                    <tr key={demande.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {demande.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(demande.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {demande.demandeur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {demande.service}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {demande.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(demande.statut)}`}>
                          {getStatutLabel(demande.statut)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(demande.priorite)}`}>
                          {getPrioriteLabel(demande.priorite)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {demande.montant_total.toLocaleString()} DA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewDemande(demande.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditDemande(demande.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteDemande(demande.id)}
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
