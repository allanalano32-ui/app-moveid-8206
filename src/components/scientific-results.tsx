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
  Zap
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="biomechanics">Detalhes</TabsTrigger>
          <TabsTrigger value="phases">Fases</TabsTrigger>
          <TabsTrigger value="kinetics">Métricas</TabsTrigger>
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
          {(analysisResult as any).biomechanics?.kinematic_parameters && (
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
                      {(analysisResult as any).biomechanics.kinematic_parameters.movement_efficiency}
                    </div>
                    <div className="text-sm text-gray-600">Eficiência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(analysisResult as any).biomechanics.kinetic_parameters.power_output}
                    </div>
                    <div className="text-sm text-gray-600">Potência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {(analysisResult as any).biomechanics.temporal_parameters.rhythm_consistency}
                    </div>
                    <div className="text-sm text-gray-600">Consistência</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {(analysisResult as any).biomechanics.postural_analysis.pelvic_stability}
                    </div>
                    <div className="text-sm text-gray-600">Estabilidade</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Análise Detalhada */}
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

          {/* Parâmetros de Movimento */}
          {(analysisResult as any).biomechanics?.kinematic_parameters && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-purple-600" />
                  Parâmetros de Movimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Velocidade Pico:</span>
                      <span className="font-medium">{(analysisResult as any).biomechanics.kinematic_parameters.velocity_profile.peak_velocity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Velocidade Média:</span>
                      <span className="font-medium">{(analysisResult as any).biomechanics.kinematic_parameters.velocity_profile.average_velocity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consistência:</span>
                      <span className="font-medium">{(analysisResult as any).biomechanics.kinematic_parameters.velocity_profile.velocity_consistency}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aceleração Máx:</span>
                      <span className="font-medium">{(analysisResult as any).biomechanics.kinematic_parameters.acceleration_peaks.max_acceleration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Simetria:</span>
                      <span className="font-medium">{(analysisResult as any).biomechanics.kinematic_parameters.acceleration_peaks.acceleration_symmetry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Eficiência:</span>
                      <span className="font-medium">{(analysisResult as any).biomechanics.kinematic_parameters.movement_efficiency}</span>
                    </div>
                  </div>
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
                      Momento: {phase.timestamp}% do movimento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{phase.analysis}</p>
                    
                    {/* Barra de Progresso da Qualidade */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Qualidade da Fase</span>
                        <span>{phase.quality_score}%</span>
                      </div>
                      <Progress value={phase.quality_score} className="h-3" />
                    </div>
                    
                    {/* Marcadores */}
                    {(phase as any).biomechanical_markers && (
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Pontos Analisados:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(phase as any).biomechanical_markers.map((marker: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {marker}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Métricas Avançadas */}
        <TabsContent value="kinetics" className="space-y-6">
          {(analysisResult as any).biomechanics?.kinetic_parameters && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-red-600" />
                    Parâmetros de Força
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Força Pico:</span>
                    <span className="font-bold text-red-600">
                      {(analysisResult as any).biomechanics.kinetic_parameters.estimated_force_production.peak_force}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Força Média:</span>
                    <span className="font-medium">
                      {(analysisResult as any).biomechanics.kinetic_parameters.estimated_force_production.average_force}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Simetria:</span>
                    <span className="font-medium">
                      {(analysisResult as any).biomechanics.kinetic_parameters.estimated_force_production.force_symmetry}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-600" />
                    Parâmetros Energéticos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potência:</span>
                    <span className="font-bold text-yellow-600">
                      {(analysisResult as any).biomechanics.kinetic_parameters.power_output}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gasto Energético:</span>
                    <span className="font-medium">
                      {(analysisResult as any).biomechanics.kinetic_parameters.energy_expenditure}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eficiência:</span>
                    <span className="font-medium">
                      {(analysisResult as any).biomechanics.kinetic_parameters.mechanical_efficiency}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Análise Postural */}
          {(analysisResult as any).biomechanics?.postural_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600" />
                  Análise Postural
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Deslocamento do Centro de Massa</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Anterior-Posterior:</span>
                        <span>{(analysisResult as any).biomechanics.postural_analysis.center_of_mass_displacement.anterior_posterior}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Médio-Lateral:</span>
                        <span>{(analysisResult as any).biomechanics.postural_analysis.center_of_mass_displacement.medial_lateral}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vertical:</span>
                        <span>{(analysisResult as any).biomechanics.postural_analysis.center_of_mass_displacement.vertical}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Métricas de Equilíbrio</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Índice de Estabilidade:</span>
                        <span>{(analysisResult as any).biomechanics.postural_analysis.balance_metrics.stability_index}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Velocidade de Oscilação:</span>
                        <span>{(analysisResult as any).biomechanics.postural_analysis.balance_metrics.sway_velocity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Controle Postural:</span>
                        <span>{(analysisResult as any).biomechanics.postural_analysis.balance_metrics.postural_control}</span>
                      </div>
                    </div>
                  </div>
                </div>
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

          {/* Comparação com População */}
          {(analysisResult as any).normative_comparison && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5 text-purple-600" />
                  Comparação com Outros Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {(analysisResult as any).normative_comparison.percentile_rank}º
                    </div>
                    <div className="text-sm text-purple-700">
                      Posição Geral
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Faixa Etária:</span>
                      <span>{(analysisResult as any).normative_comparison.population_comparison.age_group_percentile}º posição</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gênero:</span>
                      <span>{(analysisResult as any).normative_comparison.population_comparison.gender_percentile}º posição</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nível de Atividade:</span>
                      <span>{(analysisResult as any).normative_comparison.population_comparison.activity_level_percentile}º posição</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Potencial de Melhoria:</span>
                      <span>{(analysisResult as any).normative_comparison.improvement_potential}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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