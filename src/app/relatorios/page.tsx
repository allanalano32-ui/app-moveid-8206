'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Camera,
  Shirt,
  Play,
  Target,
  Activity,
  Clock,
  User
} from 'lucide-react'
import Link from 'next/link'
import { generateScientificPDF } from '@/lib/pdf-generator'

// Dados simulados de análise (baseado no OpenCap.ai)
const analysisData = {
  overall_score: 85,
  movement_type: "Agachamento",
  date: "2024-11-07",
  duration: "8.5s",
  frames_analyzed: 255,
  joints_tracked: 17,
  confidence: 94,
  
  biomechanical_metrics: {
    knee_angle_max: 142,
    hip_angle_max: 98,
    ankle_dorsiflexion: 15,
    trunk_lean: 8,
    knee_valgus: 3,
    weight_distribution: "Equilibrado"
  },
  
  phase_analysis: [
    { phase: "Descida", score: 88, duration: "3.2s", notes: "Boa velocidade controlada" },
    { phase: "Posição Baixa", score: 82, duration: "1.1s", notes: "Profundidade adequada" },
    { phase: "Subida", score: 87, duration: "4.2s", notes: "Força consistente" }
  ],
  
  recommendations: [
    {
      type: "critical",
      title: "Alinhamento do Joelho",
      description: "Mantenha os joelhos alinhados com os pés durante todo o movimento",
      impact: "Alto"
    },
    {
      type: "improvement",
      title: "Profundidade do Agachamento",
      description: "Tente descer mais 5-10cm para ativar melhor os glúteos",
      impact: "Médio"
    },
    {
      type: "good",
      title: "Postura do Tronco",
      description: "Excelente manutenção da postura ereta",
      impact: "Positivo"
    }
  ],
  
  clothing_recommendations: [
    "Use roupas justas ao corpo para melhor detecção dos pontos articulares",
    "Evite roupas muito largas que podem ocultar o movimento das articulações",
    "Prefira cores contrastantes com o fundo (roupa escura em fundo claro)",
    "Evite estampas muito chamativas que podem confundir a IA",
    "Use tênis com sola clara para melhor detecção dos pés"
  ],
  
  recording_tips: [
    "Posicione a câmera na altura do quadril, a 2-3 metros de distância",
    "Grave em ambiente bem iluminado, preferencialmente com luz natural",
    "Mantenha o fundo limpo e sem distrações visuais",
    "Certifique-se de que todo o corpo está visível no enquadramento",
    "Grave de lado (perfil) para melhor análise dos ângulos articulares",
    "Mantenha a câmera estável - use tripé se possível",
    "Faça o movimento completo 2-3 vezes no mesmo vídeo"
  ]
}

