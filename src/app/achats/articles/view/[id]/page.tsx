'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function ViewArticlePage() {
  const params = useParams()
  const router = useRouter()
  const articleId = parseInt(params.id as string)
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/achats-data')
      const data = await response.json()
      
      const foundArticle = data.articles.find((a: Article) => a.id === articleId)
      
      if (foundArticle) {
        setArticle(foundArticle)
      } else {
        setError('المادة غير موجودة')
      }
    } catch (err) {
      setError('Erreur lors de la récupération de la matière')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/achats/articles/edit/${articleId}`)
  }

  const handleDelete = async () => {
    if (!article) return
    
    if (confirm(`هل أنت متأكد من حذف المادة ${article.id}؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert(`تم حذف المادة ${article.id} بنجاح!`)
        router.push('/achats/articles')
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

  if (error || !article) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
          <main className="flex-1 p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error || 'المادة غير trouvée'}</p>
              <Button onClick={() => router.push('/achats/articles')} className="mt-3">
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Détails de l'Article</h1>
            <p className="text-gray-600 mt-2">Informations complètes de l'article</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Référence:</span>
                    <span className="text-sm text-gray-900 font-medium">{article.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Statut:</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Actif
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Date de création:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Dernière mise à jour:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(article.updated_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations détaillées</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Désignation:</span>
                    <p className="text-sm text-gray-900">{article.designation}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <p className="text-sm text-gray-900">{article.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Catégorie:</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {article.categorie}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Unité:</span>
                    <span className="text-sm font-medium text-gray-900">{article.unite}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Prix Unitaire:</span>
                    <span className="text-sm font-medium text-gray-900">{article.prix_unitaire.toLocaleString()} DA</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock et Ventes</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Stock actuel:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{article.stock} {article.unite}</span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Stock suffisant
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Stock minimum:</span>
                    <span className="text-sm font-medium text-gray-900">{article.stock_min} {article.unite}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Dernière vente:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {article.derniere_vente ? new Date(article.derniere_vente).toLocaleDateString('fr-FR') : 'Non vendu'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="flex items-center space-x-4">
                  <Button onClick={handleEdit}>
                    Modifier
                  </Button>
                  <Button variant="outline" onClick={handleDelete}>
                    Supprimer
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    Imprimer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
