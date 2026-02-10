'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface Article {
  id: number
  reference: string
  designation: string
  description: string
  prix_unitaire: number
  categorie: string
  unite_mesure: string
  stock_min: number
  stock_actuel: number
  stock_securite: number
  fournisseur_nom: string
  controle_qualite: boolean
  is_batch_tracked: boolean
  expiry_tracking: boolean
  critical_part: boolean
  created_at: string
  updated_at: string
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
}

interface Region {
  id: number
  name: string
  code: string
  description: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [regionalStocks, setRegionalStocks] = useState<RegionalStock[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchArticlesData()
  }, [])

  const fetchArticlesData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles')
      const data = await response.json()
      
      if (data.articles) {
        setArticles(data.articles)
      }
      if (data.regionalStocks) {
        setRegionalStocks(data.regionalStocks)
      }
      if (data.regions) {
        setRegions(data.regions)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des articles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (articleId: number) => {
    const stocks = regionalStocks.filter(rs => rs.article_id === articleId)
    const totalQuantity = stocks.reduce((sum, rs) => sum + rs.quantity, 0)
    const minQuantity = stocks.reduce((sum, rs) => sum + rs.min_quantity, 0)
    
    if (totalQuantity === 0) return { color: 'bg-red-100 text-red-800', label: 'Rupture' }
    if (totalQuantity <= minQuantity) return { color: 'bg-yellow-100 text-yellow-800', label: 'Bas' }
    return { color: 'bg-green-100 text-green-800', label: 'Normal' }
  }

  const getRegionalStock = (articleId: number, regionId: number) => {
    const stock = regionalStocks.find(rs => rs.article_id === articleId && rs.region_id === regionId)
    return stock ? stock.quantity : 0
  }

  const getTotalStock = (articleId: number) => {
    return regionalStocks
      .filter(rs => rs.article_id === articleId)
      .reduce((sum, rs) => sum + rs.quantity, 0)
  }

  const getCategories = () => {
    const categories = [...new Set(articles.map(article => article.categorie))]
    return categories.sort()
  }

  const filteredArticles = articles.filter(article => {
    const matchesFilter = filter === '' || 
      article.reference.toLowerCase().includes(filter.toLowerCase()) ||
      article.designation.toLowerCase().includes(filter.toLowerCase()) ||
      article.description.toLowerCase().includes(filter.toLowerCase())
    
    const matchesCategory = categoryFilter === '' || article.categorie === categoryFilter
    
    return matchesFilter && matchesCategory
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
                <p className="mt-4 text-gray-600">Chargement des articles...</p>
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
              <Button onClick={fetchArticlesData} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
              <p className="text-gray-600 mt-2">ISO 9001 - Gestion des articles avec stock régional</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/achats/articles/add'}>
                Ajouter un Article
              </Button>
              <Button onClick={() => window.location.href = '/stock'}>
                Gestion du Stock
              </Button>
            </div>
          </div>
          
          {/* Regional Stock Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {regions.map(region => {
              const regionStocks = regionalStocks.filter(rs => rs.region_id === region.id)
              const totalItems = regionStocks.length
              const lowStock = regionStocks.filter(rs => rs.quantity <= rs.min_quantity).length
              const outOfStock = regionStocks.filter(rs => rs.quantity === 0).length
              const totalValue = regionStocks.reduce((sum, rs) => {
                const article = articles.find(a => a.id === rs.article_id)
                return sum + (rs.quantity * (article?.prix_unitaire || 0))
              }, 0)
              
              return (
                <div key={region.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
                    <span className="text-sm text-gray-500">{region.code}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Articles:</span>
                      <span className="text-sm font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stock Bas:</span>
                      <span className="text-sm font-medium text-yellow-600">{lowStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rupture:</span>
                      <span className="text-sm font-medium text-red-600">{outOfStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valeur:</span>
                      <span className="text-sm font-medium">{totalValue.toLocaleString()} DA</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Articles Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Articles</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes les catégories</option>
                    {getCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
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
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix Unitaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock par Région
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
                  {filteredArticles.map((article) => {
                    const status = getStockStatus(article.id)
                    return (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {article.reference}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>
                            <div className="font-medium">{article.designation}</div>
                            <div className="text-xs text-gray-400">{article.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.categorie}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.fournisseur_nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.prix_unitaire.toLocaleString()} DA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-medium">{getTotalStock(article.id)}</span>
                            <span className="text-xs text-gray-400 ml-1">{article.unite_mesure}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            {regions.map(region => (
                              <div key={region.id} className="flex items-center justify-between text-xs">
                                <span className="font-medium">{region.code}:</span>
                                <span className="text-gray-400">
                                  {getRegionalStock(article.id, region.id)} {article.unite_mesure}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                            {status.label}
                          </span>
                          {article.critical_part && (
                            <span className="ml-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                              Critique
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link href={`/achats/articles/view/${article.id}`}>
                              <button className="text-blue-600 hover:text-blue-900 font-medium">
                                Voir
                              </button>
                            </Link>
                            <Link href={`/achats/articles/edit/${article.id}`}>
                              <button className="text-green-600 hover:text-green-900 font-medium">
                                Modifier
                              </button>
                            </Link>
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
