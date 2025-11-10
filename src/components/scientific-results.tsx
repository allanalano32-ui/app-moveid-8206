'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  TrendingUp, 
  Activity, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Clock,
  Users,
  Brain
} from 'lucide-react'
import { VideoAnalysisResult } from '@/lib/openai'
import { generateScientificPDF, PDFGenerationOptions } from '@/lib/pdf-generator'

interface ScientificResultsProps {
  analysisResult: VideoAnalysisResult
  exerciseType: string
  videoFrame?: string
  onNewAnalysis: () => void
}

export default function ScientificResults({ 
  analysisResult, 
  exerciseType, 
  videoFrame,
  onNewAnalysis 
}: ScientificResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      const options: PDFGenerationOptions = {
        analysisResult,
        videoFrame,
        exerciseType,
        date: new Date(),
        includeGraphs: true,
        includeVideoFrame: !!videoFrame
      }
      
      const pdfBlob = await generateScientificPDF(options)
      
      // Download do PDF
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analise-movimento-${exerciseType}-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente'
    if (score >= 80) return 'Muito Bom'
    if (score >= 70) return 'Bom'
    if (score >= 60) return 'Regular'
    return 'Precisa Melhorar'
  }

  const getRiskLevel = () => {
    const riskFactors = analysisResult.biomechanics?.risk_factors?.length || 0
    const score = analysisResult.score
    
    if (riskFactors === 0 && score >= 80) return { level: 'Baixo', color: 'text-green-600', bg: 'bg-green-50' }
    if (riskFactors <= 2 && score >= 60) return { level: 'Médio', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { level: 'Alto', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const riskLevel = getRiskLevel()

  // Acessar dados detalhados da análise com validações
  const detailedAnalysis = analysisResult as any
  const movementDetails = detailedAnalysis.movement_details
  const jointAnalysis = detailedAnalysis.joint_analysis
  const muscleAnalysis = detailedAnalysis.muscle_analysis
  const posturalAnalysis = detailedAnalysis.postural_analysis
  const temporalParameters = detailedAnalysis.temporal_parameters
  const gaitAnalysis = detailedAnalysis.gait_analysis
  const phaseFeedback = detailedAnalysis.phase_feedback

  return (
    <div className="space-y-8">
      {/* Header com Score Principal */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          <CheckCircle className="mr-2 h-4 w-4" />
          Análise Completa
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Relatório de Análise - {exerciseType}
        </h1>
        
        {/* Score Principal */}
        <Card className="max-w-md mx-auto">
          <CardContent className="py-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(analysisResult.score)}`}>
              {analysisResult.score}
            </div>
            <div className="text-xl text-gray-600 mb-2">Score de Qualidade</div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {getScoreLabel(analysisResult.score)}
            </Badge>
            <div className="mt-4 text-sm text-gray-500">
              Confiança da IA: {Math.round((analysisResult.confidence_score || 0.85) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Análise Detalhada */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="movement">Movimento</TabsTrigger>
          <TabsTrigger value="phases">Fases</TabsTrigger>
          <TabsTrigger value="biomechanics">Biomecânica</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resumo Executivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-blue-600" />
                  Resumo da Análise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {analysisResult.description}
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    Qualidade do Movimento
                  </div>
                  <div className="text-sm text-blue-700">
                    {analysisResult.biomechanics?.movement_quality}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avaliação de Risco */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                  Avaliação de Risco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${riskLevel.bg} mb-4`}>
                  <div className={`text-lg font-bold ${riskLevel.color}`}>
                    Nível de Risco: {riskLevel.level}
                  </div>
                </div>
                
                {analysisResult.biomechanics?.risk_factors && analysisResult.biomechanics.risk_factors.length > 0 ? (
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">Fatores Identificados:</div>
                    {analysisResult.biomechanics.risk_factors.map((risk, index) => (
                      <div key={index} className="flex items-start text-sm">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Nenhum fator de risco significativo identificado</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Métricas Rápidas */}
          {detailedAnalysis.biomechanics?.detailed_metrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Métricas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {detailedAnalysis.biomechanics.detailed_metrics.biomechanical_efficiency?.movement_economy || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Eficiência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {detailedAnalysis.biomechanics.detailed_metrics.stability_indices?.static_stability || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Estabilidade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {detailedAnalysis.biomechanics.detailed_metrics.biomechanical_efficiency?.neuromuscular_coordination || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Coordenação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {detailedAnalysis.biomechanics.detailed_metrics.stability_indices?.balance_confidence || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Equilíbrio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Detalhes do Movimento */}
        <TabsContent value="movement" className="space-y-6">
          {movementDetails && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Músculos Envolvidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Primários</h4>
                    <div className="flex flex-wrap gap-2">
                      {(movementDetails.primary_muscles || []).map((muscle: string, index: number) => (
                        <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Secundários</h4>
                    <div className="flex flex-wrap gap-2">
                      {(movementDetails.secondary_muscles || []).map((muscle: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2">Estabilizadores</h4>
                    <div className="flex flex-wrap gap-2">
                      {(movementDetails.stabilizer_muscles || []).map((muscle: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-orange-600" />
                    Características do Movimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plano de Movimento:</span>
                    <span className="font-medium">{movementDetails.movement_plane || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nível de Complexidade:</span>
                    <span className="font-medium">{movementDetails.complexity_level || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-2">Articulações Envolvidas:</span>
                    <div className="flex flex-wrap gap-2">
                      {(movementDetails.joint_involvement || []).map((joint: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {joint}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-2">Benefícios Funcionais:</span>
                    <ul className="text-sm space-y-1">
                      {(movementDetails.functional_benefits || []).map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Erros Comuns */}
          {movementDetails?.common_errors && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                  Erros Comuns Identificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {movementDetails.common_errors.map((error: string, index: number) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-red-700">{error}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Fases do Movimento */}
        <TabsContent value="phases" className="space-y-6">
          {analysisResult.movement_phases && analysisResult.movement_phases.length > 0 && (
            <div className="space-y-4">
              {analysisResult.movement_phases.map((phase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{phase.phase}</CardTitle>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {phase.quality_score}/100
                      </Badge>
                    </div>
                    <CardDescription>
                      {(phase as any).duration_seconds && `Duração: ${(phase as any).duration_seconds}`}
                      {(phase as any).duration_percent && ` (${(phase as any).duration_percent}% do movimento)`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{phase.analysis || (phase as any).description}</p>
                    
                    {/* Descrição Detalhada */}
                    {(phase as any).detailed_description && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Análise Detalhada</h5>
                        <p className="text-sm text-blue-800">{(phase as any).detailed_description}</p>
                      </div>
                    )}
                    
                    {/* Barra de Progresso da Qualidade */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Qualidade da Fase</span>
                        <span>{phase.quality_score}%</span>
                      </div>
                      <Progress value={phase.quality_score} className="h-3" />
                    </div>
                    
                    {/* Pontos-Chave */}
                    {(phase as any).key_points && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Pontos-Chave:</h5>
                        <ul className="space-y-1">
                          {(phase as any).key_points.map((point: string, idx: number) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Ângulos Articulares */}
                    {(phase as any).joint_angles && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Ângulos Articulares:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries((phase as any).joint_angles || {}).map(([joint, angle]) => (
                            <div key={joint} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span className="capitalize">{joint}:</span>
                              <span className="font-medium">{angle as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ativação Muscular */}
                    {(phase as any).muscle_activation && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Ativação Muscular:</h5>
                        <div className="space-y-2">
                          {Object.entries((phase as any).muscle_activation || {}).map(([category, muscles]) => (
                            <div key={category}>
                              <h6 className="text-sm font-medium text-gray-700 capitalize mb-1">{category}:</h6>
                              <div className="space-y-1">
                                {((muscles as any[]) || []).map((muscle, idx) => (
                                  <div key={idx} className="text-xs p-2 bg-gray-50 rounded">
                                    <span className="font-medium">{muscle.muscle}</span> - 
                                    <span className="text-blue-600 ml-1">{muscle.level}</span>
                                    <div className="text-gray-600 mt-1">{muscle.reason}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Métricas da Fase */}
                    {(phase as any).metrics && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Métricas:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries((phase as any).metrics || {}).map(([metric, value]) => (
                            <div key={metric} className="flex justify-between p-2 bg-green-50 rounded">
                              <span className="capitalize">{metric.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-green-700">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Análise de Marcha Específica */}
          {gaitAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-purple-600" />
                  Análise Específica de Marcha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Parâmetros Espaciais</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(gaitAnalysis.advanced_parameters?.step_parameters || {}).map(([param, value]) => (
                        <div key={param} className="flex justify-between">
                          <span className="capitalize">{param.replace(/_/g, ' ')}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Parâmetros Temporais</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(gaitAnalysis.advanced_parameters?.temporal_parameters || {}).map(([param, value]) => (
                        <div key={param} className="flex justify-between">
                          <span className="capitalize">{param.replace(/_/g, ' ')}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Análise Biomecânica */}
        <TabsContent value="biomechanics" className="space-y-6">
          {/* Ângulos Articulares */}
          {analysisResult.biomechanics?.joint_angles && Object.keys(analysisResult.biomechanics.joint_angles).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                  Ângulos Articulares
                </CardTitle>
                <CardDescription>
                  Análise detalhada dos ângulos articulares durante o movimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(analysisResult.biomechanics.joint_angles).map(([joint, angle]) => (
                    <div key={joint} className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {angle}°
                      </div>
                      <div className="text-sm text-gray-600 capitalize font-medium">
                        {joint.replace('_', ' ')}
                      </div>
                      <div className="mt-2">
                        <Progress value={Math.min((angle / 180) * 100, 100)} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Análise Articular Detalhada */}
          {jointAnalysis && (
            <div className="space-y-6">
              {Object.entries(jointAnalysis || {}).map(([category, joints]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">
                      Articulações {category === 'primarias' ? 'Primárias' : category === 'secundarias' ? 'Secundárias' : 'Estabilizadoras'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries((joints as any) || {}).map(([joint, data]) => (
                        <div key={joint} className="p-4 border rounded-lg">
                          <h4 className="font-semibold capitalize mb-2">{joint.replace(/_/g, ' ')}</h4>
                          <p className="text-sm text-gray-600 mb-3">{(data as any).function}</p>
                          
                          {(data as any).measured_angles && (
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 mb-1">Ângulos Medidos:</div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>Min: {(data as any).measured_angles.min}°</div>
                                <div>Máx: {(data as any).measured_angles.max}°</div>
                                <div>Média: {(data as any).measured_angles.average}°</div>
                              </div>
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-700 mb-2">
                            {(data as any).quality_assessment}
                          </div>
                          
                          {(data as any).detailed_metrics && (
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {Object.entries((data as any).detailed_metrics || {}).map(([metric, value]) => (
                                <div key={metric} className="flex justify-between">
                                  <span>{metric.replace(/_/g, ' ')}:</span>
                                  <span className="font-medium">{value as string}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Ativação Muscular */}
          {analysisResult.biomechanics?.muscle_activation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-green-600" />
                  Músculos Ativados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysisResult.biomechanics.muscle_activation.map((muscle, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span className="capitalize font-medium">{muscle}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Métricas Avançadas */}
        <TabsContent value="metrics" className="space-y-6">
          {/* Parâmetros Temporais */}
          {temporalParameters && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Parâmetros Temporais e Cadência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {temporalParameters.movement_timing && (
                    <div>
                      <h4 className="font-semibold mb-3">Timing do Movimento</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(temporalParameters.movement_timing || {}).map(([param, value]) => (
                          <div key={param} className="flex justify-between p-2 bg-blue-50 rounded">
                            <span className="capitalize">{param.replace(/_/g, ' ')}:</span>
                            <span className="font-medium">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {temporalParameters.step_parameters && (
                    <div>
                      <h4 className="font-semibold mb-3">Parâmetros de Passo</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(temporalParameters.step_parameters || {}).map(([param, value]) => (
                          <div key={param} className="flex justify-between p-2 bg-green-50 rounded">
                            <span className="capitalize">{param.replace(/_/g, ' ')}:</span>
                            <span className="font-medium">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {temporalParameters.efficiency_metrics && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Métricas de Eficiência</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(temporalParameters.efficiency_metrics || {}).map(([metric, value]) => (
                        <div key={metric} className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-xl font-bold text-purple-600">{value as string}</div>
                          <div className="text-xs text-purple-700 capitalize">{metric.replace(/_/g, ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Métricas Detalhadas */}
          {detailedAnalysis.biomechanics?.detailed_metrics && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                    Eficiência Biomecânica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(detailedAnalysis.biomechanics.detailed_metrics.biomechanical_efficiency || {}).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{metric.replace(/_/g, ' ')}:</span>
                      <span className="font-bold text-green-600">{value as string}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-blue-600" />
                    Índices de Estabilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(detailedAnalysis.biomechanics.detailed_metrics.stability_indices || {}).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{metric.replace(/_/g, ' ')}:</span>
                      <span className="font-bold text-blue-600">{value as string}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Análise Postural */}
          {posturalAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-purple-600" />
                  Análise Postural Detalhada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Score Postural: {posturalAnalysis.overall_posture_score}/100</h4>
                    <Progress value={posturalAnalysis.overall_posture_score} className="mb-4" />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Qualidade do Alinhamento:</span>
                        <span className="font-medium">{posturalAnalysis.alignment_quality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estabilidade Postural:</span>
                        <span className="font-medium">{posturalAnalysis.postural_stability}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Métricas Detalhadas</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(posturalAnalysis.detailed_metrics || {}).map(([metric, value]) => (
                        <div key={metric} className="flex justify-between">
                          <span className="capitalize">{metric.replace(/_/g, ' ')}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {posturalAnalysis.identified_deviations && posturalAnalysis.identified_deviations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Desvios Identificados</h4>
                    <div className="space-y-3">
                      {posturalAnalysis.identified_deviations.map((deviation: any, index: number) => (
                        <div key={index} className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-orange-900">{deviation.deviation}</h5>
                            <Badge variant="outline" className="text-orange-700">
                              {deviation.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-orange-800 mb-2">{deviation.compensation_pattern}</p>
                          <div className="text-xs text-orange-700">
                            Impacto: {deviation.impact_on_movement} | Prioridade: {deviation.correction_priority}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recomendações */}
        <TabsContent value="recommendations" className="space-y-6">
          {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Recomendações Personalizadas
                </CardTitle>
                <CardDescription>
                  Sugestões baseadas na análise do seu movimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-900 mb-1">
                          Recomendação {index + 1}
                        </div>
                        <div className="text-green-800 text-sm">
                          {recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback por Fases */}
          {phaseFeedback && (
            <div className="space-y-6">
              {Object.entries(phaseFeedback || {}).map(([phase, feedback]) => (
                <Card key={phase}>
                  <CardHeader>
                    <CardTitle className="capitalize">Feedback - {phase}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Métricas da Fase</h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries((feedback as any).metrics || {}).map(([metric, value]) => (
                            <div key={metric} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span className="capitalize">{metric.replace(/_/g, ' ')}:</span>
                              <span className="font-medium">{value as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Dicas Técnicas</h4>
                        <div className="space-y-2">
                          {((feedback as any).technical_cues || []).map((cue: string, index: number) => (
                            <div key={index} className="flex items-start">
                              <Brain className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-700">{cue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold mb-3">Feedback Detalhado</h4>
                      <div className="space-y-2">
                        {((feedback as any).detailed_feedback || []).map((tip: string, index: number) => (
                          <div key={index} className="flex items-start p-2 bg-blue-50 rounded">
                            <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download className="mr-2 h-5 w-5" />
          {isGeneratingPDF ? 'Gerando PDF...' : 'Baixar Relatório Completo'}
        </Button>
        <Button size="lg" variant="outline" onClick={onNewAnalysis}>
          Nova Análise
        </Button>
      </div>
    </div>
  )
}