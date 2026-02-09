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
  unite: string
  categorie: string
  stock: number
  stock_min: number
  derniere_vente: string
  created_at: string
  updated_at: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/achats-data')
      const data = await response.json()
      
      if (data.articles) {
        setArticles(data.articles)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des articles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddArticle = () => {
    alert('إضافة مادة - قيد التطوير')
  }

  const handleViewArticle = (articleId: number) => {
    alert(`عرض تفاصيل المادة ${articleId} - قيد التطوير`)
  }

  const handleEditArticle = (articleId: number) => {
    alert(`تعديل المادة ${articleId} - قيد التطوير`)
  }

  const handleDeleteArticle = (articleId: number) => {
    if (confirm(`هل أنت متأكد من حذف المادة ${articleId}؟`)) {
      setArticles(prev => prev.filter(article => article.id !== articleId))
      alert(`تم حذف المادة ${articleId} بنجاح!`)
    }
  }

  const getStockColor = (stock: number, stock_min: number) => {
    if (stock <= stock_min) return 'bg-red-100 text-red-800'
    if (stock <= stock_min * 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStockLabel = (stock: number, stock_min: number) => {
    if (stock <= stock_min) return 'Stock bas'
    if (stock <= stock_min * 2) return 'Stock faible'
    return 'Stock suffisant'
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
              <Button onClick={fetchArticles} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Catalogue Articles</h1>
              <p className="text-gray-600 mt-2">Gestion du catalogue d'articles</p>
            </div>
            <Button onClick={handleAddArticle}>Ajouter un Article</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-blue-600">{articles.length}</p>
                </div>
                <div className="text-3xl">📦</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock Critique</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <div className="text-3xl">⚠️</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Stock</p>
                  <p className="text-2xl font-bold text-green-600">2.8M</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Catégories</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
                <div className="text-3xl">📂</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Articles</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Toutes les catégories</option>
                    <option value="Filtration">Filtration</option>
                    <option value="Pneumatique">Pneumatique</option>
                    <option value="Lubrifiant">Lubrifiant</option>
                    <option value="Freinage">Freinage</option>
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
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix Unitaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Min
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => {
                    const stockStatus = getStockLabel(article.stock, article.stock_min)
                    return (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {article.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {article.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {article.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {article.prix_unitaire.toLocaleString()} DA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-2">
                              {article.stock} {article.unite}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockColor(article.stock, article.stock_min)}`}>
                              {getStockLabel(article.stock, article.stock_min)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewArticle(article.id)}
                              className="text-blue-600 hover:text-blue-900 font-medium"
                            >
                              Voir
                            </button>
                            <button 
                              onClick={() => handleEditArticle(article.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteArticle(article.id)}
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
