import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    // قراءة البيانات المستوردة من ملف JSON
    const filePath = path.join(process.cwd(), 'buses-data.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // تحويل البيانات لتتوافق مع هيكلية قاعدة البيانات MySQL
    const mysqlBuses = data.buses.map((bus: any, index: number) => ({
      id: parseInt(bus.id) || index + 1,
      bus_number: bus.id.toString(),
      license_plate: `BUS-${bus.id}`,
      type: bus.type === 'Bus' ? 'Bus' : 'MiniBus',
      status: bus.status === 'EnUsage' ? 'active' : 'maintenance',
      consumption: bus.consumption,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
    
    return NextResponse.json({ 
      message: 'Données chargées avec succès (simulation MySQL)',
      buses: mysqlBuses,
      total: mysqlBuses.length,
      active: mysqlBuses.filter((b: any) => b.status === 'active').length,
      maintenance: mysqlBuses.filter((b: any) => b.status === 'maintenance').length
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des bus:', error)
    
    // Données de test en cas d'erreur
    const testBuses = [
      { id: 1, bus_number: '1', license_plate: 'BUS-1', type: 'Bus', status: 'active', consumption: 8.5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 2, bus_number: '2', license_plate: 'BUS-2', type: 'MiniBus', status: 'maintenance', consumption: 6.2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 3, bus_number: '3', license_plate: 'BUS-3', type: 'Bus', status: 'active', consumption: 9.1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 4, bus_number: '4', license_plate: 'BUS-4', type: 'MiniBus', status: 'active', consumption: 7.3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 5, bus_number: '5', license_plate: 'BUS-5', type: 'Bus', status: 'maintenance', consumption: 8.8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ]
    
    return NextResponse.json({ 
      message: 'Utilisation des données de test',
      buses: testBuses,
      total: testBuses.length,
      active: testBuses.filter(b => b.status === 'active').length,
      maintenance: testBuses.filter(b => b.status === 'maintenance').length
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // محاكاة بيانات جديدة
    const newBus = {
      id: body.id,
      bus_number: body.id.toString(),
      license_plate: `BUS-${body.id}`,
      type: body.type === 'Bus' ? 'Bus' : 'MiniBus',
      status: body.status || 'active',
      consumption: body.consumption,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // في الواقع، سنقوم فقط بإرجاع البيانات
    const filePath = path.join(process.cwd(), 'buses-data.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    // إضافة الحافلة الجديدة
    data.buses.push(newBus)
    
    // حفظ الملف المحدث
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    
    return NextResponse.json({ 
      message: 'Bus ajouté avec succès (simulation)',
      bus: newBus
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout du bus:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du bus' },
      { status: 500 }
    )
  }
}
