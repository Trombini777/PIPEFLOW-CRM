import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/supabase/types";

// Rotas acessíveis sem sessão. Tudo que não estiver aqui (inclusive
// /onboarding e /{workspace}/*) exige usuário autenticado.
const PUBLIC_PATHS = ["/", "/login", "/signup"];

// Páginas que não fazem sentido para quem já está autenticado — ao
// acessá-las, o usuário é redirecionado para o workspace (ou onboarding).
const REDIRECT_IF_AUTHENTICATED_PATHS = ["/", "/login", "/signup"];

function isPathMatch(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() (não getSession()) valida o token contra o servidor de auth do
  // Supabase — necessário no middleware para não confiar em cookie adulterado.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  if (!user) {
    if (isPathMatch(pathname, PUBLIC_PATHS)) {
      return supabaseResponse;
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (isPathMatch(pathname, REDIRECT_IF_AUTHENTICATED_PATHS) || pathname === "/onboarding") {
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("slug")
      .limit(1)
      .maybeSingle();

    if (workspace) {
      const url = request.nextUrl.clone();
      url.pathname = `/${workspace.slug}/dashboard`;
      return NextResponse.redirect(url);
    }

    if (pathname !== "/onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
