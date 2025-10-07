"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { X, Search, User } from "lucide-react"

import { fetchMediaItems } from "@/services/consume-api"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

import MediaCarousel from "@/components/MediaCarousel"
import RecentItemCard from "@/components/items/RecentItemCard"
import LoadingSpinner from "@/components/LoadingSpinner"

import { getColorForMediaType, getIconForMediaType } from "@/utils/media-type"

const DynamicMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <LoadingSpinner text="Carregando mapa..." />,
})

export default function MediaMap() {
  const [mediaItems, setMediaItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPin, setSelectedPin] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [recentItems, setRecentItems] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState([-8.05428, -34.8813])
  const router = useRouter()
  const [mapZoom, setMapZoom] = useState(14)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRecents = localStorage.getItem("recentItems")
      setRecentItems(savedRecents ? JSON.parse(savedRecents) : [])
    }
  }, [])

  const getUserLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          setMapCenter([latitude, longitude])
        },
        (error) => {
          console.log("Erro ao obter localização", error)
        },
      )
    }
  }

  useEffect(() => {
    fetchMediaItems(setMediaItems, setLoading, setError)
    getUserLocation()
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("recentItems", JSON.stringify(recentItems))
    }
  }, [recentItems])

  const getFilteredItems = () => {
    if (!searchQuery) return []
    return mediaItems.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
  }

  const handlePinClick = (item) => {
    setSelectedPin(item)

    setRecentItems((prevItems) => {
      const isItemInRecents = prevItems.some((recent) => recent.id === item.id)
      if (isItemInRecents) return prevItems

      const newRecentItems = [item, ...prevItems].slice(0, 2)
      if (typeof window !== "undefined") {
        localStorage.setItem("recentItems", JSON.stringify(newRecentItems))
      }
      return newRecentItems
    })
  }

  const handleCloseDetails = () => {
    setSelectedPin(null)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleZoomChange = (zoom) => {
    setMapZoom(zoom)
  }

  if (loading) {
    return <LoadingSpinner text="Carregando mapa..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>Erro ao carregar o mapa: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const filteredItems = getFilteredItems()
  const showRecents = !searchQuery && recentItems.length > 0

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <DynamicMap
        mediaItems={mediaItems}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        userLocation={userLocation}
        onPinClick={handlePinClick}
        onZoomChange={handleZoomChange}
      />

      <AnimatePresence mode="wait">
        {selectedPin && (
          <motion.div
            key="details"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 1,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-0 right-0 z-50"
          >
            <Card className="rounded-md shadow-2xl">
              <CardContent className="p-4 relative">
                <button
                  onClick={handleCloseDetails}
                  className="absolute bg-primary text-white top-4 right-4 z-10 hover:bg-blue-500 hover:cursor-pointer rounded-full p-1 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-4">
                  <div className="pr-10">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedPin.location}</h1>
                    <Badge variant="secondary" className={`mb-4 ${getColorForMediaType(selectedPin.media_type)}`}>
                      {getIconForMediaType(selectedPin.media_type)}
                      {selectedPin.media_type}
                    </Badge>
                  </div>

                  <MediaCarousel
                    images={[selectedPin.imagem_cartaz, selectedPin.imagem_obra, selectedPin.imagem_local]}
                    captions={[selectedPin.legenda_1, selectedPin.legenda_2, selectedPin.legenda_3]}
                  />

                  <div className="flex justify-center pt-2 mb-6 sm:mb-0">
                    <Button
                      onClick={() => router.push(`/details/${selectedPin.id}`)}
                      variant={'default'}
                    >
                      Descobrir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!selectedPin && (
          <motion.div
            key="search"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 1,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-0 right-0 w-full"
          >
            <Card className="rounded-md shadow-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="relative w-full mx-auto flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Pesquise um ponto mapeado"
                      className="pl-10 h-12 rounded-full border-2 border-primary focus-visible:ring-blue-300 placeholder:text-sm"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="ml-4 rounded-full bg-primary p-3 hover:cursor-pointer hover:bg-blue-500 transition-colors">
                    <Link href="#">
                      <User className="text-white" />
                    </Link>
                  </div>
                </div>

                <ScrollArea className="h-full w-full mb-4 sm:mb-0">
                  <div className="space-y-2">
                    {showRecents && (
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">Recentes</h2>
                        {recentItems.map((item) => (
                          <RecentItemCard key={item.id} item={item} handlePinClick={handlePinClick} />
                        ))}
                      </div>
                    )}

                    {filteredItems.length > 0 && (
                      <div className="space-y-2">
                        {filteredItems.map((item) => (
                          <RecentItemCard key={item.id} item={item} handlePinClick={handlePinClick} />
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
