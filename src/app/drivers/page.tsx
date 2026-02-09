'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Driver {
  id: number
  nom: string
  prenom: string
  numero_conducteur: string
  telephone: string
  email: string
  cin: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      // في المستقبل، سنقوم بإنشاء API للسائقين
      // const response = await fetch('/api/drivers')
      
      // بيانات وهمية للعرض
      const mockDrivers: Driver[] = [
        {
          id: 1,
          nom: 'ALAMI',
          prenom: 'Mohammed',
          numero_conducteur: 'DR-001',
          telephone: '0661234567',
          email: 'm.alami@future.ma',
          cin: 'AB123456',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          nom: 'BENANI',
          prenom: 'Ahmed',
          numero_conducteur: 'DR-002',
          telephone: '0662345678',
          email: 'a.benani@future.ma',
          cin: 'CD234567',
          is_active: true,
          created_at: '2024-01-16T10:00:00Z',
          updated_at: '2024-01-16T10:00:00Z'
        },
        {
          id: 3,
          nom: 'CHAKIR',
          prenom: 'Youssef',
          numero_conducteur: 'DR-003',
          telephone: '0663456789',
          email: 'y.chakir@future.ma',
          cin: 'EF345678',
          is_active: true,
          created_at: '2024-01-17T10:00:00Z',
          updated_at: '2024-01-17T10:00:00Z'
        },
        {
          id: 4,
          nom: 'DAHMANI',
          prenom: 'Omar',
          numero_conducteur: 'DR-004',
          telephone: '0664567890',
          email: 'o.dahmani@future.ma',
          cin: 'GH456789',
          is_active: false,
          created_at: '2024-01-18T10:00:00Z',
          updated_at: '2024-01-18T10:00:00Z'
        },
        {
          id: 5,
          nom: 'EL IDRISSI',
          prenom: 'Karim',
          numero_conducteur: 'DR-005',
          telephone: '0665678901',
          email: 'k.elidrissi@future.ma',
          cin: 'IJ567890',
          is_active: true,
          created_at: '2024-01-19T10:00:00Z',
          updated_at: '2024-01-19T10:00:00Z'
        }
      ]
      
      setDrivers(mockDrivers)
    } catch (err) {
      setError('Erreur lors de la récupération des conducteurs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Actif' : 'Inactif'
  }

  const handleAddDriver = () => {
    alert('إضافة سائق - قيد التطوير')
  }

  const handleViewDriver = (driverId: number) => {
    alert(`عرض تفاصيل السائق ${driverId} - قيد التطوير`)
  }

  const handleEditDriver = (driverId: number) => {
    alert(`تعديل السائق ${driverId} - قيد التطوير`)
  }

  const handleDeleteDriver = (driverId: number) => {
    if (confirm(`هل أنت متأكد من حذف السائق ${driverId}؟`)) {
      setDrivers(prev => prev.filter(driver => driver.id !== driverId))
      alert(`تم حذف السائق ${driverId} بنجاح!`)
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
                <p className="mt-4 text-gray-600">Chargement des conducteurs...</p>
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
              <Button onClick={fetchDrivers} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Conducteurs</h1>
              <p className="text-gray-600 mt-2">Gestion des conducteurs du parc automobile</p>
            </div>
            <Button onClick={handleAddDriver}>Ajouter un Conducteur</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conducteurs</p>
                  <p className="text-2xl font-bold text-blue-600">{drivers.length}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {drivers.filter(d => d.is_active).length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactifs</p>
                  <p className="text-2xl font-bold text-red-600">
                    {drivers.filter(d => !d.is_active).length}
                  </p>
                </div>
                <div className="text-3xl">⚠️</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liste des Conducteurs</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prénom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
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
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {driver.prenom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.numero_conducteur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {driver.telephone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(driver.is_active)}`}>
                          {getStatusLabel(driver.is_active)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewDriver(driver.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditDriver(driver.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteDriver(driver.id)}
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
