import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch demandes achat with related data
    const { data: demandesAchat, error } = await supabase
      .from('demandes_achat')
      .select(`
        id,
        reference,
        date_demande,
        statut,
        demandeur,
        service,
        worker_id,
        bus_id,
        description,
        articles,
        total,
        priorite,
        auto_approve,
        justification,
        created_at,
        updated_at,
        workers!inner(id, nom, prenom, specialite),
        buses!inner(id, bus_number, license_plate, type, status)
      `)
      .order('date_demande', { ascending: false })
    
    if (error) {
      console.error('Error fetching demandes achat:', error)
      return NextResponse.json({ error: 'Failed to fetch demandes achat' }, { status: 500 })
    }
    
    // Process data to add computed fields
    const processedDemandesAchat = (demandesAchat || []).map(da => {
      const articles = da.articles || []
      const articles_count = Array.isArray(articles) ? articles.length : 0
      
      // Count related DP and BC (mock data for now)
      const dp_count = Math.floor(Math.random() * 3)
      const bc_count = Math.floor(Math.random() * 2)
      
      return {
        ...da,
        articles_count,
        dp_count,
        bc_count,
        worker_nom: da.workers && da.workers.length > 0 ? `${da.workers[0].prenom} ${da.workers[0].nom}` : null,
        bus_number: da.buses && da.buses.length > 0 ? da.buses[0].bus_number : null
      }
    })
    
    return NextResponse.json({
      demandesAchat: processedDemandesAchat
    })
    
  } catch (error) {
    console.error('Error in demandes achat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { demandeur, service, worker_id, bus_id, description, articles, priorite, auto_approve, justification } = body
    
    // Validate required fields
    if (!demandeur || !description || !articles) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Calculate total
    const total = articles.reduce((sum: number, article: any) => {
      return sum + (article.quantite * article.prix_unitaire || 0)
    }, 0)
    
    // Generate reference
    const reference = `DA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    
    // Create demande achat
    const { data: demandeAchat, error } = await supabase
      .from('demandes_achat')
      .insert({
        reference,
        date_demande: new Date().toISOString(),
        statut: 'en_attente',
        demandeur,
        service,
        worker_id,
        bus_id,
        description,
        articles,
        total,
        priorite: priorite || 'normale',
        auto_approve: auto_approve || true,
        justification
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating demande achat:', error)
      return NextResponse.json({ error: 'Failed to create demande achat' }, { status: 500 })
    }
    
    // If auto_approve is true, automatically approve and generate DP
    if (auto_approve) {
      await supabase
        .from('demandes_achat')
        .update({ statut: 'approuve' })
        .eq('id', demandeAchat.id)
      
      // Generate DP for each supplier (mock for now)
      const { data: fournisseurs } = await supabase
        .from('fournisseurs')
        .select('id')
        .eq('statut', 'approuve')
        .limit(3)
      
      if (fournisseurs && fournisseurs.length > 0) {
        for (const fournisseur of fournisseurs) {
          await supabase
            .from('demandes_prix')
            .insert({
              reference: `DP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
              demande_achat_id: demandeAchat.id,
              fournisseur_id: fournisseur.id,
              date_envoi: new Date().toISOString(),
              date_limite_reponse: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              statut: 'envoyee'
            })
        }
      }
      
      await supabase
        .from('demandes_achat')
        .update({ statut: 'dp_genere' })
        .eq('id', demandeAchat.id)
    }
    
    return NextResponse.json({ 
      message: 'Demande d\'achat created successfully',
      demandeAchat 
    })
    
  } catch (error) {
    console.error('Error in demandes achat POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()
    const { statut } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Demande d\'achat ID is required' }, { status: 400 })
    }
    
    // Update demande achat
    const { data: demandeAchat, error } = await supabase
      .from('demandes_achat')
      .update({ 
        statut,
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(id))
      .select()
      .single()
    
    if (error) {
      console.error('Error updating demande achat:', error)
      return NextResponse.json({ error: 'Failed to update demande achat' }, { status: 500 })
    }
    
    // If status is 'approuve' and auto_approve is true, generate DP
    if (statut === 'approuve') {
      const { data: da } = await supabase
        .from('demandes_achat')
        .select('auto_approve')
        .eq('id', parseInt(id))
        .single()
      
      if (da?.auto_approve) {
        // Generate DP for each supplier
        const { data: fournisseurs } = await supabase
          .from('fournisseurs')
          .select('id')
          .eq('statut', 'approuve')
          .limit(3)
        
        if (fournisseurs && fournisseurs.length > 0) {
          for (const fournisseur of fournisseurs) {
            await supabase
              .from('demandes_prix')
              .insert({
                reference: `DP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                demande_achat_id: parseInt(id),
                fournisseur_id: fournisseur.id,
                date_envoi: new Date().toISOString(),
                date_limite_reponse: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                statut: 'envoyee'
              })
          }
        }
        
        await supabase
          .from('demandes_achat')
          .update({ statut: 'dp_genere' })
          .eq('id', parseInt(id))
      }
    }
    
    return NextResponse.json({ 
      message: 'Demande d\'achat updated successfully',
      demandeAchat 
    })
    
  } catch (error) {
    console.error('Error in demandes achat PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
