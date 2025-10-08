'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import clsx from 'clsx'

// Pequeno componente de campo com rótulo interno (estilo do mock)
function Field({
  label,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-5 top-1 text-xs text-[#6FA0FF]">
        {label}
      </span>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className={clsx(
          'h-12 w-full rounded-full border px-5 pt-4 text-sm transition',
          'focus-visible:ring-2 focus-visible:ring-[#BFD5FF] focus:border-[#2F6EF6] bg-white',
          value.trim() === '' && 'bg-[#EAF1FF] border-transparent'
        )}
      />
    </div>
  )
}

export default function Register() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const emailOk = useMemo(() => /.+@.+\..+/.test(email), [email])
  const pwdOk = password.length >= 6
  const match = password !== '' && password === confirm
  const canContinue = firstName && lastName && emailOk && pwdOk && match

  return (
    <div className="min-h-screen bg-white">
      {/* coluna central limitada */}
      <div className="mx-auto w-full max-w-sm flex min-h-screen flex-col px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            aria-label="Fechar"
            onClick={() => router.back()}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold">Cadastro</h1>
          <span className="w-5" />
        </div>

        {/* Campos */}
        <div className="mt-4 space-y-3">
          <Field label="Nome" value={firstName} onChange={setFirstName} />
          <Field label="Sobrenome" value={lastName} onChange={setLastName} />
          <Field label="E-mail" type="email" value={email} onChange={setEmail} />
          <Field label="Senha" type="password" value={password} onChange={setPassword} />
          <Field label="Repetir senha" type="password" value={confirm} onChange={setConfirm} />

          {/* Mensagens simples (opcional) */}
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
          </div>
        </div>

        {/* Botão no rodapé da COLUNA (não da tela) */}
        <div className="mt-auto pb-4">
          <Button
            disabled={!canContinue}
            className="w-full h-11 rounded-full text-white bg-[#0B63F3] hover:bg-[#0A59DB]
                       disabled:bg-[#EAF1FF] disabled:text-[#6FA0FF] disabled:opacity-100"
            onClick={() => console.log('Registrar')}
          >
            Entrar
          </Button>
        </div>
      </div>
    </div>
  )
}
