import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fjqjtwzqdsxhxdxfqzdu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcWp0d3pxZHN4aHhkeGZxemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTM3NzksImV4cCI6MjA1NDAyOTc3OX0.VG3fN8f6zGZyKlYxL5w2Jq9Y8t7K3m9N2zX1V4W6r8'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const search = searchParams.get('search')

    let query = supabase.from('fournisseurs').select('*')
    
    if (statut) {
      query = query.eq('statut', statut)
    }
    
    if (search) {
      query = query.or(`nom.ilike.%${search}%,email.ilike.%${search}%,telephone.ilike.%${search}%`)
    }

    const { data: fournisseurs, error } = await query.order('nom', { ascending: true })

    if (error) {
      console.error('Error fetching fournisseurs:', error)
      return NextResponse.json({ error: 'Failed to fetch fournisseurs' }, { status: 500 })
    }

    return NextResponse.json(fournisseurs || [])
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
    
    const { data: fournisseur, error } = await supabase
      .from('fournisseurs')
      .insert({
        nom: body.nom,
        telephone: body.telephone,
        email: body.email,
        adresse: body.adresse,
        statut: body.statut || 'approuve'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating fournisseur:', error)
      return NextResponse.json({ error: 'Failed to create fournisseur' }, { status: 500 })
    }

    return NextResponse.json(fournisseur, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du fournisseur' },
      { status: 500 }
    )
  }
}
