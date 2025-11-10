import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { VideoAnalysisResult } from './openai'

export interface PDFGenerationOptions {
  analysisResult: VideoAnalysisResult
  videoFrame?: string // Base64 da imagem do vídeo
  patientName?: string
  exerciseType?: string
  date?: Date
  includeGraphs?: boolean
  includeVideoFrame?: boolean
}

export class PDFGenerator {
  private pdf: jsPDF
  private currentY: number = 20
  private pageHeight: number = 297 // A4 height in mm
  private margin: number = 20

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4')
  }

  async generateAnalysisReport(options: PDFGenerationOptions): Promise<Blob> {
    const {
      analysisResult,
      videoFrame,
      patientName = 'Usuário',
      exerciseType = 'Movimento Analisado',
      date = new Date(),
      includeGraphs = true,
      includeVideoFrame = true
    } = options

    // Header
    this.addHeader(patientName, exerciseType, date)
    
    // Executive Summary
    this.addExecutiveSummary(analysisResult)
    
    // Video Frame Analysis (if available)
    if (includeVideoFrame && videoFrame) {
      await this.addVideoFrameAnalysis(videoFrame)
    }
    
    // Biomechanical Parameters
    this.addBiomechanicalParameters(analysisResult)
    
    // Movement Phases Analysis
    if (analysisResult.movement_phases?.length > 0) {
      this.addMovementPhasesAnalysis(analysisResult.movement_phases)
    }
    
    // Graphical Analysis
    if (includeGraphs) {
      await this.addGraphicalAnalysis(analysisResult)
    }
    
    // Risk Assessment
    this.addRiskAssessment(analysisResult)
    
    // Clinical Recommendations
    this.addClinicalRecommendations(analysisResult)
    
    // Technical Appendix
    this.addTechnicalAppendix(analysisResult)
    
    // Footer
    this.addFooter()

    return new Blob([this.pdf.output('blob')], { type: 'application/pdf' })
  }

  private addHeader(patientName: string, exerciseType: string, date: Date) {
    // Logo/Title
    this.pdf.setFontSize(24)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('RELATÓRIO DE ANÁLISE DE MOVIMENTO', this.margin, this.currentY)
    
    this.currentY += 15
    
    // Subtitle
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text('Análise Computacional de Movimento com Inteligência Artificial', this.margin, this.currentY)
    
    this.currentY += 20
    
    // Patient Info Box
    this.pdf.setDrawColor(0, 102, 204)
    this.pdf.setFillColor(240, 248, 255)
    this.pdf.rect(this.margin, this.currentY - 5, 170, 25, 'FD')
    
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('DADOS DO USUÁRIO', this.margin + 5, this.currentY + 3)
    
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text(`Usuário: ${patientName}`, this.margin + 5, this.currentY + 10)
    this.pdf.text(`Exercício: ${exerciseType}`, this.margin + 5, this.currentY + 16)
    this.pdf.text(`Data da Análise: ${date.toLocaleDateString('pt-BR')}`, this.margin + 90, this.currentY + 10)
    this.pdf.text(`Hora: ${date.toLocaleTimeString('pt-BR')}`, this.margin + 90, this.currentY + 16)
    
    this.currentY += 35
  }

  private addExecutiveSummary(result: VideoAnalysisResult) {
    this.addSectionTitle('1. RESUMO EXECUTIVO')
    
    // Score Box
    this.pdf.setDrawColor(0, 150, 0)
    this.pdf.setFillColor(240, 255, 240)
    this.pdf.rect(this.margin, this.currentY, 170, 20, 'FD')
    
    this.pdf.setFontSize(16)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(`SCORE GERAL: ${result.score}/100`, this.margin + 5, this.currentY + 8)
    
    const scoreLabel = this.getScoreLabel(result.score)
    const scoreColor = this.getScoreColor(result.score)
    this.pdf.setTextColor(...scoreColor)
    this.pdf.text(`(${scoreLabel})`, this.margin + 5, this.currentY + 15)
    this.pdf.setTextColor(0, 0, 0)
    
    this.currentY += 30
    
    // Description
    this.pdf.setFontSize(11)
    this.pdf.setFont('helvetica', 'normal')
    const description = this.wrapText(result.description, 170)
    description.forEach(line => {
      this.pdf.text(line, this.margin, this.currentY)
      this.currentY += 5
    })
    
    this.currentY += 10
    
    // Confidence Score
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(`Nível de Confiança da IA: ${Math.round((result.confidence_score || 0.85) * 100)}%`, this.margin, this.currentY)
    this.currentY += 15
  }

  private async addVideoFrameAnalysis(videoFrame: string) {
    this.checkPageBreak(80)
    
    this.addSectionTitle('2. ANÁLISE DO FRAME DE VÍDEO')
    
    try {
      // Add video frame image
      this.pdf.addImage(videoFrame, 'JPEG', this.margin, this.currentY, 80, 60)
      
      // Add annotations box
      this.pdf.setDrawColor(255, 165, 0)
      this.pdf.setFillColor(255, 248, 220)
      this.pdf.rect(this.margin + 85, this.currentY, 85, 60, 'FD')
      
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text('PONTOS DE ANÁLISE:', this.margin + 88, this.currentY + 8)
      
      this.pdf.setFont('helvetica', 'normal')
      const annotations = [
        '• Alinhamento postural',
        '• Ângulos articulares',
        '• Compensações',
        '• Padrões de movimento',
        '• Estabilidade central',
        '• Simetria bilateral'
      ]
      
      annotations.forEach((annotation, index) => {
        this.pdf.text(annotation, this.margin + 88, this.currentY + 15 + (index * 6))
      })
      
      this.currentY += 70
    } catch (error) {
      console.error('Erro ao adicionar frame do vídeo:', error)
      this.pdf.text('Frame do vídeo não disponível', this.margin, this.currentY)
      this.currentY += 10
    }
  }

  private addBiomechanicalParameters(result: VideoAnalysisResult) {
    this.checkPageBreak(100)
    
    this.addSectionTitle('3. PARÂMETROS DETALHADOS')
    
    if (result.biomechanics?.joint_angles && Object.keys(result.biomechanics.joint_angles).length > 0) {
      // Joint Angles Table
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text('3.1 ÂNGULOS ARTICULARES', this.margin, this.currentY)
      this.currentY += 10
      
      // Table header
      this.pdf.setDrawColor(0, 0, 0)
      this.pdf.setFillColor(230, 230, 230)
      this.pdf.rect(this.margin, this.currentY, 170, 8, 'FD')
      
      this.pdf.setFontSize(10)
      this.pdf.text('ARTICULAÇÃO', this.margin + 2, this.currentY + 5)
      this.pdf.text('ÂNGULO (°)', this.margin + 60, this.currentY + 5)
      this.pdf.text('REFERÊNCIA NORMAL', this.margin + 100, this.currentY + 5)
      this.pdf.text('AVALIAÇÃO', this.margin + 140, this.currentY + 5)
      
      this.currentY += 10
      
      // Table rows
      Object.entries(result.biomechanics.joint_angles).forEach(([joint, angle]) => {
        const normalRange = this.getNormalRange(joint)
        const evaluation = this.evaluateAngle(joint, angle, normalRange)
        
        this.pdf.setFont('helvetica', 'normal')
        this.pdf.text(joint.charAt(0).toUpperCase() + joint.slice(1), this.margin + 2, this.currentY + 5)
        this.pdf.text(`${angle}°`, this.margin + 60, this.currentY + 5)
        this.pdf.text(normalRange, this.margin + 100, this.currentY + 5)
        
        // Color code evaluation
        const evalColor = evaluation.includes('Normal') ? [0, 150, 0] : 
                         evaluation.includes('Atenção') ? [255, 165, 0] : [255, 0, 0]
        this.pdf.setTextColor(...evalColor)
        this.pdf.text(evaluation, this.margin + 140, this.currentY + 5)
        this.pdf.setTextColor(0, 0, 0)
        
        this.pdf.rect(this.margin, this.currentY, 170, 8, 'S')
        this.currentY += 8
      })
      
      this.currentY += 10
    }
    
    // Muscle Activation
    if (result.biomechanics?.muscle_activation?.length > 0) {
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text('3.2 ATIVAÇÃO MUSCULAR IDENTIFICADA', this.margin, this.currentY)
      this.currentY += 8
      
      this.pdf.setFont('helvetica', 'normal')
      result.biomechanics.muscle_activation.forEach((muscle, index) => {
        this.pdf.text(`• ${muscle.charAt(0).toUpperCase() + muscle.slice(1)}`, this.margin + 5, this.currentY)
        this.currentY += 6
      })
      
      this.currentY += 10
    }
  }

  private addMovementPhasesAnalysis(phases: any[]) {
    this.checkPageBreak(60)
    
    this.addSectionTitle('4. ANÁLISE DAS FASES DO MOVIMENTO')
    
    phases.forEach((phase, index) => {
      this.checkPageBreak(25)
      
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(`4.${index + 1} ${phase.phase.toUpperCase()}`, this.margin, this.currentY)
      this.currentY += 8
      
      // Phase info box
      this.pdf.setDrawColor(0, 102, 204)
      this.pdf.setFillColor(245, 250, 255)
      this.pdf.rect(this.margin, this.currentY, 170, 20, 'FD')
      
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(`Timestamp: ${phase.timestamp}%`, this.margin + 5, this.currentY + 6)
      this.pdf.text(`Score de Qualidade: ${phase.quality_score}/100`, this.margin + 5, this.currentY + 12)
      
      // Quality bar
      const barWidth = (phase.quality_score / 100) * 60
      this.pdf.setFillColor(0, 150, 0)
      this.pdf.rect(this.margin + 90, this.currentY + 8, barWidth, 4, 'F')
      this.pdf.setDrawColor(0, 0, 0)
      this.pdf.rect(this.margin + 90, this.currentY + 8, 60, 4, 'S')
      
      this.currentY += 25
      
      // Analysis text
      const analysisLines = this.wrapText(phase.analysis, 170)
      analysisLines.forEach(line => {
        this.pdf.text(line, this.margin, this.currentY)
        this.currentY += 5
      })
      
      this.currentY += 10
    })
  }

  private async addGraphicalAnalysis(result: VideoAnalysisResult) {
    this.checkPageBreak(120)
    
    this.addSectionTitle('5. ANÁLISE GRÁFICA')
    
    // Create canvas for charts
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 400
    const ctx = canvas.getContext('2d')
    
    if (ctx && result.biomechanics?.joint_angles) {
      // Joint angles radar chart
      const angles = Object.values(result.biomechanics.joint_angles)
      const labels = Object.keys(result.biomechanics.joint_angles)
      
      // Simple bar chart
      ctx.fillStyle = '#f8f9fa'
      ctx.fillRect(0, 0, 600, 400)
      
      // Chart title
      ctx.fillStyle = '#333'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Ângulos Articulares (Graus)', 300, 30)
      
      // Draw bars
      const barWidth = 500 / labels.length
      const maxAngle = Math.max(...angles)
      
      labels.forEach((label, index) => {
        const angle = angles[index]
        const barHeight = (angle / maxAngle) * 300
        const x = 50 + index * barWidth
        const y = 350 - barHeight
        
        // Bar
        ctx.fillStyle = '#0066cc'
        ctx.fillRect(x, y, barWidth - 10, barHeight)
        
        // Label
        ctx.fillStyle = '#333'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(label, x + barWidth/2, 370)
        
        // Value
        ctx.fillText(`${angle}°`, x + barWidth/2, y - 5)
      })
      
      // Add chart to PDF
      const chartImage = canvas.toDataURL('image/png')
      this.pdf.addImage(chartImage, 'PNG', this.margin, this.currentY, 170, 100)
      this.currentY += 110
    }
  }

  private addRiskAssessment(result: VideoAnalysisResult) {
    this.checkPageBreak(60)
    
    this.addSectionTitle('6. AVALIAÇÃO DE RISCOS')
    
    if (result.biomechanics?.risk_factors?.length > 0) {
      // Risk level calculation
      const riskLevel = this.calculateRiskLevel(result)
      const riskColor = riskLevel === 'Baixo' ? [0, 150, 0] : 
                      riskLevel === 'Médio' ? [255, 165, 0] : [255, 0, 0]
      
      // Risk level box
      this.pdf.setDrawColor(...riskColor)
      this.pdf.setFillColor(255, 245, 245)
      this.pdf.rect(this.margin, this.currentY, 170, 15, 'FD')
      
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.setTextColor(...riskColor)
      this.pdf.text(`NÍVEL DE RISCO: ${riskLevel.toUpperCase()}`, this.margin + 5, this.currentY + 10)
      this.pdf.setTextColor(0, 0, 0)
      
      this.currentY += 20
      
      // Risk factors
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text('FATORES IDENTIFICADOS:', this.margin, this.currentY)
      this.currentY += 8
      
      this.pdf.setFont('helvetica', 'normal')
      result.biomechanics.risk_factors.forEach(risk => {
        this.pdf.text(`• ${risk}`, this.margin + 5, this.currentY)
        this.currentY += 6
      })
      
      this.currentY += 10
    } else {
      this.pdf.setDrawColor(0, 150, 0)
      this.pdf.setFillColor(240, 255, 240)
      this.pdf.rect(this.margin, this.currentY, 170, 15, 'FD')
      
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.setTextColor(0, 150, 0)
      this.pdf.text('NENHUM FATOR DE RISCO SIGNIFICATIVO IDENTIFICADO', this.margin + 5, this.currentY + 10)
      this.pdf.setTextColor(0, 0, 0)
      
      this.currentY += 25
    }
  }

  private addClinicalRecommendations(result: VideoAnalysisResult) {
    this.checkPageBreak(80)
    
    this.addSectionTitle('7. RECOMENDAÇÕES PERSONALIZADAS')
    
    if (result.recommendations?.length > 0) {
      this.pdf.setFont('helvetica', 'normal')
      result.recommendations.forEach((recommendation, index) => {
        this.checkPageBreak(15)
        
        this.pdf.setFont('helvetica', 'bold')
        this.pdf.text(`7.${index + 1}`, this.margin, this.currentY)
        
        this.pdf.setFont('helvetica', 'normal')
        const recLines = this.wrapText(recommendation, 160)
        recLines.forEach((line, lineIndex) => {
          this.pdf.text(line, this.margin + 15, this.currentY + (lineIndex * 5))
        })
        
        this.currentY += (recLines.length * 5) + 5
      })
    }
    
    this.currentY += 10
  }

  private addTechnicalAppendix(result: VideoAnalysisResult) {
    this.checkPageBreak(60)
    
    this.addSectionTitle('8. APÊNDICE TÉCNICO')
    
    // Technical parameters
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('8.1 PARÂMETROS TÉCNICOS DA ANÁLISE', this.margin, this.currentY)
    this.currentY += 8
    
    this.pdf.setFont('helvetica', 'normal')
    const technicalData = [
      `• Algoritmo: OpenAI Vision API com análise de movimento`,
      `• Confiança da IA: ${Math.round((result.confidence_score || 0.85) * 100)}%`,
      `• Método: Análise computacional de movimento`,
      `• Referências: Padrões estabelecidos`,
      `• Data de processamento: ${new Date().toLocaleString('pt-BR')}`
    ]
    
    technicalData.forEach(data => {
      this.pdf.text(data, this.margin, this.currentY)
      this.currentY += 6
    })
    
    this.currentY += 15
    
    // Disclaimer
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('IMPORTANTE:', this.margin, this.currentY)
    this.currentY += 6
    
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setFontSize(9)
    const disclaimer = this.wrapText(
      'Este relatório foi gerado por inteligência artificial e deve ser interpretado por profissional qualificado. ' +
      'As recomendações são baseadas em análise computacional e não substituem avaliação presencial.',
      170
    )
    
    disclaimer.forEach(line => {
      this.pdf.text(line, this.margin, this.currentY)
      this.currentY += 4
    })
  }

  private addFooter() {
    const pageCount = this.pdf.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i)
      this.pdf.setFontSize(8)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(
        `MoveID - Análise de Movimento com IA | Página ${i} de ${pageCount} | ${new Date().toLocaleDateString('pt-BR')}`,
        this.margin,
        this.pageHeight - 10
      )
    }
  }

  // Helper methods
  private addSectionTitle(title: string) {
    this.checkPageBreak(20)
    
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(0, 102, 204)
    this.pdf.text(title, this.margin, this.currentY)
    this.pdf.setTextColor(0, 0, 0)
    
    // Underline
    this.pdf.setDrawColor(0, 102, 204)
    this.pdf.line(this.margin, this.currentY + 2, this.margin + 170, this.currentY + 2)
    
    this.currentY += 15
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.pdf.addPage()
      this.currentY = 20
    }
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const textWidth = this.pdf.getTextWidth(testLine)
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }

  private getScoreLabel(score: number): string {
    if (score >= 90) return 'Excelente'
    if (score >= 80) return 'Muito Bom'
    if (score >= 70) return 'Bom'
    if (score >= 60) return 'Regular'
    if (score >= 50) return 'Precisa Melhorar'
    return 'Crítico'
  }

  private getScoreColor(score: number): [number, number, number] {
    if (score >= 85) return [0, 150, 0]
    if (score >= 70) return [0, 100, 200]
    if (score >= 50) return [255, 165, 0]
    return [255, 0, 0]
  }

  private getNormalRange(joint: string): string {
    const ranges: { [key: string]: string } = {
      'joelho': '0-135°',
      'quadril': '0-120°',
      'tornozelo': '0-50°',
      'tronco': '0-45°',
      'ombro': '0-180°',
      'cotovelo': '0-145°'
    }
    return ranges[joint.toLowerCase()] || 'N/A'
  }

  private evaluateAngle(joint: string, angle: number, normalRange: string): string {
    // Simplified evaluation logic
    if (joint.toLowerCase() === 'joelho') {
      if (angle >= 80 && angle <= 135) return 'Normal'
      if (angle >= 60 && angle < 80) return 'Atenção'
      return 'Crítico'
    }
    return 'Normal' // Default for other joints
  }

  private calculateRiskLevel(result: VideoAnalysisResult): string {
    const riskFactors = result.biomechanics?.risk_factors?.length || 0
    const score = result.score
    
    if (riskFactors === 0 && score >= 80) return 'Baixo'
    if (riskFactors <= 2 && score >= 60) return 'Médio'
    return 'Alto'
  }
}

// Export utility function
export async function generateScientificPDF(options: PDFGenerationOptions): Promise<Blob> {
  const generator = new PDFGenerator()
  return await generator.generateAnalysisReport(options)
}