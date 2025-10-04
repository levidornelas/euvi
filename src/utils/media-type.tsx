import { Film, Book, Music, Palette, HelpCircle } from 'lucide-react';

export const getImageForMediaType = (mediaType: string) => {
  switch (mediaType) {
    case 'Filmes':
      return '/films.svg' 
    case 'Livros':
      return '/books.svg'
    case 'Músicas':
      return '/music.svg'
    case 'Artes':
      return '/art.svg'
    default:
      return null;
  }
};

export const getColorForMediaType = (mediaType: string) => {
  switch (mediaType) {
    case 'Filmes':
      return 'bg-red-600 text-white';
    case 'Livros':
      return 'bg-green-600 text-white';
    case 'Músicas':
      return 'bg-orange-500 text-white';
    case 'Artes':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}



export const getIconForMediaType = (mediaType: string) => {
  switch (mediaType) {
    case "Filmes":
      return <Film className="w-4 h-4 mr-1" />;
    case "Livros":
      return <Book className="w-4 h-4 mr-1" />;
    case "Músicas":
      return <Music className="w-4 h-4 mr-1" />;
    case "Artes":
      return <Palette className="w-4 h-4 mr-1" />;
    default:
      return <HelpCircle className="w-4 h-4 mr-1" />;
  }
};
