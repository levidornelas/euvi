import { checkAuth } from "@/utils/check-auth";
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.API_URL}media-items/${id}/esta_salvo/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          detail: errorData.detail || "Erro ao verificar favorito",
        },
        {
          status: res.status,
        }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { detail: "Falha na comunicação com o servidor" },
      { status: 500 }
    );
  }
}