import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function importBuses() {
  try {
    console.log('🚀 Début de l\'importation des bus...')
    
    // Lire le fichier Excel
    const workbook = XLSX.readFile('../Misterbus data/ListeDesBus.xls')
    const sheetName = workbook.SheetNames[0] // Sheet1
    const worksheet = workbook.Sheets[sheetName]
    
    // Convertir en JSON
    const data: any[] = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`📊 ${data.length} lignes trouvées dans le fichier Excel`)
    
    // Nettoyer et transformer les données
    const buses = data.map((row, index) => {
      // Nettoyer la colonne consumption (enlever le %)
      let consumption = 0
      if (row['Consommation']) {
        const consumptionStr = String(row['Consommation']).replace('%', '').trim()
        consumption = parseFloat(consumptionStr) || 0
      }
      
      // Déterminer le type (Bus ou MiniBus)
      let type: 'Bus' | 'MiniBus' = 'Bus'
      if (row['Type'] && String(row['Type']).toLowerCase().includes('mini')) {
        type = 'MiniBus'
      }
      
      // Déterminer le statut
      let status: 'active' | 'inactive' | 'maintenance' | 'retired' = 'active'
      if (row['Statut'] && String(row['Statut']).toLowerCase().includes('panne')) {
        status = 'maintenance'
      }
      
      return {
        busNumber: row['N° Bus'] || `BUS-${index + 1}`, // Mapper 'N° Bus' à busNumber
        licensePlate: row['Immatriculation'] || `MAT-${index + 1}`, // Ajouter licensePlate
        type,
        status,
        consumption
      }
    }).filter(bus => bus.type && bus.status) // Filtrer les lignes valides
    
    console.log(`🚌 ${buses.length} bus valides à importer`)
    
    // Vider la table existante
    await prisma.bus.deleteMany({})
    console.log('🗑️ Table des bus vidée')
    
    // Importer les données
    const result = await prisma.bus.createMany({
      data: buses
    })
    
    console.log(`✅ ${result.count} bus importés avec succès!`)
    
    // Afficher un aperçu
    const importedBuses = await prisma.bus.findMany({
      take: 5
    })
    
    console.log('\n📋 Aperçu des bus importés:')
    importedBuses.forEach(bus => {
      console.log(`- ${bus.type}: ${bus.status} (${bus.consumption}%)`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter l'importation
importBuses()
