import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
    matcher: [
      "/dashboard/:path*",
      "/goals/:path*",
      "/dailies/:path*",
      "/settings/:path*",
      "/personal/:path*",
      "/work/:path*",
      "/history/:path*"
    ]
  };
