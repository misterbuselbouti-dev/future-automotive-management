import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorie = searchParams.get('categorie')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (categorie) {
      where.categorie = categorie
    }
    
    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        lignesAchat: {
          select: {
            id: true,
            quantite: true,
            prixEstime: true
          }
        },
        lignesCommande: {
          select: {
            id: true,
            quantite: true,
            prixUnitaire: true
          }
        }
      },
      orderBy: { designation: 'asc' }
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const article = await prisma.article.create({
      data: {
        reference: body.reference,
        designation: body.designation,
        description: body.description,
        prixUnitaire: body.prixUnitaire ? parseFloat(body.prixUnitaire) : null,
        unite: body.unite,
        categorie: body.categorie,
        stock: body.stock ? parseFloat(body.stock) : 0,
        stockMin: body.stockMin ? parseFloat(body.stockMin) : 0
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    )
  }
}
