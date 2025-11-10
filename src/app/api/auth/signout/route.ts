import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Verificar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas')
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Verifique as variáveis de ambiente.' },
        { status: 500 }
      )
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fazer logout no Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Erro no logout:', error)
      return NextResponse.json(
        { error: 'Erro ao fazer logout' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Logout realizado com sucesso!'
    })

  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}