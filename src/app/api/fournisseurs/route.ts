import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (statut) {
      where.statut = statut
    }
    
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const fournisseurs = await prisma.fournisseur.findMany({
      where,
      include: {
        demandesPrix: {
          select: {
            id: true,
            reference: true,
            statut: true,
            prixTotal: true
          }
        },
        bonsCommande: {
          select: {
            id: true,
            reference: true,
            statut: true,
            montantTotal: true
          }
        }
      },
      orderBy: { nom: 'asc' }
    })

    return NextResponse.json(fournisseurs)
  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des fournisseurs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const fournisseur = await prisma.fournisseur.create({
      data: {
        nom: body.nom,
        contact: body.contact,
        email: body.email,
        telephone: body.telephone,
        adresse: body.adresse,
        statut: body.statut || 'Actif'
      }
    })

    return NextResponse.json(fournisseur, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du fournisseur' },
      { status: 500 }
    )
  }
}
