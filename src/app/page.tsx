'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const [stats, setStats] = useState({
    totalBuses: '--',
    activeBuses: '--',
    brokenBuses: '--'
  })

  useEffect(() => {
    fetchBusData()
  }, [])

  const fetchBusData = async () => {
    try {
      const response = await fetch('/api/buses-mysql')
      const data = await response.json()
      
      if (data.buses && data.buses.length > 0) {
        const totalBuses = data.total
        const activeBuses = data.active
        const brokenBuses = data.maintenance
        
        // Update the dashboard cards
        const totalElement = document.getElementById('total-buses')
        const activeElement = document.getElementById('active-buses')
        const brokenElement = document.getElementById('broken-buses')
        
        if (totalElement) totalElement.textContent = totalBuses.toString()
        if (activeElement) activeElement.textContent = activeBuses.toString()
        if (brokenElement) brokenElement.textContent = brokenBuses.toString()
        
        setStats({
          totalBuses: totalBuses.toString(),
          activeBuses: activeBuses.toString(),
          brokenBuses: brokenBuses.toString()
        })
        
        console.log('✅ Données des bus chargées:', data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données des bus:', error)
    }
  }

  // Functions for dashboard buttons
  const handleAddBus = () => {
    window.location.href = '/buses/add'
  }

  const handleImportData = () => {
    alert('وظيفة الاستيراد - قيد التطوير')
  }

  const handleViewReports = () => {
    window.location.href = '/reports'
  }

  const handleConfigureDatabase = () => {
    alert('تكوين قاعدة البيانات - قيد التطوير')
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-2">Bienvenue dans le système de gestion Future Automotive</p>
          </div>
          
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
                  <p className="text-sm font-medium text-gray-600">En Panne</p>
                  <p className="text-2xl font-bold text-red-600">{stats.brokenBuses}</p>
                </div>
                <div className="text-3xl">⚠️</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conducteurs</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleAddBus}>Ajouter un Bus</Button>
              <Button variant="outline" onClick={handleImportData}>Importer des Données</Button>
              <Button variant="outline" onClick={handleViewReports}>Voir les Rapports</Button>
            </div>
          </div>
          
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800">Configuration requise</h3>
            <p className="text-sm text-yellow-700 mt-1">
              La base de données MySQL doit être configurée pour importer les données des bus.
            </p>
            <div className="mt-3">
              <Button size="sm" onClick={handleConfigureDatabase}>Configurer la base de données</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
