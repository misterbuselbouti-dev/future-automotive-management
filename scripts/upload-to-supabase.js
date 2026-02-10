const { createClient } = require('@supabase/supabase-js')
const XLSX = require('xlsx')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample data for buses
const busesData = [
  {
    bus_number: 'BUS-001',
    license_plate: 'MAT-001',
    type: 'Bus',
    status: 'active',
    consumption: 25.5,
    created_at: new Date().toISOString()
  },
  {
    bus_number: 'BUS-002',
    license_plate: 'MAT-002',
    type: 'MiniBus',
    status: 'active',
    consumption: 18.2,
    created_at: new Date().toISOString()
  },
  {
    bus_number: 'BUS-003',
    license_plate: 'MAT-003',
    type: 'Bus',
    status: 'maintenance',
    consumption: 22.8,
    created_at: new Date().toISOString()
  }
]

// Sample data for articles
const articlesData = [
  {
    reference: 'ART-001',
    designation: 'Huile Moteur',
    description: 'Huile synthétique pour moteurs diesel',
    prix_unitaire: 150.00,
    stock_min: 10,
    stock_actuel: 25,
    fournisseur_id: 1,
    created_at: new Date().toISOString()
  },
  {
    reference: 'ART-002',
    designation: 'Filtre à Air',
    description: 'Filtre à air pour bus',
    prix_unitaire: 45.50,
    stock_min: 15,
    stock_actuel: 30,
    fournisseur_id: 1,
    created_at: new Date().toISOString()
  },
  {
    reference: 'ART-003',
    designation: 'Pneu 315/80R22.5',
    description: 'Pneu pour bus',
    prix_unitaire: 850.00,
    stock_min: 5,
    stock_actuel: 12,
    fournisseur_id: 2,
    created_at: new Date().toISOString()
  }
]

// Sample data for fournisseurs
const fournisseursData = [
  {
    nom: 'AutoParts Supplier',
    adresse: '123 Rue des Pièces, Casablanca',
    telephone: '0522123456',
    email: 'contact@autoparts.ma',
    created_at: new Date().toISOString()
  },
  {
    nom: 'Transport Equipment Ltd',
    adresse: '456 Avenue des Véhicules, Rabat',
    telephone: '0537789012',
    email: 'info@transport-equip.ma',
    created_at: new Date().toISOString()
  }
]

// Sample data for demandes_achat
const demandesAchatData = [
  {
    reference: 'DA-001',
    date_demande: new Date().toISOString(),
    statut: 'en_attente',
    demandeur: 'Admin',
    articles: JSON.stringify([
      { article_id: 1, quantite: 5, prix_unitaire: 150.00 },
      { article_id: 2, quantite: 10, prix_unitaire: 45.50 }
    ]),
    total: 1205.00,
    created_at: new Date().toISOString()
  }
]

async function uploadDataToSupabase() {
  try {
    console.log('🚀 Début de l\'upload vers Supabase...')

    // Upload buses
    console.log('📤 Upload des buses...')
    const { data: buses, error: busesError } = await supabase
      .from('buses')
      .upsert(busesData, { onConflict: 'bus_number' })
    
    if (busesError) {
      console.error('❌ Erreur buses:', busesError)
    } else {
      console.log(`✅ ${buses ? buses.length : 0} buses uploadés`)
    }

    // Upload fournisseurs
    console.log('📤 Upload des fournisseurs...')
    const { data: fournisseurs, error: fournisseursError } = await supabase
      .from('fournisseurs')
      .upsert(fournisseursData, { onConflict: 'nom' })
    
    if (fournisseursError) {
      console.error('❌ Erreur fournisseurs:', fournisseursError)
    } else {
      console.log(`✅ ${fournisseurs ? fournisseurs.length : 0} fournisseurs uploadés`)
    }

    // Upload articles
    console.log('📤 Upload des articles...')
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .upsert(articlesData, { onConflict: 'reference' })
    
    if (articlesError) {
      console.error('❌ Erreur articles:', articlesError)
    } else {
      console.log(`✅ ${articles ? articles.length : 0} articles uploadés`)
    }

    // Upload demandes_achat
    console.log('📤 Upload des demandes d\'achat...')
    const { data: demandes, error: demandesError } = await supabase
      .from('demandes_achat')
      .upsert(demandesAchatData, { onConflict: 'reference' })
    
    if (demandesError) {
      console.error('❌ Erreur demandes:', demandesError)
    } else {
      console.log(`✅ ${demandes ? demandes.length : 0} demandes uploadées`)
    }

    console.log('🎉 Upload terminé avec succès!')

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Import buses from Excel file
async function importBusesFromExcel() {
  try {
    console.log('📊 Import des buses depuis Excel...')
    
    // Try to read the Excel file
    const workbook = XLSX.readFile('../Misterbus data/ListeDesBus.xls')
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    const data = XLSX.utils.sheet_to_json(worksheet)
    console.log(`📋 ${data.length} lignes trouvées`)
    
    // Transform data for Supabase
    const buses = data.map((row, index) => ({
      bus_number: row['N° Bus'] || `BUS-${index + 1}`,
      license_plate: row['Immatriculation'] || `MAT-${index + 1}`,
      type: row['Type']?.toLowerCase().includes('mini') ? 'MiniBus' : 'Bus',
      status: row['Statut']?.toLowerCase().includes('panne') ? 'maintenance' : 'active',
      consumption: parseFloat(row['Consommation']) || 20.0,
      created_at: new Date().toISOString()
    }))
    
    // Upload to Supabase
    const { data: result, error } = await supabase
      .from('buses')
      .upsert(buses, { onConflict: 'bus_number' })
    
    if (error) {
      console.error('❌ Erreur import Excel:', error)
    } else {
      console.log(`✅ ${result ? result.length : 0} buses importés depuis Excel`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lecture Excel:', error)
    console.log('🔄 Utilisation des données de test...')
    await uploadDataToSupabase()
  }
}

// Run the upload
async function main() {
  await uploadDataToSupabase()
}

main().catch(console.error)

module.exports = { uploadDataToSupabase, importBusesFromExcel }
