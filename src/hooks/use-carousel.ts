import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

interface UseCarouselOptions {
  totalSlides: number;
  emblaOptions?: EmblaOptionsType;
  onLastSlide?: () => void;
  onFirstSlideBack?: () => void;
}

interface UseCarouselReturn {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  currentSlide: number;
  goToSlide: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export const useCarousel = ({
  totalSlides,
  emblaOptions = {},
  onLastSlide,
  onFirstSlideBack,
}: UseCarouselOptions): UseCarouselReturn => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    watchDrag: (emblaApi) => emblaApi.slideNodes().length > 1,
    ...emblaOptions,
  });

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(true);

  const goToSlide = useCallback(
    (index: number): void => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const goToNext = useCallback((): void => {
    if (emblaApi) {
      if (currentSlide < totalSlides - 1) {
        emblaApi.scrollNext();
      } else if (onLastSlide) {
        onLastSlide();
      }
    }
  }, [emblaApi, currentSlide, totalSlides, onLastSlide]);

  const goToPrevious = useCallback((): void => {
    if (emblaApi) {
      if (currentSlide > 0) {
        emblaApi.scrollPrev();
      } else if (onFirstSlideBack) {
        onFirstSlideBack();
      }
    }
  }, [emblaApi, currentSlide, onFirstSlideBack]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return {
    emblaRef,
    currentSlide,
    goToSlide,
    goToNext,
    goToPrevious,
    canScrollPrev,
    canScrollNext,
  };
};