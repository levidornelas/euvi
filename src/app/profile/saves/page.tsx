"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SavedPlace {
  id: number;
  title: string;
  location: string;
  imagem_local?: string;
  imagem_cartaz?: string;
  imagem_obra?: string;
}

export default function SavedPlacesPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  const fetchSavedPlaces = async () => {
    try {
      const response = await fetch("/api/media-items/saved-places");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao carregar lugares salvos");
      }

      const data = await response.json();
      setPlaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // const handleRemoveFavorite = async (placeId: number, e: React.MouseEvent) => {
  //   e.stopPropagation()

  //   try {
  //     const response = await fetch(`/api/media-items/${placeId}/toggle-favorite`, {
  //       method: 'POST',
  //     })

  //     if (response.ok) {
  //       setPlaces(places.filter(place => place.id !== placeId))
  //     } else {
  //       const errorData = await response.json()
  //       console.error('Erro ao remover favorito:', errorData.detail)
  //     }
  //   } catch (err) {
  //     console.error('Erro ao remover favorito:', err)
  //   }
  // }

  const handleCardClick = (placeId: number) => {
    router.push(`/details/${placeId}`);
  };

  const getPlaceImage = (place: SavedPlace) => {
    return (
      place.imagem_local ||
      place.imagem_cartaz ||
      place.imagem_obra ||
      "/placeholder-image.jpg"
    );
  };

  if (loading) {
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
          <h1 className="text-base font-semibold">Lugares salvos</h1>
          <span className="w-9" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-base font-semibold">Lugares salvos</h1>
        <span className="w-9" />
      </div>

      {/* Lista de lugares */}
      <div className="flex-1 px-4 py-4">
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!error && places.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              Nenhum lugar salvo ainda
            </p>
            <p className="text-gray-400 text-sm">
              Comece a explorar e salve seus lugares favoritos
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {places.map((place) => (
            <Card
              key={place.id}
              className="relative overflow-hidden rounded-xl border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleCardClick(place.id)}
            >
              {/* Imagem */}
              <div className="relative h-28 w-full bg-gray-100">
                <Image
                  src={getPlaceImage(place)}
                  alt={place.title}
                  width={200}
                  height={0}
                  className="w-full h-full object-cover rounded-sm"
                />

                <button
                  className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all hover:scale-110"
                  aria-label="Remover dos favoritos"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>
              </div>

              {/* Informações */}
              <div className="p-2 bg-white">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {place.title}
                </h3>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{place.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
