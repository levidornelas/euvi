'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/Field'
import { AuthService } from '@/services/AuthService'

export default function Register() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emailOk = useMemo(() => /.+@.+\..+/.test(email), [email])
  const pwdOk = password.length >= 6
  const match = password !== '' && password === confirm
  const canContinue = firstName && lastName && emailOk && pwdOk && match

  const handleRegister = async () => {
    if (!canContinue) return

    setLoading(true)
    setError('')

    const result = await AuthService.register({
      email,
      password,
      password2: confirm,
      first_name: firstName,
      last_name: lastName,
    })

    setLoading(false)

    if (result.success) {
      router.push('/map')
    } else {
      setError(result.detail || 'Erro ao criar conta')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-sm flex min-h-screen flex-col px-4 pt-4">
        <div className="flex items-center justify-between">
          <button
            aria-label="Fechar"
            onClick={() => router.push('/sign')}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold">Cadastro</h1>
          <span className="w-5" />
        </div>

        <div className="mt-4 space-y-3">
          <Field label="Nome" value={firstName} onChange={setFirstName} />
          <Field label="Sobrenome" value={lastName} onChange={setLastName} />
          <Field label="E-mail" type="email" value={email} onChange={setEmail} />
          <Field label="Senha" type="password" value={password} onChange={setPassword} />
          <Field label="Repetir senha" type="password" value={confirm} onChange={setConfirm} />

          <div className="space-y-1 text-xs">
            {email && !emailOk && (
              <p className="text-amber-600">Digite um e-mail válido.</p>
            )}
            {password && !pwdOk && (
              <p className="text-amber-600">A senha deve ter pelo menos 6 caracteres.</p>
            )}
            {confirm && !match && (
              <p className="text-amber-600">As senhas não coincidem.</p>
            )}
            {error && (
              <p className="text-red-600">{error}</p>
            )}
          </div>

          <div className='mt-6'>
            <Button
              disabled={!canContinue || loading}
              variant={'ghost'}
              className='w-full'
              onClick={handleRegister}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}