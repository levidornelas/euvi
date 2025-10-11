"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Info, ChevronLeft, LinkIcon, Bookmark } from "lucide-react";
import MediaCarousel from "@/components/MediaCarousel";
import LoadingSpinner from "@/components/LoadingSpinner";
import ImageGallery from "@/components/ImageGallery";
import { getColorForMediaType, getIconForMediaType } from "@/utils/media-type";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { MediaItemService } from "@/services/MediaItemService";
import Image from "next/image";

const normalizeText = (text: string) => {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
};

export default function Details() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingSaved, setIsCheckingSaved] = useState(true);

  const minSwipeDistance = 50;

  useEffect(() => {
    const loadItemDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const result = await MediaItemService.fetchItemDetails(id);

        if (result.success && result.data) {
          setItem(result.data);
          setError(null);
        } else {
          throw new Error(
            result.detail || "Item não encontrado ou erro desconhecido."
          );
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadItemDetails();
  }, [id]);

  // Verifica se o item está salvo
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!id) return;
      setIsCheckingSaved(true);

      try {
        const result = await MediaItemService.checkIfSaved(id);

        if (result.success && result.isSaved !== undefined) {
          setIsSaved(result.isSaved);
        }
      } catch (err) {
        console.error("Erro ao verificar se está salvo:", err);
      } finally {
        setIsCheckingSaved(false);
      }
    };

    checkIfSaved();
  }, [id]);

  const handleToggleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const result = await MediaItemService.toggleSave(id, isSaved);

      if (result.success) {
        setIsSaved(!isSaved);
      } else {
        console.error(
          "Erro ao processar solicitação:",
          result.detail || "Erro desconhecido"
        );
      }
    } catch (err) {
      console.error("Falha na comunicação com o servidor", err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderLoading = () => <LoadingSpinner text="Carregando detalhes..." />;

  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-red-50">
      <div className="text-red-600 mb-4">
        <Info size={48} strokeWidth={1.5} />
      </div>
      <p className="text-red-700 text-lg">{error}</p>
    </div>
  );

  const renderSemItem = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="text-gray-600 mb-4">
        <Info size={48} strokeWidth={1.5} />
      </div>
      <p className="text-gray-700 text-lg">Item não encontrado</p>
    </div>
  );

  const tabs = [
    { key: "about", label: "Sobre" },
    { key: "author", label: "Autor" },
    { key: "info", label: "Local" },
    { key: "gallery", label: "Galeria" },
  ];

  const changeTab = (newTab: string) => {
    if (isLightboxOpen) return;
    if (newTab === activeTab) return;
    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    const newIndex = tabs.findIndex((tab) => tab.key === newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (isLightboxOpen) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isLightboxOpen) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (isLightboxOpen) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    if (isLeftSwipe && currentIndex < tabs.length - 1) {
      changeTab(tabs[currentIndex + 1].key);
    }
    if (isRightSwipe && currentIndex > 0) {
      changeTab(tabs[currentIndex - 1].key);
    }
  };

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!item) return renderSemItem();

  const galleryImages = [
    item.imagem_cartaz,
    item.imagem_local,
    item.imagem_obra,
    item.outra_imagem1,
    item.outra_imagem2,
    item.autor_imagem,
  ].filter(Boolean);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative min-h-screen bg-gray-200 overflow-y-visible">
      <div className="sticky top-0 z-10 bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button
            className="mr-4 hover:cursor-pointer hover:text-muted-foreground"
            onClick={() => router.push("/map")}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold truncate">{item.title}</h1>
        </div>

        <button
          onClick={handleToggleSave}
          disabled={isSaving || isCheckingSaved}
          aria-label={isSaved ? "Remover dos salvos" : "Salvar local"}
          className={`
            flex items-center justify-center gap-2
            px-4 py-2 text-sm font-medium rounded-full
            transition-all duration-200 cursor-pointer
            ${
              isSaved
                ? "bg-gray-200 text-primary hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Bookmark
            size={16}
            className={`${
              isSaved ? "fill-primary text-primary" : "fill-primary text-white"
            }`}
          />
          {isSaved ? "Salvo" : "Salvar"}
        </button>
      </div>

      <div className="mb-4 mx-4">
        <div className="relative w-full mx-auto overflow-hidden mt-6 h-auto">
          <div className="mb-2">
            <Badge
              variant="secondary"
              className={`mb-4 ${getColorForMediaType(item.media_type)}`}
            >
              {getIconForMediaType(item.media_type)}
              {item.media_type}
            </Badge>
          </div>
          <MediaCarousel
            images={[item.imagem_cartaz, item.imagem_obra, item.imagem_local]}
            captions={[item.legenda_1, item.legenda_2, item.legenda_3]}
          />
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => changeTab(tab.key)}
              className={`flex flex-col items-center ${
                activeTab === tab.key
                  ? "text-primary"
                  : "text-black hover:text-primary"
              }`}
            >
              <span
                className={`text-sm mt-0 ml-0 inline-block pb-1 transition-colors duration-800 ${
                  activeTab === tab.key
                    ? "border-b-2 border-primary"
                    : "border-b-2 border-transparent hover:border-primary"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="mb-8 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {activeTab === "about" && (
            <motion.div
              key="about"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-4 overflow-hidden bg-gray-200 p-4 rounded-lg"
            >
              <h2 className="text-lg font-semibold mb-2 text-black">
                Sobre o espaço
              </h2>
              {item.general_info ? (
                <>
                  {normalizeText(item.general_info)
                    .split("\n")
                    .map((paragraph: string, index: number) => (
                      <p key={index} className="text-black">
                        {paragraph}
                      </p>
                    ))}
                </>
              ) : (
                <p className="text-black">
                  Não há informações gerais disponíveis
                </p>
              )}
            </motion.div>
          )}

          {activeTab === "author" && (
            <motion.div
              key="author"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-gray-200 p-4 rounded-lg"
            >
              <h2 className="text-lg font-semibold mb-4 text-black">
                {item.autor || "Autor Desconhecido"}
              </h2>
              {item.autor_imagem && (
                <div className="mb-4">
                  <Image
                    src={item.autor_imagem || "/placeholder.svg"}
                    width={2000}
                    height={300}
                    alt={`Imagem de ${item.autor || "Autor Desconhecido"}`}
                    className="rounded-lg"
                  />
                </div>
              )}
              {item.autor_bio && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-2 text-black">
                    Biografia
                  </h3>
                  {normalizeText(item.autor_bio)
                    .split("\n")
                    .map((paragraph: string, index: number) => (
                      <p key={index} className="text-black mb-2">
                        {paragraph}
                      </p>
                    ))}
                </div>
              )}
              {item.obras && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-2 text-black">
                    Outras Obras
                  </h3>
                  <ul className="list-disc pl-6 text-black">
                    {normalizeText(item.obras)
                      .split("\n")
                      .map((obra: string, index: number) => (
                        <li key={index} className="mb-1">
                          {obra.trim()}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              {item.autor_link && (
                <div className="flex items-center space-x-2">
                  <LinkIcon size={20} />
                  <a
                    href={item.autor_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary"
                  >
                    Mais sobre o autor
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.div
              key="info"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-gray-200 p-4 rounded-lg overflow-y-visible">
                <h2 className="text-lg font-semibold mb-4 text-black">
                  Informações gerais
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-black">
                    <MapPin size={20} />
                    <span>{item.location || "Localização não disponível"}</span>
                  </div>
                </div>
              </div>
              {item.locais && item.locais.length > 0 && (
                <div className="bg-gray-200 p-4 rounded-lg mt-0">
                  <h2 className="text-lg font-semibold mb-4 text-black">
                    Locais Próximos
                  </h2>
                  {item.locais.map((local: any, index: number) => (
                    <div key={index} className="space-y-4 mb-4">
                      <h3 className="text-md font-semibold text-black">
                        {local.name}
                      </h3>
                      <p className="text-black">
                        {normalizeText(local.description)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "gallery" && (
            <motion.div
              key="gallery"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gray-200 rounded-lg"
            >
              <h2 className="text-lg font-semibold p-4 text-black">Galeria</h2>
              <ImageGallery
                galleryImages={galleryImages}
                setIsLightboxOpen={setIsLightboxOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Selected"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
