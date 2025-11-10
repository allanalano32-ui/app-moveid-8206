'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Square, Play, RotateCcw, Download, Smartphone, AlertCircle } from 'lucide-react'

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void
  maxDuration?: number // em segundos
  className?: string
}

export default function VideoRecorder({ 
  onVideoRecorded, 
  maxDuration = 30,
  className = "" 
}: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment')
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking')

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Verificar permissões ao montar o componente
  useEffect(() => {
    checkCameraPermissions()
  }, [])

  const checkCameraPermissions = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
        setPermissionStatus(permission.state)
        
        permission.onchange = () => {
          setPermissionStatus(permission.state)
        }
      } else {
        // Fallback para navegadores que não suportam Permissions API
        setPermissionStatus('prompt')
      }
    } catch (err) {
      console.log('Permissions API não suportada, tentando acesso direto')
      setPermissionStatus('prompt')
    }
  }

  const requestCameraPermission = async () => {
    try {
      setError(null)
      setPermissionStatus('checking')
      
      // Tentar acessar a câmera para forçar o prompt de permissão
      const testStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      })
      
      // Se chegou até aqui, a permissão foi concedida
      testStream.getTracks().forEach(track => track.stop())
      setPermissionStatus('granted')
      
      // Iniciar a câmera automaticamente após obter permissão
      startCamera()
      
    } catch (err: any) {
      console.error('Erro ao solicitar permissão da câmera:', err)
      
      if (err.name === 'NotAllowedError') {
        setPermissionStatus('denied')
        setError('Permissão da câmera negada. Por favor, permita o acesso à câmera nas configurações do navegador.')
      } else if (err.name === 'NotFoundError') {
        setError('Nenhuma câmera encontrada no dispositivo.')
      } else if (err.name === 'NotSupportedError') {
        setError('Câmera não suportada neste navegador.')
      } else {
        setError('Erro ao acessar a câmera. Verifique se ela não está sendo usada por outro aplicativo.')
      }
    }
  }

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      
      // Configurações otimizadas para celular e computador
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false // Não precisamos de áudio para análise de movimento
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setPermissionStatus('granted')
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
    } catch (err: any) {
      console.error('Erro ao acessar câmera:', err)
      
      if (err.name === 'NotAllowedError') {
        setPermissionStatus('denied')
        setError('Permissão da câmera negada. Clique em "Permitir" quando solicitado pelo navegador.')
      } else if (err.name === 'NotFoundError') {
        setError('Nenhuma câmera encontrada. Verifique se seu dispositivo possui câmera.')
      } else if (err.name === 'NotSupportedError') {
        setError('Câmera não suportada neste navegador. Tente usar Chrome, Firefox ou Safari.')
      } else {
        setError('Erro ao acessar a câmera. Verifique se ela não está sendo usada por outro aplicativo.')
      }
    }
  }, [cameraFacing])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const startRecording = useCallback(() => {
    if (!stream) return

    try {
      setError(null)
      chunksRef.current = []
      
      // Tentar diferentes formatos de vídeo para compatibilidade
      let mimeType = 'video/webm;codecs=vp9'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm'
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/mp4'
          }
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: mimeType })
        setRecordedVideo(videoBlob)
        onVideoRecorded(videoBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Timer para contagem regressiva
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

    } catch (err) {
      console.error('Erro ao iniciar gravação:', err)
      setError('Erro ao iniciar a gravação. Tente novamente.')
    }
  }, [stream, maxDuration, onVideoRecorded])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const switchCamera = useCallback(() => {
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user')
    if (stream) {
      stopCamera()
      // Restart camera with new facing mode
      setTimeout(() => {
        startCamera()
      }, 100)
    }
  }, [stream, stopCamera, startCamera])

  const resetRecording = useCallback(() => {
    setRecordedVideo(null)
    setRecordingTime(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const downloadVideo = useCallback(() => {
    if (recordedVideo) {
      const url = URL.createObjectURL(recordedVideo)
      const a = document.createElement('a')
      a.href = url
      a.download = `movimento-${Date.now()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [recordedVideo])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          Gravação de Vídeo
        </CardTitle>
        <CardDescription>
          Grave seu movimento diretamente no navegador para análise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 text-sm font-medium">Erro de Câmera</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                {permissionStatus === 'denied' && (
                  <div className="mt-2 text-xs text-red-600">
                    <p><strong>Como resolver:</strong></p>
                    <p>1. Clique no ícone de câmera na barra de endereços</p>
                    <p>2. Selecione "Permitir" para câmera</p>
                    <p>3. Recarregue a página</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Permission Status */}
        {permissionStatus === 'denied' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-yellow-800 text-sm font-medium">Permissão da câmera necessária</p>
                <p className="text-yellow-700 text-sm">Para gravar vídeos, precisamos acessar sua câmera.</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Preview */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <Badge variant="destructive">
                REC {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </Badge>
            </div>
          )}

          {/* Camera Switch Button */}
          {stream && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={switchCamera}
              title={cameraFacing === 'user' ? 'Trocar para câmera traseira' : 'Trocar para câmera frontal'}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          {/* No Camera State */}
          {!stream && !recordedVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Smartphone className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">
                  {permissionStatus === 'checking' ? 'Verificando permissões...' : 'Câmera não iniciada'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {permissionStatus === 'denied' && (
            <Button onClick={requestCameraPermission} className="bg-blue-600 hover:bg-blue-700">
              <Camera className="mr-2 h-4 w-4" />
              Solicitar Permissão
            </Button>
          )}

          {(permissionStatus === 'prompt' || permissionStatus === 'checking') && !stream && !recordedVideo && (
            <Button onClick={requestCameraPermission} className="bg-blue-600 hover:bg-blue-700">
              <Camera className="mr-2 h-4 w-4" />
              Iniciar Câmera
            </Button>
          )}

          {permissionStatus === 'granted' && !stream && !recordedVideo && (
            <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
              <Camera className="mr-2 h-4 w-4" />
              Iniciar Câmera
            </Button>
          )}

          {stream && !isRecording && !recordedVideo && (
            <>
              <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                <Camera className="mr-2 h-4 w-4" />
                Gravar
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                Fechar Câmera
              </Button>
            </>
          )}

          {isRecording && (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="mr-2 h-4 w-4" />
              Parar Gravação
            </Button>
          )}

          {recordedVideo && (
            <>
              <Button variant="outline" onClick={downloadVideo}>
                <Download className="mr-2 h-4 w-4" />
                Baixar Vídeo
              </Button>
              <Button variant="outline" onClick={resetRecording}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Gravar Novamente
              </Button>
              <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                <Camera className="mr-2 h-4 w-4" />
                Nova Gravação
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">Dicas para melhor gravação:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Celular:</strong> Posicione na horizontal (landscape)</li>
            <li>• <strong>Computador:</strong> Use webcam externa se possível</li>
            <li>• Mantenha boa iluminação no ambiente</li>
            <li>• Grave de corpo inteiro, com espaço nas laterais</li>
            <li>• Evite movimentos bruscos da câmera</li>
            <li>• Use a câmera traseira para melhor qualidade</li>
          </ul>
        </div>

        {/* Browser Compatibility Info */}
        <div className="text-xs text-gray-500 text-center">
          Compatível com Chrome, Firefox, Safari e Edge. 
          Funciona em celular e computador.
        </div>
      </CardContent>
    </Card>
  )
}