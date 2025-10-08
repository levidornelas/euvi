'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, MapPin, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

const mockPlaces = [
  {
    id: 1,
    name: 'Cão sem Plumas',
    location: 'Boa Viagem, Recife',
    image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Filme Aquarius',
    location: 'Boa Viagem, Recife',
    image: 'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'La Belle de Jour',
    location: 'São Paulo, SP',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
  },
]

export default function SavedPlacesPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b">
        <button
          aria-label="Voltar"
          onClick={() => router.back()}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold">Lugares salvos</h1>
        <span className="w-9" />
      </div>

      {/* Lista de lugares */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {mockPlaces.map((place) => (
          <Card
            key={place.id}
            className="relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative h-40 w-full">
              <img
                src={place.image}
                alt={place.name}
                className="object-cover"
              />
              <button
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                aria-label="Remover dos favoritos"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{place.location}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}