import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface PersonalData {
  id: string
  user_id: string
  document_type: 'cpf' | 'rg' | 'passport'
  document_number: string
  address?: {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  emergency_contact?: {
    name: string
    phone: string
    relationship: string
  }
  medical_info?: {
    allergies: string[]
    medications: string[]
    conditions: string[]
  }
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  plan_type: 'basic' | 'premium' | 'pro'
  status: 'active' | 'canceled' | 'past_due'
  current_period_start?: string
  current_period_end?: string
  created_at: string
  updated_at: string
}

export interface ImageAnalysis {
  id: string
  user_id: string
  image_url: string
  analysis_result?: any
  analysis_type?: 'movement' | 'posture' | 'biomechanics'
  confidence_score?: number
  created_at: string
}