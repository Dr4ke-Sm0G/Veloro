// src/app/admin/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { AdminSidebar } from "./components/AdminSidebar";
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
