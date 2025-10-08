'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useCarousel } from '@/hooks/use-carousel';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Slide {
  imageSrc: string;
  imageAlt: string;
}

const OnboardingSwipe: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth(); 

  const slides: Slide[] = [
    { imageSrc: "/o1.svg", imageAlt: "Primeira tela do onboarding" },
    { imageSrc: "/o2.svg", imageAlt: "Segunda tela do onboarding" },
    { imageSrc: "/o3.svg", imageAlt: "Terceira tela do onboarding" }
  ];

  const { emblaRef, currentSlide, goToNext, goToPrevious, goToSlide } = useCarousel({
    totalSlides: slides.length,
    onLastSlide: () => {
      router.push(user ? '/map' : '/sign');
    },
    onFirstSlideBack: () => router.push('/'),
  });

  if (loading) {
    return <LoadingSpinner text='Carregando usuário...' />
  }

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      router.push(user ? '/map' : '/sign');
    } else {
      goToNext();
    }
  };

  const skipToEnd = () => {
    router.push(user ? '/map' : '/sign');
  };

  return (
    <div className="flex flex-col justify-between bg-white h-screen relative overflow-hidden">
      <div className="flex justify-between items-center px-6 py-6 z-10">
        <button
          onClick={goToPrevious}
          className="text-primary text-lg font-medium hover:underline transition-colors"
        >
          {currentSlide === 0 ? 'Início' : 'Voltar'}
        </button>
        
        <button
          onClick={skipToEnd}
          className="text-primary text-lg font-medium hover:underline transition-colors"
        >
          Pular
        </button>
      </div>

      <div ref={emblaRef} className="flex-1 relative overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-start px-6"
            >
              <div className="flex-1 flex items-center justify-center pt-8 pb-4">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  className="w-full max-w-sm h-auto"
                  width={400}
                  height={400}
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-2 my-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-200 focus:outline-none',
              index === currentSlide ? 'bg-primary scale-110' : 'bg-gray-300 hover:bg-gray-400'
            )}
          />
        ))}
      </div>

      <div className="px-6 pb-8 mb-8">
        <Button
          onClick={handleNext}
          className="w-full py-3 text-lg font-medium"
        >
          {currentSlide === slides.length - 1 ? (user ? 'Ir para o mapa' : 'Entrar') : 'Próximo'}
        </Button>
      </div>

      {currentSlide < slides.length - 1 && (
        <div className="absolute bottom-40 right-6 animate-pulse transition-colors">
          <div className="flex items-center space-x-1 text-primary text-sm">
            <span>Deslize</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingSwipe;
