"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiZap,
  FiShoppingCart,
  FiBox,
} from "react-icons/fi";
import type { Product } from "@/app/types";
import { useCart } from "./CartContext";
import {
  chatAssistantAction,
  fetchStockByProductAction,
} from "@/app/helpers/actions";
import type { ChatMessage } from "@/app/helpers/actions";
import { formatCurrency } from "@/app/helpers/utils";
import { toast } from "sonner";
import Image from "next/image";

// ─── Mini product card shown inside chat ────────────────────
function ChatProductCard({
  product,
  onAdd,
  isAdding,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  isAdding: boolean;
}) {
  const firstImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-700/60 bg-zinc-800/80 p-2.5 transition-colors hover:border-zinc-600">
      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-900">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <FiBox className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-zinc-200">
          {product.name}
        </p>
        <p className="text-sm font-semibold text-emerald-400">
          {formatCurrency(Number(product.price))}
        </p>
      </div>

      {/* Add to cart */}
      <button
        onClick={() => onAdd(product)}
        disabled={isAdding}
        className="shrink-0 rounded-lg bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Agregar al carrito"
      >
        <FiShoppingCart className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Typing indicator ───────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="flex items-center gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
      </div>
      <span className="ml-2 text-xs text-zinc-500">Pensando…</span>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────
export function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente de compras. Cuéntame qué estás buscando y te ayudaré a encontrar los productos perfectos para ti.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history (only role + content for the action)
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await chatAssistantAction(history);
      console.log("Respuesta del asistente:", res);

      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.message,
            products: res.products,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.message || "Lo siento, hubo un problema. ¿Puedes intentar de nuevo?",
          },
        ]);
      }
    } catch (error) {
      console.error("Error en handleSend:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error de conexión. Inténtalo de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddToCart = useCallback(
    async (product: Product) => {
      setAddingProductId(product.id);
      try {
        const stockRes = await fetchStockByProductAction(product.id);
        if (!stockRes.success || !stockRes.data) {
          toast.error("No se pudo verificar el stock");
          return;
        }
        if (stockRes.data.stock === 0) {
          toast.error("Producto sin stock disponible");
          return;
        }
        addItem(product, 1, stockRes.data);
        toast.success(`${product.name} agregado al carrito`);
        
        // Cerrar el chat y resetear mensajes después de agregar al carrito
        setTimeout(() => {
          setIsOpen(false);
          setMessages([
            {
              role: "assistant",
              content:
                "¡Hola! Soy tu asistente de compras. Cuéntame qué estás buscando y te ayudaré a encontrar los productos perfectos para ti.",
            },
          ]);
        }, 800); // Pequeño delay para que el usuario vea el toast de éxito
      } catch {
        toast.error("Error al agregar al carrito");
      } finally {
        setAddingProductId(null);
      }
    },
    [addItem]
  );

  return (
    <>
      {/* ── Chat panel ───────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-28 right-3 left-3 z-50 flex max-w-90 flex-col overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900 shadow-2xl shadow-black/40 sm:left-auto sm:right-6 md:bottom-32 md:right-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-linear-to-r from-indigo-600/20 to-violet-600/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                <FiZap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Asistente IA
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Te ayudo a elegir
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ maxHeight: "420px", minHeight: "280px" }}>
            {messages.map((msg, i) => (
              <div key={i}>
                {/* Message bubble */}
                <div
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-indigo-600 text-white"
                        : "rounded-bl-md bg-zinc-800 text-zinc-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Product recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.products.map((product) => (
                      <ChatProductCard
                        key={product.id}
                        product={product}
                        onAdd={handleAddToCart}
                        isAdding={addingProductId === product.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800 bg-zinc-900/80 px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="¿Qué estás buscando?"
                disabled={isLoading}
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Enviar"
              >
                <FiSend className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating bubble button ───────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`fixed bottom-16 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 cursor-pointer sm:right-6 md:bottom-20 md:right-8 ${
          isOpen
            ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            : "bg-linear-to-br from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 hover:shadow-xl"
        }`}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente de compras IA"}
      >
        {isOpen ? (
          <FiX className="h-6 w-6" />
        ) : (
          <div className="relative">
            <FiMessageCircle className="h-6 w-6" />
            <FiZap className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 text-yellow-300" />
          </div>
        )}
      </button>
    </>
  );
}
