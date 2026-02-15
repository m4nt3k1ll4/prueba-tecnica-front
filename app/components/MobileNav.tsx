"use client";

import { useState } from "react";
import { FiMenu, FiX, FiPower, FiShield, FiUser } from "react-icons/fi";
import { useSession } from "next-auth/react";
import Logo from "@/app/components/Logo";
import { NavLinks } from "@/app/components/NavLinks";
import { logOut } from "@/app/helpers/actions";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin ?? false;
  const isInterviewer = session?.user?.isInterviewer ?? false;

  return (
    <>
      {/* Hamburger button — visible only below md */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors md:hidden cursor-pointer"
        aria-label="Abrir menú"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-zinc-900 border-r border-zinc-800 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
            <Logo />
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar menú"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav
            className="flex-1 overflow-y-auto px-3 py-4"
            onClick={() => setIsOpen(false)}
          >
            <NavLinks />
          </nav>

          {/* User & Logout */}
          <div className="border-t border-zinc-800 px-4 py-4">
            {session?.user && (
              <div className="mb-3 px-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {session.user.name}
                  </p>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-400/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 uppercase">
                      <FiShield className="h-2.5 w-2.5" />
                      Admin
                    </span>
                  ) : isInterviewer ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase">
                      <FiShield className="h-2.5 w-2.5" />
                      Interviewer
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-700/50 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 uppercase">
                      <FiUser className="h-2.5 w-2.5" />
                      Usuario
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">
                  {session.user.email}
                </p>
              </div>
            )}
            <form action={logOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
              >
                <FiPower className="h-5 w-5" />
                <span>Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
