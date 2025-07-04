import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ✅ tu ajoutes le champ ici
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}
