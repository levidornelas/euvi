import { authenticatedFetch } from "@/lib/authenticated-fetch";

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  detail?: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          detail: result.detail || "Erro ao criar conta",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        detail: "Erro de conexão. Tente novamente.",
      };
    }
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          detail: result.detail || "Erro ao fazer login",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        detail: "Erro de conexão. Tente novamente.",
      };
    }
  }

  static async logout(): Promise<AuthResponse> {
    try {
      const response = await authenticatedFetch("api/auth/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          detail: result.detail || "Erro ao fazer logout",
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        detail: "Erro de conexão. Tente novamente.",
      };
    }
  }
}
