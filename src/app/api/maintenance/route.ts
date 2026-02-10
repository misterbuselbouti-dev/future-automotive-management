import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Fetch maintenance records with related data
    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .select(`
        id,
        bus_id,
        type,
        description,
        scheduled_date,
        completed_date,
        statut,
        priorite,
        cout,
        technician_id,
        created_at,
        updated_at,
        buses!inner(id, bus_number, license_plate, type, status),
        workers!inner(id, nom, prenom, specialite),
        maintenance_parts_usage(
          id,
          article_id,
          region_id,
          quantity_used,
          articles!inner(id, reference, designation, unite_mesure),
          regions!inner(id, name, code)
        )
      `)
      .order('scheduled_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching maintenance:', error)
      return NextResponse.json({ error: 'Failed to fetch maintenance records' }, { status: 500 })
    }
    
    // Fetch buses
    const { data: buses, error: busesError } = await supabase
      .from('buses')
      .select('id, bus_number, license_plate, type, status')
      .order('bus_number')
    
    // Fetch workers
    const { data: workers, error: workersError } = await supabase
      .from('workers')
      .select('id, nom, prenom, specialite, status')
      .order('nom')
    
    return NextResponse.json({
      maintenance: maintenance || [],
      buses: buses || [],
      workers: workers || []
    })
    
  } catch (error) {
    console.error('Error in maintenance API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bus_id, type, description, scheduled_date, priorite, technician_id, parts_used } = body
    
    // Validate required fields
    if (!bus_id || !type || !description || !scheduled_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Create maintenance record
    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .insert({
        bus_id,
        type,
        description,
        scheduled_date,
        priorite: priorite || 'normale',
        technician_id: technician_id || null,
        statut: 'programme',
        cout: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating maintenance:', error)
      return NextResponse.json({ error: 'Failed to create maintenance record' }, { status: 500 })
    }
    
    // Create parts usage records if provided
    if (parts_used && parts_used.length > 0) {
      const partsInserts = parts_used.map((part: any) => ({
        maintenance_id: maintenance.id,
        article_id: part.article_id,
        region_id: part.region_id || 1, // Default to KSAR region
        quantity_used: part.quantity_used
      }))
      
      const { error: partsError } = await supabase
        .from('maintenance_parts_usage')
        .insert(partsInserts)
      
      if (partsError) {
        console.error('Error creating parts usage records:', partsError)
      }
    }
    
    return NextResponse.json({ 
      message: 'Maintenance created successfully',
      maintenance 
    })
    
  } catch (error) {
    console.error('Error in maintenance POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()
    const { status, completed_date, parts_used } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Maintenance ID is required' }, { status: 400 })
    }
    
    // Update maintenance status
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    if (status) {
      updateData.statut = status
      if (status === 'termine') {
        updateData.completed_date = completed_date || new Date().toISOString()
      }
    }
    
    const { data: maintenance, error } = await supabase
      .from('maintenance')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single()
    
    if (error) {
      console.error('Error updating maintenance:', error)
      return NextResponse.json({ error: 'Failed to update maintenance' }, { status: 500 })
    }
    
    // Handle parts usage when completing maintenance
    if (status === 'termine' && parts_used && parts_used.length > 0) {
      // Delete existing parts usage records
      const { error: deleteError } = await supabase
        .from('maintenance_parts_usage')
        .delete()
        .eq('maintenance_id', parseInt(id))
      
      if (deleteError) {
        console.error('Error deleting parts usage records:', deleteError)
      }
      
      // Create new parts usage records
      const partsInserts = parts_used.map((part: any) => ({
        maintenance_id: parseInt(id),
        article_id: part.article_id,
        region_id: part.region_id || 1,
        quantity_used: part.quantity_used
      }))
      
      const { error: partsError } = await supabase
        .from('maintenance_parts_usage')
        .insert(partsInserts)
      
      if (partsError) {
        console.error('Error creating parts usage records:', partsError)
      }
      
      // Update maintenance cost
      const totalCost = parts_used.reduce((sum: number, part: any) => sum + (part.quantity_used * part.unit_price), 0)
      
      const { data: updatedMaintenance } = await supabase
        .from('maintenance')
        .update({
          cout: totalCost
        })
        .eq('id', parseInt(id))
        .select()
        .single()
    }
    
    return NextResponse.json({ 
      message: 'Maintenance updated successfully',
      maintenance: maintenance 
    })
    
  } catch (error) {
    console.error('Error in maintenance PUT API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
