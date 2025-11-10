import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Smartphone, Download, Apple } from 'lucide-react'

export default function AppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-gray-900">MoveID</span>
        </Link>
        <Button variant="outline" asChild>
          <Link href="/">Voltar</Link>
        </Button>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Smartphone className="h-20 w-20 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Baixe o App MoveID
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Tenha a análise biomecânica inteligente sempre na palma da sua mão. 
          Disponível para iOS e Android.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="text-center p-6">
            <CardHeader>
              <Apple className="h-12 w-12 text-gray-900 mx-auto mb-4" />
              <CardTitle>iOS</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Disponível na App Store
              </CardDescription>
              <Button className="w-full" disabled>
                <Download className="mr-2 h-4 w-4" />
                Em Breve
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">A</span>
              </div>
              <CardTitle>Android</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Disponível no Google Play
              </CardDescription>
              <Button className="w-full" disabled>
                <Download className="mr-2 h-4 w-4" />
                Em Breve
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <p className="text-gray-600 mb-4">
            Enquanto isso, você pode usar nossa versão web:
          </p>
          <Button size="lg" asChild>
            <Link href="/login">
              Acessar Versão Web
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}