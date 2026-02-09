'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Maintenance {
  id: number
  bus_id: number
  type: string
  description: string
  scheduled_date: string
  completed_date?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  cost: number
  technician_id?: number
  created_at: string
  updated_at: string
}

interface Bus {
  id: number
  bus_number: string
  license_plate: string
  type: string
  status: string
}

interface Technician {
  id: number
  nom: string
  prenom: string
  numero_conducteur: string
}

export default function MaintenancePage() {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [buses, setBuses] = useState<Bus[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // بيانات وهمية للعرض
      const mockMaintenance: Maintenance[] = [
        {
          id: 1,
          bus_id: 1,
          type: 'Changement huile',
          description: 'Changement huile moteur et filtres',
          scheduled_date: '2024-02-10T09:00:00Z',
          completed_date: '2024-02-10T11:30:00Z',
          status: 'completed',
          priority: 'medium',
          cost: 450,
          technician_id: 1,
          created_at: '2024-02-10T08:00:00Z',
          updated_at: '2024-02-10T11:30:00Z'
        },
        {
          id: 2,
          bus_id: 2,
          type: 'Réparation frein',
          description: 'Réparation du système de freinage',
          scheduled_date: '2024-02-12T14:00:00Z',
          status: 'in_progress',
          priority: 'high',
          cost: 850,
          technician_id: 2,
          created_at: '2024-02-12T13:00:00Z',
          updated_at: '2024-02-12T14:00:00Z'
        },
        {
          id: 3,
          bus_id: 3,
          type: 'Inspection climatisation',
          description: 'Inspection système climatisation',
          scheduled_date: '2024-02-15T10:00:00Z',
          status: 'scheduled',
          priority: 'low',
          cost: 120,
          technician_id: 3,
          created_at: '2024-02-15T09:00:00Z',
          updated_at: '2024-02-15T09:00:00Z'
        },
        {
          id: 4,
          bus_id: 1,
          type: 'Remplacement pneus',
          description: 'Remplacement pneus avant et arrière',
          scheduled_date: '2024-02-20T08:00:00Z',
          status: 'scheduled',
          priority: 'high',
          cost: 1200,
          technician_id: 1,
          created_at: '2024-02-19T16:00:00Z',
          updated_at: '2024-02-19T16:00:00Z'
        }
      ]
      
      const mockBuses: Bus[] = [
        { id: 1, bus_number: '102', license_plate: 'BUS-102', type: 'Bus', status: 'active' },
        { id: 2, bus_number: '104', license_plate: 'BUS-104', type: 'Bus', status: 'maintenance' },
        { id: 3, bus_number: '105', license_plate: 'BUS-105', type: 'Bus', status: 'active' }
      ]
      
      const mockTechnicians: Technician[] = [
        { id: 1, nom: 'ALAMI', prenom: 'Mohammed', numero_conducteur: 'DR-001' },
        { id: 2, nom: 'BENANI', prenom: 'Ahmed', numero_conducteur: 'DR-002' },
        { id: 3, nom: 'CHAKIR', prenom: 'Youssef', numero_conducteur: 'DR-003' }
      ]
      
      setMaintenance(mockMaintenance)
      setBuses(mockBuses)
      setTechnicians(mockTechnicians)
    } catch (err) {
      setError('Erreur lors de la récupération des données')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programmé'
      case 'in_progress':
        return 'En cours'
      case 'completed':
        return 'Terminé'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Faible'
      case 'medium':
        return 'Normal'
      case 'high':
        return 'Urgent'
      case 'critical':
        return 'Critique'
      default:
        return priority
    }
  }

  const getBusInfo = (busId: number) => {
    return buses.find(bus => bus.id === busId)
  }

  const getTechnicianInfo = (technicianId: number) => {
    return technicians.find(tech => tech.id === technicianId)
  }

  const handleAddMaintenance = () => {
    alert('إضافة صيانة - قيد التطوير')
  }

  const handleViewMaintenance = (maintenanceId: number) => {
    alert(`عرض تفاصيل الصيانة ${maintenanceId} - قيد التطوير`)
  }

  const handleEditMaintenance = (maintenanceId: number) => {
    alert(`تعديل الصيانة ${maintenanceId} - قيد التطوير`)
  }

  const handleDeleteMaintenance = (maintenanceId: number) => {
    if (confirm(`هل أنت متأكد من حذف الصيانة ${maintenanceId}؟`)) {
      setMaintenance(prev => prev.filter(m => m.id !== maintenanceId))
      alert(`تم حذف الصيانة ${maintenanceId} بنجاح!`)
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
                <p className="mt-4 text-gray-600">Chargement des maintenances...</p>
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
              <Button onClick={fetchData} className="mt-3">
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
              <p className="text-600 mt-2">Gestion de la maintenance du parc automobile</p>
            </div>
            <Button onClick={handleAddMaintenance}>Ajouter une Maintenance</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Maintenances</p>
                  <p className="text-2xl font-bold text-blue-600">{maintenance.length}</p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Cours</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {maintenance.filter(m => m.status === 'in_progress').length}
                  </p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {maintenance.filter(m => m.status === 'completed').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Programmées</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {maintenance.filter(m => m.status === 'scheduled').length}
                  </p>
                </div>
                <div className="text-3xl">📅</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liste des Maintenances</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenance.map((m) => {
                    const bus = getBusInfo(m.bus_id)
                    const technician = getTechnicianInfo(m.technician_id || 0)
                    
                    return (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {m.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bus ? `${bus.bus_number} (${bus.license_plate})` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {m.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {m.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(m.status)}`}>
                            {getStatusLabel(m.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(m.priority)}`}>
                            {getPriorityLabel(m.priority)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {technician ? `${technician.nom} ${technician.prenom}` : 'Non assigné'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {m.cost.toLocaleString('fr-FR')} MAD
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewMaintenance(m.id)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Voir
                            </button>
                            <button 
                              onClick={() => handleEditMaintenance(m.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteMaintenance(m.id)}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
