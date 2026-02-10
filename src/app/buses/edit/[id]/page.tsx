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

export default function EditBusPage() {
  const params = useParams()
  const router = useRouter()
  const busId = parseInt(params.id as string)
  
  const [bus, setBus] = useState<Bus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (bus) {
      setBus({
        ...bus,
        [name]: name === 'consumption' ? parseFloat(value) : value
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bus) return

    setSaving(true)
    
    try {
      // في المستقبل، سنقوم بإرسال البيانات إلى API
      console.log('Données mises à jour:', bus)
      alert('تم تحديث الحافلة بنجاح!')
      
      router.push('/buses')
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!bus) return
    
    if (confirm(`هل أنت متأكد من حذف الحافلة ${bus.id}؟`)) {
      try {
        // في المستقبل، سنقوم بإرسال طلب الحذف إلى API
        console.log('Suppression du bus:', bus.id)
        alert('تم حذف الحافلة بنجاح!')
        
        router.push('/buses')
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression')
      }
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
              <h1 className="text-3xl font-bold text-gray-900">Modifier le Bus</h1>
              <p className="text-gray-600 mt-2">Modifier les informations du bus #{bus.id}</p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bus_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro du Bus
                  </label>
                  <input
                    type="text"
                    id="bus_number"
                    name="bus_number"
                    value={bus.bus_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-2">
                    Plaque d'immatriculation
                  </label>
                  <input
                    type="text"
                    id="license_plate"
                    name="license_plate"
                    value={bus.license_plate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={bus.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bus">Bus</option>
                    <option value="MiniBus">MiniBus</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={bus.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">En Service</option>
                    <option value="maintenance">En Maintenance</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-2">
                    Consommation (%)
                  </label>
                  <input
                    type="number"
                    id="consumption"
                    name="consumption"
                    value={bus.consumption}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de création
                    </label>
                    <p className="text-sm text-gray-600">
                      {new Date(bus.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dernière mise à jour
                    </label>
                    <p className="text-sm text-gray-600">
                      {new Date(bus.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/buses')}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
