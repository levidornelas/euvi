'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/Field'
import { AuthService } from '@/services/AuthService'

export default function LoginEmail() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canContinue = email.trim() !== '' && password.trim() !== ''

  const handleLogin = async () => {
    if (!canContinue) return

    setLoading(true)
    setError('')

    const result = await AuthService.login({ email, password })

    setLoading(false)

    if (result.success) {
      router.push('/map')
    } else {
      setError(result.detail || 'Erro ao fazer login')
    }
  }

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          aria-label="Fechar"
          onClick={() => router.push('/sign')}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold">Entrar</h1>
        <span className="w-5" />
      </div>

      {/* Form */}
      <div className="min-h-screen flex flex-col bg-white">
        <div className="px-4 mt-4 space-y-4 pb-28">
          <Field
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <Field
            label="Senha"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {error}
            </p>
          )}

          <div className="mx-auto w-full max-w-sm mt-10">
            <Button
              onClick={handleLogin}
              disabled={!canContinue || loading}
              variant="ghost"
              className="w-full"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
