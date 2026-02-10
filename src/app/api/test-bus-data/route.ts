import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Chargement des données réelles des bus...')
    
    // Lire les données importées depuis le fichier JSON
    const filePath = path.join(process.cwd(), 'buses-data.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    console.log(`✅ ${data.buses.length} bus chargés avec succès!`)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données:', error)
    
    // En cas d'erreur, retourner les données de test
    const testBuses = [
      { id: 1, type: 'Bus', status: 'EnUsage', consumption: 8.5 },
      { id: 2, type: 'MiniBus', status: 'EnPanne', consumption: 6.2 },
      { id: 3, type: 'Bus', status: 'EnUsage', consumption: 9.1 },
      { id: 4, type: 'MiniBus', status: 'EnUsage', consumption: 7.3 },
      { id: 5, type: 'Bus', status: 'EnPanne', consumption: 8.8 }
    ]
    
    return NextResponse.json({ 
      message: 'Utilisation des données de test (fichier non trouvé)',
      buses: testBuses
    })
  }
}

export async function GET() {
  try {
    // Essayer de lire les données réelles
    const filePath = path.join(process.cwd(), 'buses-data.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des bus:', error)
    
    // Données de test en cas d'erreur
    const testBuses = [
      { id: 1, type: 'Bus', status: 'EnUsage', consumption: 8.5 },
      { id: 2, type: 'MiniBus', status: 'EnPanne', consumption: 6.2 },
      { id: 3, type: 'Bus', status: 'EnUsage', consumption: 9.1 },
      { id: 4, type: 'MiniBus', status: 'EnUsage', consumption: 7.3 },
      { id: 5, type: 'Bus', status: 'EnPanne', consumption: 8.8 }
    ]
    
    return NextResponse.json({ 
      message: 'Utilisation des données de test',
      buses: testBuses
    })
  }
}
