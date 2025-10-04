import React from "react";


export const fetchMediaItems = async (setMediaItems: React.Dispatch<React.SetStateAction<any>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  setLoading(true); 

  try {
    const response = await fetch('api/media-items');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Falha ao buscar itens de mídia. Status: ${response.status}`);
    }

    const data = await response.json();
    setMediaItems(data);
    
  } catch (error: any) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};