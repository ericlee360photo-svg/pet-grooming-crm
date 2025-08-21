import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Client-side Supabase client
export const supabase = typeof window !== 'undefined' 
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side Supabase client (with service role key)
export const createServerSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createServerClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Legacy export for backward compatibility
export const createServerClient = createServerSupabaseClient

// Export createClient for API routes
export { createClient }

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          time_zone: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          time_zone?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          time_zone?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          org_id: string
          role: 'owner' | 'manager' | 'staff' | 'admin'
          email: string | null
          phone: string | null
          name: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          role?: 'owner' | 'manager' | 'staff' | 'admin'
          email?: string | null
          phone?: string | null
          name?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          role?: 'owner' | 'manager' | 'staff' | 'admin'
          email?: string | null
          phone?: string | null
          name?: string | null
          active?: boolean
          created_at?: string
        }
      }
      owners: {
        Row: {
          id: string
          org_id: string
          name: string
          email: string | null
          phone: string | null
          address: any | null
          notes: string | null
          risk_level: number
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: any | null
          notes?: string | null
          risk_level?: number
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: any | null
          notes?: string | null
          risk_level?: number
          created_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          org_id: string
          owner_id: string
          name: string
          species: string
          breed: string | null
          weight_kg: number | null
          coat_type: string | null
          sex: string | null
          birthdate: string | null
          behavior_flags: string[] | null
          notes: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          owner_id: string
          name: string
          species?: string
          breed?: string | null
          weight_kg?: number | null
          coat_type?: string | null
          sex?: string | null
          birthdate?: string | null
          behavior_flags?: string[] | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          owner_id?: string
          name?: string
          species?: string
          breed?: string | null
          weight_kg?: number | null
          coat_type?: string | null
          sex?: string | null
          birthdate?: string | null
          behavior_flags?: string[] | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          org_id: string
          owner_id: string | null
          start_at: string
          end_at: string
          status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          location: any | null
          notes: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          org_id: string
          owner_id?: string | null
          start_at: string
          end_at: string
          status?: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          location?: any | null
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          owner_id?: string | null
          start_at?: string
          end_at?: string
          status?: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          location?: any | null
          notes?: string | null
          created_by?: string | null
        }
      }
      appointment_pets: {
        Row: {
          appointment_id: string
          pet_id: string
          service_id: string | null
          add_on_ids: string[] | null
          price_cents: number | null
          minutes: number | null
        }
        Insert: {
          appointment_id: string
          pet_id: string
          service_id?: string | null
          add_on_ids?: string[] | null
          price_cents?: number | null
          minutes?: number | null
        }
        Update: {
          appointment_id?: string
          pet_id?: string
          service_id?: string | null
          add_on_ids?: string[] | null
          price_cents?: number | null
          minutes?: number | null
        }
      }
      services: {
        Row: {
          id: string
          org_id: string
          name: string
          base_price_cents: number
          base_minutes: number
          active: boolean
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          base_price_cents: number
          base_minutes: number
          active?: boolean
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          base_price_cents?: number
          base_minutes?: number
          active?: boolean
        }
      }
      add_ons: {
        Row: {
          id: string
          org_id: string
          name: string
          price_cents: number
          minutes: number
          active: boolean
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          price_cents: number
          minutes: number
          active?: boolean
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          price_cents?: number
          minutes?: number
          active?: boolean
        }
      }
      vaccinations: {
        Row: {
          id: string
          org_id: string
          pet_id: string
          vaccine_type_id: string | null
          administered_on: string | null
          expires_on: string | null
          source: string | null
          document_url: string | null
          status: 'VALID' | 'EXPIRING' | 'EXPIRED'
        }
        Insert: {
          id?: string
          org_id: string
          pet_id: string
          vaccine_type_id?: string | null
          administered_on?: string | null
          expires_on?: string | null
          source?: string | null
          document_url?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          pet_id?: string
          vaccine_type_id?: string | null
          administered_on?: string | null
          expires_on?: string | null
          source?: string | null
          document_url?: string | null
        }
      }
    }
  }
}
