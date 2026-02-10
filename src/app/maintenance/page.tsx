'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Maintenance {
  id: number
  bus_id: number
  bus_number: string
  type: string
  description: string
  scheduled_date: string
  completed_date?: string
  status: 'programme' | 'en_cours' | 'termine' | 'annule'
  priority: 'basse' | 'normale' | 'urgente' | 'critique'
  cost: number
  technician_id?: number
  technician_name?: string
  parts_used: MaintenancePart[]
  created_at: string
  updated_at: string
}

interface MaintenancePart {
  id: number
  article_id: number
  article_reference: string
  article_designation: string
  region_name: string
  quantity_used: number
  unit_price: number
  total_cost: number
}

interface Bus {
  id: number
  bus_number: string
  license_plate: string
  type: string
  status: string
}

interface Worker {
  id: number
  nom: string
  prenom: string
  specialite: string
  status: string
}

export default function MaintenancePage() {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchMaintenanceData()
  }, [])

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/maintenance')
      const data = await response.json()
      
      if (data.maintenance) {
        setMaintenance(data.maintenance)
      }
      if (data.buses) {
        setBuses(data.buses)
      }
      if (data.workers) {
        setWorkers(data.workers)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des données de maintenance')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'programme': return 'bg-blue-100 text-blue-800'
      case 'en_cours': return 'bg-yellow-100 text-yellow-800'
      case 'termine': return 'bg-green-100 text-green-800'
      case 'annule': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'programme': return 'Programmé'
      case 'en_cours': return 'En Cours'
      case 'termine': return 'Terminé'
      case 'annule': return 'Annulé'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'bg-red-100 text-red-800'
      case 'urgente': return 'bg-orange-100 text-orange-800'
      case 'normale': return 'bg-blue-100 text-blue-800'
      case 'basse': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critique': return 'Critique'
      case 'urgente': return 'Urgente'
      case 'normale': return 'Normale'
      case 'basse': return 'Basse'
      default: return priority
    }
  }

  const handleCompleteMaintenance = async (maintenanceId: number) => {
    try {
      const response = await fetch(`/api/maintenance/${maintenanceId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Maintenance terminée avec succès! Le stock a été mis à jour automatiquement.')
        fetchMaintenanceData()
      } else {
        alert('Erreur lors de la terminaison de la maintenance')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la terminaison de la maintenance')
    }
  }

  const filteredMaintenance = maintenance.filter(maint => {
    const matchesFilter = filter === '' || 
      maint.description.toLowerCase().includes(filter.toLowerCase()) ||
      maint.bus_number.toLowerCase().includes(filter.toLowerCase()) ||
      maint.type.toLowerCase().includes(filter.toLowerCase())
    
    const matchesStatus = statusFilter === '' || maint.status === statusFilter
    
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
                <p className="mt-4 text-gray-600">Chargement des données de maintenance...</p>
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
              <Button onClick={fetchMaintenanceData} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
              <p className="text-gray-600 mt-2">ISO 9001 - Gestion de la maintenance et utilisation des pièces</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/maintenance/add'}>
                Nouvelle Maintenance
              </Button>
              <Button onClick={() => window.location.href = '/driver'}>
                Portail Conducteur
              </Button>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Maintenance</p>
                  <p className="text-2xl font-bold text-blue-600">{maintenance.length}</p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Programmées</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {maintenance.filter(m => m.status === 'programme').length}
                  </p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Cours</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {maintenance.filter(m => m.status === 'en_cours').length}
                  </p>
                </div>
                <div className="text-3xl">⚙️</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {maintenance.filter(m => m.status === 'termine').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coût Total</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {maintenance.reduce((sum, m) => sum + m.cost, 0).toLocaleString()} DA
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          </div>
          
          {/* Maintenance Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Interventions de Maintenance</h2>
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
                    <option value="programme">Programmées</option>
                    <option value="en_cours">En Cours</option>
                    <option value="termine">Terminées</option>
                    <option value="annule">Annulées</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Programmée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Terminée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priorité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technicien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coût
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pièces Utilisées
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaintenance.map((maint) => (
                    <tr key={maint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {maint.bus_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {maint.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {maint.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(maint.scheduled_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {maint.completed_date ? new Date(maint.completed_date).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(maint.status)}`}>
                          {getStatusLabel(maint.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(maint.priority)}`}>
                          {getPriorityLabel(maint.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {maint.technician_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {maint.cost.toLocaleString()} DA
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          {maint.parts_used.length > 0 ? (
                            maint.parts_used.map((part, index) => (
                              <div key={index} className="text-xs">
                                <span className="font-medium">{part.article_reference}</span>
                                <span className="text-gray-400 ml-1">
                                  ({part.quantity_used} {part.article_designation})
                                </span>
                                <span className="text-gray-400 ml-1">
                                  ({part.total_cost.toLocaleString()} DA)
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">Aucune pièce</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 font-medium">
                            Voir
                          </button>
                          {maint.status === 'en_cours' && (
                            <button 
                              onClick={() => handleCompleteMaintenance(maint.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Terminer
                            </button>
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
