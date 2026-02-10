'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  created_at: string
  updated_at: string
}

export default function ViewBusPage() {
  const params = useParams()
  const router = useRouter()
  const busId = parseInt(params.id as string)
  
  const [bus, setBus] = useState<Bus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchBus()
  }, [busId])

  const fetchBus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/buses-mysql')
      const data = await response.json()
      
      const foundBus = data.buses.find((b: Bus) => b.id === busId)
      
      if (foundBus) {
        setBus(foundBus)
      } else {
        setError('الحافلة غير موجودة')
      }
    } catch (err) {
      setError('Erreur lors de la récupération des données')
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
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !bus) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
          <main className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error || 'الحافلة غير trouvée'}</p>
              <Button onClick={() => router.push('/buses')} className="mt-3">
                Retour à la liste
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
              <h1 className="text-3xl font-bold text-gray-900">Détails du Bus</h1>
              <p className="text-gray-600 mt-2">Informations complètes du bus #{bus.id}</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => router.push(`/buses/edit/${bus.id}`)}>
                Modifier
              </Button>
              <Button variant="outline" onClick={() => router.push('/buses')}>
                Retour
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro du Bus
                    </label>
                    <p className="text-lg text-gray-900">{bus.bus_number}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plaque d'immatriculation
                    </label>
                    <p className="text-lg text-gray-900">{bus.license_plate}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <p className="text-lg text-gray-900">{bus.type}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bus.status)}`}>
                      {getStatusLabel(bus.status)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consommation
                    </label>
                    <p className="text-lg text-gray-900">{bus.consumption}%</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de création
                    </label>
                    <p className="text-lg text-gray-900">
                      {new Date(bus.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des modifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Création</p>
                      <p className="text-sm text-gray-600">
                        {new Date(bus.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Créé
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dernière mise à jour</p>
                      <p className="text-sm text-gray-600">
                        {new Date(bus.updated_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Mis à jour
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push(`/buses/edit/${bus.id}`)}
                    className="w-full justify-start"
                  >
                    ✏️ Modifier les informations
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📊 Voir les rapports
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📋 Imprimer les détails
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full justify-start"
                  >
                    📧 Envoyer par email
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jours en service</span>
                    <span className="text-sm font-medium text-gray-900">--</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Kilométrage total</span>
                    <span className="text-sm font-medium text-gray-900">--</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Dernier entretien</span>
                    <span className="text-sm font-medium text-gray-900">--</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prochain entretien</span>
                    <span className="text-sm font-medium text-gray-900">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
