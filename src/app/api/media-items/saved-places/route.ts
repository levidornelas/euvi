// app/api/saved-places/route.ts
import { checkAuth } from "@/utils/check-auth";
import { NextResponse } from 'next/server';

export async function GET() {
  const { access, error } = await checkAuth();
  if (error) return error;

  try {
    const res = await fetch(`${process.env.API_URL}media-items/meus_salvos/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          detail: errorData.detail || "Erro ao buscar lugares salvos",
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