'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginEmail() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const canContinue = email.trim() !== '' && password.trim() !== ''

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          aria-label="Fechar"
          onClick={() => router.back()}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold">Entrar</h1>
        <span className="w-5" />
      </div>

      {/* Form */}
      <div className="min-h-screen flex flex-col bg-white">
        {/* Campos */}
        <div className="px-4 mt-4 space-y-4 pb-28">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-full border-0 px-5
                       bg-[#EAF1FF] placeholder:text-[#8AA3C7]
                       focus-visible:ring-2 focus-visible:ring-[#BFD5FF]"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-full border-0 px-5
                       bg-[#EAF1FF] placeholder:text-[#8AA3C7]
                       focus-visible:ring-2 focus-visible:ring-[#BFD5FF]"
          />
        </div>

        {/* Botão fixo */}
        <div className="fixed inset-x-0 bottom-0 
                px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
            <div className="mx-auto w-full max-w-sm">   {/* <- limita e centraliza */}
                <Button
                disabled={!canContinue}
                className="w-full h-11 rounded-full
                            bg-[#0B63F3] hover:bg-[#0A59DB]
                            disabled:bg-[#EAF1FF] disabled:text-[#6FA0FF] disabled:opacity-100 text-white"
      
                >
                Seguinte
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
