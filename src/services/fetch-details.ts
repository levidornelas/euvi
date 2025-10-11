import { authenticatedFetch } from "@/lib/authenticated-fetch";

export const fetchItemDetails = async (id: string) => {
  try {
    const response = await authenticatedFetch(`/api/media-items/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar dados');
    }
    
    return await response.json();
  } catch (err: any) {
    throw new Error(err.message);
  }
};