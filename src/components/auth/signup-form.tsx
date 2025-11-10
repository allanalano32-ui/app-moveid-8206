'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('Nome é obrigatório')
      return false
    }
    if (!formData.lastName.trim()) {
      toast.error('Sobrenome é obrigatório')
      return false
    }
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
    if (formData.password.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Senhas não coincidem')
      return false
    }
    if (!acceptedTerms) {
      toast.error('Você deve aceitar os termos de uso')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar.')
      
      // Limpar formulário
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      })
      setAcceptedTerms(false)

      // Callback de sucesso ou redirecionamento
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/login?message=Conta criada com sucesso! Faça login.')
      }

    } catch (error) {
      console.error('Erro no cadastro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nome</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Seu nome"
              className="pl-10"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="lastName">Sobrenome</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Seu sobrenome"
              className="pl-10"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            className="pl-10"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="terms" 
          className="rounded" 
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          disabled={isLoading}
        />
        <label htmlFor="terms" className="text-sm">
          Aceito os{' '}
          <Link href="/termos" className="text-blue-600 hover:underline">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/privacidade" className="text-blue-600 hover:underline">
            Política de Privacidade
          </Link>
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Criar Conta
          </>
        )}
      </Button>
    </form>
  )
}