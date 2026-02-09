'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Bus {
  id: number
  type: string
  status: string
  consumption: number
}

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/buses-mysql')
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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En Service'
      case 'maintenance':
        return 'En Maintenance'
      case 'inactive':
        return 'Inactif'
      default:
        return status
    }
  }

  const handleAddBus = () => {
    window.location.href = '/buses/add'
  }

  const handleViewBus = (busId: number) => {
    window.location.href = `/buses/view/${busId}`
  }

  const handleEditBus = (busId: number) => {
    window.location.href = `/buses/edit/${busId}`
  }

  const handleDeleteBus = (busId: number) => {
    if (confirm(`هل أنت متأكد من حذف الحافلة ${busId}؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      // في المستقبل، سنقوم بإرسال طلب الحذف إلى API
      console.log('Suppression du bus:', busId)
      
      // محاكاة الحذف من القائمة المحلية
      setBuses(prev => prev.filter(bus => bus.id !== busId))
      alert(`تم حذف الحافلة ${busId} بنجاح!`)
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
              <Button onClick={fetchBuses} className="mt-3">Réessayer</Button>
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
              <p className="text-gray-600 mt-2">Gestion du parc de bus</p>
            </div>
            <Button onClick={handleAddBus}>Ajouter un Bus</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-sm font-medium text-gray-600">En Service</p>
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
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liste des Bus</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {buses.map((bus, index) => (
                    <tr key={`${bus.id}-${bus.type}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bus.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bus.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(bus.status)}`}>
                          {getStatusLabel(bus.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bus.consumption}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewBus(bus.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditBus(bus.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteBus(bus.id)}
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
