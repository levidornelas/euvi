import { cookies } from "next/headers";

export async function checkAuth() {
  const access = (await cookies()).get("accessToken")?.value;

  if (!access) {
    return {
      error: new Response(JSON.stringify({ detail: "Não Autorizado." }), {
        status: 401,
      }),
    };
  }

  return { access };
}