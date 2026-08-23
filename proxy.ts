import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const username = process.env.OPS_DASHBOARD_USER;
  const password = process.env.OPS_DASHBOARD_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Operations portal is not configured.", { status: 503 });
  }

  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice(6));
      const separator = decoded.indexOf(":");
      const suppliedUser = separator >= 0 ? decoded.slice(0, separator) : "";
      const suppliedPassword = separator >= 0 ? decoded.slice(separator + 1) : "";

      if (suppliedUser === username && suppliedPassword === password) {
        return NextResponse.next();
      }
    } catch {
      // Fall through to the authentication challenge.
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Floush Operations"' },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/ops/:path*"],
};
