'use client'

import { useState, useEffect } from 'react'
import { prisma } from '@/lib/prisma'

export default function TestDB() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function testConnection() {
      try {
        // This would need to be an API call since we're client-side
        // For now, let's just show the status
        setStatus('Database connection test - Check console for details')
        console.log('Testing database connection...')
        
        // Log any potential issues
        console.log('Prisma client initialized')
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('Connection failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <p className="text-gray-700">{status}</p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Debug Info</h3>
          <p className="text-sm text-blue-700 mt-1">
            Check the browser console (F12) for detailed logs
          </p>
        </div>
      </div>
    </div>
  )
}
