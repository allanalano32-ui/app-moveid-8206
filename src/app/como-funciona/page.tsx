import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Smartphone, Upload, BarChart3, Shield, Users, Star } from 'lucide-react'

export default function ComoFunciona() {
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
          Como funciona a análise
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
          Análise Biomecânica em 3 Passos Simples
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubra como nossa IA analisa seus movimentos e fornece feedback preciso para melhorar sua performance.
        </p>
      </section>

      {/* Processo */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
            </div>
            <CardHeader className="pt-8">
              <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Envie seu Vídeo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Grave ou faça upload de um vídeo de 5-15 segundos do seu exercício. 
                Certifique-se de que todo o corpo esteja visível.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
            </div>
            <CardHeader className="pt-8">
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>IA Analisa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Nossa inteligência artificial detecta pontos-chave do corpo, 
                calcula ângulos articulares e identifica padrões de movimento.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
            </div>
            <CardHeader className="pt-8">
              <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Receba Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Obtenha uma pontuação de 0-100, análise detalhada dos erros 
                e sugestões personalizadas para melhorar.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/analise">
              Testar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Recursos */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recursos Avançados
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detecção de Postura</h3>
              <p className="text-gray-600">
                Identifica desvios posturais e problemas de alinhamento corporal.
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Análise Angular</h3>
              <p className="text-gray-600">
                Mede ângulos articulares com precisão para otimizar movimentos.
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comparação</h3>
              <p className="text-gray-600">
                Compare seus movimentos com padrões ideais e atletas profissionais.
              </p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Evolução</h3>
              <p className="text-gray-600">
                Acompanhe seu progresso ao longo do tempo com relatórios detalhados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exercícios Suportados */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Exercícios Suportados
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Agachamento',
            'Levantamento Terra',
            'Supino',
            'Desenvolvimento',
            'Remada',
            'Flexão',
            'Burpee',
            'Prancha',
            'Corrida'
          ].map((exercise, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">{exercise}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Crie sua conta gratuita e faça sua primeira análise agora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cadastro">
                <Smartphone className="mr-2 h-5 w-5" />
                Criar Conta Grátis
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/planos">
                Ver Planos Premium
              </Link>
            </Button>
          </div>
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
            <Link href="/contato" className="hover:text-white">Contato</Link>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MoveID. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}