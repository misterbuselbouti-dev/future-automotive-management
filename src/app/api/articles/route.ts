import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fjqjtwzqdsxhxdxfqzdu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcWp0d3pxZHN4aHhkeGZxemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTM3NzksImV4cCI6MjA1NDAyOTc3OX0.VG3fN8f6zGZyKlYxL5w2Jq9Y8t7K3m9N2zX1V4W6r8'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch articles with regional stocks
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        reference,
        designation,
        description,
        prix_unitaire,
        categorie,
        unite_mesure,
        stock_min,
        stock_actuel,
        stock_securite,
        controle_qualite,
        is_batch_tracked,
        expiry_tracking,
        critical_part,
        created_at,
        updated_at,
        fournisseurs!inner(id, nom),
        regional_stocks(
          id,
          region_id,
          quantity,
          min_quantity,
          max_quantity,
          last_updated,
          regions!inner(id, name, code)
        )
      `)
      .order('reference')
    
    if (error) {
      console.error('Error fetching articles:', error)
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }
    
    // Fetch regions
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('id, name, code, description')
      .order('name')
    
    // Fetch regional stocks
    const { data: regionalStocks, error: stocksError } = await supabase
      .from('regional_stocks')
      .select(`
        id,
        article_id,
        region_id,
        quantity,
        min_quantity,
        max_quantity,
        last_updated
      `)
    
    return NextResponse.json({
      articles: articles || [],
      regions: regions || [],
      regionalStocks: regionalStocks || []
    })
    
  } catch (error) {
    console.error('Error in articles API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reference, designation, description, prix_unitaire, categorie, unite_mesure, stock_min, fournisseur_id, controle_qualite, is_batch_tracked, expiry_tracking, critical_part } = body
    
    // Validate required fields
    if (!reference || !designation || !prix_unitaire || !categorie) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Create article
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        reference,
        designation,
        description,
        prix_unitaire,
        categorie,
        unite_mesure,
        stock_min: stock_min || 0,
        stock_actuel: 0,
        stock_securite: 0,
        fournisseur_id,
        controle_qualite: controle_qualite || true,
        is_batch_tracked: is_batch_tracked || false,
        expiry_tracking: expiry_tracking || false,
        critical_part: critical_part || false
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating article:', error)
      return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
    }
    
    // Create regional stocks for all regions
    const { data: regions } = await supabase
      .from('regions')
      .select('id')
    
    if (regions && regions.length > 0) {
      const stockInserts = regions.map(region => ({
        article_id: article.id,
        region_id: region.id,
        quantity: 0,
        min_quantity: stock_min || 0
      }))
      
      const { error: stocksError } = await supabase
        .from('regional_stocks')
        .insert(stockInserts)
      
      if (stocksError) {
        console.error('Error creating regional stocks:', stocksError)
      }
    }
    
    return NextResponse.json({ 
      message: 'Article created successfully',
      article 
    })
    
  } catch (error) {
    console.error('Error in articles POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
