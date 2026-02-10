'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface Worker {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  specialite: string
  bus_id: number | null
  bus_number: string | null
  status: string
  date_embauche: string
  qualification: string
  demandes_count: number
  parts_needed_count: number
  created_at: string
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workers')
      const data = await response.json()
      
      if (data.workers) {
        setWorkers(data.workers)
      }
    } catch (err) {
      setError('Erreur lors de la récupération des travailleurs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'inactive':
        return 'Inactif'
      case 'on_leave':
        return 'En Congé'
      default:
        return status
    }
  }

  const handleCreateDemande = async (workerId: number) => {
    try {
      const response = await fetch(`/api/workers/${workerId}/create-demande`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Demande d\'achat créée automatiquement pour ce travailleur!')
        fetchWorkers()
      } else {
        alert('Erreur lors de la création de la demande')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création de la demande')
    }
  }

  const filteredWorkers = workers.filter(worker => {
    const matchesFilter = filter === '' || 
      worker.nom.toLowerCase().includes(filter.toLowerCase()) ||
      worker.prenom.toLowerCase().includes(filter.toLowerCase()) ||
      worker.specialite.toLowerCase().includes(filter.toLowerCase()) ||
      (worker.bus_number && worker.bus_number.toLowerCase().includes(filter.toLowerCase()))
    
    const matchesStatus = statusFilter === '' || worker.status === statusFilter
    
    return matchesFilter && matchesStatus
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
                <p className="mt-4 text-gray-600">Chargement des travailleurs...</p>
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
              <Button onClick={fetchWorkers} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Travailleurs</h1>
              <p className="text-gray-600 mt-2">ISO 9001 - Gestion du personnel et affectation aux bus</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/workers/add'}>
                Ajouter un Travailleur
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Travailleurs</p>
                  <p className="text-2xl font-bold text-blue-600">{workers.length}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {workers.filter(w => w.status === 'active').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Affectés aux Bus</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {workers.filter(w => w.bus_id !== null).length}
                  </p>
                </div>
                <div className="text-3xl">🚌</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Demandes en Cours</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {workers.reduce((sum, w) => sum + w.demandes_count, 0)}
                  </p>
                </div>
                <div className="text-3xl">📋</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pièces Requises</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {workers.reduce((sum, w) => sum + w.parts_needed_count, 0)}
                  </p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Liste des Travailleurs</h2>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                    <option value="on_leave">En Congé</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom & Prénom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spécialité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bus Affecté
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'Embauche
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demandes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {worker.prenom} {worker.nom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {worker.specialite}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {worker.bus_number ? (
                          <div className="flex items-center">
                            <span className="text-blue-600 font-medium">{worker.bus_number}</span>
                            <span className="ml-2 text-xs text-gray-400">({worker.demandes_count} demandes)</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Non affecté</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{worker.telephone}</div>
                          <div className="text-xs text-gray-400">{worker.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {worker.qualification}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(worker.date_embauche).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(worker.status)}`}>
                          {getStatusLabel(worker.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-center">
                          <div className="font-medium">{worker.demandes_count}</div>
                          <div className="text-xs text-gray-400">
                            {worker.parts_needed_count} pièces requises
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                          <button className="text-green-600 hover:text-green-900">Modifier</button>
                          {worker.status === 'active' && worker.bus_id && (
                            <button 
                              onClick={() => handleCreateDemande(worker.id)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              Créer DA
                            </button>
                          )}
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
