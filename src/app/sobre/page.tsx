import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Target, Award, Heart } from 'lucide-react'

export default function SobrePage() {
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
        <Button variant="outline" asChild>
          <Link href="/">Voltar</Link>
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Sobre o MoveID
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Somos uma empresa dedicada a revolucionar a análise de movimento através da inteligência artificial, 
          ajudando pessoas a melhorarem sua performance física e prevenirem lesões.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Democratizar a análise biomecânica profissional, tornando-a acessível 
                  para todos através de tecnologia de ponta.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Nossa Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ser a plataforma líder mundial em análise de movimento por IA, 
                  ajudando milhões a se moverem melhor.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Nossos Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Privacidade, precisão, simplicidade e compromisso com a saúde 
                  e bem-estar de nossos usuários.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Nossa Equipe
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Equipe de IA</h3>
            <p className="text-gray-600">
              Especialistas em machine learning e visão computacional
            </p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Target className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Biomecânicos</h3>
            <p className="text-gray-600">
              Profissionais da saúde e educação física
            </p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Award className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Desenvolvedores</h3>
            <p className="text-gray-600">
              Engenheiros focados em experiência do usuário
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Junte-se à Revolução do Movimento
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Faça parte da comunidade que está transformando a forma como analisamos o movimento humano.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/planos">
              Começar Agora
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}