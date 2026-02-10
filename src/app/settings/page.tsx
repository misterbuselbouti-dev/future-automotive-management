'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'Future Automotive',
    companyAddress: '123 Rue de la République, 75001 Paris, France',
    companyPhone: '+33 1 42 86 95 20 00',
    companyEmail: 'contact@futureautomotive.ma',
    currency: 'MAD',
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    notifications: true,
    autoBackup: true,
    maintenanceAlerts: true,
    lowStockAlert: true
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // في المستقبل، سنقوم بحفظ الإعدادات في قاعدة البيانات
      console.log('Paramètres sauvegardés:', settings)
      
      // محاكاة الحفظظ
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error)
      alert('Erreur lors de la sauvegarde des paramètres')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setSettings({
        companyName: 'Future Automotive',
        companyAddress: '123 Rue de la République, 75001 Paris, France',
        companyPhone: '+33 1 42 86 95 20 00',
        companyEmail: 'contact@futureautomotive.ma',
        currency: 'MAD',
        language: 'fr',
        timezone: 'Europe/Paris',
        dateFormat: 'DD/MM/YYYY',
        notifications: true,
        autoBackup: true,
        maintenanceAlerts: true,
        lowStockAlert: true
      })
      alert('Paramètres réinitialisés avec succès!')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar user={{ name: 'Administrateur', role: 'Admin' }} />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600 mt-2">Configuration du système Future Automotive</p>
          </div>
          
          {success && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800">✅ Paramètres sauvegardés avec succès!</h3>
              <p className="text-sm text-green-700 mt-1">
                Les modifications ont été enregistrées avec succès.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de l'entreprise</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={settings.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <textarea
                    id="companyAddress"
                    name="companyAddress"
                    value={settings.companyAddress}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="companyPhone"
                      name="companyPhone"
                      value={settings.companyPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="companyEmail"
                      name="companyEmail"
                      value={settings.companyEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Préférences</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                      Devise
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MAD">MAD (درهم)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dollar)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau horaire
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={settings.timezone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Dubai">Asia/Dubai</option>
                      <option value="Africa/Casablanca">Africa/Casablanca</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                      Format de date
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      value={settings.dateFormat}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={settings.notifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                    />
                    <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
                      Activer les notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      name="autoBackup"
                      checked={settings.autoBackup}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                    />
                    <label htmlFor="autoBackup" className="ml-2 text-sm text-gray-700">
                      Sauvegarde automatique
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenanceAlerts"
                      name="maintenanceAlerts"
                      checked={settings.maintenanceAlerts}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                    />
                    <label htmlFor="maintenanceAlerts" className="ml-2 text-sm text-gray-700">
                      Alertes de maintenance
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="lowStockAlert"
                      name="lowStockAlert"
                      checked={settings.lowStockAlert}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                    />
                    <label htmlFor="lowStockAlert" className="ml-2 text-sm text-gray-700">
                      Alertes de stock bas
                    </label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                Réinitialiser
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
