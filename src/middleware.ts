import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ["/", "/onboarding", "/sign", "/login", "/register"];

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Se não for rota pública e não tiver token, redireciona para login
  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign", request.url));
  }

  // Se tiver token e estiver tentando acessar rotas de auth, redireciona para /map
  if (
    accessToken &&
    (pathname === "/sign" || pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/map", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
