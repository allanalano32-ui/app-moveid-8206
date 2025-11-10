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
    <form onSubmit={handleSubmit} className=\"space-y-4\">
      <div className=\"grid grid-cols-2 gap-4\">
        <div>
          <Label htmlFor=\"firstName\">Nome</Label>\n          <div className=\"relative\">\n            <User className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />\n            <Input\n              id=\"firstName\"\n              name=\"firstName\"\n              type=\"text\"\n              placeholder=\"Seu nome\"\n              className=\"pl-10\"\n              value={formData.firstName}\n              onChange={handleInputChange}\n              disabled={isLoading}\n              required\n            />\n          </div>\n        </div>\n        <div>\n          <Label htmlFor=\"lastName\">Sobrenome</Label>\n          <div className=\"relative\">\n            <User className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />\n            <Input\n              id=\"lastName\"\n              name=\"lastName\"\n              type=\"text\"\n              placeholder=\"Seu sobrenome\"\n              className=\"pl-10\"\n              value={formData.lastName}\n              onChange={handleInputChange}\n              disabled={isLoading}\n              required\n            />\n          </div>\n        </div>\n      </div>\n\n      <div>\n        <Label htmlFor=\"email\">E-mail</Label>\n        <div className=\"relative\">\n          <Mail className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />\n          <Input\n            id=\"email\"\n            name=\"email\"\n            type=\"email\"\n            placeholder=\"seu@email.com\"\n            className=\"pl-10\"\n            value={formData.email}\n            onChange={handleInputChange}\n            disabled={isLoading}\n            required\n          />\n        </div>\n      </div>\n\n      <div>\n        <Label htmlFor=\"phone\">Telefone (opcional)</Label>\n        <div className=\"relative\">\n          <Phone className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />\n          <Input\n            id=\"phone\"\n            name=\"phone\"\n            type=\"tel\"\n            placeholder=\"(11) 99999-9999\"\n            className=\"pl-10\"\n            value={formData.phone}\n            onChange={handleInputChange}\n            disabled={isLoading}\n          />\n        </div>\n      </div>\n\n      <div>\n        <Label htmlFor=\"password\">Senha</Label>\n        <div className=\"relative\">\n          <Lock className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />\n          <Input\n            id=\"password\"\n            name=\"password\"\n            type={showPassword ? 'text' : 'password'}\n            placeholder=\"••••••••\"\n            className=\"pl-10 pr-10\"\n            value={formData.password}\n            onChange={handleInputChange}\n            disabled={isLoading}\n            required\n          />\n          <button\n            type=\"button\"\n            className=\"absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer\"\n            onClick={() => setShowPassword(!showPassword)}\n          >\n            {showPassword ? <EyeOff /> : <Eye />}\n          </button>\n        </div>\n      </div>\n\n      <div>\n        <Label htmlFor=\"confirmPassword\">Confirmar Senha</Label>\n        <div className=\"relative\">\n          <Lock className=\"absolute left-3 top-3 h-4 w-4 text-gray-400\" />\n          <Input\n            id=\"confirmPassword\"\n            name=\"confirmPassword\"\n            type={showConfirmPassword ? 'text' : 'password'}\n            placeholder=\"••••••••\"\n            className=\"pl-10 pr-10\"\n            value={formData.confirmPassword}\n            onChange={handleInputChange}\n            disabled={isLoading}\n            required\n          />\n          <button\n            type=\"button\"\n            className=\"absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer\"\n            onClick={() => setShowConfirmPassword(!showConfirmPassword)}\n          >\n            {showConfirmPassword ? <EyeOff /> : <Eye />}\n          </button>\n        </div>\n      </div>\n\n      <div className=\"flex items-center space-x-2\">\n        <input \n          type=\"checkbox\" \n          id=\"terms\" \n          className=\"rounded\" \n          checked={acceptedTerms}\n          onChange={(e) => setAcceptedTerms(e.target.checked)}\n          disabled={isLoading}\n        />\n        <label htmlFor=\"terms\" className=\"text-sm\">\n          Aceito os{' '}\n          <Link href=\"/termos\" className=\"text-blue-600 hover:underline\">\n            Termos de Uso\n          </Link>{' '}\n          e{' '}\n          <Link href=\"/privacidade\" className=\"text-blue-600 hover:underline\">\n            Política de Privacidade\n          </Link>\n        </label>\n      </div>\n\n      <Button \n        type=\"submit\" \n        className=\"w-full bg-blue-600 hover:bg-blue-700\" \n        disabled={isLoading}\n      >\n        {isLoading ? (\n          <>\n            <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" />\n            Criando conta...\n          </>\n        ) : (\n          <>\n            <UserPlus className=\"mr-2 h-4 w-4\" />\n            Criar Conta\n          </>\n        )}\n      </Button>\n    </form>\n  )\n}"