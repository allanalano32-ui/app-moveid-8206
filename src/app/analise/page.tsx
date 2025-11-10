'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Video, Camera, Play, CheckCircle, AlertCircle, Smartphone, Brain, Image as ImageIcon } from 'lucide-react'
import VideoRecorder from '@/components/video-recorder'
import ImageAnalyzer from '@/components/image-analyzer'
import ScientificResults from '@/components/scientific-results'
import { VideoAnalysisResult, ImageAnalysisResult } from '@/lib/openai'

export default function Analise() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null)
  const [exerciseType, setExerciseType] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showRecorder, setShowRecorder] = useState(false)
  const [activeTab, setActiveTab] = useState('video')
  const [videoFrame, setVideoFrame] = useState<string | undefined>(undefined)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setRecordedVideo(null) // Limpar vídeo gravado se arquivo foi selecionado
      
      // Extrair frame do vídeo para análise
      extractVideoFrame(file)
    }
  }

  const extractVideoFrame = (videoFile: File) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Capturar frame no meio do vídeo
      video.currentTime = video.duration / 2
    }
    
    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const frameData = canvas.toDataURL('image/jpeg', 0.8)
        setVideoFrame(frameData)
      }
    }
    
    video.src = URL.createObjectURL(videoFile)
  }

  const handleVideoRecorded = (videoBlob: Blob) => {
    setRecordedVideo(videoBlob)
    setSelectedFile(null) // Limpar arquivo selecionado se vídeo foi gravado
    setShowRecorder(false)
    
    // Extrair frame do vídeo gravado
    const videoFile = new File([videoBlob], `recorded-video-${Date.now()}.webm`, {
      type: videoBlob.type
    })
    extractVideoFrame(videoFile)
  }

  const handleVideoAnalysis = async () => {
    const videoToAnalyze = selectedFile || recordedVideo
    if (!videoToAnalyze) return

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
          return prev + 10
        })
      }, 300)

      // Preparar FormData
      const formData = new FormData()
      
      if (selectedFile) {
        formData.append('video', selectedFile)
      } else if (recordedVideo) {
        // Converter Blob para File
        const videoFile = new File([recordedVideo], `recorded-video-${Date.now()}.webm`, {
          type: recordedVideo.type
        })
        formData.append('video', videoFile)
      }
      
      if (exerciseType) {
        formData.append('exerciseType', exerciseType)
      }

      // Chamar API de análise
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Erro na análise do vídeo')
      }

      const result = await response.json()
      
      clearInterval(progressInterval)
      setAnalysisProgress(100)
      
      setTimeout(() => {
        setAnalysisResult(result.analysis)
        setAnalysisComplete(true)
        setIsAnalyzing(false)
      }, 500)

    } catch (error) {
      console.error('Erro na análise:', error)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setRecordedVideo(null)
    setAnalysisComplete(false)
    setAnalysisResult(null)
    setAnalysisProgress(0)
    setExerciseType('')
    setShowRecorder(false)
    setVideoFrame(undefined)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excelente'
    if (score >= 70) return 'Bom'
    if (score >= 50) return 'Regular'
    return 'Precisa Melhorar'
  }

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
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/historico" className="text-gray-600 hover:text-blue-600 transition-colors">
            Histórico
          </Link>
          <Link href="/planos" className="text-gray-600 hover:text-blue-600 transition-colors">
            Planos
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {!analysisComplete ? (
            <>
              {/* Header Section */}
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4">
                  <Brain className="mr-2 h-4 w-4" />
                  Análise Inteligente com IA Avançada
                </Badge>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Análise de Movimento Inteligente
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Grave um vídeo, faça upload ou tire uma foto para receber análise detalhada do seu movimento com relatório completo.
                </p>
              </div>

              {/* Analysis Type Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="video" className="flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    Análise de Vídeo
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Análise de Imagem
                  </TabsTrigger>
                </TabsList>

                {/* Video Analysis Tab */}
                <TabsContent value="video" className="space-y-8">
                  {/* Exercise Type Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tipo de Exercício (Recomendado)</CardTitle>
                      <CardDescription>
                        Selecione o tipo de exercício para análise mais precisa e recomendações específicas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select value={exerciseType} onValueChange={setExerciseType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de exercício" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agachamento">Agachamento</SelectItem>
                          <SelectItem value="deadlift">Levantamento Terra</SelectItem>
                          <SelectItem value="supino">Supino</SelectItem>
                          <SelectItem value="flexao">Flexão de Braço</SelectItem>
                          <SelectItem value="corrida">Corrida</SelectItem>
                          <SelectItem value="salto">Salto</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  {/* Upload/Recording Options */}
                  {!showRecorder ? (
                    <div className="grid md:grid-cols-2 gap-8">
                      <Card className="text-center">
                        <CardHeader>
                          <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                          <CardTitle>Fazer Upload</CardTitle>
                          <CardDescription>
                            Envie um vídeo existente do seu dispositivo
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="video-upload"
                          />
                          <label htmlFor="video-upload">
                            <Button variant="outline" className="w-full" asChild>
                              <span className="cursor-pointer">
                                <Video className="mr-2 h-4 w-4" />
                                Selecionar Vídeo
                              </span>
                            </Button>
                          </label>
                          {selectedFile && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-700 font-medium">
                                ✓ {selectedFile.name}
                              </p>
                              <p className="text-xs text-green-600">
                                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="text-center">
                        <CardHeader>
                          <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <CardTitle>Gravar Vídeo</CardTitle>
                          <CardDescription>
                            Use a câmera do seu dispositivo para gravar
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowRecorder(true)}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Abrir Câmera
                          </Button>
                          {recordedVideo && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-700 font-medium">
                                ✓ Vídeo gravado com sucesso
                              </p>
                              <p className="text-xs text-green-600">
                                {(recordedVideo.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Funciona em celular e computador
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div>
                      <VideoRecorder
                        onVideoRecorded={handleVideoRecorded}
                        maxDuration={30}
                      />
                      <div className="text-center mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowRecorder(false)}
                        >
                          Voltar às Opções
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Analysis Button */}
                  {(selectedFile || recordedVideo) && !isAnalyzing && (
                    <div className="text-center">
                      <Button
                        size="lg"
                        onClick={handleVideoAnalysis}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Brain className="mr-2 h-5 w-5" />
                        Iniciar Análise Inteligente
                      </Button>
                    </div>
                  )}

                  {/* Analyzing State */}
                  {isAnalyzing && (
                    <Card className="text-center">
                      <CardContent className="py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold mb-2">Processando Análise...</h3>
                        <p className="text-gray-600 mb-4">
                          Nossa IA está analisando seu movimento com tecnologia avançada.
                        </p>
                        <Progress value={analysisProgress} className="max-w-xs mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          {analysisProgress < 30 && "Extraindo frames e identificando pontos..."}
                          {analysisProgress >= 30 && analysisProgress < 60 && "Calculando ângulos e padrões de movimento..."}
                          {analysisProgress >= 60 && analysisProgress < 90 && "Analisando parâmetros e qualidade..."}
                          {analysisProgress >= 90 && "Gerando relatório completo..."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Image Analysis Tab */}
                <TabsContent value="image">
                  <ImageAnalyzer 
                    onAnalysisComplete={(result) => {
                      // Converter resultado de imagem para formato de vídeo para compatibilidade
                      const videoResult: VideoAnalysisResult = {
                        score: 85, // Score padrão para imagens
                        description: result.description,
                        movement_phases: [],
                        biomechanics: result.biomechanics || {
                          joint_angles: {},
                          muscle_activation: [],
                          risk_factors: [],
                          movement_quality: 'Análise baseada em imagem estática'
                        },
                        recommendations: result.movement_analysis?.recommendations || [],
                        confidence_score: result.confidence_score
                      }
                      setAnalysisResult(videoResult)
                      setAnalysisComplete(true)
                    }}
                  />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            /* Results Section */
            analysisResult && (
              <ScientificResults
                analysisResult={analysisResult}
                exerciseType={exerciseType || 'Movimento Analisado'}
                videoFrame={videoFrame}
                onNewAnalysis={resetAnalysis}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}