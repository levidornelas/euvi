'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { Field } from '@/components/Field'

export default function AccountInfoPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [email, setEmail] = useState(user?.email || '')

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b">
        <button
          aria-label="Voltar"
          onClick={() => router.back()}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold">Informações da conta</h1>
        <span className="w-9" />
      </div>

      <div className="flex-1 px-6 py-6 space-y-5">
        <Field 
        label="Nome" 
        value={firstName} 
        onChange={setFirstName} 
        readOnly
        />

        <Field 
        label="Sobrenome" 
        value={lastName} 
        onChange={setLastName} 
        readOnly
        />

        <Field 
        label="E-mail" 
        type="email" 
        value={email} 
        onChange={setEmail} 
        readOnly
        />

      </div>
    </div>
  )
}
