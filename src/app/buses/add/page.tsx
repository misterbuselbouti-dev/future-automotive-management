'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

export default function AddBusPage() {
  const [formData, setFormData] = useState({
    busNumber: '',
    licensePlate: '',
    type: 'Bus',
    status: 'active',
    consumption: 0
  })
  
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // في المستقبل، سنقوم بإرسال البيانات إلى API
      console.log('Données du bus:', formData)
      
      // محاكاة الإضافة الناجحة
      const newBus = {
        id: Date.now(), // معرف مؤقت
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // هنا سنقوم بإرسال طلب POST إلى API
      // const response = await fetch('/api/buses-mysql', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newBus)
      // })
      
      alert('حافلة تمت إضافتها بنجاح!')
      
      // إعادة التوجيه إلى صفحة التفاصيل
      window.location.href = `/buses/view/${newBus.id}`
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du bus:', error)
      alert('Erreur lors de l\'ajout du bus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Ajouter un Bus</h1>
            <p className="text-gray-600 mt-2">Ajouter une nouvelle bus au parc</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="busNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro du Bus
                  </label>
                  <input
                    type="text"
                    id="busNumber"
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
                    Plaque d'immatriculation
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate}
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
                    value={formData.type}
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
                    value={formData.status}
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
                    value={formData.consumption}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Ajout en cours...' : 'Ajouter le Bus'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
