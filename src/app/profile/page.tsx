'use client'

import Image from 'next/image'
import { useAuth } from '@/providers/AuthProvider'
import { Card } from '@/components/ui/card'
import { Pencil, User, Bookmark, Eye, LogOut, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { ProfileOption } from '@/components/ProfileOption'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()

  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          aria-label="Fechar"
          onClick={() => router.push('/map')}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold">Perfil</h1>
        <span className="w-5" />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col items-center px-6 mt-6">
        {/* Avatar */}
        <Card className="relative w-40 h-40 bg-[#EAF1FF] flex flex-col items-center justify-center rounded-lg border border-[#BFD5FF]">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="Avatar"
              width={140}
              height={140}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#5A8DFF] flex items-center justify-center text-white text-3xl font-semibold">
              {user?.first_name?.[0]?.toUpperCase() || '?'}
              {user?.last_name?.[0]?.toUpperCase() || ''}
            </div>
          )}

          <button className="absolute bottom-3 right-3 bg-[#1D64F2] p-2 rounded-full hover:bg-[#174ecc] transition">
            <Pencil className="w-4 h-4 text-white" />
          </button>
        </Card>

        {/* Nome e bio */}
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold text-gray-800">{fullName}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          {user?.bio && (
            <p className="text-sm text-gray-400 mt-1">{user.bio}</p>
          )}
        </div>

        {/* Opções */}
        <div className="w-full mt-8 space-y-1">
          <Separator />
          <ProfileOption icon={<User size={18} />} label="Informações da conta" pushTo='profile/info'/>
          <Separator />
          <ProfileOption icon={<Bookmark size={18} />} label="Lugares salvos" pushTo='profile/saves'/>
          <Separator />
          <ProfileOption icon={<Eye size={18} />} label="Sobre o projeto" pushTo='about/'/>
          <Separator />
          <ProfileOption icon={<LogOut size={18} />} label="Sair" textColor="text-red-500" />
          <Separator />
        </div>
      </div>
    </div>
  )
}