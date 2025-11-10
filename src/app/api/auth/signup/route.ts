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

    const { email, password, firstName, lastName, phone } = await request.json()

    // Validação básica
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    // Validação de senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          phone: phone || null
        }
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário:', authError)
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este e-mail já está cadastrado' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Erro ao criar conta. Tente novamente.' },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 400 }
      )
    }

    // Inserir dados adicionais na tabela users (se existir)
    try {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: `${firstName} ${lastName}`,
          phone: phone || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.warn('Erro ao inserir dados adicionais do usuário:', insertError)
        // Não retorna erro pois o usuário foi criado com sucesso no Auth
      }
    } catch (insertError) {
      console.warn('Tabela users pode não existir ainda:', insertError)
    }

    return NextResponse.json({
      message: 'Conta criada com sucesso! Verifique seu e-mail para confirmar.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: `${firstName} ${lastName}`,
        phone: phone || null
      }
    })

  } catch (error) {
    console.error('Erro ao criar conta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}