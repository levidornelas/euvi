import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ImageGalleryProps {
  galleryImages: string[];
  setIsLightboxOpen: (value: boolean) => void;
}

export default function ImageGallery({ galleryImages, setIsLightboxOpen }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleOpen = (idx: number) => {
    setSelectedImage(idx);
    setOpen(true);
    setIsLightboxOpen(true); 
  };

  const handleClose = () => {
    setOpen(false);
    setIsLightboxOpen(false); 
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {galleryImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            onClick={() => handleOpen(idx)}
            className="cursor-pointer rounded-lg hover:opacity-80 w-full h-full object-cover"
          />
        ))}
      </div>

      <Lightbox
        open={open}
        close={handleClose}
        slides={galleryImages.map(img => ({ src: img }))}
        plugins={[Thumbnails, Zoom]}
        index={selectedImage}
      />
    </>
  );
}
