import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react'

export default function Contato() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-gray-900">MoveID</span>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/cadastro">Criar Conta</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          <MessageCircle className="w-4 h-4 mr-2" />
          Fale Conosco
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Entre em Contato
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Tem dúvidas, sugestões ou precisa de ajuda? Nossa equipe está pronta para atender você.
        </p>
      </section>

      {/* Contato */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e retornaremos em até 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" placeholder="Seu sobrenome" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input id="phone" type="tel" placeholder="(11) 99999-9999" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Selecione um assunto</option>
                    <option value="suporte">Suporte Técnico</option>
                    <option value="vendas">Vendas e Planos</option>
                    <option value="parceria">Parcerias</option>
                    <option value="feedback">Feedback</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Descreva sua dúvida ou solicitação..."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações de Contato</CardTitle>
                <CardDescription>
                  Outras formas de entrar em contato conosco
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">E-mail</h3>
                    <p className="text-gray-600">suporte@moveid.com</p>
                    <p className="text-sm text-gray-500">Resposta em até 24h</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Telefone</h3>
                    <p className="text-gray-600">(11) 99999-9999</p>
                    <p className="text-sm text-gray-500">Seg-Sex: 9h às 18h</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-gray-600">São Paulo, SP</p>
                    <p className="text-sm text-gray-500">Brasil</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Segunda - Sexta</span>
                    <span className="font-semibold">9h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sábado</span>
                    <span className="font-semibold">9h às 14h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domingo</span>
                    <span className="text-gray-500">Fechado</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Clientes Premium e Pro:</strong> Suporte prioritário com resposta mais rápida
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">FAQ</CardTitle>
                <CardDescription>
                  Antes de entrar em contato, veja se sua dúvida já foi respondida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faq">
                    Ver Perguntas Frequentes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tipos de Suporte */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como Podemos Ajudar?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Suporte Técnico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Problemas com upload, análise ou funcionalidades do app
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Badge className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Dúvidas sobre planos, preços e funcionalidades premium
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Parcerias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Oportunidades de negócio, integração e colaboração
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Sugestões, críticas e ideias para melhorar o MoveID
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ainda não tem uma conta?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Crie sua conta gratuita e comece a analisar seus movimentos hoje.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/cadastro">
              Criar Conta Grátis
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold">MoveID</span>
          </div>
          <p className="text-gray-400 mb-4">
            IA que entende seu movimento para resultados reais.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
            <Link href="/termos" className="hover:text-white">Termos</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MoveID. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}