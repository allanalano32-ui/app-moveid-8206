'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Image as ImageIcon, Camera, CheckCircle, AlertCircle, Brain } from 'lucide-react'
import { ImageAnalysisResult } from '@/lib/openai'

interface ImageAnalyzerProps {
  onAnalysisComplete?: (result: ImageAnalysisResult) => void
  className?: string
}

export default function ImageAnalyzer({ onAnalysisComplete, className = "" }: ImageAnalyzerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisType, setAnalysisType] = useState<string>('movement')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Criar preview da imagem
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // Resetar estados
      setAnalysisComplete(false)
      setAnalysisResult(null)
    }
  }

  const handleAnalysis = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 200)

      // Preparar FormData
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('analysisType', analysisType)

      // Chamar API de análise
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erro na análise da imagem')
      }

      const result = await response.json()
      
      clearInterval(progressInterval)
      setAnalysisProgress(100)
      
      setTimeout(() => {
        setAnalysisResult(result.analysis)
        setAnalysisComplete(true)
        setIsAnalyzing(false)
        
        // Callback para componente pai
        if (onAnalysisComplete) {
          onAnalysisComplete(result.analysis)
        }
      }, 500)

    } catch (error) {
      console.error('Erro na análise:', error)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setAnalysisComplete(false)
    setAnalysisResult(null)
    setAnalysisProgress(0)
    setAnalysisType('movement')
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case 'posture': return 'Análise de Postura'
      case 'biomechanics': return 'Análise Biomecânica'
      default: return 'Análise de Movimento'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="mr-2 h-5 w-5" />
          Análise de Imagem com IA
        </CardTitle>
        <CardDescription>
          Faça upload de uma foto para análise biomecânica instantânea
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!analysisComplete ? (
          <>
            {/* Analysis Type Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Análise</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movement">Análise de Movimento</SelectItem>
                  <SelectItem value="posture">Análise de Postura</SelectItem>
                  <SelectItem value="biomechanics">Análise Biomecânica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="outline" className="w-full" asChild>
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar Imagem
                  </span>
                </Button>
              </label>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="space-y-3">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-contain"
                  />
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ {selectedFile?.name}
                  </p>
                  <p className="text-xs text-green-600">
                    {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            )}

            {/* Analysis Button */}
            {selectedFile && !isAnalyzing && (
              <Button
                onClick={handleAnalysis}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="mr-2 h-4 w-4" />
                {getAnalysisTypeLabel(analysisType)}
              </Button>
            )}

            {/* Analyzing State */}
            {isAnalyzing && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h4 className="font-semibold mb-2">Analisando com OpenAI...</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Processando imagem e extraindo insights biomecânicos.
                </p>
                <Progress value={analysisProgress} className="max-w-xs mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  {analysisProgress < 30 && "Processando imagem..."}
                  {analysisProgress >= 30 && analysisProgress < 60 && "Analisando postura..."}
                  {analysisProgress >= 60 && analysisProgress < 90 && "Gerando recomendações..."}
                  {analysisProgress >= 90 && "Finalizando..."}
                </p>
              </div>
            )}
          </>
        ) : (
          /* Results */
          <div className="space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">
                <CheckCircle className="mr-2 h-4 w-4" />
                Análise Completa
              </Badge>
              <h4 className="font-semibold text-lg">
                {getAnalysisTypeLabel(analysisType)}
              </h4>
            </div>

            {/* Description */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                {analysisResult?.description}
              </p>
            </div>

            {/* Movement Analysis */}
            {analysisResult?.movement_analysis && (
              <div className="space-y-3">
                <h5 className="font-medium">Análise Detalhada:</h5>
                <div className="grid gap-3">
                  <div className="p-3 border rounded-lg">
                    <h6 className="font-medium text-sm mb-1">Postura:</h6>
                    <p className="text-sm text-gray-600">{analysisResult.movement_analysis.posture}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h6 className="font-medium text-sm mb-1">Alinhamento:</h6>
                    <p className="text-sm text-gray-600">{analysisResult.movement_analysis.alignment}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Biomechanics */}
            {analysisResult?.biomechanics && (
              <div className="space-y-3">
                <h5 className="font-medium">Métricas Biomecânicas:</h5>
                
                {/* Joint Angles */}
                {Object.keys(analysisResult.biomechanics.joint_angles).length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(analysisResult.biomechanics.joint_angles).map(([joint, angle]) => (
                      <div key={joint} className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{angle}°</div>
                        <div className="text-xs text-gray-600 capitalize">{joint}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Risk Factors */}
                {analysisResult.biomechanics.risk_factors.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h6 className="font-medium text-yellow-800 mb-2 flex items-center text-sm">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Pontos de Atenção
                    </h6>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {analysisResult.biomechanics.risk_factors.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {analysisResult?.movement_analysis?.recommendations && analysisResult.movement_analysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Recomendações:</h5>
                <ul className="space-y-2">
                  {analysisResult.movement_analysis.recommendations.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence Score */}
            <div className="text-center pt-2 border-t">
              <p className="text-xs text-gray-500">
                Confiança da análise: {Math.round((analysisResult?.confidence_score || 0) * 100)}%
              </p>
            </div>

            {/* Reset Button */}
            <Button variant="outline" onClick={resetAnalysis} className="w-full">
              Nova Análise
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}