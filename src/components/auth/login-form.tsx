'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error('E-mail é obrigatório')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('E-mail inválido')
      return false
    }
    if (!formData.password) {
      toast.error('Senha é obrigatória')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      toast.success('Login realizado com sucesso!')
      
      // Salvar dados do usuário no localStorage se lembrar
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Limpar formulário
      setFormData({
        email: '',
        password: ''
      })

      // Callback de sucesso ou redirecionamento
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/analise')
      }

    } catch (error) {
      console.error('Erro no login:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className=\"space-y-4\">
      <div>
        <Label htmlFor=\"email\">E-mail</Label>
        <div className=\"relative\">
          <Mail className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />
          <Input
            id=\"email\"
            name=\"email\"
            type=\"email\"
            placeholder=\"seu@email.com\"
            className=\"pl-10\"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor=\"password\">Senha</Label>
        <div className=\"relative\">
          <Lock className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />
          <Input
            id=\"password\"
            name=\"password\"
            type={showPassword ? 'text' : 'password'}
            placeholder=\"••••••••\"
            className=\"pl-10 pr-10\"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          <button
            type=\"button\"
            className=\"absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer\"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div className=\"flex items-center justify-between\">
        <label className=\"flex items-center space-x-2 text-sm\">
          <input 
            type=\"checkbox\" 
            className=\"rounded\" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <span>Lembrar-me</span>
        </label>
        <Link href=\"/recuperar-senha\" className=\"text-sm text-blue-600 hover:underline\">
          Esqueceu a senha?
        </Link>
      </div>

      <Button 
        type=\"submit\" 
        className=\"w-full bg-blue-600 hover:bg-blue-700\" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" />
            Entrando...
          </>
        ) : (
          <>
            <LogIn className=\"mr-2 h-4 w-4\" />
            Entrar
          </>
        )}
      </Button>
    </form>
  )
}"