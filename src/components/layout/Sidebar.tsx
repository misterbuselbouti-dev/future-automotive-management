'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

const sidebarItems = [
  {
    title: 'Tableau de bord',
    href: '/',
    icon: '📊'
  },
  {
    title: 'Bus',
    href: '/buses',
    icon: '🚌'
  },
  {
    title: 'Conducteurs',
    href: '/drivers',
    icon: '👥'
  },
  {
    title: 'Maintenance',
    href: '/maintenance',
    icon: '🔧'
  },
  {
    title: 'Achats',
    href: '/achats',
    icon: '🛒'
  },
  {
    title: 'Rapports',
    href: '/reports',
    icon: '📈'
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: '⚙️'
  }
]

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('w-64 bg-white border-r border-gray-200 h-full', className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Future Automotive</h1>
        <p className="text-sm text-gray-500 mt-1">Système de Gestion</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
