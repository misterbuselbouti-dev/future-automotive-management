const { PrismaClient } = require('@prisma/client')

// Utiliser l'URL de la base de données directement
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
})

async function createTestData() {
  try {
    console.log('🚀 Création de données de test...')
    
    // Créer des bus de test
    const testBuses = [
      { id: 1, type: 'Bus', status: 'EnUsage', consumption: 8.5 },
      { id: 2, type: 'MiniBus', status: 'EnPanne', consumption: 6.2 },
      { id: 3, type: 'Bus', status: 'EnUsage', consumption: 9.1 },
      { id: 4, type: 'MiniBus', status: 'EnUsage', consumption: 7.3 },
      { id: 5, type: 'Bus', status: 'EnPanne', consumption: 8.8 }
    ]
    
    // Vider la table existante
    await prisma.bus.deleteMany({})
    console.log('🗑️ Table des bus vidée')
    
    // Insérer les données de test
    const result = await prisma.bus.createMany({
      data: testBuses
    })
    
    console.log(`✅ ${result.count} bus de test créés avec succès!`)
    
    // Afficher un aperçu
    const buses = await prisma.bus.findMany()
    console.log('\n📋 Liste des bus:')
    buses.forEach(bus => {
      console.log(`- ID: ${bus.id}, Type: ${bus.type}, Statut: ${bus.status}, Consommation: ${bus.consumption}%`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData()
