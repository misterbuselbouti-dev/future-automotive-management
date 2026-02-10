import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch bons entree with related data
    const { data: bonsEntree, error } = await supabase
      .from('bons_entree')
      .select(`
        id,
        reference,
        bon_commande_id,
        fournisseur_id,
        date_entree,
        statut,
        controle_qualite,
        resultats_controle,
        recu_par,
        observation,
        articles_recus,
        non_conformites,
        created_at,
        updated_at,
        bons_commande!inner(id, reference, montant_total, articles),
        fournisseurs!inner(id, nom, telephone, email)
      `)
      .order('date_entree', { ascending: false })
    
    if (error) {
      console.error('Error fetching bons entree:', error)
      return NextResponse.json({ error: 'Failed to fetch bons entree' }, { status: 500 })
    }
    
    // Process data to add computed fields
    const processedBonsEntree = (bonsEntree || []).map(be => {
      const articles = be.articles_recus || []
      const articles_count = Array.isArray(articles) ? articles.length : 0
      const total_value = articles.reduce((sum: number, article: any) => {
        return sum + (article.quantite * article.prix_unitaire || 0)
      }, 0)
      
      return {
        ...be,
        articles_count,
        total_value
      }
    })
    
    return NextResponse.json({
      bonsEntree: processedBonsEntree
    })
    
  } catch (error) {
    console.error('Error in bons entree API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bon_commande_id, fournisseur_id, articles_recus, recu_par, observation } = body
    
    // Validate required fields
    if (!bon_commande_id || !fournisseur_id || !articles_recus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Generate reference
    const reference = `BE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    
    // Create bon entree
    const { data: bonEntree, error } = await supabase
      .from('bons_entree')
      .insert({
        reference,
        bon_commande_id,
        fournisseur_id,
        date_entree: new Date().toISOString(),
        statut: 'en_attente',
        articles_recus,
        recu_par,
        observation
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating bon entree:', error)
      return NextResponse.json({ error: 'Failed to create bon entree' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Bon d\'entrée created successfully',
      bonEntree 
    })
    
  } catch (error) {
    console.error('Error in bons entree POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()
    const { statut, controle_qualite, resultats_controle, recu_par } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Bon d\'entrée ID is required' }, { status: 400 })
    }
    
    // Update bon entree
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (statut) {
      updateData.statut = statut
    }
    
    if (controle_qualite !== undefined) {
      updateData.controle_qualite = controle_qualite
    }
    
    if (resultats_controle) {
      updateData.resultats_controle = resultats_controle
    }
    
    if (recu_par) {
      updateData.recu_par = recu_par
    }
    
    const { data: bonEntree, error } = await supabase
      .from('bons_entree')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single()
    
    if (error) {
      console.error('Error updating bon entree:', error)
      return NextResponse.json({ error: 'Failed to update bon entree' }, { status: 500 })
    }
    
    // If status is 'valide', update regional stocks
    if (statut === 'valide') {
      const { data: bonEntreeWithArticles } = await supabase
        .from('bons_entree')
        .select('articles_recus')
        .eq('id', parseInt(id))
        .single()
      
      if (bonEntreeWithArticles?.articles_recus) {
        const articles = bonEntreeWithArticles.articles_recus
        
        for (const article of articles) {
          // Update regional stock
          const { data: currentStock } = await supabase
            .from('regional_stocks')
            .select('quantity')
            .eq('article_id', article.article_id)
            .eq('region_id', 1)
            .single()
          
          if (currentStock) {
            await supabase
              .from('regional_stocks')
              .update({ 
                quantity: currentStock.quantity + article.quantite,
                last_updated: new Date().toISOString()
              })
              .eq('article_id', article.article_id)
              .eq('region_id', 1)
          }
          
          // Create inventory transaction
          await supabase
            .from('inventory_transactions')
            .insert({
              article_id: article.article_id,
              type_transaction: 'entree',
              quantite: article.quantite,
              reference_document: bonEntree.reference,
              date_transaction: new Date().toISOString(),
              region_id: 1,
              operateur: recu_par || 'System',
              motif: 'Reception from BC'
            })
        }
      }
    }
    
    return NextResponse.json({ 
      message: 'Bon d\'entrée updated successfully',
      bonEntree 
    })
    
  } catch (error) {
    console.error('Error in bons entree PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
