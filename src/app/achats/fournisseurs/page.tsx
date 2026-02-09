'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Fournisseur {
  id: number
  nom: string
  contact: string
  telephone: string
  email: string
  adresse: string
  statut: string
  created_at: string
  updated_at: string
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchFournisseurs()
  }, [])

  const fetchFournisseurs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/achats-data')
      const data = await response.json()
      
      if (data.fournisseurs) {
        setFournisseurs(data.fournisseurs)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des fournisseurs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFournisseur = () => {
    alert('إضافة مورد - قيد التطوير')
  }

  const handleViewFournisseur = (fournisseurId: number) => {
    alert(`عرض تفاصيل المورد ${fournisseurId} - قيد التطوير`)
  }

  const handleEditFournisseur = (fournisseurId: number) => {
    alert(`تعديل المورد ${fournisseurId} - قيد التطوير`)
  }

  const handleDeleteFournisseur = (fournisseurId: number) => {
    if (confirm(`هل أنت متأكد من حذف المورد ${fournisseurId}؟`)) {
      setFournisseurs(prev => prev.filter(f => f.id !== fournisseurId))
      alert(`تم حذف المورد ${fournisseurId} بنجاح!`)
    }
  }

  const getStatusColor = (statut: string) => {
    return statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                <p className="mt-4 text-gray-600">Chargement des fournisseurs...</p>
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
              <Button onClick={fetchFournisseurs} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Fournisseurs</h1>
              <p className="text-gray-600 mt-2">Gestion des fournisseurs</p>
            </div>
            <Button onClick={handleAddFournisseur}>Ajouter un Fournisseur</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fournisseurs</p>
                  <p className="text-2xl font-bold text-blue-600">{fournisseurs.length}</p>
                </div>
                <div className="text-3xl">🏢</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fournisseurs.filter(f => f.statut === 'ACTIF').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactifs</p>
                  <p className="text-2xl font-bold text-red-600">
                    {fournisseurs.filter(f => f.statut !== 'ACTIF').length}
                  </p>
                </div>
                <div className="text-3xl">⚠️</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liste des Fournisseurs</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
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
                  {fournisseurs.map((fournisseur) => (
                    <tr key={fournisseur.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fournisseur.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fournisseur.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fournisseur.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fournisseur.telephone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fournisseur.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fournisseur.statut)}`}>
                          {fournisseur.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewFournisseur(fournisseur.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditFournisseur(fournisseur.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteFournisseur(fournisseur.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Supprimer
                          </button>
                        </div>
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
