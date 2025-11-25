import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Função para criar cliente admin com service role
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password } = body

    // Validação básica
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
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

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          full_name: `${firstName} ${lastName}`
        }
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário no Supabase:', authError)
      return NextResponse.json(
        { error: authError.message || 'Erro ao criar conta' },
        { status: 400 }
      )
    }

    // Verificar se o usuário foi criado
    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    // Confirmar automaticamente o usuário usando service role
    try {
      const adminClient = createAdminClient()
      const { error: confirmError } = await adminClient.auth.admin.updateUserById(
        authData.user.id,
        { email_confirm: true }
      )

      if (confirmError) {
        console.warn('Aviso: Não foi possível confirmar automaticamente o email:', confirmError.message)
        // Não retornar erro, pois o usuário foi criado
      }
    } catch (confirmErr) {
      console.warn('Erro ao confirmar usuário:', confirmErr)
    }

    // Tentar inserir dados adicionais na tabela de perfis (se existir)
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          created_at: new Date().toISOString()
        })

      if (profileError) {
        console.warn('Aviso: Não foi possível criar perfil:', profileError.message)
        // Não retornar erro aqui, pois o usuário foi criado com sucesso
      }
    } catch (profileErr) {
      console.warn('Tabela profiles pode não existir:', profileErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Você pode fazer login agora.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName,
        lastName
      }
    })

  } catch (error) {
    console.error('Erro no cadastro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}