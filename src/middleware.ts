import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // Redirect unauthenticated users to this page
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
