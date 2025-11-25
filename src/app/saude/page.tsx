'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Heart,
  Calendar,
  FileText,
  TrendingUp,
  Plus,
  Activity,
  Stethoscope,
  Pill,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { supabase, isSupabaseConfigured, createHealthExam, createAppointment, createHealthMetric, HealthExam, Appointment, HealthMetric } from '@/lib/supabase'

export default function SaudePage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [healthExams, setHealthExams] = useState<HealthExam[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Estados para formulários
  const [examForm, setExamForm] = useState({
    exam_type: '',
    exam_date: '',
    doctor_name: '',
    clinic_name: '',
    notes: '',
    status: 'pending' as const
  })

  const [appointmentForm, setAppointmentForm] = useState({
    doctor_name: '',
    specialty: '',
    appointment_date: '',
    clinic_name: '',
    status: 'scheduled' as const
  })

  const [metricForm, setMetricForm] = useState({
    metric_type: '',
    value: '',
    unit: '',
    recorded_date: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!isSupabaseConfigured()) return

    try {
      const [examsRes, appointmentsRes, metricsRes] = await Promise.all([
        supabase?.from('health_exams').select('*').order('created_at', { ascending: false }),
        supabase?.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase?.from('health_metrics').select('*').order('created_at', { ascending: false })
      ])

      if (examsRes?.data) setHealthExams(examsRes.data)
      if (appointmentsRes?.data) setAppointments(appointmentsRes.data)
      if (metricsRes?.data) setHealthMetrics(metricsRes.data)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    }
  }

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não está configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      }

      const newExam = await createHealthExam(examForm)
      setHealthExams(prev => [newExam, ...prev])
      setExamForm({
        exam_type: '',
        exam_date: '',
        doctor_name: '',
        clinic_name: '',
        notes: '',
        status: 'pending'
      })
      setSuccess('Exame criado com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar exame')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não está configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      }

      const newAppointment = await createAppointment(appointmentForm)
      setAppointments(prev => [newAppointment, ...prev])
      setAppointmentForm({
        doctor_name: '',
        specialty: '',
        appointment_date: '',
        clinic_name: '',
        status: 'scheduled'
      })
      setSuccess('Consulta agendada com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao agendar consulta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMetric = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não está configurado. Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      }

      const newMetric = await createHealthMetric(metricForm)
      setHealthMetrics(prev => [newMetric, ...prev])
      setMetricForm({
        metric_type: '',
        value: '',
        unit: '',
        recorded_date: '',
        notes: ''
      })
      setSuccess('Métrica registrada com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar métrica')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saúde e Bem-estar</h1>
            <p className="text-gray-600 mt-2">Gerencie seus exames, consultas e métricas de saúde</p>
          </div>
          <Button asChild>
            <Link href="/">
              <Heart className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
        </div>

        {!isSupabaseConfigured() && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Supabase não configurado</h3>
                  <p className="text-yellow-700 text-sm">
                    Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para salvar dados no banco.
                    Por enquanto, os dados são exibidos apenas localmente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-700">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="exams">Exames</TabsTrigger>
            <TabsTrigger value="appointments">Consultas</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Exames</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthExams.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {healthExams.filter(e => e.status === 'completed').length} concluídos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {appointments.filter(a => new Date(a.appointment_date) > new Date()).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {appointments.filter(a => a.status === 'scheduled').length} agendadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Métricas Registradas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{healthMetrics.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Última: {healthMetrics[0]?.recorded_date || 'Nenhuma'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Adicione novos registros rapidamente</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <Button onClick={() => setActiveTab('exams')} variant="outline" className="h-20">
                  <div className="text-center">
                    <Stethoscope className="h-6 w-6 mx-auto mb-2" />
                    Novo Exame
                  </div>
                </Button>
                <Button onClick={() => setActiveTab('appointments')} variant="outline" className="h-20">
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    Agendar Consulta
                  </div>
                </Button>
                <Button onClick={() => setActiveTab('metrics')} variant="outline" className="h-20">
                  <div className="text-center">
                    <Activity className="h-6 w-6 mx-auto mb-2" />
                    Nova Métrica
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Novo Exame</CardTitle>
                <CardDescription>Adicione um novo exame médico</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateExam} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exam_type">Tipo de Exame</Label>
                      <Input
                        id="exam_type"
                        value={examForm.exam_type}
                        onChange={(e) => setExamForm(prev => ({ ...prev, exam_type: e.target.value }))}
                        placeholder="Ex: Sangue, Raio-X, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="exam_date">Data do Exame</Label>
                      <Input
                        id="exam_date"
                        type="date"
                        value={examForm.exam_date}
                        onChange={(e) => setExamForm(prev => ({ ...prev, exam_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor_name">Médico</Label>
                      <Input
                        id="doctor_name"
                        value={examForm.doctor_name}
                        onChange={(e) => setExamForm(prev => ({ ...prev, doctor_name: e.target.value }))}
                        placeholder="Nome do médico"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clinic_name">Clínica</Label>
                      <Input
                        id="clinic_name"
                        value={examForm.clinic_name}
                        onChange={(e) => setExamForm(prev => ({ ...prev, clinic_name: e.target.value }))}
                        placeholder="Nome da clínica"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="exam_notes">Observações</Label>
                    <Textarea
                      id="exam_notes"
                      value={examForm.notes}
                      onChange={(e) => setExamForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações adicionais"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exam_status">Status</Label>
                    <Select value={examForm.status} onValueChange={(value: any) => setExamForm(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar Exame'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exames Registrados</CardTitle>
              </CardHeader>
              <CardContent>
                {healthExams.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum exame registrado ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {healthExams.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{exam.exam_type}</h4>
                          <p className="text-sm text-gray-600">
                            {exam.doctor_name} - {exam.clinic_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(exam.exam_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge variant={exam.status === 'completed' ? 'default' : exam.status === 'pending' ? 'secondary' : 'destructive'}>
                          {exam.status === 'completed' ? 'Concluído' : exam.status === 'pending' ? 'Pendente' : 'Cancelado'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendar Consulta</CardTitle>
                <CardDescription>Agende uma nova consulta médica</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAppointment} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointment_doctor">Médico</Label>
                      <Input
                        id="appointment_doctor"
                        value={appointmentForm.doctor_name}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, doctor_name: e.target.value }))}
                        placeholder="Nome do médico"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="appointment_specialty">Especialidade</Label>
                      <Input
                        id="appointment_specialty"
                        value={appointmentForm.specialty}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, specialty: e.target.value }))}
                        placeholder="Ex: Cardiologia, Dermatologia"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointment_date">Data e Hora</Label>
                      <Input
                        id="appointment_date"
                        type="datetime-local"
                        value={appointmentForm.appointment_date}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointment_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="appointment_clinic">Clínica</Label>
                      <Input
                        id="appointment_clinic"
                        value={appointmentForm.clinic_name}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, clinic_name: e.target.value }))}
                        placeholder="Nome da clínica"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Agendando...' : 'Agendar Consulta'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consultas Agendadas</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma consulta agendada.</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{appointment.doctor_name}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.specialty} - {appointment.clinic_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.appointment_date).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                          {appointment.status === 'completed' ? 'Concluída' : 'Agendada'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Métrica</CardTitle>
                <CardDescription>Registre uma nova métrica de saúde</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMetric} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="metric_type">Tipo de Métrica</Label>
                      <Select value={metricForm.metric_type} onValueChange={(value) => setMetricForm(prev => ({ ...prev, metric_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peso">Peso</SelectItem>
                          <SelectItem value="altura">Altura</SelectItem>
                          <SelectItem value="pressao_arterial">Pressão Arterial</SelectItem>
                          <SelectItem value="frequencia_cardiaca">Frequência Cardíaca</SelectItem>
                          <SelectItem value="glicemia">Glicemia</SelectItem>
                          <SelectItem value="colesterol">Colesterol</SelectItem>
                          <SelectItem value="imc">IMC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="metric_value">Valor</Label>
                      <Input
                        id="metric_value"
                        type="number"
                        step="0.01"
                        value={metricForm.value}
                        onChange={(e) => setMetricForm(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="Ex: 70.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="metric_unit">Unidade</Label>
                      <Input
                        id="metric_unit"
                        value={metricForm.unit}
                        onChange={(e) => setMetricForm(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="Ex: kg, cm, mmHg"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="metric_date">Data de Registro</Label>
                    <Input
                      id="metric_date"
                      type="date"
                      value={metricForm.recorded_date}
                      onChange={(e) => setMetricForm(prev => ({ ...prev, recorded_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="metric_notes">Observações</Label>
                    <Textarea
                      id="metric_notes"
                      value={metricForm.notes}
                      onChange={(e) => setMetricForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações adicionais"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar Métrica'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Registradas</CardTitle>
              </CardHeader>
              <CardContent>
                {healthMetrics.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma métrica registrada ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {healthMetrics.map((metric) => (
                      <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{metric.metric_type}</h4>
                          <p className="text-sm text-gray-600">
                            {metric.value} {metric.unit}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(metric.recorded_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          {metric.notes && (
                            <p className="text-sm text-gray-600">{metric.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}