export default function RelatoriosPage() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [formattedDate, setFormattedDate] = useState('')

  // Corrigir hydration mismatch - formatar data apenas no cliente
  useEffect(() => {
    setFormattedDate(new Date(analysisData.date).toLocaleDateString('pt-BR'))
  }, [])

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Converter dados para o formato esperado pela função PDF
      const pdfOptions = {
        analysisResult: {
          score: analysisData.overall_score,
          description: `Análise completa do movimento ${analysisData.movement_type} realizada em ${analysisData.date}. Confiança da IA: ${analysisData.confidence}%.`,
          confidence_score: analysisData.confidence / 100,
          biomechanics: {
            joint_angles: {
              joelho: analysisData.biomechanical_metrics.knee_angle_max,
              quadril: analysisData.biomechanical_metrics.hip_angle_max,
              tornozelo: analysisData.biomechanical_metrics.ankle_dorsiflexion,
              tronco: analysisData.biomechanical_metrics.trunk_lean
            },
            muscle_activation: ['quadríceps', 'glúteos', 'isquiotibiais', 'panturrilha'],
            risk_factors: analysisData.recommendations
              .filter(rec => rec.type === 'critical')
              .map(rec => rec.title)
          },
          movement_phases: analysisData.phase_analysis.map(phase => ({
            phase: phase.phase,
            timestamp: `${Math.round(Math.random() * 100)}`,
            quality_score: phase.score,
            analysis: phase.notes
          })),
          recommendations: analysisData.recommendations.map(rec => rec.description)
        },
        patientName: 'Usuário',
        exerciseType: analysisData.movement_type,
        date: new Date(analysisData.date),
        includeGraphs: true,
        includeVideoFrame: false
      }
      
      // Gerar PDF usando o serviço
      const pdfBlob = await generateScientificPDF(pdfOptions)
      
      // Criar link para download
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-${analysisData.movement_type}-${analysisData.date}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

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
        <Button variant="outline" asChild>
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho do Relatório */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Relatório de Análise Biomecânica
              </h1>
              <p className="text-gray-600">
                Análise completa do movimento: {analysisData.movement_type}
              </p>
            </div>
            <Button 
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingPDF ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </>
              )}
            </Button>
          </div>

          {/* Métricas Principais */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pontuação Geral</p>
                    <p className={`text-2xl font-bold ${getScoreColor(analysisData.overall_score)}`}>
                      {analysisData.overall_score}/100
                    </p>
                  </div>
                  <div className={`p-2 rounded-full ${getScoreBg(analysisData.overall_score)}`}>
                    <Target className={`h-6 w-6 ${getScoreColor(analysisData.overall_score)}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Confiança da IA</p>
                    <p className="text-2xl font-bold text-green-600">{analysisData.confidence}%</p>
                  </div>
                  <div className="p-2 rounded-full bg-green-100">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Duração</p>
                    <p className="text-2xl font-bold text-blue-600">{analysisData.duration}</p>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Articulações</p>
                    <p className="text-2xl font-bold text-purple-600">{analysisData.joints_tracked}</p>
                  </div>
                  <div className="p-2 rounded-full bg-purple-100">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="analise" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analise">Análise</TabsTrigger>
            <TabsTrigger value="biomecanica">Biomecânica</TabsTrigger>
            <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
            <TabsTrigger value="vestimenta">Vestimenta</TabsTrigger>
            <TabsTrigger value="gravacao">Gravação</TabsTrigger>
          </TabsList>

          {/* Aba Análise */}
          <TabsContent value="analise" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Análise por Fases do Movimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.phase_analysis.map((phase, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{phase.phase}</h4>
                        <Badge variant={phase.score >= 85 ? "default" : "secondary"}>
                          {phase.score}/100
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Duração: {phase.duration}</span>
                      </div>
                      <Progress value={phase.score} className="mb-2" />
                      <p className="text-sm text-gray-700">{phase.notes}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Biomecânica */}
          <TabsContent value="biomecanica" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Métricas Biomecânicas Detalhadas
                </CardTitle>
                <CardDescription>
                  Análise precisa dos ângulos articulares e padrões de movimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Ângulos Articulares</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Flexão Máxima do Joelho</span>
                        <span className="text-lg font-bold text-blue-600">
                          {analysisData.biomechanical_metrics.knee_angle_max}°
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Flexão Máxima do Quadril</span>
                        <span className="text-lg font-bold text-green-600">
                          {analysisData.biomechanical_metrics.hip_angle_max}°
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Dorsiflexão do Tornozelo</span>
                        <span className="text-lg font-bold text-purple-600">
                          {analysisData.biomechanical_metrics.ankle_dorsiflexion}°
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Padrões de Movimento</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Inclinação do Tronco</span>
                        <span className="text-lg font-bold text-yellow-600">
                          {analysisData.biomechanical_metrics.trunk_lean}°
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Valgo do Joelho</span>
                        <span className="text-lg font-bold text-red-600">
                          {analysisData.biomechanical_metrics.knee_valgus}°
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Distribuição de Peso</span>
                        <span className="text-lg font-bold text-green-600">
                          {analysisData.biomechanical_metrics.weight_distribution}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Interpretação dos Dados</h5>
                  <p className="text-blue-800 text-sm">
                    Os ângulos articulares estão dentro dos parâmetros normais para o agachamento. 
                    A flexão do joelho de {analysisData.biomechanical_metrics.knee_angle_max}° indica boa profundidade. 
                    O valgo mínimo de {analysisData.biomechanical_metrics.knee_valgus}° demonstra excelente controle neuromuscular.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Recomendações */}
          <TabsContent value="recomendacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Recomendações Personalizadas
                </CardTitle>
                <CardDescription>
                  Dicas específicas baseadas na sua análise para melhorar a técnica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.recommendations.map((rec, index) => (
                    <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                      rec.type === 'critical' ? 'border-red-500 bg-red-50' :
                      rec.type === 'improvement' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        {rec.type === 'critical' && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />}
                        {rec.type === 'improvement' && <TrendingUp className="h-5 w-5 text-yellow-500 mt-0.5" />}
                        {rec.type === 'good' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <Badge variant={
                              rec.impact === 'Alto' ? 'destructive' :
                              rec.impact === 'Médio' ? 'default' : 'secondary'
                            }>
                              {rec.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Vestimenta */}
          <TabsContent value="vestimenta" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shirt className="mr-2 h-5 w-5" />
                  Guia de Vestimenta para Melhor Análise
                </CardTitle>
                <CardDescription>
                  Como se vestir para obter a máxima precisão na análise biomecânica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Recomendado
                      </h4>
                      <ul className="space-y-2">
                        {analysisData.clothing_recommendations.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Evitar
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Roupas muito largas ou baggy</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Estampas muito chamativas ou listras</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Cores que se confundem com o fundo</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Acessórios que balançam (brincos grandes, colares)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Tênis com sola escura em fundo escuro</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">💡 Dica Profissional</h5>
                    <p className="text-blue-800 text-sm">
                      Para análises mais precisas, use roupas de compressão ou fitness que marquem bem 
                      as articulações. Isso permite que nossa IA detecte com maior precisão os pontos 
                      anatômicos e calcule os ângulos articulares com margem de erro menor que 2°.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Gravação */}
          <TabsContent value="gravacao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Guia Completo de Gravação
                </CardTitle>
                <CardDescription>
                  Como gravar o vídeo perfeito para análise biomecânica precisa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-4">📹 Configuração da Câmera</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {analysisData.recording_tips.slice(0, 4).map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Play className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-4">🎬 Técnica de Gravação</h4>
                    <div className="space-y-3">
                      {analysisData.recording_tips.slice(4).map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Camera className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">2-3m</div>
                      <div className="text-sm text-green-700">Distância Ideal</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">30fps</div>
                      <div className="text-sm text-blue-700">Taxa de Quadros Mínima</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">1080p</div>
                      <div className="text-sm text-purple-700">Resolução Recomendada</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-yellow-900 mb-2">⚠️ Problemas Comuns</h5>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      <li>• <strong>Vídeo tremido:</strong> Use tripé ou apoie o celular em superfície estável</li>
                      <li>• <strong>Corpo cortado:</strong> Afaste a câmera para capturar corpo inteiro</li>
                      <li>• <strong>Pouca luz:</strong> Grave próximo a janela ou use iluminação artificial</li>
                      <li>• <strong>Fundo confuso:</strong> Use parede lisa ou fundo neutro</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rodapé do Relatório */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Relatório Gerado pelo MoveID</h3>
              <p className="text-sm text-gray-600">
                Data: {formattedDate || analysisData.date} | 
                Frames Analisados: {analysisData.frames_analyzed} | 
                Confiança: {analysisData.confidence}%
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/analise">Nova Análise</Link>
                </Button>
                <Button 
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Salvar Relatório
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}