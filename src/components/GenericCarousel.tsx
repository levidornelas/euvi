'use client';

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Slide =
  | string
  | {
      imageSrc: string;
      imageAlt: string;
      caption?: string;
    };

interface GenericCarouselProps {
  slides: Slide[];
  captions?: string[]; // compatibilidade com API
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  className?: string;
}

const GenericCarousel: React.FC<GenericCarouselProps> = ({
  slides,
  captions,
  autoplay = false,
  autoplayDelay = 3000,
  loop = true,
  className,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align: "center" },
    autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : []
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative group", className)}>
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => {
            const imageSrc =
              typeof slide === "string" ? slide : slide.imageSrc;
            const imageAlt =
              typeof slide === "string" ? `Imagem ${index + 1}` : slide.imageAlt;
            const caption =
              typeof slide === "string"
                ? captions?.[index]
                : slide.caption;

            return (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                <div className="relative w-full h-[370px] overflow-hidden rounded-xl shadow-lg bg-gray-100">
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-full object-cover"
                    width={420}
                    height={370}
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white p-4">
                      <p className="text-sm font-medium">{caption}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* indicadores */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === selectedIndex
                ? "w-8 bg-primary"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GenericCarousel;
