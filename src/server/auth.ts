// src/server/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "@/server/db";
import { Role } from "@prisma/client";   

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user?.password) {
          const isValid = await compare(credentials.password, user.password);
          if (isValid) return user;
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // → Ajoute token.role ici
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.picture =
          typeof user.image === "string" && user.image.startsWith("data:image")
            ? null
            : user.image || null;
        token.role = (user as any).role as Role;  // ← **nouveau**
      }
      return token;
    },
    // → Expose role dans session.user
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.image = token.picture as string | null;
        session.user.role = token.role as Role;  
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};