import GenericCarousel from "@/components/GenericCarousel";

interface MediaCarouselProps {
  images: string[];
  captions?: string[];
}

const MediaCarousel = ({ images, captions }: MediaCarouselProps) => {
  return (
    <GenericCarousel
      slides={images} 
      captions={captions} 
      loop
      autoplay
      autoplayDelay={4000}
      className="max-w-2xl mx-auto"
    />
  );
};

export default MediaCarousel;
