import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BarChart3, TrendingUp, Calendar, Video, FileText, Settings, LogOut, Menu } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MoveID</span>
            </Link>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">Plano Premium</Badge>
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Hidden on mobile, shown as horizontal menu */}
          <div className="lg:col-span-1">
            <Card className="hidden lg:block">
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
                  <Button variant="ghost" className="w-full justify-start" asChild>
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

            {/* Mobile Navigation */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <BarChart3 className="mr-1 h-3 w-3" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/analise">
                  <Video className="mr-1 h-3 w-3" />
                  Análise
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/historico">
                  <Calendar className="mr-1 h-3 w-3" />
                  Histórico
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/relatorios">
                  <FileText className="mr-1 h-3 w-3" />
                  Relatórios
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta, João!
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Aqui está um resumo das suas análises recentes.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Análises Este Mês</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78</div>
                  <p className="text-xs text-muted-foreground">
                    +5 pontos na última semana
                  </p>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 md:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    3 PDFs exportados
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Evolução dos Movimentos</CardTitle>
                <CardDescription className="text-sm">
                  Seu progresso nos últimos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Agachamento</span>
                    <span>85/100</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Flexão</span>
                    <span>72/100</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Corrida</span>
                    <span>90/100</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Analyses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Análises Recentes</CardTitle>
                <CardDescription className="text-sm">
                  Suas últimas avaliações de movimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-semibold">Agachamento Profundo</h3>
                        <p className="text-xs md:text-sm text-gray-600">Ontem às 14:30</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">Nota: 82</Badge>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Bom</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-semibold">Flexão com Barra</h3>
                        <p className="text-xs md:text-sm text-gray-600">2 dias atrás</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">Nota: 75</Badge>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Regular</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-semibold">Corrida em Esteira</h3>
                        <p className="text-xs md:text-sm text-gray-600">3 dias atrás</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">Nota: 88</Badge>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">Excelente</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/historico">Ver Todo o Histórico</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Nova Análise</CardTitle>
                  <CardDescription className="text-sm">
                    Grave ou envie um vídeo para análise imediata
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Gerar Relatório</CardTitle>
                  <CardDescription className="text-sm">
                    Baixe um PDF completo com suas métricas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/relatorios">
                      <FileText className="mr-2 h-4 w-4" />
                      Criar Relatório
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
