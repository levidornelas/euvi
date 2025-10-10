import { checkAuth } from "@/utils/check-auth";
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.API_URL}media-items/${id}/remover/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          detail: errorData.detail || "Erro ao remover local",
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