import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.API_URL}auth/register/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      // Se o backend enviar objeto de erros, transforma em string
      let errorMessage = "Erro ao criar conta";

      if (data) {
        if (typeof data === "object") {
          errorMessage = Object.values(data).flat().join(" ");
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }

      return Response.json(
        { success: false, detail: errorMessage },
        { status: res.status }
      );
    }

    const { access, refresh } = data.tokens || {};

    const cookieStore = cookies();
    const expiresInSeconds = 60 * 60;

    (await cookieStore).set("accessToken", access, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: expiresInSeconds,
    });

    (await cookieStore).set("refreshToken", refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("Erro na rota de registro:", err);

    return Response.json(
      { success: false, detail: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}
