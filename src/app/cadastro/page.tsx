import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'

export default function Cadastro() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Cadastro */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MoveID</span>
            </Link>
            <CardTitle className="text-2xl">Criar sua conta</CardTitle>
            <CardDescription>
              Junte-se ao MoveID e comece a analisar seus movimentos hoje mesmo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Seu nome"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Seu sobrenome"
                      className="pl-10"
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
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />
                  <EyeOff className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />
                  <EyeOff className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded" />
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

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Criar Conta
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C21.138 20.161 25 16.418 25 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Apple
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vídeo Demonstrativo */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Como criar sua conta</CardTitle>
            <CardDescription>
              Assista ao vídeo rápido e veja como é fácil começar a usar o MoveID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Vídeo demonstrativo - Como criar conta no MoveID"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-medium">Preencha seus dados</h4>
                  <p className="text-sm text-gray-600">Nome, e-mail e senha para criar sua conta</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-medium">Confirme seu e-mail</h4>
                  <p className="text-sm text-gray-600">Verifique seu e-mail para ativar a conta</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-medium">Comece a analisar</h4>
                  <p className="text-sm text-gray-600">Faça upload de vídeos e veja a análise em tempo real</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}