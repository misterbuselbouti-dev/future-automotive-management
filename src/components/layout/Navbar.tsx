'use client'

import { Button } from '@/components/ui/Button'

interface NavbarProps {
  user?: {
    name: string
    role: string
  }
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Tableau de bord
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || 'Administrateur'}
          </p>
          <p className="text-xs text-gray-500">
            {user?.role || 'Admin'}
          </p>
        </div>
        
        <Button variant="outline" size="sm">
          Déconnexion
        </Button>
      </div>
    </header>
  )
}
