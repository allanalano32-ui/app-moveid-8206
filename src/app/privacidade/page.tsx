import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Privacidade() {
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
            Privacidade e LGPD
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Política de Privacidade
          </h1>
          <p className="text-gray-600 mb-8">
            Última atualização: Janeiro de 2024
          </p>

          <div className="prose prose-lg max-w-none">
            <h2>1. Compromisso com sua Privacidade</h2>
            <p>
              No MoveID, levamos sua privacidade muito a sério. Esta política descreve como coletamos,
              usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a LGPD
              (Lei Geral de Proteção de Dados).
            </p>

            <h2>2. Informações que Coletamos</h2>
            <h3>2.1 Informações Fornecidas por Você</h3>
            <ul>
              <li>Nome e informações de contato (e-mail, telefone)</li>
              <li>Dados de conta e preferências</li>
              <li>Vídeos de exercícios (com seu consentimento explícito)</li>
            </ul>

            <h3>2.2 Informações Coletadas Automaticamente</h3>
            <ul>
              <li>Dados de uso do aplicativo</li>
              <li>Informações do dispositivo (tipo, sistema operacional)</li>
              <li>Métricas de performance anônimas</li>
            </ul>

            <h2>3. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul>
              <li>Fornecer e melhorar nossos serviços de análise de movimento</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar comunicações importantes sobre sua conta</li>
              <li>Melhorar a experiência do usuário com base em dados agregados</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2>4. Processamento de Vídeos</h2>
            <p>
              Seus vídeos são processados com máxima segurança. Oferecemos opções de processamento local
              (no dispositivo) sempre que possível, minimizando a transmissão de dados. Quando necessário,
              os vídeos são criptografados durante transmissão e processamento.
            </p>

            <h2>5. Compartilhamento de Dados</h2>
            <p>
              Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar dados apenas:
            </p>
            <ul>
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Com provedores de serviços essenciais (pagamentos, armazenamento)</li>
              <li>Em forma agregada e anônima para análise estatística</li>
            </ul>

            <h2>6. Seus Direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul>
              <li><strong>Confirmação:</strong> Saber se processamos seus dados</li>
              <li><strong>Acesso:</strong> Obter cópia dos dados que mantemos</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos</li>
              <li><strong>Exclusão:</strong> Solicitar exclusão de seus dados ("direito ao esquecimento")</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Oposição:</strong> Se opor ao processamento em certas circunstâncias</li>
            </ul>

            <h2>7. Controle sobre seus Vídeos</h2>
            <p>
              Você tem controle total sobre seus vídeos:
            </p>
            <ul>
              <li>Pode optar por não armazenar vídeos (apenas processar)</li>
              <li>Pode excluir vídeos e dados a qualquer momento</li>
              <li>Recebe consentimento explícito antes de qualquer processamento</li>
            </ul>

            <h2>8. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais apropriadas, incluindo:
            </p>
            <ul>
              <li>Criptografia de dados em trânsito e repouso</li>
              <li>Controles de acesso rigorosos</li>
              <li>Auditorias regulares de segurança</li>
              <li>Backup seguro e recuperação de desastres</li>
            </ul>

            <h2>9. Retenção de Dados</h2>
            <p>
              Mantemos seus dados apenas pelo tempo necessário para fornecer nossos serviços ou cumprir
              obrigações legais. Dados de conta são mantidos enquanto sua conta estiver ativa, e vídeos
              são excluídos automaticamente após períodos definidos, a menos que você solicite retenção.
            </p>

            <h2>10. Cookies e Tecnologias Similares</h2>
            <p>
              Usamos cookies e tecnologias similares para melhorar sua experiência, lembrar suas preferências
              e analisar o uso do site. Você pode controlar cookies através das configurações do seu navegador.
            </p>

            <h2>11. Menores de Idade</h2>
            <p>
              Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente
              dados de menores sem consentimento parental.
            </p>

            <h2>12. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas
              através do aplicativo ou e-mail. O uso continuado constitui aceitação das atualizações.
            </p>

            <h2>13. Contato sobre Privacidade</h2>
            <p>
              Para exercer seus direitos ou fazer perguntas sobre privacidade, entre em contato:
            </p>
            <ul>
              <li><strong>E-mail:</strong> privacidade@moveid.com</li>
              <li><strong>Encarregado de Dados:</strong> DPO@moveid.com</li>
              <li><strong>Prazo de resposta:</strong> Até 15 dias úteis</li>
            </ul>

            <h2>14. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
            <p>
              Você tem o direito de apresentar reclamações diretamente à ANPD caso considere que seus
              direitos não foram atendidos adequadamente.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}