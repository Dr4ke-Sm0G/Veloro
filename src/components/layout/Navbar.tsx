"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    import("flowbite"); // Dropdowns Flowbite si utilisés
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`z-50 w-full fixed top-0 left-0 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-700"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-5 pl-5 bg-transparent">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span
            className={`self-center text-2xl font-semibold whitespace-nowrap ${
              scrolled ? "text-gray-900 dark:text-white" : "text-white"
            }`}
          >
            Flowbite
          </span>
        </a>

        {/* Langue + Login + Burger */}
        <div className="flex items-center md:order-2 space-x-3">
          {/* Dropdown langue */}
          <div className="relative">
            <button
              type="button"
              data-dropdown-toggle="language-dropdown-menu"
              className={`inline-flex items-center gap-3 font-medium justify-center px-4 py-2 text-sm rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                scrolled ? "text-gray-900 dark:text-white" : "text-white"
              }`}
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

            {/* Dropdown */}
            <div
              id="language-dropdown-menu"
              className="z-50 hidden absolute mt-2 w-72 bg-white rounded-xl shadow-lg dark:bg-gray-700"
            >
              <ul className="py-6 px-4 text-base text-gray-700 dark:text-gray-200 space-y-3 flex flex-col items-center">
                {[
                  { lang: "English (US)", flag: "🇺🇸" },
                  { lang: "Deutsch", flag: "🇩🇪" },
                  { lang: "Italiano", flag: "🇮🇹" },
                  { lang: "中文 (繁體)", flag: "🇨🇳" },
                ].map(({ lang, flag }) => (
                  <li key={lang} className="w-full">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-md text-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
          <a
            href="/login"
            className={`text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
              scrolled ? "text-gray-900 dark:text-white" : "text-white"
            }`}
          >
            Login
          </a>

          {/* Burger */}
          <button
            data-collapse-toggle="navbar-menu"
            type="button"
            className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ${
              scrolled ? "text-gray-500 dark:text-white" : "text-white"
            }`}
            aria-controls="navbar-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
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
          <ul className="flex flex-col md:flex-row gap-y-2 md:gap-x-6 font-medium p-4 md:p-0 mt-4 md:mt-0 border border-transparent md:border-0 rounded-lg bg-transparent">
            {["Electric", "Hybrid", "Compare", "Reviews", "News"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className={`block py-2 px-3 rounded md:p-0 transition ${
                    scrolled
                      ? "text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500"
                      : "text-white hover:text-blue-200"
                  }`}
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
