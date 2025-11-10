'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Upload, FileText, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function NovoExamePage() {
  const [formData, setFormData] = useState({
    exam_type: '',
    doctor_name: '',
    clinic_name: '',
    notes: '',
    status: 'completed'
  })
  const [examDate, setExamDate] = useState<Date>()
  const [loading, setLoading] = useState(false)

  const examTypes = [
    'Hemograma Completo',
    'Glicemia de Jejum',
    'Colesterol Total',
    'Triglicerídeos',
    'Ureia e Creatinina',
    'Ácido Úrico',
    'TSH e T4 Livre',
    'Vitamina D',
    'Vitamina B12',
    'Ferro Sérico',
    'Raio-X de Tórax',
    'Ultrassom Abdominal',
    'Ecocardiograma',
    'Eletrocardiograma',
    'Mamografia',
    'Papanicolau',
    'Colonoscopia',
    'Endoscopia',
    'Ressonância Magnética',
    'Tomografia Computadorizada',
    'Outro'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!examDate || !formData.exam_type || !formData.doctor_name) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('health_exams')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000001', // ID do usuário demo
          exam_type: formData.exam_type,
          exam_date: format(examDate, 'yyyy-MM-dd'),
          doctor_name: formData.doctor_name,
          clinic_name: formData.clinic_name,
          notes: formData.notes,
          status: formData.status
        })

      if (error) throw error

      toast.success('Exame adicionado com sucesso!')
      
      // Reset form
      setFormData({
        exam_type: '',
        doctor_name: '',
        clinic_name: '',
        notes: '',
        status: 'completed'
      })
      setExamDate(undefined)
      
    } catch (error) {
      console.error('Erro ao salvar exame:', error)
      toast.error('Erro ao salvar exame. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/saude">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                Novo Exame
              </h1>
              <p className="text-gray-600 mt-1">Adicione um novo exame ao seu histórico médico</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Exame</CardTitle>
              <CardDescription>
                Preencha os dados do seu exame médico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de Exame */}
                <div className="space-y-2">
                  <Label htmlFor="exam_type">Tipo de Exame *</Label>
                  <Select 
                    value={formData.exam_type} 
                    onValueChange={(value) => handleInputChange('exam_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de exame" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data do Exame */}
                <div className="space-y-2">
                  <Label>Data do Exame *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {examDate ? (
                          format(examDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={examDate}
                        onSelect={setExamDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Nome do Médico */}
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Nome do Médico *</Label>
                  <Input
                    id="doctor_name"
                    placeholder="Ex: Dr. João Silva"
                    value={formData.doctor_name}
                    onChange={(e) => handleInputChange('doctor_name', e.target.value)}
                    required
                  />
                </div>

                {/* Nome da Clínica */}
                <div className="space-y-2">
                  <Label htmlFor="clinic_name">Nome da Clínica/Laboratório</Label>
                  <Input
                    id="clinic_name"
                    placeholder="Ex: Laboratório Central"
                    value={formData.clinic_name}
                    onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações sobre o exame, resultados, etc."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Upload de Arquivo */}
                <div className="space-y-2">
                  <Label>Arquivo do Exame (opcional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Arraste e solte o arquivo do exame aqui, ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, JPG, PNG até 10MB
                    </p>
                    <Button variant="outline" className="mt-4" type="button">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Salvando...' : 'Salvar Exame'}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/saude">Cancelar</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}