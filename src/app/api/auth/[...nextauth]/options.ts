import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginWithCredentials } from "@/actions/auth.action";
import { ENV } from "@/config/env";
import { loginSchema } from "@/validations/auth.dto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          throw new Error("Invalid input");
        }
        return await loginWithCredentials(validated.data);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: ENV.AUTH_SECRET,
};
