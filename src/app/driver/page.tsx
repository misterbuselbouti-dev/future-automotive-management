'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Driver {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  specialite: string
  bus_id: number
  bus_number: string
  status: string
}

interface Bus {
  id: number
  bus_number: string
  license_plate: string
  type: string
  status: string
}

interface Part {
  id: number
  reference: string
  designation: string
  description: string
  categorie: string
  prix_unitaire: number
  unite_mesure: string
  critical_part: boolean
}

interface RegionalStock {
  id: number
  article_id: number
  region_id: number
  region_name: string
  quantity: number
  min_quantity: number
  article: Part
}

interface PartsRequest {
  id: number
  driver_id: number
  bus_id: number
  article_id: number
  quantity: number
  status: string
  created_at: string
  article: Part
}

export default function DriverPage() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [buses, setBuses] = useState<Bus[]>([])
  const [parts, setParts] = useState<RegionalStock[]>([])
  const [requests, setRequests] = useState<PartsRequest[]>([])
  const [selectedBus, setSelectedBus] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Simulate driver login - in real app, this would come from auth
    const mockDriver: Driver = {
      id: 1,
      nom: 'Benali',
      prenom: 'Ahmed',
      telephone: '0612345678',
      email: 'ahmed.benali@company.com',
      specialite: 'Mécanicien',
      bus_id: 1,
      bus_number: 'BUS-001',
      status: 'active'
    }
    setDriver(mockDriver)
    setSelectedBus(mockDriver.bus_id)
    fetchDriverData(mockDriver.id)
  }, [])

  const fetchDriverData = async (driverId: number) => {
    try {
      setLoading(true)
      
      // Fetch buses
      const busesResponse = await fetch('/api/buses')
      const busesData = await busesResponse.json()
      if (busesData.buses) {
        setBuses(busesData.buses.filter((bus: Bus) => bus.status === 'active'))
      }
      
      // Fetch parts for driver's region
      const partsResponse = await fetch('/api/stock/parts-available')
      const partsData = await partsResponse.json()
      if (partsData.parts) {
        setParts(partsData.parts)
      }
      
      // Fetch driver's requests
      const requestsResponse = await fetch(`/api/driver/${driverId}/requests`)
      const requestsData = await requestsResponse.json()
      if (requestsData.requests) {
        setRequests(requestsData.requests)
      }
      
    } catch (err) {
      setError('Erreur lors de la récupération des données')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestParts = async (articleId: number, quantity: number) => {
    if (!driver || !selectedBus) return
    
    try {
      const response = await fetch('/api/driver/request-parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver_id: driver.id,
          bus_id: selectedBus,
          article_id: articleId,
          quantity: quantity
        })
      })

      if (response.ok) {
        alert('Demande de pièces envoyée avec succès!')
        fetchDriverData(driver.id)
      } else {
        alert('Erreur lors de l\'envoi de la demande')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'envoi de la demande')
    }
  }

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return { color: 'bg-red-100 text-red-800', label: 'Indisponible' }
    if (quantity <= minQuantity) return { color: 'bg-yellow-100 text-yellow-800', label: 'Stock Bas' }
    return { color: 'bg-green-100 text-green-800', label: 'Disponible' }
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'approuve': return 'bg-green-100 text-green-800'
      case 'rejete': return 'bg-red-100 text-red-800'
      case 'livre': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRequestStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En Attente'
      case 'approuve': return 'Approuvée'
      case 'rejete': return 'Rejetée'
      case 'livre': return 'Livrée'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar user={{ name: driver ? `${driver.prenom} ${driver.nom}` : 'Conducteur', role: 'Driver' }} />
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

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar user={{ name: driver ? `${driver.prenom} ${driver.nom}` : 'Conducteur', role: 'Driver' }} />
          <main className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button onClick={() => driver && fetchDriverData(driver.id)} className="mt-3">
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
        <Navbar user={{ name: driver ? `${driver.prenom} ${driver.nom}` : 'Conducteur', role: 'Driver' }} />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Portail Conducteur</h1>
            <p className="text-gray-600 mt-2">Demande de pièces pour maintenance</p>
          </div>
          
          {/* Driver Info */}
          {driver && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informations Conducteur</h2>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Nom:</span> {driver.prenom} {driver.nom}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Spécialité:</span> {driver.specialite}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Téléphone:</span> {driver.telephone}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <select
                    value={selectedBus || ''}
                    onChange={(e) => setSelectedBus(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {buses.map(bus => (
                      <option key={bus.id} value={bus.id}>
                        {bus.bus_number} - {bus.license_plate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Parts Catalog */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Catalogue des Pièces</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Désignation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parts.map((part) => {
                    const status = getStockStatus(part.quantity, part.min_quantity)
                    return (
                      <tr key={part.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {part.article.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.article.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.article.categorie}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-medium">{part.quantity}</span>
                            <span className="text-xs text-gray-400 ml-1">{part.article.unite_mesure}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.article.prix_unitaire.toLocaleString()} DA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              max={part.quantity}
                              defaultValue="1"
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                              id={`quantity-${part.id}`}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`quantity-${part.id}`) as HTMLInputElement
                                const quantity = parseInt(input.value)
                                if (quantity > 0 && quantity <= part.quantity) {
                                  handleRequestParts(part.article_id, quantity)
                                } else {
                                  alert('Quantité invalide')
                                }
                              }}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                              disabled={part.quantity === 0}
                            >
                              Demander
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
          
          {/* My Requests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mes Demandes</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pièce
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{request.article.reference}</div>
                          <div className="text-xs text-gray-400">{request.article.designation}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.quantity} {request.article.unite_mesure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getRequestStatusColor(request.status)}`}>
                          {getRequestStatusLabel(request.status)}
                        </span>
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
