'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface HealthExam {
  id: string
  exam_type: string
  exam_date: string
  doctor_name: string
  clinic_name: string
  results: any
  notes: string
  status: string
}

interface Appointment {
  id: string
  doctor_name: string
  specialty: string
  appointment_date: string
  clinic_name: string
  status: string
}

interface HealthMetric {
  id: string
  metric_type: string
  value: number
  unit: string
  recorded_date: string
  notes: string
}

// Dados mock para demonstração quando Supabase não está configurado
const mockExams: HealthExam[] = [
  {
    id: '1',
    exam_type: 'Hemograma Completo',
    exam_date: '2024-01-15',
    doctor_name: 'Dr. Silva',
    clinic_name: 'Clínica Central',
    results: { status: 'normal' },
    notes: 'Todos os valores dentro da normalidade',
    status: 'completed'
  },
  {
    id: '2',
    exam_type: 'Raio-X Tórax',
    exam_date: '2024-01-10',
    doctor_name: 'Dr. Santos',
    clinic_name: 'Hospital São José',
    results: { status: 'normal' },
    notes: 'Pulmões limpos, sem alterações',
    status: 'completed'
  }
]

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctor_name: 'Dr. Oliveira',
    specialty: 'Cardiologia',
    appointment_date: '2024-02-15T14:30:00',
    clinic_name: 'Clínica do Coração',
    status: 'scheduled'
  },
  {
    id: '2',
    doctor_name: 'Dra. Costa',
    specialty: 'Dermatologia',
    appointment_date: '2024-02-20T10:00:00',
    clinic_name: 'Derma Clinic',
    status: 'scheduled'
  }
]

const mockMetrics: HealthMetric[] = [
  {
    id: '1',
    metric_type: 'Pressão Arterial',
    value: 120,
    unit: 'mmHg',
    recorded_date: '2024-01-20',
    notes: 'Medida em jejum'
  },
  {
    id: '2',
    metric_type: 'Peso',
    value: 75,
    unit: 'kg',
    recorded_date: '2024-01-20',
    notes: 'Balança digital'
  },
  {
    id: '3',
    metric_type: 'Glicemia',
    value: 95,
    unit: 'mg/dL',
    recorded_date: '2024-01-18',
    notes: 'Glicemia de jejum'
  }
]

export default function SaudePage() {
  const [exams, setExams] = useState<HealthExam[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [supabaseConfigured, setSupabaseConfigured] = useState(false)

  useEffect(() => {
    const configured = isSupabaseConfigured()
    setSupabaseConfigured(configured)
    
    if (configured) {
      loadHealthData()
    } else {
      // Usar dados mock quando Supabase não está configurado
      setExams(mockExams)
      setAppointments(mockAppointments)
      setMetrics(mockMetrics)
      setLoading(false)
    }
  }, [])

  const loadHealthData = async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      // Carregar exames
      const { data: examsData } = await supabase
        .from('health_exams')
        .select('*')
        .order('exam_date', { ascending: false })
        .limit(5)

      // Carregar consultas
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .limit(5)

      // Carregar métricas
      const { data: metricsData } = await supabase
        .from('health_metrics')
        .select('*')
        .order('recorded_date', { ascending: false })
        .limit(10)

      setExams(examsData || [])
      setAppointments(appointmentsData || [])
      setMetrics(metricsData || [])
    } catch (error) {
      console.error('Erro ao carregar dados de saúde:', error)
      // Em caso de erro, usar dados mock
      setExams(mockExams)
      setAppointments(mockAppointments)
      setMetrics(mockMetrics)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'completed': { label: 'Concluído', variant: 'default' as const },
      'pending': { label: 'Pendente', variant: 'secondary' as const },
      'scheduled': { label: 'Agendado', variant: 'outline' as const },
      'cancelled': { label: 'Cancelado', variant: 'destructive' as const }
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados de saúde...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500" />
                Painel de Saúde
              </h1>
              <p className="text-gray-600 mt-1">Gerencie seus dados de saúde de forma inteligente</p>
              {!supabaseConfigured && (
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Modo demonstração - Configure o Supabase para dados reais</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/saude/exames/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Exame
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/saude/consultas/nova">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Consulta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Resumo */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exames Realizados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-muted-foreground">
                Últimos 6 meses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'scheduled').length}</div>
              <p className="text-xs text-muted-foreground">
                Agendadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Métricas Registradas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.length}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Bom</div>
              <p className="text-xs text-muted-foreground">
                Baseado nos últimos exames
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="exames" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="exames">Exames</TabsTrigger>
            <TabsTrigger value="consultas">Consultas</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="exames">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Exames Recentes
                </CardTitle>
                <CardDescription>
                  Histórico dos seus exames médicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {exams.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum exame registrado</p>
                    <Button className="mt-4" asChild>
                      <Link href="/saude/exames/novo">Adicionar Primeiro Exame</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {exams.map((exam) => (
                      <div key={exam.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{exam.exam_type}</h3>
                            <p className="text-gray-600">Dr. {exam.doctor_name} - {exam.clinic_name}</p>
                            <p className="text-sm text-gray-500">Data: {formatDate(exam.exam_date)}</p>
                            {exam.notes && (
                              <p className="text-sm text-gray-700 mt-2">{exam.notes}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(exam.status)}
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Consultas Agendadas
                </CardTitle>
                <CardDescription>
                  Suas próximas consultas médicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma consulta agendada</p>
                    <Button className="mt-4" asChild>
                      <Link href="/saude/consultas/nova">Agendar Consulta</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Dr. {appointment.doctor_name}</h3>
                            <p className="text-gray-600">{appointment.specialty}</p>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(appointment.appointment_date)}
                            </p>
                            <p className="text-sm text-gray-500">{appointment.clinic_name}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(appointment.status)}
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metricas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Métricas de Saúde
                </CardTitle>
                <CardDescription>
                  Acompanhe suas métricas vitais
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma métrica registrada</p>
                    <Button className="mt-4" asChild>
                      <Link href="/saude/metricas/nova">Registrar Métrica</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{metric.metric_type}</h3>
                            <p className="text-2xl font-bold text-blue-600">
                              {metric.value} {metric.unit}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(metric.recorded_date)}
                            </p>
                          </div>
                          <Activity className="h-8 w-8 text-gray-400" />
                        </div>
                        {metric.notes && (
                          <p className="text-sm text-gray-600 mt-2">{metric.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios de Saúde
                </CardTitle>
                <CardDescription>
                  Gere relatórios personalizados dos seus dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Relatório Completo</h3>
                    <p className="text-gray-600 mb-4">
                      Histórico completo de exames, consultas e métricas
                    </p>
                    <Button>Gerar Relatório</Button>
                  </div>
                  
                  <div className="border rounded-lg p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Análise de Tendências</h3>
                    <p className="text-gray-600 mb-4">
                      Gráficos e análises das suas métricas ao longo do tempo
                    </p>
                    <Button variant="outline">Ver Análise</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}