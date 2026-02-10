'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBuses: 120,
    activeBuses: 61,
    maintenanceBuses: 59,
    totalDrivers: 5,
    activeDrivers: 4,
    totalMaintenance: 4,
    completedMaintenance: 1,
    inProgressMaintenance: 1,
    scheduledMaintenance: 2,
    totalReports: 4,
    publishedReports: 3,
    draftReports: 1
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

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
                <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
              </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-600 mt-2">Vue d'ensemble du système Future Automotive</p>
          </div>
          
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBuses}</p>
                </div>
                <div className="text-3xl">🚌</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Service</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeBuses}</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Maintenance</p>
                  <p className="text-2xl font-bold text-red-600">{stats.maintenanceBuses}</p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conducteurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
          </div>
          
          {/* Statistiques secondaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Terminées</span>
                  <span className="text-sm font-medium text-green-600">{stats.completedMaintenance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">En cours</span>
                  <span className="text-sm font-medium text-blue-600">{stats.inProgressMaintenance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Programmées</span>
                  <span className="text-sm font-medium text-yellow-600">{stats.scheduledMaintenance}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapports</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Publiés</span>
                  <span className="text-sm font-medium text-green-600">{stats.publishedReports}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Brouillons</span>
                  <span className="text-sm font-medium text-gray-600">{stats.draftReports}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-sm font-medium text-blue-600">{stats.totalReports}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/buses/add'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  🚌 Ajouter un Bus
                </Button>
                <Button 
                  onClick={() => window.location.href = '/maintenance'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  🔧 Nouvelle Maintenance
                </Button>
                <Button 
                  onClick={() => window.location.href = '/reports'}
                  className="w-full justify-start"
                  variant="outline"
                >
                  📊 Générer un Rapport
                </Button>
              </div>
            </div>
          </div>
          
          {/* Activités récentes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Maintenance terminée</p>
                    <p className="text-sm text-gray-600">Bus 102 - Changement huile</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Il y a 2 heures</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nouveau bus ajouté</p>
                    <p className="text-sm text-gray-600">Bus 106 - Bus standard</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Il y a 5 heures</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Maintenance programmée</p>
                    <p className="text-sm text-gray-600">Bus 104 - Réparation frein</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Il y a 1 jour</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rapport généré</p>
                    <p className="text-sm text-gray-600">Rapport Mensuel - Février 2024</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Il y a 2 jours</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
