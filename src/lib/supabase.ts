import { createClient } from '@supabase/supabase-js'

// Validação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as variáveis estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Função helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Funções para criar registros
export const createHealthExam = async (examData: Omit<HealthExam, 'id' | 'created_at' | 'updated_at'>) => {
  if (!supabase) throw new Error('Supabase não configurado')
  const { data, error } = await supabase
    .from('health_exams')
    .insert(examData)
    .select()
    .single()
  if (error) throw error
  return data
}

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at'>) => {
  if (!supabase) throw new Error('Supabase não configurado')
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single()
  if (error) throw error
  return data
}

export const createHealthMetric = async (metricData: Omit<HealthMetric, 'id' | 'created_at'>) => {
  if (!supabase) throw new Error('Supabase não configurado')
  const { data, error } = await supabase
    .from('health_metrics')
    .insert(metricData)
    .select()
    .single()
  if (error) throw error
  return data
}