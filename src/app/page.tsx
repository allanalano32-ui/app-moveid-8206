import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Upload, BarChart3, Shield, Smartphone, Zap, FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-gray-900">MoveID</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors" prefetch={false}>
            Como Funciona
          </Link>
          <Link href="/relatorios" className="text-gray-600 hover:text-blue-600 transition-colors" prefetch={false}>
            Relatórios
          </Link>
          <Link href="/planos" className="text-gray-600 hover:text-blue-600 transition-colors" prefetch={false}>
            Planos
          </Link>
          <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors" prefetch={false}>
            FAQ
          </Link>
          <Link href="/contato" className="text-gray-600 hover:text-blue-600 transition-colors" prefetch={false}>
            Contato
          </Link>
        </nav>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/login" prefetch={false}>Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/planos" prefetch={false}>Assinar Premium</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          IA que entende seu movimento
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
          Análise Biomecânica Inteligente para Melhoria do Movimento
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Grave um vídeo curto do seu exercício e receba feedback técnico preciso com IA avançada.
          Corrija sua postura e maximize seus resultados.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/analise" prefetch={false}>
              <Smartphone className="mr-2 h-5 w-5" />
              Começar Análise
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/relatorios" prefetch={false}>
              <FileText className="mr-2 h-5 w-5" />
              Ver Relatório Demo
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Como o MoveID Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Play className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>1. Grave ou Envie</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Capture um vídeo de 5-10 segundos do seu movimento ou faça upload diretamente no app.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>2. IA Analisa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Nossa IA detecta ângulos articulares, postura e erros biomecânicos em tempo real.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>3. Receba Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtenha uma nota de 0-100 e dicas personalizadas para melhorar sua técnica.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher o MoveID?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacidade LGPD</h3>
              <p className="text-gray-600">
                Seus vídeos são processados com total segurança e você controla o armazenamento.
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Análise Rápida</h3>
              <p className="text-gray-600">
                Resultados em menos de 10 segundos com IA de ponta.
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Histórico Completo</h3>
              <p className="text-gray-600">
                Acompanhe sua evolução com relatórios detalhados e gráficos.
              </p>
            </div>
            <div className="text-center">
              <Smartphone className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">App e Web</h3>
              <p className="text-gray-600">
                Disponível para mobile e web, sincronize seus dados em qualquer lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Section - Relatórios */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Relatórios Completos e Detalhados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Receba análises biomecânicas profissionais em PDF com métricas precisas, 
            recomendações personalizadas e guias completos de vestimenta e gravação.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Análise Detalhada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Métricas biomecânicas precisas com ângulos articulares, fases do movimento e interpretação profissional.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dicas personalizadas baseadas na sua análise para corrigir erros e melhorar a técnica de movimento.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Smartphone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Guias Práticos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instruções completas sobre vestimenta adequada e técnicas de gravação para máxima precisão.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/relatorios" prefetch={false}>
              <FileText className="mr-2 h-5 w-5" />
              Ver Exemplo de Relatório
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Pronto para melhorar seus movimentos?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Comece gratuitamente e evolua com o plano premium.
        </p>
        <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/planos" prefetch={false}>
            Ver Planos
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold">MoveID</span>
              </div>
              <p className="text-gray-400">
                IA que entende seu movimento para resultados reais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/como-funciona" className="hover:text-white" prefetch={false}>Como Funciona</Link></li>
                <li><Link href="/relatorios" className="hover:text-white" prefetch={false}>Relatórios</Link></li>
                <li><Link href="/planos" className="hover:text-white" prefetch={false}>Planos</Link></li>
                <li><Link href="/analise" className="hover:text-white" prefetch={false}>Análise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white" prefetch={false}>FAQ</Link></li>
                <li><Link href="/contato" className="hover:text-white" prefetch={false}>Contato</Link></li>
                <li><Link href="/privacidade" className="hover:text-white" prefetch={false}>Privacidade</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/sobre" className="hover:text-white" prefetch={false}>Sobre Nós</Link></li>
                <li><Link href="/termos" className="hover:text-white" prefetch={false}>Termos de Uso</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MoveID. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}