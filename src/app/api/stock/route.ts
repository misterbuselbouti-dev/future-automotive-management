import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fjqjtwzqdsxhxdxfqzdu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcWp0d3pxZHN4aHhkeGZxemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTM3NzksImV4cCI6MjA1NDAyOTc3OX0.VG3fN8f6zGZyKlYxL5w2Jq9Y8t7K3m9N2zX1V4W6r8'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const regionId = searchParams.get('region')
    
    // Fetch regional stocks with article information
    let query = supabase
      .from('regional_stocks')
      .select(`
        id,
        article_id,
        region_id,
        quantity,
        min_quantity,
        max_quantity,
        last_updated,
        regions!inner(
          id,
          name,
          code
        ),
        articles!inner(
          id,
          reference,
          designation,
          description,
          prix_unitaire,
          categorie,
          unite_mesure,
          critical_part
        )
      `)
    
    if (regionId && regionId !== 'all') {
      query = query.eq('region_id', parseInt(regionId))
    }
    
    const { data: regionalStocks, error } = await query
    
    if (error) {
      console.error('Error fetching regional stocks:', error)
      return NextResponse.json({ error: 'Failed to fetch regional stocks' }, { status: 500 })
    }
    
    // Fetch stock movements
    const { data: stockMovements, error: movementsError } = await supabase
      .from('stock_movements')
      .select(`
        id,
        article_id,
        region_id,
        quantity,
        movement_type,
        reference,
        reason,
        created_at,
        regions!inner(id, name, code),
        articles!inner(id, reference, designation)
      `)
      .order('created_at', { ascending: false })
      .limit(50)
    
    // Fetch regions
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('id, name, code, description')
      .order('name')
    
    return NextResponse.json({
      regionalStocks: regionalStocks || [],
      stockMovements: stockMovements || [],
      regions: regions || []
    })
    
  } catch (error) {
    console.error('Error in stock API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, articleId, regionId, quantity, reason, operatorId } = body
    
    if (!type || !articleId || !regionId || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get current stock
    const { data: currentStock } = await supabase
      .from('regional_stocks')
      .select('quantity')
      .eq('article_id', articleId)
      .eq('region_id', regionId)
      .single()
    
    if (!currentStock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }
    
    let newQuantity = currentStock.quantity
    
    if (type === 'entry') {
      newQuantity = currentStock.quantity + quantity
    } else if (type === 'exit') {
      if (currentStock.quantity < quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
      }
      newQuantity = currentStock.quantity - quantity
    } else if (type === 'transfer') {
      // Handle transfer logic
      return NextResponse.json({ error: 'Transfer not implemented yet' }, { status: 501 })
    }
    
    // Update regional stock
    const { error: updateError } = await supabase
      .from('regional_stocks')
      .update({ 
        quantity: newQuantity,
        last_updated: new Date().toISOString()
      })
      .eq('article_id', articleId)
      .eq('region_id', regionId)
    
    if (updateError) {
      console.error('Error updating stock:', updateError)
      return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 })
    }
    
    // Create stock movement record
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        article_id: articleId,
        region_id: regionId,
        quantity: type === 'entry' ? quantity : -quantity,
        movement_type: type,
        reference: body.reference || 'MANUAL',
        reason: reason || 'Manual adjustment',
        operator_id: operatorId || null
      })
    
    if (movementError) {
      console.error('Error creating movement record:', movementError)
      return NextResponse.json({ error: 'Failed to create movement record' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Stock updated successfully',
      newQuantity 
    })
    
  } catch (error) {
    console.error('Error in stock POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
