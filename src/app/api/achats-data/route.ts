import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // قراءة بيانات المشتريات من ملف JSON
    const filePath = path.join(process.cwd(), 'achats-data.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json({
      message: 'Données d\'achats chargées avec succès',
      ...data
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données d\'achats:', error)
    
    // Données de test en cas d'erreur
    const testData = {
      demandesAchat: [],
      demandesPrix: [],
      bonsCommande: [],
      bonsReception: [],
      fournisseurs: [],
      articles: []
    }
    
    return NextResponse.json({ 
      message: 'Utilisation des données de test',
      ...testData
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body
    
    // في المستقبل، سنقوم بإضافة البيانات إلى الملف
    console.log('Ajout de données d\'achats:', { type, data })
    
    return NextResponse.json({ 
      message: 'Données ajoutées avec succès (simulation)',
      type,
      data
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données d\'achats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout des données d\'achats' },
      { status: 500 }
    )
  }
}
