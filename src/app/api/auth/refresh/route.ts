import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Sem refesh token." }),
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${process.env.API_URL}auth/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      (await cookieStore).delete("accessToken");
      (await cookieStore).delete("refreshToken");

    const errorData = await res.json();
        return new Response(
        JSON.stringify({
            detail: errorData.detail || "Erro ao dar refresh.",
        }),
        {
            status: res.status,
        }
        );
    }

    const { access, refresh } = await res.json();

    const expiresInSeconds = 60 * 60;
    (await cookieStore).set("accessToken", access, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: expiresInSeconds,
    });

    if (refresh) {
      (await cookieStore).set("refreshToken", refresh, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Erro interno durante o refresh",
      }),
      { status: 500 }
    );
  }
}