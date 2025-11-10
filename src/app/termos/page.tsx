import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Termos() {
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
        <nav className="hidden md:flex space-x-6">
          <Link href="/como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">
            Como Funciona
          </Link>
          <Link href="/planos" className="text-gray-600 hover:text-blue-600 transition-colors">
            Planos
          </Link>
          <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
            FAQ
          </Link>
          <Link href="/contato" className="text-gray-600 hover:text-blue-600 transition-colors">
            Contato
          </Link>
        </nav>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/planos">Assinar Premium</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Jurídico
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Termos de Uso
          </h1>
          <p className="text-gray-600 mb-8">
            Última atualização: Janeiro de 2024
          </p>

          <div className="prose prose-lg max-w-none">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o MoveID, você concorda em cumprir e estar vinculado a estes Termos de Uso.
              Se você não concordar com estes termos, por favor, não use nosso serviço.
            </p>

            <h2>2. Descrição do Serviço</h2>
            <p>
              O MoveID é uma plataforma de análise biomecânica que utiliza inteligência artificial para analisar
              vídeos de exercícios físicos e fornecer feedback técnico sobre a execução dos movimentos.
            </p>

            <h2>3. Uso Aceitável</h2>
            <p>Você concorda em usar o MoveID apenas para fins legais e de acordo com estes termos. Você não deve:</p>
            <ul>
              <li>Usar o serviço para qualquer atividade ilegal ou não autorizada</li>
              <li>Tentar acessar áreas restritas do sistema</li>
              <li>Compartilhar sua conta com terceiros</li>
              <li>Fazer upload de conteúdo que viole direitos de terceiros</li>
            </ul>

            <h2>4. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo, funcionalidades e tecnologia do MoveID são propriedade da empresa ou de seus licenciadores
              e estão protegidos por leis de direitos autorais e propriedade intelectual.
            </p>

            <h2>5. Privacidade e Dados</h2>
            <p>
              Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para entender como
              coletamos, usamos e protegemos suas informações pessoais.
            </p>

            <h2>6. Limitação de Responsabilidade</h2>
            <p>
              O MoveID fornece informações gerais sobre análise de movimento, mas não substitui aconselhamento
              médico profissional. Use o serviço por sua própria conta e risco.
            </p>

            <h2>7. Modificações dos Termos</h2>
            <p>
              Podemos atualizar estes termos periodicamente. Continuar usando o serviço após mudanças constitui
              aceitação dos novos termos.
            </p>

            <h2>8. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes termos, entre em contato conosco através do e-mail suporte@moveid.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}