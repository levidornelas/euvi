import { NextResponse } from "next/server";
import { checkAuth } from "@/utils/check-auth";

export async function GET() {
  const { access, error } = await checkAuth();
  if (error) return error;

  const apiUrl = process.env.API_URL;

  try {
    const response = await fetch(`${apiUrl}media-items/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          detail: errorData.detail || "Erro ao buscar lugares salvos",
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API Route:", error);
    return NextResponse.json(
      { error: "Falha na comunicação com o servidor externo" },
      { status: 500 }
    );
  }
}
