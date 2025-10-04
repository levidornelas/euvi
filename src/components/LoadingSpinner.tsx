import * as React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <Loader2 
        className="h-8 w-8 animate-spin text-blue-200" 
      />
      <span className="ml-2  text-white">{text}</span>
    </div>
  );
};

export default LoadingSpinner;