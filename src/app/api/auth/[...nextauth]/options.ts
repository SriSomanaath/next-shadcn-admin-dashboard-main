import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  LoginResponse,
  CustomJWT,
  CustomUser,
  CustomSession,
} from "@/types/loginType";
import { getApiBaseUrl } from "@/redux/config";

// Construct your custom API base URL from environment variables.
const baseURL = getApiBaseUrl();

/**
 * Helper function to refresh the access token when expired.
 */
async function refreshAccessToken(token: CustomJWT): Promise<CustomJWT> {
  try {
    const res = await fetch(`${baseURL}/auth/refresh`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token.refreshToken}`, // Using refreshToken from our token
      },
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    const refreshedResponse: LoginResponse = await res.json();
    const data = refreshedResponse.data;

    return {
      ...token,
      accessToken: data.access_token,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Define your NextAuth configuration.
// IMPORTANT: Do NOT export this variable from the route file.
export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body: new URLSearchParams({
              EMAIL: credentials.username,
              PASSWORD: credentials.password,
            }),
          });

          if (!res.ok) {
            console.error("Failed to fetch:", res.statusText);
            throw new Error("Failed to fetch");
          }

          // Parse the response using our LoginResponse type.
          const response: LoginResponse = await res.json();

          if (
            response.status === "success" &&
            response.data &&
            response.data.access_token
          ) {
            const { access_token, refresh_token, role } = response.data;
            return {
              id: access_token, // Replace with a proper unique identifier if available
              name: credentials.username,
              role,
              accessToken: access_token,
              refreshToken: refresh_token,
            } as CustomUser;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, merge user info into token.
      if (user) {
        token.role = (user as CustomUser).role;
        token.accessToken = (user as CustomUser).accessToken;
        token.refreshToken = (user as CustomUser).refreshToken;
      }

      // If the token is still valid, return it.
      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // Otherwise, attempt to refresh the access token.
      return refreshAccessToken(token as CustomJWT);
    },
    async session({ session, token }) {
      // Cast session and token to our custom types.
      const customSession = session as CustomSession;
      customSession.user.role = token.role as string | undefined;
      customSession.user.accessToken = token.accessToken as string | undefined;
      customSession.user.refreshToken = token.refreshToken as string | undefined;
      return customSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/auth/login", // Your custom login page
  },
};

export default NextAuth(options);