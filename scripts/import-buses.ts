import * as XLSX from 'xlsx';
import { PrismaClient, BusType, BusStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface BusData {
  busNumber: string;
  licensePlate: string;
  type: BusType;
  status: BusStatus;
  consumption: number;
}

async function importBuses() {
  try {
    console.log('🚀 Début de l\'importation des bus...');
    
    // Lire le fichier Excel
    const workbook = XLSX.readFile('../Misterbus data/ListeDesBus.xls');
    const sheetName = workbook.SheetNames[0]; // Sheet1
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir en JSON
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 ${data.length} lignes trouvées dans le fichier Excel`);
    
    // Nettoyer et transformer les données
    const buses: BusData[] = data.map((row, index) => {
      // Nettoyer la colonne consumption (enlever le %)
      let consumption = 0;
      if (row.consumption) {
        const consumptionStr = String(row.consumption).replace('%', '').trim();
        consumption = parseFloat(consumptionStr) || 0;
      }
      
      // Déterminer le type (Bus ou MiniBus)
      let type: BusType = BusType.Bus;
      if (row.type && String(row.type).toLowerCase().includes('mini')) {
        type = BusType.MiniBus;
      }
      
      // Déterminer le statut
      let status: BusStatus = 'active' as BusStatus;
      if (row.status && String(row.status).toLowerCase().includes('panne')) {
        status = 'maintenance' as BusStatus;
      }
      
      return {
        busNumber: row.id || `BUS-${index + 1}`,
        licensePlate: row.licensePlate || `MAT-${index + 1}`,
        type,
        status,
        consumption
      };
    }).filter(bus => bus.type && bus.status); // Filtrer les lignes valides
    
    console.log(`🚌 ${buses.length} bus valides à importer`);
    
    // Vider la table existante
    await prisma.bus.deleteMany({});
    console.log('🗑️ Table des bus vidée');
    
    // Importer les données
    const result = await prisma.bus.createMany({
      data: buses
    });
    
    console.log(`✅ ${result.count} bus importés avec succès!`);
    
    // Afficher un aperçu
    const importedBuses = await prisma.bus.findMany({
      take: 5
    });
    
    console.log('\n📋 Aperçu des bus importés:');
    importedBuses.forEach(bus => {
      console.log(`- ${bus.type}: ${bus.status} (${bus.consumption}%)`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'importation
importBuses();
