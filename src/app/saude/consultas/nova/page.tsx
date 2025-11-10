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
import { CalendarIcon, Clock, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function NovaConsultaPage() {
  const [formData, setFormData] = useState({
    doctor_name: '',
    specialty: '',
    clinic_name: '',
    clinic_address: '',
    notes: '',
    status: 'scheduled'
  })
  const [appointmentDate, setAppointmentDate] = useState<Date>()
  const [appointmentTime, setAppointmentTime] = useState('')
  const [loading, setLoading] = useState(false)

  const specialties = [
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Ginecologia',
    'Neurologia',
    'Oftalmologia',
    'Ortopedia',
    'Otorrinolaringologia',
    'Pediatria',
    'Pneumologia',
    'Psiquiatria',
    'Urologia',
    'Clínica Geral',
    'Outro'
  ]

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!appointmentDate || !appointmentTime || !formData.doctor_name || !formData.specialty) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)

    try {
      // Combinar data e hora
      const [hours, minutes] = appointmentTime.split(':')
      const appointmentDateTime = new Date(appointmentDate)
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes))

      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000001', // ID do usuário demo
          doctor_name: formData.doctor_name,
          specialty: formData.specialty,
          appointment_date: appointmentDateTime.toISOString(),
          clinic_name: formData.clinic_name,
          clinic_address: formData.clinic_address,
          notes: formData.notes,
          status: formData.status
        })

      if (error) throw error

      toast.success('Consulta agendada com sucesso!')
      
      // Reset form
      setFormData({
        doctor_name: '',
        specialty: '',
        clinic_name: '',
        clinic_address: '',
        notes: '',
        status: 'scheduled'
      })
      setAppointmentDate(undefined)
      setAppointmentTime('')
      
    } catch (error) {
      console.error('Erro ao agendar consulta:', error)
      toast.error('Erro ao agendar consulta. Tente novamente.')
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
                <CalendarIcon className="h-8 w-8 text-blue-600" />
                Nova Consulta
              </h1>
              <p className="text-gray-600 mt-1">Agende uma nova consulta médica</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Consulta</CardTitle>
              <CardDescription>
                Preencha os dados da sua consulta médica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Especialidade */}
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade *</Label>
                  <Select 
                    value={formData.specialty} 
                    onValueChange={(value) => handleInputChange('specialty', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data da Consulta */}
                <div className="space-y-2">
                  <Label>Data da Consulta *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {appointmentDate ? (
                          format(appointmentDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={appointmentDate}
                        onSelect={setAppointmentDate}
                        initialFocus
                        locale={ptBR}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Horário */}
                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nome da Clínica */}
                <div className="space-y-2">
                  <Label htmlFor="clinic_name">Nome da Clínica/Hospital</Label>
                  <Input
                    id="clinic_name"
                    placeholder="Ex: Hospital São Paulo"
                    value={formData.clinic_name}
                    onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                  />
                </div>

                {/* Endereço da Clínica */}
                <div className="space-y-2">
                  <Label htmlFor="clinic_address">Endereço da Clínica</Label>
                  <Input
                    id="clinic_address"
                    placeholder="Ex: Rua das Flores, 123 - São Paulo"
                    value={formData.clinic_address}
                    onChange={(e) => handleInputChange('clinic_address', e.target.value)}
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
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Motivo da consulta, sintomas, etc."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Agendando...' : 'Agendar Consulta'}
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