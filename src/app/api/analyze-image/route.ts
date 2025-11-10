import { NextRequest, NextResponse } from 'next/server'
import { analyzeMovementImage } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const analysisType = (formData.get('analysisType') as string) || 'movement'

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de imagem foi enviado' },
        { status: 400 }
      )
    }

    // Verificar se é um arquivo de imagem
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'O arquivo deve ser uma imagem' },
        { status: 400 }
      )
    }

    // Verificar tamanho do arquivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'O arquivo é muito grande. Máximo permitido: 10MB' },
        { status: 400 }
      )
    }

    // Converter imagem para base64
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString('base64')
    const imageUrl = `data:${imageFile.type};base64,${imageBase64}`

    // Analisar imagem com OpenAI
    const analysisResult = await analyzeMovementImage(
      imageUrl, 
      analysisType as 'movement' | 'posture' | 'biomechanics'
    )

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      metadata: {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        analysisType
      }
    })

  } catch (error) {
    console.error('Erro na análise de imagem:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erro interno do servidor ao processar a imagem' 
      },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const maxDuration = 30