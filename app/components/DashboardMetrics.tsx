import { prisma } from "@/lib/prisma";
import { FiActivity, FiClock, FiDollarSign } from "react-icons/fi";

export async function DashboardMetrics() {
  // Calcular fecha para últimas 24 horas
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  
  // Obtener métricas adicionales
  const [
    recentPurchasesCount,
    totalRevenue,
    avgItemsPerPurchase,
  ] = await Promise.all([
    // Compras de las últimas 24 horas
    prisma.purchase.count({
      where: {
        createdAt: {
          gte: yesterday,
        },
      },
    }),
    // Revenue total (suma de totales de compras completadas)
    prisma.purchase.aggregate({
      where: { status: "completed" },
      _sum: { total: true },
    }),
    // Promedio de items por compra
    prisma.purchaseItem.aggregate({
      _avg: { quantity: true },
    }),
  ]);

  const revenue = totalRevenue._sum.total 
    ? parseFloat(totalRevenue._sum.total.toString()) 
    : 0;
  
  const avgItems = avgItemsPerPurchase._avg.quantity 
    ? parseFloat(avgItemsPerPurchase._avg.quantity.toString()).toFixed(1)
    : "0";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Actividad Reciente */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-400/10 p-2.5">
            <FiActivity className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-400">Últimas 24h</p>
            <p className="mt-1 text-2xl font-bold text-zinc-100">{recentPurchasesCount}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Compras recientes</p>
          </div>
        </div>
      </div>

      {/* Revenue Total */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-400/10 p-2.5">
            <FiDollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-400">Revenue Total</p>
            <p className="mt-1 text-2xl font-bold text-zinc-100">
              ${revenue.toFixed(2)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">Compras completadas</p>
          </div>
        </div>
      </div>

      {/* Promedio Items */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-400/10 p-2.5">
            <FiClock className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-400">Promedio Items</p>
            <p className="mt-1 text-2xl font-bold text-zinc-100">{avgItems}</p>
            <p className="mt-0.5 text-xs text-zinc-500">Por compra</p>
          </div>
        </div>
      </div>
    </div>
  );
}
