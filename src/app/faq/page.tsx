import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react'

export default function FAQ() {
  const faqs = [
    {
      question: "Como funciona a análise biomecânica?",
      answer: "Nossa IA utiliza visão computacional para detectar pontos-chave do corpo humano em movimento. Analisamos ângulos articulares, postura, simetria e padrões de movimento para fornecer feedback preciso sobre sua técnica."
    },
    {
      question: "Que tipos de exercícios posso analisar?",
      answer: "Suportamos uma ampla gama de exercícios incluindo agachamento, levantamento terra, supino, desenvolvimento, remada, flexões, burpees, pranchas e movimentos de corrida. Estamos constantemente adicionando novos exercícios."
    },
    {
      question: "Preciso de equipamentos especiais?",
      answer: "Não! Você só precisa de um smartphone ou câmera para gravar seus exercícios. Recomendamos boa iluminação e enquadramento completo do corpo para melhores resultados."
    },
    {
      question: "Como é calculada a pontuação?",
      answer: "A pontuação de 0-100 é baseada em múltiplos fatores: alinhamento postural, ângulos articulares ideais, simetria de movimento, timing e fluidez. Comparamos com padrões biomecânicos estabelecidos."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim! Seguimos rigorosamente a LGPD. Seus vídeos são processados de forma segura e você tem controle total sobre seus dados. Não compartilhamos informações pessoais com terceiros."
    },
    {
      question: "Posso usar em qualquer lugar?",
      answer: "Sim! O MoveID funciona tanto no navegador web quanto em dispositivos móveis. Você pode analisar seus movimentos em casa, na academia ou em qualquer lugar."
    },
    {
      question: "Qual a diferença entre os planos?",
      answer: "O plano gratuito oferece 5 análises mensais com recursos básicos. O Premium inclui análises ilimitadas, comparações com atletas e relatórios detalhados. O Pro adiciona API, dashboard para equipes e suporte 24/7."
    },
    {
      question: "Como cancelo minha assinatura?",
      answer: "Você pode cancelar a qualquer momento nas configurações da sua conta. Não há taxas de cancelamento e você manterá acesso até o final do período pago."
    },
    {
      question: "A análise é precisa?",
      answer: "Nossa IA foi treinada com milhares de movimentos e validada por profissionais de educação física. A precisão é alta, mas recomendamos usar como ferramenta complementar ao acompanhamento profissional."
    },
    {
      question: "Funciona para reabilitação?",
      answer: "O MoveID pode ser útil para acompanhar progresso em reabilitação, mas sempre consulte seu fisioterapeuta ou médico. Nossa ferramenta é educacional e não substitui orientação médica profissional."
    }
  ]

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
          <HelpCircle className="w-4 h-4 mr-2" />
          Central de Ajuda
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Perguntas Frequentes
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre o MoveID e nossa tecnologia de análise biomecânica.
        </p>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <CardTitle className="text-left text-lg font-semibold">
                      {faq.question}
                    </CardTitle>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Categorias de Ajuda */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Outras Formas de Ajuda
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Chat ao Vivo</CardTitle>
                <CardDescription>
                  Converse com nossa equipe de suporte em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/contato">Iniciar Chat</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Suporte por Email</CardTitle>
                <CardDescription>
                  Envie sua dúvida e receba resposta em até 24h
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="mailto:suporte@moveid.com">Enviar Email</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Suporte Telefônico</CardTitle>
                <CardDescription>
                  Fale diretamente com nossos especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="tel:+5511999999999">(11) 99999-9999</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dicas Rápidas */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Dicas para Melhores Resultados
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📹 Gravação do Vídeo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Use boa iluminação natural ou artificial</li>
                <li>• Mantenha o corpo inteiro no enquadramento</li>
                <li>• Grave de lado para exercícios como agachamento</li>
                <li>• Mantenha a câmera estável</li>
                <li>• Vídeos de 5-15 segundos são ideais</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Análise Precisa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Use roupas que não escondam as articulações</li>
                <li>• Execute o movimento de forma natural</li>
                <li>• Evite fundos muito bagunçados</li>
                <li>• Faça múltiplas análises para comparar</li>
                <li>• Use os relatórios para acompanhar evolução</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Não encontrou sua resposta?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nossa equipe de suporte está pronta para ajudar você.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contato">
              Entrar em Contato
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