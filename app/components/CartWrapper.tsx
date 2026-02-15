"use client";

import { CartProvider } from "@/app/components/CartContext";
import { CartDrawer } from "@/app/components/CartDrawer";
import { CartButton } from "@/app/components/CartButton";
import { AIChatBubble } from "@/app/components/AIChatBubble";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

export function CartWrapper({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin ?? false;

  // Solo usuarios normales (no admin) ven el carrito
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      {/* Floating cart button */}
      <div className="fixed bottom-4 right-3 z-30 sm:right-6 md:bottom-8 md:right-8">
        <CartButton />
      </div>

      {/* AI Shopping assistant bubble */}
      <AIChatBubble />

      {children}

      {/* Cart drawer */}
      <CartDrawer />
    </CartProvider>
  );
}
