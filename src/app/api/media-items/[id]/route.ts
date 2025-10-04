import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validar se o ID é um número válido
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Buscar o item específico
    const itemResponse = await fetch(
      `${process.env.API_URL}media-items/${id}/`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!itemResponse.ok) {
      return NextResponse.json(
        { error: 'Item não encontrado' },
        { status: itemResponse.status }
      );
    }

    const item = await itemResponse.json();

    // Buscar locais próximos relacionados
    const locaisResponse = await fetch(
      `${process.env.API_URL}locais-proximos/?media_item=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!locaisResponse.ok) {
      console.warn(`Erro ao buscar locais próximos para o item ${id}`);
      return NextResponse.json({ ...item, locais: [] });
    }

    const locais = await locaisResponse.json();

    // Combinar dados
    const resultado = {
      ...item,
      locais
    };

    return NextResponse.json(resultado);

  } catch (error: any) {
    console.error('Erro ao buscar detalhes do item:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', message: error.message },
      { status: 500 }
    );
  }
}