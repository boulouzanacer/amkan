import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname;
      if (path.startsWith("/admin")) return token?.role === "ADMIN";
      if (path.startsWith("/host")) return token?.role === "HOST" || token?.role === "ADMIN";
      return Boolean(token);
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/host/:path*", "/traveler/:path*", "/favorites/:path*", "/messages/:path*", "/profile", "/security", "/verification", "/notifications"]
};
