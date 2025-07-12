// src/app/admin/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="flex flex-col space-y-2">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/catalogue">Catalogue</Link>
          <Link href="/admin/users">Utilisateurs</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
