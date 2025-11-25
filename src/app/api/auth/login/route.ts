import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase não está configurado. Configure as variáveis de ambiente.' },
        { status: 500 }
      )
    }

    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

    // Fazer login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.error('Erro ao fazer login:', authError)
      return NextResponse.json(
        { error: authError.message || 'E-mail ou senha incorretos' },
        { status: 401 }
      )
    }

    // Verificar se o usuário foi autenticado
    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: 'Erro ao autenticar usuário' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: authData.user.user_metadata?.first_name,
        lastName: authData.user.user_metadata?.last_name
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}