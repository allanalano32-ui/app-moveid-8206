import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Shield, BarChart3, Users } from 'lucide-react'

export default function Planos() {
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
          Escolha seu plano
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Planos para Todos os Níveis
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Comece gratuitamente ou escolha um plano premium para análises ilimitadas e recursos avançados.
        </p>
      </section>

      {/* Planos */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plano Gratuito */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Gratuito</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 0
                <span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              <CardDescription>
                Perfeito para começar e testar a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>5 análises por mês</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Análise básica de postura</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Pontuação de 0-100</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Histórico de 30 dias</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Suporte por email</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/cadastro">Começar Grátis</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="relative border-2 border-blue-600 shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600">Mais Popular</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 29
                <span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              <CardDescription>
                Para atletas e entusiastas do fitness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Análises ilimitadas</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Análise avançada completa</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Comparação com atletas</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Relatórios detalhados</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Histórico completo</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Exportar dados</span>
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/cadastro">Assinar Premium</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Plano Pro */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                R$ 79
                <span className="text-lg font-normal text-gray-600">/mês</span>
              </div>
              <CardDescription>
                Para profissionais e academias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Tudo do Premium</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>API para integração</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Dashboard para equipes</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Análise em lote</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Relatórios customizados</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Suporte 24/7</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-3" />
                  <span>Treinamento personalizado</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/contato">Falar com Vendas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recursos por Plano */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compare os Recursos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6">Recurso</th>
                  <th className="text-center py-4 px-6">Gratuito</th>
                  <th className="text-center py-4 px-6">Premium</th>
                  <th className="text-center py-4 px-6">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 px-6 font-medium">Análises por mês</td>
                  <td className="text-center py-4 px-6">5</td>
                  <td className="text-center py-4 px-6">Ilimitadas</td>
                  <td className="text-center py-4 px-6">Ilimitadas</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Análise de postura</td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Comparação com atletas</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">API de integração</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium">Dashboard para equipes</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6">-</td>
                  <td className="text-center py-4 px-6"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Perguntas Frequentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento e você manterá acesso até o final do período pago.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Como funciona o período de teste?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                O plano gratuito não tem limite de tempo. Você pode usar para sempre com as limitações do plano. Para planos pagos, oferecemos 7 dias de teste grátis.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posso fazer upgrade do meu plano?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Escolha o plano ideal para você e comece a melhorar seus movimentos hoje.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/cadastro">
              Começar Agora
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