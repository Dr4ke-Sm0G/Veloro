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
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const userFirstName = session?.user?.name?.split(" ")[0] ?? "";
  useEffect(() => {
    import("flowbite");
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll(); // initial
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  return (
    <nav
      className={`z-50 w-full fixed top-0 left-0 transition-all duration-300 ${scrolled
        ? "backdrop-blur-md bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700"
        : isDark
          ? "bg-transparent text-white"
          : "bg-white text-gray-900 shadow-sm"
        }`}
    >
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between py-5 px-5">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Logo" />
          <span className="text-2xl font-semibold">Flowbite</span>
        </a>

        {/* Langue + Login + Burger */}
        <div className="flex items-center md:order-2 space-x-3">
          {/* Dropdown langue */}
          <div className="relative">
            <button
              type="button"
              data-dropdown-toggle="language-dropdown-menu"
              className="inline-flex items-center gap-2 font-medium justify-center px-4 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <svg
                className="w-5 h-5 rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 3900 3900"
                aria-hidden="true"
              >
                <path fill="#b22234" d="M0 0h7410v3900H0z" />
                <path
                  d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
                  stroke="#fff"
                  strokeWidth="300"
                />
                <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
              </svg>
              <span>English (US)</span>
            </button>

            {/* Dropdown menu */}
            <div
              id="language-dropdown-menu"
              className="z-50 hidden absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-xl shadow-lg"
            >
              <ul className="py-4 px-2 text-base text-gray-700 dark:text-gray-200 space-y-2">
                {[
                  { lang: "English (US)", flag: "🇺🇸" },
                  { lang: "Deutsch", flag: "🇩🇪" },
                  { lang: "Italiano", flag: "🇮🇹" },
                  { lang: "中文 (繁體)", flag: "🇨🇳" },
                ].map(({ lang, flag }) => (
                  <li key={lang} className="w-full">
                    <a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <span className="text-lg">{flag}</span>
                      <span>{lang}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Login */}
          {status === "loading" ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-4 py-2 text-sm font-medium">
                  Hello, {userFirstName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard">👤 Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/favorites">⭐ Favorites</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 cursor-pointer"
                >
                  🚪 Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              onClick={() => window.location.href = "/login"}
              className="text-sm font-medium px-4 py-2"
            >
              Login
            </Button>
          )}


          {/* Burger */}
          <button
            data-collapse-toggle="navbar-menu"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-controls="navbar-menu"
            aria-expanded="false"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 17 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Menu principal */}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-menu"
        >
          <ul className="flex flex-col md:flex-row gap-y-2 md:gap-x-6 font-medium p-4 md:p-0 mt-4 md:mt-0 bg-transparent">
            {["Electric", "Hybrid", "Compare", "Reviews", "News"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block py-2 px-3 rounded md:p-0 transition hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
