import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function AchatsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Achats</h1>
            <p className="text-gray-600 mt-2">Système intelligent de gestion des achats</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/achats/demandes-achat">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Demandes d'Achat</p>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-xs text-gray-500 mt-1">3 en attente</p>
                  </div>
                  <div className="text-3xl">📝</div>
                </div>
              </div>
            </Link>
            
            <Link href="/achats/demandes-prix">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Demandes de Prix</p>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                    <p className="text-xs text-gray-500 mt-1">5 envoyées</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </div>
            </Link>
            
            <Link href="/achats/bons-commande">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bons de Commande</p>
                    <p className="text-2xl font-bold text-green-600">6</p>
                    <p className="text-xs text-gray-500 mt-1">2 approuvés</p>
                  </div>
                  <div className="text-3xl">📋</div>
                </div>
              </div>
            </Link>
            
            <Link href="/achats/bons-reception">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bons de Réception</p>
                    <p className="text-2xl font-bold text-purple-600">4</p>
                    <p className="text-xs text-gray-500 mt-1">1 en attente</p>
                  </div>
                  <div className="text-3xl">📦</div>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/achats/demandes-achat/nouvelle">
                <Button>Nouvelle Demande d'Achat</Button>
              </Link>
              <Link href="/achats/fournisseurs">
                <Button variant="outline">Gérer les Fournisseurs</Button>
              </Link>
              <Link href="/achats/articles">
                <Button variant="outline">Catalogue Articles</Button>
              </Link>
              <Link href="/achats/rapports">
                <Button variant="outline">Rapports Achats</Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandes Récentes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">DA-2024-001</p>
                    <p className="text-sm text-gray-600">Pièces détachées bus</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">En attente</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">DA-2024-002</p>
                    <p className="text-sm text-gray-600">Carburant et lubrifiants</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Approuvée</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dernières Réceptions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">BR-2024-001</p>
                    <p className="text-sm text-gray-600">Filtres huile (10 pcs)</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Reçu</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">BR-2024-002</p>
                    <p className="text-sm text-gray-600">Pneus (4 pcs)</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">En cours</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
