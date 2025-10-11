import { authenticatedFetch } from "@/lib/authenticated-fetch";


export interface MediaItem {
  id: string;
  title: string;
  media_type: string;
}

export interface MediaItemResponse {
  success: boolean;
  detail?: string; 
  data?: any;     
}

export interface MediaItemsListResponse extends MediaItemResponse {
  data?: MediaItem[];
}

export interface IsSavedResponse {
  esta_salvo: boolean;
}


export class MediaItemService {
  static async fetchMediaItems(): Promise<MediaItemsListResponse> {
    try {
      const response = await authenticatedFetch('/api/media-items');

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          detail: data.error || `Falha ao buscar itens de mídia. Status: ${response.status}`,
        };
      }

      return { success: true, data: data as MediaItem[] };

    } catch (error) {
      console.error('MediaItemService.fetchMediaItems error:', error);
      return {
        success: false,
        detail: 'Erro de conexão. Não foi possível carregar a lista de itens.',
      };
    }
  }


  static async fetchItemDetails(id: string): Promise<MediaItemResponse> {
    try {
      const response = await authenticatedFetch(`/api/media-items/${id}`);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          detail: data.error || 'Erro ao buscar dados do item.',
        };
      }

      return { success: true, data: data };

    } catch (error) {
      console.error('MediaItemService.fetchItemDetails error:', error);
      return {
        success: false,
        detail: 'Erro de conexão. Não foi possível carregar os detalhes.',
      };
    }
  }

  static async checkIfSaved(id: string): Promise<{ success: boolean; isSaved?: boolean }> {
    try {
      const response = await authenticatedFetch(`/api/media-items/${id}/is-saved`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao verificar status de salvo:', errorData);
        return { success: false };
      }

      const data: IsSavedResponse = await response.json();
      return { success: true, isSaved: data.esta_salvo };

    } catch (err) {
      console.error('MediaItemService.checkIfSaved error:', err);
      return { success: false };
    }
  }


  static async toggleSave(id: string, isSaved: boolean): Promise<MediaItemResponse> {
    try {
      const endpoint = isSaved ? 'remove' : 'save';

      // Usando authenticatedFetch e método POST
      const response = await authenticatedFetch(`/api/media-items/${id}/${endpoint}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          detail: errorData.detail || `Erro ao ${isSaved ? 'remover' : 'salvar'} item.`,
        };
      }

      return {
        success: true,
        detail: `Item ${isSaved ? 'removido' : 'salvo'} com sucesso.`,
      };
      
    } catch (err) {
      console.error('MediaItemService.toggleSave error:', err);
      return {
        success: false,
        detail: 'Erro de conexão. Tente novamente.',
      };
    }
  }
}