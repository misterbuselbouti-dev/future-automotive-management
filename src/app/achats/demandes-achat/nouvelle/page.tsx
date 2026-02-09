'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function NouvelleDemandeAchatPage() {
  const [formData, setFormData] = useState({
    demandeur: '',
    departement: '',
    motif: '',
    priorite: 'NORMAL',
    articles: [{ reference: '', designation: '', quantite: '', prixEstime: '', observation: '' }]
  })

  const departments = ['Maintenance', 'Exploitation', 'Administration', 'Commercial']
  const priorities = [
    { value: 'BASSE', label: 'Basse' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'URGENTE', label: 'Urgente' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArticleChange = (index: number, field: string, value: string) => {
    const newArticles = [...formData.articles]
    newArticles[index] = { ...newArticles[index], [field]: value }
    setFormData(prev => ({ ...prev, articles: newArticles }))
  }

  const addArticle = () => {
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { reference: '', designation: '', quantite: '', prixEstime: '', observation: '' }]
    }))
  }

  const removeArticle = (index: number) => {
    if (formData.articles.length > 1) {
      const newArticles = formData.articles.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, articles: newArticles }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Données du formulaire:', formData)
    // Ici on ajoutera la logique pour soumettre la demande
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
        
        <main className="flex-1 p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouvelle Demande d'Achat</h1>
              <p className="text-gray-600 mt-2">Créer une nouvelle demande d'achat</p>
            </div>
            <Link href="/achats/demandes-achat">
              <Button variant="outline">Retour</Button>
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demandeur *
                  </label>
                  <input
                    type="text"
                    name="demandeur"
                    value={formData.demandeur}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département *
                  </label>
                  <select
                    name="departement"
                    value={formData.departement}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité *
                  </label>
                  <select
                    name="priorite"
                    value={formData.priorite}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de la demande *
                </label>
                <textarea
                  name="motif"
                  value={formData.motif}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Articles demandés</h2>
                <Button type="button" onClick={addArticle} variant="outline">
                  Ajouter un article
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.articles.map((article, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Référence
                        </label>
                        <input
                          type="text"
                          value={article.reference}
                          onChange={(e) => handleArticleChange(index, 'reference', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Désignation *
                        </label>
                        <input
                          type="text"
                          value={article.designation}
                          onChange={(e) => handleArticleChange(index, 'designation', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={article.quantite}
                          onChange={(e) => handleArticleChange(index, 'quantite', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix estimé
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={article.prixEstime}
                          onChange={(e) => handleArticleChange(index, 'prixEstime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observation
                        </label>
                        <input
                          type="text"
                          value={article.observation}
                          onChange={(e) => handleArticleChange(index, 'observation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      {formData.articles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArticle(index)}
                          className="ml-4 px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <Link href="/achats/demandes-achat">
                <Button variant="outline">Annuler</Button>
              </Link>
              <Button type="submit">Soumettre la demande</Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
