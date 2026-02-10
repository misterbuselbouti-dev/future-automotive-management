import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fjqjtwzqdsxhxdxfqzdu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcWp0d3pxZHN4aHhkeGZxemR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTM3NzksImV4cCI6MjA1NDAyOTc3OX0.VG3fN8f6zGZyKlYxL5w2Jq9Y8t7K3m9N2zX1V4W6r8'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions for database operations
export const supabaseClient = {
  // Bus operations
  buses: {
    getAll: () => supabase.from('buses').select('*'),
    getById: (id: string) => supabase.from('buses').select('*').eq('id', id).single(),
    create: (data: any) => supabase.from('buses').insert(data),
    update: (id: string, data: any) => supabase.from('buses').update(data).eq('id', id),
    delete: (id: string) => supabase.from('buses').delete().eq('id', id),
  },
  
  // Article operations
  articles: {
    getAll: () => supabase.from('articles').select('*'),
    getById: (id: string) => supabase.from('articles').select('*').eq('id', id).single(),
    create: (data: any) => supabase.from('articles').insert(data),
    update: (id: string, data: any) => supabase.from('articles').update(data).eq('id', id),
    delete: (id: string) => supabase.from('articles').delete().eq('id', id),
  },
  
  // Fournisseur operations
  fournisseurs: {
    getAll: () => supabase.from('fournisseurs').select('*'),
    getById: (id: string) => supabase.from('fournisseurs').select('*').eq('id', id).single(),
    create: (data: any) => supabase.from('fournisseurs').insert(data),
    update: (id: string, data: any) => supabase.from('fournisseurs').update(data).eq('id', id),
    delete: (id: string) => supabase.from('fournisseurs').delete().eq('id', id),
  },
  
  // Demande Achat operations
  demandesAchat: {
    getAll: () => supabase.from('demandes_achat').select('*'),
    getById: (id: string) => supabase.from('demandes_achat').select('*').eq('id', id).single(),
    create: (data: any) => supabase.from('demandes_achat').insert(data),
    update: (id: string, data: any) => supabase.from('demandes_achat').update(data).eq('id', id),
    delete: (id: string) => supabase.from('demandes_achat').delete().eq('id', id),
  }
}

export default supabase
