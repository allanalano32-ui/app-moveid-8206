import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ImageAnalysisResult {
  description: string
  movement_analysis?: {
    posture: string
    alignment: string
    recommendations: string[]
  }
  biomechanics?: {
    joint_angles: Record<string, number>
    muscle_activation: string[]
    risk_factors: string[]
  }
  confidence_score: number
}

export interface VideoAnalysisResult {
  score: number
  description: string
  movement_phases: {
    phase: string
    timestamp: number
    analysis: string
    quality_score: number
  }[]
  biomechanics: {
    joint_angles: Record<string, number>
    muscle_activation: string[]
    risk_factors: string[]
    movement_quality: string
  }
  recommendations: string[]
  confidence_score: number
}

export async function analyzeMovementImage(imageUrl: string, analysisType: 'movement' | 'posture' | 'biomechanics' = 'movement'): Promise<ImageAnalysisResult> {
  try {
    const prompt = getAnalysisPrompt(analysisType)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })

    const analysis = response.choices[0]?.message?.content
    if (!analysis) {
      throw new Error('Análise não foi gerada')
    }

    // Tentar parsear como JSON, se falhar, usar como texto simples
    try {
      const parsedAnalysis = JSON.parse(analysis)
      return {
        ...parsedAnalysis,
        confidence_score: parsedAnalysis.confidence_score || 0.8
      }
    } catch {
      return {
        description: analysis,
        confidence_score: 0.7
      }
    }
  } catch (error) {
    console.error('Erro na análise de imagem:', error)
    throw new Error('Falha ao analisar a imagem')
  }
}

export async function analyzeMovementVideo(videoFrames: string[], exerciseType?: string): Promise<VideoAnalysisResult> {
  try {
    const prompt = getVideoAnalysisPrompt(exerciseType)
    
    // Analisar múltiplos frames do vídeo
    const frameAnalyses = await Promise.all(
      videoFrames.slice(0, 5).map(async (frameUrl, index) => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `${prompt}\n\nEste é o frame ${index + 1} de ${videoFrames.length}. Analise este momento específico do movimento:`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: frameUrl,
                    detail: "high"
                  }
                }
              ]
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        })

        return {
          frame: index + 1,
          timestamp: (index / videoFrames.length) * 100,
          analysis: response.choices[0]?.message?.content || ''
        }
      })
    )

    // Análise consolidada final
    const consolidatedPrompt = `
    Com base nas análises dos frames individuais abaixo, forneça uma análise consolidada do movimento completo em formato JSON:

    ${frameAnalyses.map(fa => `Frame ${fa.frame} (${fa.timestamp}%): ${fa.analysis}`).join('\n\n')}

    Retorne no formato:
    {
      "score": 85,
      "description": "Análise geral do movimento observado",
      "movement_phases": [
        {
          "phase": "Fase inicial",
          "timestamp": 0,
          "analysis": "Descrição da fase",
          "quality_score": 80
        }
      ],
      "biomechanics": {
        "joint_angles": {"joelho": 90, "quadril": 45, "tornozelo": 15},
        "muscle_activation": ["quadríceps", "glúteos", "core"],
        "risk_factors": ["sobrecarga no joelho"],
        "movement_quality": "Boa execução geral"
      },
      "recommendations": ["Recomendação 1", "Recomendação 2"],
      "confidence_score": 0.85
    }
    `

    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: consolidatedPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.2
    })

    const finalAnalysis = finalResponse.choices[0]?.message?.content
    if (!finalAnalysis) {
      throw new Error('Análise consolidada não foi gerada')
    }

    try {
      const parsedAnalysis = JSON.parse(finalAnalysis)
      return {
        score: parsedAnalysis.score || 75,
        description: parsedAnalysis.description || 'Análise do movimento',
        movement_phases: parsedAnalysis.movement_phases || [],
        biomechanics: parsedAnalysis.biomechanics || {
          joint_angles: {},
          muscle_activation: [],
          risk_factors: [],
          movement_quality: 'Análise em processamento'
        },
        recommendations: parsedAnalysis.recommendations || [],
        confidence_score: parsedAnalysis.confidence_score || 0.8
      }
    } catch {
      // Fallback se não conseguir parsear JSON
      return {
        score: 75,
        description: finalAnalysis,
        movement_phases: [],
        biomechanics: {
          joint_angles: {},
          muscle_activation: [],
          risk_factors: [],
          movement_quality: 'Análise textual disponível'
        },
        recommendations: ['Consulte a descrição detalhada para recomendações'],
        confidence_score: 0.7
      }
    }
  } catch (error) {
    console.error('Erro na análise de vídeo:', error)
    throw new Error('Falha ao analisar o vídeo')
  }
}

