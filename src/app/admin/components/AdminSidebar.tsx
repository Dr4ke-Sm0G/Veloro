"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Search,
  Package,
  User,
  Inbox,
  Menu,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "users", icon: Users },
  { href: "/admin/catalogue", label: "catalogue", icon: Package },

];

const others = [
  { href: "#", label: "Units", icon: Search },
  { href: "#", label: "Drivers", icon: User },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden p-4 flex justify-between items-center border-b">
        <h1 className="text-lg font-semibold">Admin</h1>
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col md:w-64 px-4 py-6",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <h2 className="px-2 text-sm font-semibold text-muted-foreground mb-4">Main</h2>
        <nav className="space-y-1 relative">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={`${link.href}-${link.label}`} // ✅ clef unique
                href={link.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >

                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-md bg-primary/10"
                    transition={{ duration: 0.3 }}
                  />
                )}
                <Icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{link.label}</span>

              </Link>
            );
          })}
        </nav>

        <h2 className="mt-6 px-2 text-sm font-semibold text-muted-foreground mb-4">Others</h2>
        <nav className="space-y-1">
          {others.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={`${link.href}-${link.label}`} // ✅ clef unique
                href={link.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}