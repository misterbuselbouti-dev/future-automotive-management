import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch demandes prix with related data
    const { data: demandesPrix, error } = await supabase
      .from('demandes_prix')
      .select(`
        id,
        reference,
        demande_achat_id,
        fournisseur_id,
        date_envoi,
        date_reponse,
        date_limite_reponse,
        prix_total,
        statut,
        delai_livraison,
        conditions,
        pieces_jointes,
        evaluation_qualite,
        created_at,
        updated_at,
        demandes_achat!inner(id, reference, description, demandeur, service),
        fournisseurs!inner(id, nom, telephone, email)
      `)
      .order('date_envoi', { ascending: false })
    
    if (error) {
      console.error('Error fetching demandes prix:', error)
      return NextResponse.json({ error: 'Failed to fetch demandes prix' }, { status: 500 })
    }
    
    return NextResponse.json({
      demandesPrix: demandesPrix || []
    })
    
  } catch (error) {
    console.error('Error in demandes prix API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { demande_achat_id, fournisseur_id, date_limite_reponse, conditions, pieces_jointes } = body
    
    // Validate required fields
    if (!demande_achat_id || !fournisseur_id || !date_limite_reponse) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Generate reference
    const reference = `DP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    
    // Create demande prix
    const { data: demandePrix, error } = await supabase
      .from('demandes_prix')
      .insert({
        reference,
        demande_achat_id,
        fournisseur_id,
        date_envoi: new Date().toISOString(),
        date_limite_reponse,
        statut: 'envoyee',
        conditions,
        pieces_jointes
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating demande prix:', error)
      return NextResponse.json({ error: 'Failed to create demande prix' }, { status: 500 })
    }
    
    // Update demande achat status
    await supabase
      .from('demandes_achat')
      .update({ statut: 'dp_genere' })
      .eq('id', demande_achat_id)
    
    return NextResponse.json({ 
      message: 'Demande de prix created successfully',
      demandePrix 
    })
    
  } catch (error) {
    console.error('Error in demandes prix POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
