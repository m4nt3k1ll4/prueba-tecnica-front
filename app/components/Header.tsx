"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="#stack"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
          >
            Stack
          </a>
          <a
            href="#features"
            className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
          >
            Funcionalidades
          </a>
          <Link
            href="/login"
            className="hidden rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:inline-flex"
          >
            Iniciar Sesión
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-white sm:hidden cursor-pointer"
            aria-label="Menú"
          >
            {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black/95 backdrop-blur-md px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="#stack"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Stack
            </a>
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Funcionalidades
            </a>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-full justify-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
