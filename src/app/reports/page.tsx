'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

interface Report {
  id: number
  title: string
  type: string
  description: string
  date: string
  status: 'draft' | 'generated' | 'published'
  created_by: string
  created_at: string
  updated_at: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      
      // بيانات وهمية للعرض
      const mockReports: Report[] = [
        {
          id: 1,
          title: 'Rapport Mensuel - Février 2024',
          type: 'mensuel',
          description: 'Rapport mensuel sur les opérations de Février 2024 incluant les revenus, les dépenses et les statistiques du parc automobile.',
          date: '2024-02-01T00:00:00Z',
          status: 'published',
          created_by: 'Administrateur',
          created_at: '2024-02-01T10:00:00Z',
          updated_at: '2024-02-01T10:00:00Z'
        },
        {
          id: 2,
          title: 'Analyse des Coûts de Maintenance',
          type: 'maintenance',
          description: 'Analyse détaillée des coûts de maintenance pour le premier trimestre 2024. Identification des tendances et recommandations pour optimisation.',
          date: '2024-02-15T00:00:00Z',
          status: 'published',
          created_by: 'Administrateur',
          created_at: '2024-02-15T10:00:00Z',
          updated_at: '2024-02-15T10:00:00Z'
        },
        {
          id: 3,
          title: 'Rapport Performance Bus',
          type: 'performance',
          description: 'Analyse de la performance des bus du parc. Évaluation de la consommation de carburant et des coûts opérationnels par véhicule.',
          date: '2024-02-20T00:00:00Z',
          status: 'draft',
          created_by: 'Administrateur',
          created_at: '2024-02-20T10:00:00Z',
          updated_at: '2024-02-20T10:00:00Z'
        },
        {
          id: 4,
          title: 'Rapport d\'Audit de Sécurité',
          type: 'sécurité',
          description: 'Audit annuel des mesures de sécurité mises en place pour la protection du parc automobile contre les risques opérationnels.',
          date: '2024-01-10T00:00:00Z',
          status: 'published',
          created_by: 'Administrateur',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z'
        }
      ]
      
      setReports(mockReports)
    } catch (err) {
      setError('Erreur lors de la récupération des rapports')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'generated':
        return 'bg-blue-100 text-blue-800'
      case 'published':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon'
      case 'generated':
        return 'Généré'
      case 'published':
        return 'Publié'
      default:
        return status
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mensuel':
        return 'bg-blue-100 text-blue-800'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800'
      case 'performance':
        return 'bg-purple-100 text-purple-800'
      case 'sécurité':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mensuel':
        return 'Mensuel'
      case 'maintenance':
        return 'Maintenance'
      case 'performance':
        return 'Performance'
      case 'sécurité':
        return 'Sécurité'
      default:
        return type
    }
  }

  const handleViewReport = (reportId: number) => {
    alert(`عرض تفاصيل التقرير ${reportId} - قيد التطوير`)
  }

  const handleEditReport = (reportId: number) => {
    alert(`تعديل التقرير ${reportId} - قيد التطوير`)
  }

  const handleDeleteReport = (reportId: number) => {
    if (confirm(`هل أنت متأكد من حذف التقرير ${reportId}؟`)) {
      setReports(prev => prev.filter(r => r.id !== reportId))
      alert(`تم حذف التقرير ${reportId} بنجاح!`)
    }
  }

  const handleGenerateReport = (reportId: number) => {
    alert(`توليد التقرير ${reportId} - قيد التطوير`)
  }

  const handlePublishReport = (reportId: number) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'published' } : r
    ))
    alert(`تم نشر التقرير ${reportId} بنجاح!`)
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
                <p className="mt-4 text-gray-600">Chargement des rapports...</p>
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
              <Button onClick={fetchReports} className="mt-3">
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
              <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
              <p className="text-gray-600 mt-2">Gestion des rapports et analyses</p>
            </div>
            <Button onClick={() => alert('إنشاء تقرير جديد - قيد التطوير')}>
              Nouveau Rapport
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rapports</p>
                  <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Publiés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reports.filter(r => r.status === 'published').length}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Brouillon</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {reports.filter(r => r.status === 'draft').length}
                  </p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Générés</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reports.filter(r => r.status === 'generated').length}
                  </p>
                </div>
                <div className="text-3xl">📄</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Liste des Rapports</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créé par
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                          {getTypeLabel(report.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.created_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewReport(report.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Voir
                          </button>
                          <button 
                            onClick={() => handleEditReport(report.id)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteReport(report.id)}
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
