"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { data: session, status } = useSession();

   // 👤 Premier prénom pour le dropdown
  const userFirstName = session?.user?.name?.split(" ")[0] ?? "";

  // 🛂 Est‑ce un administrateur ?
  const isAdmin = session?.user?.role === "ADMIN";

// Définir les liens avec leurs hrefs correspondants
const navLinks = [
  { label: "Electric", href: "/search" }, // Assurez-vous que cette page existe
  { label: "Hybrid", href: "#" },     // Assurez-vous que cette page existe
  { label: "Compare", href: "/compare" },   // Le lien vers la page de comparaison
 // { label: "Reviews", href: "#" },   // Assurez-vous que cette page existe
  { label: "News", href: "/news" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  // pour l’effet de scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled
          ? "backdrop-blur-md bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"
          : isDark
            ? "bg-transparent text-white"
            : "bg-white text-gray-900 shadow-sm"
        }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-5 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="text-2xl font-semibold">Flowbite</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6 font-medium">
          {navLinks.map((item) => ( // Utilisez navLinks ici
            <li key={item.label}>
              <Link
                href={item.href} // <--- LIEN MIS À JOUR ICI
                className="block py-2 px-3 rounded transition hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions (Langue + Login) Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Dropdown langue */}
          <LanguageDropdown />
          {/* Login / Profile */}
          {status === "loading" ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </span>
          ) : session?.user ? (
            <ProfileDropdown name={userFirstName} />
          ) : (
            <Button
              variant="ghost"
              onClick={() => signIn()}
              className="text-sm font-medium px-4 py-2 font-sans"
              
            >
              Login
            </Button>
          )}
        </div>

        {/* Burger Button Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              // icône fermeture
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // icône burger
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden">
            <ul className="flex flex-col space-y-2 p-4">
              {navLinks.map((item) => ( // Utilisez navLinks ici
                <li key={item.label}>
                  <Link
                    href={item.href} // <--- LIEN MIS À JOUR ICI
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-3 rounded transition hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <LanguageDropdown inMobile onSelect={() => setMenuOpen(false)} />
              {status === "loading" ? (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Loading...
                </span>
              ) : session?.user ? (
                <ProfileDropdown
                  name={userFirstName}
                  inMobile
                  onItemClick={() => setMenuOpen(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => { signIn(); setMenuOpen(false); }}
                  className="w-full text-center"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Composants auxiliaires (inchangés)
function LanguageDropdown({ inMobile = false, onSelect }: { inMobile?: boolean; onSelect?: () => void }) {
  const langs = [
    { lang: "English (US)", flag: "🇺🇸" },
    { lang: "Deutsch", flag: "🇩🇪" },
    { lang: "Italiano", flag: "🇮🇹" },
    { lang: "中文 (繁體)", flag: "🇨🇳" },
  ];
  return (
    <div className={inMobile ? "" : "relative"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`inline-flex items-center gap-2 font-medium px-4 py-2 text-sm rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 ${inMobile ? "w-full justify-between" : ""}`}
          >
            🌐 Language
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`w-48 ${inMobile ? "" : "absolute right-0 mt-2"}`}>
          {langs.map(({ lang, flag }) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => onSelect && onSelect()}
            >
              <span className="text-lg">{flag}</span>
              <span>{lang}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ProfileDropdown({ name, inMobile = false, onItemClick }: { name: string; inMobile?: boolean; onItemClick?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`text-sm font-medium ${inMobile ? "w-full text-left" : "px-4 py-2"}`}>
          Hello, {name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={inMobile ? "start" : "end"} className={inMobile ? "w-full" : "w-44"}>
        <DropdownMenuItem asChild>
          <Link href="/user/dashboard" onClick={() => onItemClick && onItemClick()}>
            👤 Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/user/favorites" onClick={() => onItemClick && onItemClick()}>
            ⭐ Favorites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut({ callbackUrl: "/" });
            onItemClick && onItemClick();
          }}
          className="text-red-600"
        >
          🚪 Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}