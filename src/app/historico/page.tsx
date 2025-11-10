import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  Calendar, 
  Video, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  Filter,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

// Mock data para demonstração
const analysisHistory = [
  {
    id: 1,
    title: "Agachamento Profundo",
    date: "2024-01-15",
    time: "14:30",
    score: 82,
    movement: "Agachamento",
    duration: "8s",
    status: "Concluído",
    improvement: "+5"
  },
  {
    id: 2,
    title: "Flexão com Barra",
    date: "2024-01-13",
    time: "16:45",
    score: 75,
    movement: "Flexão",
    duration: "12s",
    status: "Concluído",
    improvement: "-2"
  },
  {
    id: 3,
    title: "Corrida em Esteira",
    date: "2024-01-12",
    time: "09:15",
    score: 88,
    movement: "Corrida",
    duration: "15s",
    status: "Concluído",
    improvement: "+8"
  },
  {
    id: 4,
    title: "Agachamento Básico",
    date: "2024-01-10",
    time: "18:20",
    score: 77,
    movement: "Agachamento",
    duration: "6s",
    status: "Concluído",
    improvement: "0"
  },
  {
    id: 5,
    title: "Flexão Tradicional",
    date: "2024-01-08",
    time: "11:30",
    score: 79,
    movement: "Flexão",
    duration: "10s",
    status: "Concluído",
    improvement: "+3"
  },
  {
    id: 6,
    title: "Corrida ao Ar Livre",
    date: "2024-01-06",
    time: "07:00",
    score: 85,
    movement: "Corrida",
    duration: "20s",
    status: "Concluído",
    improvement: "+7"
  },
  {
    id: 7,
    title: "Agachamento com Peso",
    date: "2024-01-05",
    time: "15:45",
    score: 71,
    movement: "Agachamento",
    duration: "9s",
    status: "Concluído",
    improvement: "-6"
  },
  {
    id: 8,
    title: "Flexão Inclinada",
    date: "2024-01-03",
    time: "13:15",
    score: 83,
    movement: "Flexão",
    duration: "11s",
    status: "Concluído",
    improvement: "+4"
  }
]

function getScoreColor(score: number) {
  if (score >= 85) return "text-green-600 bg-green-50"
  if (score >= 70) return "text-yellow-600 bg-yellow-50"
  return "text-red-600 bg-red-50"
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excelente"
  if (score >= 70) return "Bom"
  return "Precisa Melhorar"
}

function getImprovementIcon(improvement: string) {
  const value = parseInt(improvement)
  if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
  if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
  return <Minus className="h-4 w-4 text-gray-400" />
}

export default function Historico() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MoveID</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Plano Premium</Badge>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/dashboard">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/analise">
                      <Video className="mr-2 h-4 w-4" />
                      Nova Análise
                    </Link>
                  </Button>
                  <Button variant="default" className="w-full justify-start" asChild>
                    <Link href="/historico">
                      <Calendar className="mr-2 h-4 w-4" />
                      Histórico
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/relatorios">
                      <FileText className="mr-2 h-4 w-4" />
                      Relatórios
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Histórico de Análises
              </h1>
              <p className="text-gray-600">
                Visualize todas as suas análises de movimento e acompanhe sua evolução.
              </p>
            </div>

            {/* Stats Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <p className="text-sm text-gray-600">Total de Análises</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">78</div>
                  <p className="text-sm text-gray-600">Nota Média</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">+5</div>
                  <p className="text-sm text-gray-600">Melhoria Média</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">8</div>
                  <p className="text-sm text-gray-600">Esta Semana</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Buscar por nome do movimento..." 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Tipo de Movimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Movimentos</SelectItem>
                      <SelectItem value="agachamento">Agachamento</SelectItem>
                      <SelectItem value="flexao">Flexão</SelectItem>
                      <SelectItem value="corrida">Corrida</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="recentes">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recentes">Mais Recentes</SelectItem>
                      <SelectItem value="antigos">Mais Antigos</SelectItem>
                      <SelectItem value="melhor-nota">Melhor Nota</SelectItem>
                      <SelectItem value="pior-nota">Pior Nota</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis History List */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Análises</CardTitle>
                <CardDescription>
                  Histórico completo das suas avaliações de movimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisHistory.map((analysis) => (
                    <div 
                      key={analysis.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Video className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{analysis.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{analysis.date}</span>
                            <span>{analysis.time}</span>
                            <span>{analysis.duration}</span>
                            <Badge variant="outline" className="text-xs">
                              {analysis.movement}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary" 
                              className={`${getScoreColor(analysis.score)} border-0`}
                            >
                              {analysis.score}/100
                            </Badge>
                            {getImprovementIcon(analysis.improvement)}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {getScoreLabel(analysis.score)}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-8">
                  <p className="text-sm text-gray-600">
                    Mostrando 8 de 24 análises
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" className="bg-blue-600 text-white">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Próximo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exportar Histórico</CardTitle>
                  <CardDescription>
                    Baixe um relatório completo do seu histórico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Análise</CardTitle>
                  <CardDescription>
                    Continue melhorando seus movimentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/analise">
                      <Video className="mr-2 h-4 w-4" />
                      Iniciar Análise
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}