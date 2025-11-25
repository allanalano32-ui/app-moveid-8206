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
import { supabase, isSupabaseConfigured, createHealthExam, createAppointment, createHealthMetric } from '@/lib/supabase'

// Interfaces
interface HealthExam {
  id: number
  exam_type: string
  exam_date: string
  doctor_name: string
  clinic_name: string
  notes: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

interface Appointment {
  id: number
  doctor_name: string
  specialty: string
  appointment_date: string
  clinic_name: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

interface HealthMetric {
  id: number
  metric_type: string
  value: string
  unit: string
  recorded_date: string
  notes: string
  created_at: string
}

export default function SaudePage() {
  const [exams, setExams] = useState<HealthExam[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  // Estados para formulários
  const [newExam, setNewExam] = useState({
    exam_type: '',
    exam_date: '',
    doctor_name: '',
    clinic_name: '',
    notes: '',
    status: 'pending'
  })
  const [newAppointment, setNewAppointment] = useState({
    doctor_name: '',
    specialty: '',
    appointment_date: '',
    clinic_name: '',
    status: 'scheduled'
  })
  const [newMetric, setNewMetric] = useState({
    metric_type: '',
    value: '',
    unit: '',
    recorded_date: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const checkSupabase = async () => {
      const configured = isSupabaseConfigured()
      setSupabaseConfigured(configured)

      if (configured) {
        try {
          // Carregar exames
          const { data: examsData, error: examsError } = await supabase
            .from('health_exams')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (!examsError) {
            setExams(examsData || [])
          }

          // Carregar consultas
          const { data: appointmentsData, error: appointmentsError } = await supabase
            .from('appointments')
            .select('*')
            .order('appointment_date', { ascending: false })
          
          if (!appointmentsError) {
            setAppointments(appointmentsData || [])
          }

          // Carregar métricas
          const { data: metricsData, error: metricsError } = await supabase
            .from('health_metrics')
            .select('*')
            .order('recorded_date', { ascending: false })
          
          if (!metricsError) {
            setMetrics(metricsData || [])
          }
        } catch (error) {
          console.error('Erro ao carregar dados:', error)
        }
      } else {
        // Dados mock quando Supabase não está configurado
        setExams([
          {
            id: 1,
            exam_type: 'Hemograma Completo',
            exam_date: '2024-01-15',
            doctor_name: 'Dr. João Silva',
            clinic_name: 'Laboratório Central',
            notes: 'Exame de rotina',
            status: 'completed',
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-15T14:00:00Z'
          }
        ])
        setAppointments([
          {
            id: 1,
            doctor_name: 'Dra. Maria Santos',
            specialty: 'Cardiologia',
            appointment_date: '2024-02-01T09:00:00Z',
            clinic_name: 'Clínica do Coração',
            status: 'scheduled',
            created_at: '2024-01-20T08:00:00Z'
          }
        ])
        setMetrics([
          {
            id: 1,
            metric_type: 'Pressão Arterial',
            value: '120/80',
            unit: 'mmHg',
            recorded_date: '2024-01-25',
            notes: 'Medição matinal',
            created_at: '2024-01-25T07:30:00Z'
          }
        ])
      }
      setLoading(false)
    }

    checkSupabase()
  }, [])

  // Funções para submeter formulários
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const exam = await createHealthExam(newExam)
      setExams(prev => [exam, ...prev])
      setNewExam({
        exam_type: '',
        exam_date: '',
        doctor_name: '',
        clinic_name: '',
        notes: '',
        status: 'pending'
      })
      alert('Exame criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar exame:', error)
      alert('Erro ao criar exame. Verifique a configuração do Supabase.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const appointment = await createAppointment(newAppointment)
      setAppointments(prev => [appointment, ...prev])
      setNewAppointment({
        doctor_name: '',
        specialty: '',
        appointment_date: '',
        clinic_name: '',
        status: 'scheduled'
      })
      alert('Consulta criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar consulta:', error)
      alert('Erro ao criar consulta. Verifique a configuração do Supabase.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateMetric = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const metric = await createHealthMetric(newMetric)
      setMetrics(prev => [metric, ...prev])
      setNewMetric({
        metric_type: '',
        value: '',
        unit: '',
        recorded_date: '',
        notes: ''
      })
      alert('Métrica criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar métrica:', error)
      alert('Erro ao criar métrica. Verifique a configuração do Supabase.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Carregando dados de saúde...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Saúde</h1>
          </div>
          <div className="flex space-x-2">
            <Badge variant={supabaseConfigured ? "default" : "secondary"}>
              {supabaseConfigured ? "Supabase Conectado" : "Modo Offline"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exams">Exames</TabsTrigger>
            <TabsTrigger value="appointments">Consultas</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>

          {/* Exames Tab */}
          <TabsContent value="exams" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Meus Exames</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Exame
              </Button>
            </div>

            {/* Formulário Novo Exame */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Exame</CardTitle>
                <CardDescription>Preencha os dados do exame médico</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateExam} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exam_type">Tipo de Exame</Label>
                      <Input
                        id="exam_type"
                        value={newExam.exam_type}
                        onChange={(e) => setNewExam({...newExam, exam_type: e.target.value})}
                        placeholder="Ex: Hemograma"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="exam_date">Data do Exame</Label>
                      <Input
                        id="exam_date"
                        type="date"
                        value={newExam.exam_date}
                        onChange={(e) => setNewExam({...newExam, exam_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor_name">Nome do Médico</Label>
                      <Input
                        id="doctor_name"
                        value={newExam.doctor_name}
                        onChange={(e) => setNewExam({...newExam, doctor_name: e.target.value})}
                        placeholder="Dr. João Silva"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clinic_name">Nome da Clínica</Label>
                      <Input
                        id="clinic_name"
                        value={newExam.clinic_name}
                        onChange={(e) => setNewExam({...newExam, clinic_name: e.target.value})}
                        placeholder="Laboratório Central"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={newExam.notes}
                      onChange={(e) => setNewExam({...newExam, notes: e.target.value})}
                      placeholder="Observações sobre o exame"
                    />
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Criando...' : 'Criar Exame'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Exames */}
            <div className="grid gap-4">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{exam.exam_type}</CardTitle>
                        <CardDescription>{exam.clinic_name}</CardDescription>
                      </div>
                      <Badge variant={exam.status === 'completed' ? 'default' : 'secondary'}>
                        {exam.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Data:</p>
                        <p className="text-gray-600">{new Date(exam.exam_date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="font-medium">Médico:</p>
                        <p className="text-gray-600">{exam.doctor_name}</p>
                      </div>
                    </div>
                    {exam.notes && (
                      <div className="mt-4">
                        <p className="font-medium">Observações:</p>
                        <p className="text-gray-600">{exam.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Consultas Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Consultas</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agendar Consulta
              </Button>
            </div>

            {/* Formulário Nova Consulta */}
            <Card>
              <CardHeader>
                <CardTitle>Agendar Nova Consulta</CardTitle>
                <CardDescription>Preencha os dados da consulta médica</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAppointment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor_name">Nome do Médico</Label>
                      <Input
                        id="doctor_name"
                        value={newAppointment.doctor_name}
                        onChange={(e) => setNewAppointment({...newAppointment, doctor_name: e.target.value})}
                        placeholder="Dra. Maria Santos"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Especialidade</Label>
                      <Input
                        id="specialty"
                        value={newAppointment.specialty}
                        onChange={(e) => setNewAppointment({...newAppointment, specialty: e.target.value})}
                        placeholder="Cardiologia"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointment_date">Data e Hora</Label>
                      <Input
                        id="appointment_date"
                        type="datetime-local"
                        value={newAppointment.appointment_date}
                        onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clinic_name">Nome da Clínica</Label>
                      <Input
                        id="clinic_name"
                        value={newAppointment.clinic_name}
                        onChange={(e) => setNewAppointment({...newAppointment, clinic_name: e.target.value})}
                        placeholder="Clínica do Coração"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Agendando...' : 'Agendar Consulta'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Consultas */}
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{appointment.doctor_name}</CardTitle>
                        <CardDescription>{appointment.specialty}</CardDescription>
                      </div>
                      <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                        {appointment.status === 'completed' ? 'Concluída' : 'Agendada'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Data/Hora:</p>
                        <p className="text-gray-600">{new Date(appointment.appointment_date).toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="font-medium">Clínica:</p>
                        <p className="text-gray-600">{appointment.clinic_name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Métricas Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Métricas</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Métrica
              </Button>
            </div>

            {/* Formulário Nova Métrica */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Nova Métrica</CardTitle>
                <CardDescription>Registre uma nova medição de saúde</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMetric} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="metric_type">Tipo de Métrica</Label>
                      <Input
                        id="metric_type"
                        value={newMetric.metric_type}
                        onChange={(e) => setNewMetric({...newMetric, metric_type: e.target.value})}
                        placeholder="Ex: Pressão Arterial"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Valor</Label>
                      <Input
                        id="value"
                        value={newMetric.value}
                        onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
                        placeholder="120/80"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unidade</Label>
                      <Input
                        id="unit"
                        value={newMetric.unit}
                        onChange={(e) => setNewMetric({...newMetric, unit: e.target.value})}
                        placeholder="mmHg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recorded_date">Data da Medição</Label>
                      <Input
                        id="recorded_date"
                        type="date"
                        value={newMetric.recorded_date}
                        onChange={(e) => setNewMetric({...newMetric, recorded_date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={newMetric.notes}
                        onChange={(e) => setNewMetric({...newMetric, notes: e.target.value})}
                        placeholder="Observações sobre a medição"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Registrando...' : 'Registrar Métrica'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Métricas */}
            <div className="grid gap-4">
              {metrics.map((metric) => (
                <Card key={metric.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{metric.metric_type}</CardTitle>
                        <CardDescription>{metric.value} {metric.unit}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {new Date(metric.recorded_date).toLocaleDateString('pt-BR')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {metric.notes && (
                      <div>
                        <p className="font-medium">Observações:</p>
                        <p className="text-gray-600">{metric.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}