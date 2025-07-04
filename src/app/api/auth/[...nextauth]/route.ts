// src/app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs'; // ⬅️ ajoute cette ligne en tout début

import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
