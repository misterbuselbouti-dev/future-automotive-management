import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { from_region_id, to_region_id, article_id, quantity, reason, operator_id } = body
    
    // Validate required fields
    if (!from_region_id || !to_region_id || !article_id || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    if (from_region_id === to_region_id) {
      return NextResponse.json({ error: 'Cannot transfer to same region' }, { status: 400 })
    }
    
    // Check if source stock has enough quantity
    const { data: sourceStock, error: sourceError } = await supabase
      .from('regional_stocks')
      .select('quantity')
      .eq('article_id', article_id)
      .eq('region_id', from_region_id)
      .single()
    
    if (sourceError || !sourceStock) {
      return NextResponse.json({ error: 'Source stock not found' }, { status: 404 })
    }
    
    if (sourceStock.quantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock in source region' }, { status: 400 })
    }
    
    // Check if destination stock exists
    const { data: destStock, error: destError } = await supabase
      .from('regional_stocks')
      .select('quantity')
      .eq('article_id', article_id)
      .eq('region_id', to_region_id)
      .single()
    
    if (destError) {
      return NextResponse.json({ error: 'Destination stock not found' }, { status: 404 })
    }
    
    // Update source stock (decrease)
    const { error: sourceUpdateError } = await supabase
      .from('regional_stocks')
      .update({ 
        quantity: sourceStock.quantity - quantity,
        last_updated: new Date().toISOString()
      })
      .eq('article_id', article_id)
      .eq('region_id', from_region_id)
    
    if (sourceUpdateError) {
      console.error('Error updating source stock:', sourceUpdateError)
      return NextResponse.json({ error: 'Failed to update source stock' }, { status: 500 })
    }
    
    // Update destination stock (increase)
    const { error: destUpdateError } = await supabase
      .from('regional_stocks')
      .update({ 
        quantity: destStock.quantity + quantity,
        last_updated: new Date().toISOString()
      })
      .eq('region_id', to_region_id)
      .eq('article_id', article_id)
    
    if (destUpdateError) {
      console.error('Error updating destination stock:', destUpdateError)
      return NextResponse.json({ error: 'Failed to update destination stock' }, { status: 500 })
    }
    
    // Create stock movement record
    const { error: movementError } = await supabase
      .from('stock_movements')
      .insert({
        article_id,
        from_region_id,
        to_region_id,
        quantity,
        movement_type: 'transfer',
        reference: `TRANSFER-${from_region_id}-to-${to_region_id}`,
        reason: reason || 'Manual transfer',
        operator_id: operator_id || null
      })
    
    if (movementError) {
      console.error('Error creating transfer record:', movementError)
      return NextResponse.json({ error: 'Failed to create transfer record' }, { status: 500 })
    }
    
    // Create inventory transactions
    const sourceTransaction = await supabase
      .from('inventory_transactions')
      .insert({
        article_id,
        type_transaction: 'sortie',
        quantite: -quantity,
        reference_document: `TRANSFER-${from_region_id}-to-${to_region_id}`,
        date_transaction: new Date().toISOString(),
        region_id: from_region_id,
        operateur: operator_id ? `Worker-${operator_id}` : 'System',
        motif: reason || 'Stock transfer'
      })
    
    const destTransaction = await supabase
      .from('inventory_transactions')
      .insert({
        article_id,
        type_transaction: 'entree',
        quantite: quantity,
        reference_document: `TRANSFER-${from_region_id}-to-${to_region_id}`,
        date_transaction: new Date().toISOString(),
        region_id: to_region_id,
        operateur: operator_id ? `Worker-${operator_id}` : 'System',
        motif: reason || 'Stock transfer'
      })
    
    return NextResponse.json({ 
      message: 'Stock transferred successfully',
      sourceQuantity: sourceStock.quantity - quantity,
      destQuantity: destStock.quantity + quantity
    })
    
  } catch (error) {
    console.error('Error in stock transfer API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
