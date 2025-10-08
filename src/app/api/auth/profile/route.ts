import { checkAuth } from "@/utils/check-auth";

export async function GET() {
  const { access, error } = await checkAuth();
  if (error) return error;

  const res = await fetch(`${process.env.API_URL}auth/profile/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

if (!res.ok) {
    const errorData = await res.json();
    return new Response(
      JSON.stringify({
        detail: errorData.detail || "Erro ao criar conta",
      }),
      {
        status: res.status,
      }
    );
  }

  const data = await res.json();
  return Response.json(data);
}