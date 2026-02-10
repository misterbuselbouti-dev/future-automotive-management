'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Bus {
  id: number
  bus_number: string
  license_plate: string
  type: string
  status: string
  consumption: number
  workers: Worker[]
  parts_requirements_count: number
  maintenance_count: number
  created_at: string
}

interface Worker {
  id: number
  nom: string
  prenom: string
  specialite: string
  telephone: string
  email: string
}

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/buses')
      const data = await response.json()
      
      if (data.buses) {
        setBuses(data.buses)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des bus')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-red-100 text-red-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'retired':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'maintenance':
        return 'En Maintenance'
      case 'inactive':
        return 'Inactif'
      case 'retired':
        return 'Retiré'
      default:
        return status
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Bus':
        return 'bg-blue-100 text-blue-800'
      case 'MiniBus':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateMaintenanceDemand = async (busId: number) => {
    try {
      const response = await fetch(`/api/buses/${busId}/create-maintenance-demande`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Demande de maintenance créée automatiquement pour ce bus!')
        fetchBuses()
      } else {
        alert('Erreur lors de la création de la demande de maintenance')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création de la demande de maintenance')
    }
  }

  const filteredBuses = buses.filter(bus => {
    const matchesFilter = filter === '' || 
      bus.bus_number.toLowerCase().includes(filter.toLowerCase()) ||
      bus.license_plate.toLowerCase().includes(filter.toLowerCase()) ||
      bus.type.toLowerCase().includes(filter.toLowerCase())
    
    const matchesStatus = statusFilter === '' || bus.status === statusFilter
    
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
                <p className="mt-4 text-gray-600">Chargement des bus...</p>
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
              <Button onClick={fetchBuses} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Bus</h1>
              <p className="text-gray-600 mt-2">ISO 9001 - Gestion du parc automobile et affectation du personnel</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/buses/add'}>
                Ajouter un Bus
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bus</p>
                  <p className="text-2xl font-bold text-blue-600">{buses.length}</p>
                </div>
                <div className="text-3xl">🚌</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {buses.filter(b => b.status === 'active').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Maintenance</p>
                  <p className="text-2xl font-bold text-red-600">
                    {buses.filter(b => b.status === 'maintenance').length}
                  </p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Personnel Affecté</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {buses.reduce((sum, b) => sum + b.workers.length, 0)}
                  </p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pièces Requises</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {buses.reduce((sum, b) => sum + b.parts_requirements_count, 0)}
                  </p>
                </div>
                <div className="text-3xl">🔩</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Bus</h2>
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
                    <option value="active">Actifs</option>
                    <option value="maintenance">En Maintenance</option>
                    <option value="inactive">Inactifs</option>
                    <option value="retired">Retirés</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro Bus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Immatriculation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consommation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personnel Affecté
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pièces Requises
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Maintenance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBuses.map((bus) => (
                    <tr key={bus.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bus.bus_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bus.license_plate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(bus.type)}`}>
                          {bus.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(bus.status)}`}>
                          {getStatusLabel(bus.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bus.consumption} L/100km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bus.workers.length > 0 ? (
                          <div className="space-y-1">
                            {bus.workers.map((worker, index) => (
                              <div key={worker.id} className="text-xs">
                                <span className="font-medium">{worker.prenom} {worker.nom}</span>
                                <span className="text-gray-400 ml-1">({worker.specialite})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Aucun travailleur</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-center">
                          <div className="font-medium">{bus.parts_requirements_count}</div>
                          <div className="text-xs text-gray-400">pièces requises</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-center">
                          <div className="font-medium">{bus.maintenance_count}</div>
                          <div className="text-xs text-gray-400">demandes</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                          <button className="text-green-600 hover:text-green-900">Modifier</button>
                          {bus.status === 'active' && (
                            <button 
                              onClick={() => handleCreateMaintenanceDemand(bus.id)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Maintenance
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
