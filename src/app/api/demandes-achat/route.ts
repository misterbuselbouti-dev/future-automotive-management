import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (statut) {
      where.statut = statut
    }
    
    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { demandeur: { contains: search, mode: 'insensitive' } },
        { motif: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [demandes, total] = await Promise.all([
      prisma.demandeAchat.findMany({
        where,
        include: {
          lignes: {
            include: {
              articleRef: true
            }
          },
          demandesPrix: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.demandeAchat.count({ where })
    ])

    return NextResponse.json({
      demandes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'achat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes d\'achat' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Générer une référence unique
    const reference = `DA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    
    const demande = await prisma.demandeAchat.create({
      data: {
        reference,
        demandeur: body.demandeur,
        departement: body.departement,
        motif: body.motif,
        priorite: body.priorite,
        lignes: {
          create: body.articles.map((article: any) => ({
            article: article.articleId,
            quantite: parseFloat(article.quantite),
            prixEstime: article.prixEstime ? parseFloat(article.prixEstime) : null,
            observation: article.observation
          }))
        }
      },
      include: {
        lignes: {
          include: {
            articleRef: true
          }
        }
      }
    })

    return NextResponse.json(demande, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la demande d\'achat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande d\'achat' },
      { status: 500 }
    )
  }
}
