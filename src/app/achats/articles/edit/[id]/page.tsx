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

export default function EditArticlePage() {
  const params = useParams()
  const router = useRouter()
  const articleId = parseInt(params.id as string)
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (article) {
      setArticle({
        ...article,
        [name]: type === 'number' ? parseFloat(value) : value
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!article) return

    setSaving(true)
    
    try {
      // في المستقبل، سنقوم بإرسال طلب PUT إلى API
      console.log('Données mises à jour:', article)
      
      // محاكاة التحديث
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('تم تحديث المادة بنجاح!')
      router.push('/achats/articles')
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!article) return
    
    if (confirm(`هل أنت متأكد من حذف المادة ${article.id}؟\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        // في المستقبل، سنقوم بإرسال طلب DELETE إلى API
        console.log('Suppression de l\'article:', article.id)
        
        // محاكاة الحذفف
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        alert(`تم حذف المادة ${article.id} بنجاح!`)
        router.push('/achats/articles')
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const categories = ['Filtration', 'Pneumatique', 'Lubrifiants', 'Freinage', 'Électrique', 'Sécurité']
  const unites = ['Pièce', 'Litre', 'Kit', 'Mètre']

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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modifier l'Article</h1>
              <p className="text-gray-600 mt-2">Modifier les informations de l'article</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => router.push('/achats/articles')}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
                    Référence
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={article.reference}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                    Désignation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={article.designation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={article.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="prix_unitaire" className="block text-sm font-medium text-gray-700 mb-2">
                    Prix Unitaire (DA)
                  </label>
                  <input
                    type="number"
                    id="prix_unitaire"
                    name="prix_unitaire"
                    value={article.prix_unitaire}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="unite" className="block text-sm font-medium text-gray-700 mb-2">
                      Unité
                    </label>
                    <select
                      id="unite"
                      name="unite"
                      value={article.unite}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {unites.map(unite => (
                        <option key={unite} value={unite}>
                          {unite}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      id="categorie"
                      name="categorie"
                      value={article.categorie}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(categorie => (
                        <option key={categorie} value={categorie}>
                          {categorie}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Actuel
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={article.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="stock_min" className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Minimum
                    </label>
                    <input
                      type="number"
                      id="stock_min"
                      name="stock_min"
                      value={article.stock_min}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de Dernière Vente
                    </label>
                    <input
                      type="date"
                      id="derniere_vente"
                      name="derniere_vente"
                      value={article.derniere_vente?.split('T')[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de Création
                    </label>
                    <input
                      type="date"
                      id="created_at"
                      name="created_at"
                      value={article.created_at?.split('T')[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/achats/articles')}
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