function getAnalysisPrompt(analysisType: string): string {
  const basePrompt = `Analise esta imagem de movimento humano e forneça uma análise detalhada em português brasileiro. Retorne a resposta em formato JSON com a seguinte estrutura:`

  switch (analysisType) {
    case 'posture':
      return `${basePrompt}
      {
        "description": "Descrição geral da postura observada",
        "movement_analysis": {
          "posture": "Avaliação da postura (boa/regular/ruim)",
          "alignment": "Análise do alinhamento corporal",
          "recommendations": ["recomendação 1", "recomendação 2"]
        },
        "confidence_score": 0.85
      }`

    case 'biomechanics':
      return `${basePrompt}
      {
        "description": "Análise biomecânica do movimento",
        "biomechanics": {
          "joint_angles": {"joelho": 90, "quadril": 45},
          "muscle_activation": ["quadríceps", "glúteos"],
          "risk_factors": ["sobrecarga no joelho", "desequilíbrio muscular"]
        },
        "confidence_score": 0.80
      }`

    default: // movement
      return `${basePrompt}
      {
        "description": "Análise completa do movimento observado",
        "movement_analysis": {
          "posture": "Avaliação da postura durante o movimento",
          "alignment": "Análise do alinhamento e coordenação",
          "recommendations": ["sugestão de melhoria 1", "sugestão de melhoria 2"]
        },
        "confidence_score": 0.85
      }`
  }
}

function getVideoAnalysisPrompt(exerciseType?: string): string {
  const basePrompt = `Você é um especialista em biomecânica e análise de movimento. Analise este frame de vídeo de exercício físico e forneça insights detalhados sobre:`

  const analysisPoints = `
  1. Postura e alinhamento corporal
  2. Ângulos articulares (joelho, quadril, tornozelo, etc.)
  3. Qualidade do movimento
  4. Possíveis compensações ou erros
  5. Ativação muscular observada
  6. Fatores de risco para lesões
  7. Recomendações específicas de melhoria
  `

  if (exerciseType) {
    return `${basePrompt}
    
    Tipo de exercício: ${exerciseType}
    
    Pontos de análise:${analysisPoints}
    
    Forneça uma análise técnica e precisa em português brasileiro, focando especificamente nas características deste tipo de exercício.`
  }

  return `${basePrompt}
  
  Pontos de análise:${analysisPoints}
  
  Forneça uma análise técnica e precisa em português brasileiro.`
}

// Função auxiliar para extrair frames de vídeo
export function extractVideoFrames(videoFile: File, frameCount: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Não foi possível criar contexto do canvas'))
      return
    }

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const frames: string[] = []
      const duration = video.duration
      const interval = duration / frameCount
      
      let currentTime = 0
      let frameIndex = 0
      
      const extractFrame = () => {
        video.currentTime = currentTime
        
        video.addEventListener('seeked', function onSeeked() {
          video.removeEventListener('seeked', onSeeked)
          
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          frames.push(frameDataUrl)
          
          frameIndex++
          currentTime += interval
          
          if (frameIndex < frameCount && currentTime < duration) {
            extractFrame()
          } else {
            resolve(frames)
          }
        })
      }
      
      extractFrame()
    })

    video.addEventListener('error', () => {
      reject(new Error('Erro ao carregar o vídeo'))
    })

    video.src = URL.createObjectURL(videoFile)
    video.load()
  })
}