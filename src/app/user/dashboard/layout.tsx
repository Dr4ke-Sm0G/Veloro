'use client';
// src/app/(user)/dashboard/layout.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const links = [
  { href: "/user/dashboard", label: "Overview" },
  { href: "/user/favorites", label: "Favorites" },
  { href: "/user/messages", label: "Messages" },
  { href: "/user/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-white border-r p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">My Account</h2>
        <nav className="space-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "block px-4 py-2 rounded-md text-sm font-medium",
                pathname === href
                  ? "bg-black text-white"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children} 
    <Toaster richColors closeButton position="top-right" />
      </main>
    </div>
  );
}
