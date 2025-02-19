// src/types/loginType.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Module augmentation for NextAuth.
 */
declare module "next-auth" {
  interface Session {
    user: {
      /** The user's role (e.g. "ADMIN") */
      role?: string;
      /** The access token from your API */
      accessToken?: string;
      /** The refresh token from your API */
      refreshToken?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    /** The user's role (e.g. "ADMIN") */
    role?: string;
    /** The access token from your API */
    accessToken?: string;
    /** The refresh token from your API */
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role (e.g. "ADMIN") */
    role?: string;
    /** The access token from your API */
    accessToken?: string;
    /** The refresh token from your API */
    refreshToken?: string;
    /** When the access token expires (Unix timestamp in ms) */
    accessTokenExpires?: number;
    /** An error indicator if token refresh fails */
    error?: string;
  }
}

/**
 * Response types from your login API.
 */
export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  role: string;
  token_type: string;
}

export interface LoginResponse {
  status: "success" | "error";
  message: string;
  data: LoginResponseData;
}

/**
 * Custom type aliases for convenience.
 */
export type CustomUser = DefaultUser & {
  role?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type CustomJWT = JWT & {
  role?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
};

export type CustomSession = DefaultSession & {
  user: CustomUser;
};
