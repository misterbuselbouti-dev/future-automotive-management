'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Article {
  id: number
  reference: string
  designation: string
  description: string
  prix_unitaire: number
  categorie: string
  unite_mesure: string
  critical_part: boolean
  created_at: string
}

interface RegionalStock {
  id: number
  article_id: number
  region_id: number
  region_name: string
  region_code: string
  quantity: number
  min_quantity: number
  max_quantity: number
  last_updated: string
  article: Article
}

interface StockMovement {
  id: number
  article_id: number
  article_reference: string
  article_designation: string
  region_id: number
  region_name: string
  quantity: number
  movement_type: string
  reference: string
  reason: string
  operator_name: string
  created_at: string
}

interface Region {
  id: number
  name: string
  code: string
  description: string
}

export default function StockPage() {
  const [regionalStocks, setRegionalStocks] = useState<RegionalStock[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchStockData()
  }, [selectedRegion])

  const fetchStockData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stock${selectedRegion !== 'all' ? `?region=${selectedRegion}` : ''}`)
      const data = await response.json()
      
      if (data.regionalStocks) {
        setRegionalStocks(data.regionalStocks)
      }
      if (data.stockMovements) {
        setStockMovements(data.stockMovements)
      }
      if (data.regions) {
        setRegions(data.regions)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des données de stock')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return { color: 'bg-red-100 text-red-800', label: 'Rupture' }
    if (quantity <= minQuantity) return { color: 'bg-yellow-100 text-yellow-800', label: 'Bas' }
    return { color: 'bg-green-100 text-green-800', label: 'Normal' }
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'entry': return 'bg-green-100 text-green-800'
      case 'exit': return 'bg-red-100 text-red-800'
      case 'transfer': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'entry': return 'Entrée'
      case 'exit': return 'Sortie'
      case 'transfer': return 'Transfert'
      default: return type
    }
  }

  const getRegionStats = (regionId: number) => {
    const regionStocks = regionalStocks.filter(rs => rs.region_id === regionId)
    const totalItems = regionStocks.length
    const lowStock = regionStocks.filter(rs => rs.quantity <= rs.min_quantity).length
    const outOfStock = regionStocks.filter(rs => rs.quantity === 0).length
    const totalValue = regionStocks.reduce((sum, rs) => sum + (rs.quantity * rs.article.prix_unitaire), 0)
    
    return { totalItems, lowStock, outOfStock, totalValue }
  }

  const filteredStocks = regionalStocks.filter(stock => {
    const matchesFilter = filter === '' || 
      stock.article.reference.toLowerCase().includes(filter.toLowerCase()) ||
      stock.article.designation.toLowerCase().includes(filter.toLowerCase()) ||
      stock.article.categorie.toLowerCase().includes(filter.toLowerCase())
    
    return matchesFilter
  })

  const filteredMovements = stockMovements.filter(movement => {
    const matchesFilter = filter === '' || 
      movement.article_reference.toLowerCase().includes(filter.toLowerCase()) ||
      movement.article_designation.toLowerCase().includes(filter.toLowerCase()) ||
      movement.reference.toLowerCase().includes(filter.toLowerCase())
    
    return matchesFilter
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
                <p className="mt-4 text-gray-600">Chargement des données de stock...</p>
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
              <Button onClick={fetchStockData} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion du Stock</h1>
              <p className="text-gray-600 mt-2">ISO 9001 - Gestion régionale du stock</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les régions</option>
                {regions.map(region => (
                  <option key={region.id} value={region.code}>
                    {region.name} ({region.code})
                  </option>
                ))}
              </select>
              <Button onClick={() => window.location.href = '/stock/transfer'}>
                Transfert de Stock
              </Button>
            </div>
          </div>
          
          {/* Regional Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {regions.map(region => {
              const stats = getRegionStats(region.id)
              return (
                <div key={region.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
                    <span className="text-sm text-gray-500">{region.code}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Articles:</span>
                      <span className="text-sm font-medium">{stats.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stock Bas:</span>
                      <span className="text-sm font-medium text-yellow-600">{stats.lowStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rupture:</span>
                      <span className="text-sm font-medium text-red-600">{stats.outOfStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valeur Totale:</span>
                      <span className="text-sm font-medium">{stats.totalValue.toLocaleString()} DA</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Stock Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">État du Stock</h2>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                      Région
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStocks.map((stock) => {
                    const status = getStockStatus(stock.quantity, stock.min_quantity)
                    return (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stock.article.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.article.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.article.categorie}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="font-medium">{stock.region_name}</div>
                            <div className="text-xs text-gray-400">{stock.region_code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-medium">{stock.quantity}</span>
                            <span className="text-xs text-gray-400 ml-1">{stock.article.unite_mesure}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.min_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(stock.quantity * stock.article.prix_unitaire).toLocaleString()} DA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Movements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mouvements Récents</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Région
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opérateur
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovements.slice(0, 10).map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(movement.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{movement.article_reference}</div>
                          <div className="text-xs text-gray-400">{movement.article_designation}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getMovementTypeColor(movement.movement_type)}`}>
                          {getMovementTypeLabel(movement.movement_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`font-medium ${movement.movement_type === 'exit' ? 'text-red-600' : 'text-green-600'}`}>
                          {movement.movement_type === 'exit' ? '-' : '+'}{movement.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.region_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movement.operator_name}
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
