
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${process.env.API_URL}/auth/login/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || "E-mail ou senha incorretos",
      }),
      {
        status: res.status,
      }
    );
  }
  const { access, refresh } = await res.json();

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
}