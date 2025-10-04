import { NextResponse } from 'next/server';


export async function GET() {
  const apiUrl = process.env.API_URL;

  try {
    const response = await fetch(`${apiUrl}media-items/`, {
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar dados da API externa' },
        { status: response.status }
      );
    }

    // Retorna os dados como JSON
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erro na API Route:", error);
    return NextResponse.json(
      { error: 'Falha na comunicação com o servidor externo' },
      { status: 500 }
    );
  }
}