import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Interfaces
export interface HealthExam {
  id: number
  exam_type: string
  exam_date: string
  doctor_name: string
  clinic_name: string
  notes: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: number
  doctor_name: string
  specialty: string
  appointment_date: string
  clinic_name: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

export interface HealthMetric {
  id: number
  metric_type: string
  value: string
  unit: string
  recorded_date: string
  notes: string
  created_at: string
}

// Validação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validação mais rigorosa: verificar se URL é válida do Supabase
const isValidSupabaseUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')
const isValidSupabaseKey = supabaseAnonKey && supabaseAnonKey.length > 10 // chave típica tem mais de 10 chars

// Criar cliente apenas se as variáveis estiverem válidas
export const supabase = (isValidSupabaseUrl && isValidSupabaseKey)
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null

// Função para criar cliente Supabase (usada nas rotas API)
export const createClient = () => {
  if (!isValidSupabaseUrl || !isValidSupabaseKey) {
    console.warn('Supabase não configurado corretamente')
    return null
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Função helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabase && isValidSupabaseUrl && isValidSupabaseKey)
}

// Funções para criar registros
export const createHealthExam = async (examData: Omit<HealthExam, 'id' | 'created_at' | 'updated_at'>) => {
  if (!supabase) throw new Error('Supabase não configurado. Verifique se NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão corretos no arquivo .env.local.')
  const { data, error } = await supabase
    .from('health_exams')
    .insert(examData)
    .select()
    .single()
  if (error) throw error
  return data
}

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at'>) => {
  if (!supabase) throw new Error('Supabase não configurado. Verifique se NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão corretos no arquivo .env.local.')
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single()
  if (error) throw error
  return data
}

export const createHealthMetric = async (metricData: Omit<HealthMetric, 'id' | 'created_at'>) => {
  if (!supabase) throw new Error('Supabase não configurado. Verifique se NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão corretos no arquivo .env.local.')
  const { data, error } = await supabase
    .from('health_metrics')
    .insert(metricData)
    .select()
    .single()
  if (error) throw error
  return data
}
