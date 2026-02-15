"use client";

import type { Product } from "@/app/types";
import { formatCurrency } from "@/app/helpers/utils";
import Image from "next/image";
import { FiBox, FiShoppingCart, FiEye, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "./CartContext";
import { useState } from "react";
import { fetchStockByProductAction } from "@/app/helpers/actions";
import { toast } from "sonner";

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const firstImage =
    product.images && product.images.length > 0 ? product.images[0] : null;
  
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      const stockRes = await fetchStockByProductAction(product.id);
      if (!stockRes.success || !stockRes.data) {
        toast.error("No se pudo verificar el stock");
        return;
      }

      const stock = stockRes.data;
      if (stock.stock === 0) {
        toast.error("Producto sin stock disponible");
        return;
      }

      if (quantity > stock.stock) {
        toast.error(`Solo hay ${stock.stock} unidades disponibles`);
        return;
      }

      addItem(product, quantity, stock);
      toast.success(`${quantity}x ${product.name} agregado al carrito`);
      setQuantity(1);
    } catch (error) {
      toast.error("Error al agregar al carrito");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-600 hover:shadow-lg hover:shadow-indigo-500/5">
      {/* Image - clickeable para abrir modal */}
      <button
        onClick={onClick}
        className="relative aspect-square w-full overflow-hidden bg-zinc-950 cursor-pointer"
      >
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-700">
            <FiBox className="h-12 w-12" />
          </div>
        )}
        {/* Image count badge */}
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
            +{product.images.length - 1} fotos
          </span>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <button onClick={onClick} className="text-left cursor-pointer">
          <p className="text-xs text-zinc-400 line-clamp-1 sm:text-sm">
            {product.features || "Producto"}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-zinc-100 line-clamp-2 group-hover:text-indigo-300 transition-colors sm:text-base">
            {product.name}
          </h3>
        </button>
        
        <p className="mt-auto pt-2 text-base font-bold text-emerald-400 sm:pt-3 sm:text-xl">
          {formatCurrency(Number(product.price))}
        </p>

        {/* Controles de cantidad y agregar al carrito */}
        <div className="mt-2 flex flex-col gap-1.5 sm:mt-3 sm:flex-row sm:items-center">
          {/* Selector de cantidad */}
          <div className="flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
            <button
              onClick={handleDecrement}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors sm:p-2"
            >
              <FiMinus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
            <span className="px-2 text-sm font-medium text-zinc-200 min-w-5 text-center sm:px-2.5 sm:min-w-6">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors sm:p-2"
            >
              <FiPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 min-w-0 flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-sm"
          >
            <FiShoppingCart className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">{isAdding ? "..." : "Agregar"}</span>
          </button>
        </div>

        {/* Botón ver detalles */}
        <button
          onClick={onClick}
          className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-2 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 sm:mt-2 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <FiEye className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span>Ver detalles</span>
        </button>
      </div>
    </div>
  );
}
