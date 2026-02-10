import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fjqjtwzqdsxhxdxfqzdu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcWp0d3pxZHN4aHhkeGZxemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTM3NzksImV4cCI6MjA1NDAyOTc3OX0.VG3fN8f6zGZyKlYxL5w2Jq9Y8t7K3m9N2zX1V4W6r8'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get('driverId')
    
    if (!driverId) {
      return NextResponse.json({ error: 'Driver ID is required' }, { status: 400 })
    }
    
    // Fetch driver information
    const { data: driver, error: driverError } = await supabase
      .from('workers')
      .select(`
        id,
        nom,
        prenom,
        telephone,
        email,
        specialite,
        bus_id,
        status,
        date_embauche,
        qualification
      `)
      .eq('id', parseInt(driverId))
      .single()
    
    if (driverError || !driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }
    
    // Fetch driver's requests
    const { data: requests, error: requestsError } = await supabase
      .from('maintenance_parts_usage')
      .select(`
        id,
        maintenance_id,
        article_id,
        quantity_used,
        created_at,
        articles!inner(id, reference, designation, unite_mesure),
        regions!inner(id, name, code)
      `)
      .eq('technician_id', parseInt(driverId))
      .order('created_at', { ascending: false })
    
    // Fetch available parts for driver's region
    const { data: parts, error: partsError } = await supabase
      .from('regional_stocks')
      .select(`
        id,
        article_id,
        region_id,
        quantity,
        min_quantity,
        max_quantity,
        last_updated,
        articles!inner(id, reference, designation, description, categorie, prix_unitaire, unite_mesure, critical_part)
      `)
      .eq('region_id', 1) // Default to KSAR region
      .gt('quantity', 0)
      .order('articles.designation')
    
    return NextResponse.json({
      driver,
      requests: requests || [],
      parts: parts || []
    })
    
  } catch (error: any) {
    console.error('Error in driver API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json() as any
    const { driver_id, bus_id, article_id, quantity } = requestBody
    
    // Validate required fields
    if (!driver_id || !bus_id || !article_id || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Check if article is available in stock
    const { data: stock, error: stockError } = await supabase
      .from('regional_stocks')
      .select('quantity')
      .filter('article_id', 'eq', article_id)
      .filter('region_id', 'eq', 1) // Default to KSAR region
      .single()
    
    if (stockError || !stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }
    
    if (stock.quantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }
    
    // Create parts request
    const { data: requestRecord, error: requestError } = await supabase
      .from('maintenance_parts_usage')
      .insert({
        maintenance_id: 0, // Will be updated when maintenance is created
        article_id,
        region_id: 1, // Default to KSAR region
        quantity_used: quantity,
        technician_id: parseInt(driver_id)
      })
      .select()
      .single()
    
    if (requestError) {
      console.error('Error creating parts request:', requestError)
      return NextResponse.json({ error: 'Failed to create parts request' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Parts request created successfully',
      request: requestRecord 
    })
    
  } catch (error) {
    console.error('Error in driver API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
