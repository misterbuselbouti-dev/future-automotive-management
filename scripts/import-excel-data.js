const XLSX = require('xlsx')

// Importation des bus depuis le fichier Excel
function importBusesFromExcel() {
  try {
    console.log('🚀 Début de l\'importation des bus depuis Excel...')
    
    // Lire le fichier Excel
    const workbook = XLSX.readFile('C:/Users/Lenovo/Desktop/Misterbus data/ListeDesBus.xls')
    const sheetName = workbook.SheetNames[0] // Sheet1
    const worksheet = workbook.Sheets[sheetName]
    
    // Convertir en JSON
    const data = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`📊 ${data.length} lignes trouvées dans le fichier Excel`)
    
    // Afficher les premières lignes pour comprendre la structure
    console.log('\n📋 Structure des données (premières lignes):')
    data.slice(0, 3).forEach((row, index) => {
      console.log(`Ligne ${index + 1}:`, row)
    })
    
    // Nettoyer et transformer les données
    const buses = data.map((row, index) => {
      // Nettoyer la colonne consumption (enlever le %)
      let consumption = 0
      if (row['Consommation']) {
        const consumptionStr = String(row['Consommation']).replace('%', '').trim()
        consumption = parseFloat(consumptionStr) || 0
      }
      
      // Déterminer le type (Bus ou MiniBus)
      let type = 'Bus'
      if (row['Type'] && String(row['Type']).toLowerCase().includes('mini')) {
        type = 'MiniBus'
      }
      
      // Déterminer le statut
      let status = 'EnUsage'
      if (row['état'] && String(row['état']).toLowerCase().includes('panne')) {
        status = 'EnPanne'
      } else if (row['état'] && String(row['état']).toLowerCase().includes('usage')) {
        status = 'EnUsage'
      }
      
      return {
        id: row['N° Bus'] || index + 1, // Mapper 'N° Bus' à id
        type,
        status,
        consumption
      }
    }).filter(bus => bus.type && bus.status) // Filtrer les lignes valides
    
    console.log(`🚌 ${buses.length} bus valides à importer`)
    
    // Afficher un aperçu des bus transformés
    console.log('\n📋 Aperçu des bus transformés:')
    buses.slice(0, 5).forEach(bus => {
      console.log(`- ID: ${bus.id}, Type: ${bus.type}, Statut: ${bus.status}, Consommation: ${bus.consumption}%`)
    })
    
    // Créer le fichier de données pour l'API
    const fs = require('fs')
    const busData = {
      message: `${buses.length} bus importés avec succès!`,
      buses: buses
    }
    
    fs.writeFileSync('buses-data.json', JSON.stringify(busData, null, 2))
    console.log('\n✅ Données sauvegardées dans buses-data.json')
    
    return buses
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error)
    return []
  }
}

// Exécuter l'importation
const buses = importBusesFromExcel()

if (buses.length > 0) {
  console.log('\n🎉 Importation terminée avec succès!')
  console.log(`📈 Statistiques:`)
  console.log(`   - Total: ${buses.length}`)
  console.log(`   - Bus: ${buses.filter(b => b.type === 'Bus').length}`)
  console.log(`   - MiniBus: ${buses.filter(b => b.type === 'MiniBus').length}`)
  console.log(`   - En service: ${buses.filter(b => b.status === 'EnUsage').length}`)
  console.log(`   - En panne: ${buses.filter(b => b.status === 'EnPanne').length}`)
} else {
  console.log('\n❌ Aucun bus importé')
}
