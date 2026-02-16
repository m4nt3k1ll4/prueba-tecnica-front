import { Suspense } from "react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { bebasNeue } from "@/app/ui/fonts";
import { CardWrapper } from "@/app/components/CardWrapper";
import { DashboardMetrics } from "@/app/components/DashboardMetrics";
import { CardsSkeleton } from "@/app/components/Skeletons";
import { LatestProducts } from "@/app/components/LatestProducts";

export default async function DashboardPage() {
  const session = await auth();

  // Usuarios normales solo ven el catálogo (admins e interviewers ven el dashboard)
  if (!session?.user?.isAdmin && !session?.user?.isInterviewer) {
    redirect("/dashboard/catalogo");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1
          className={`${bebasNeue.className} text-3xl tracking-wider text-zinc-100 sm:text-4xl`}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-zinc-400">
          Bienvenido, {session?.user?.name ?? "Administrador"}.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<CardsSkeleton />}>
        <CardWrapper />
      </Suspense>

      {/* Métricas Adicionales */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-200">
          Métricas de Actividad
        </h2>
        <Suspense fallback={<div className="grid gap-4 sm:grid-cols-3"><div className="h-32 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" /><div className="h-32 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" /><div className="h-32 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" /></div>}>
          <DashboardMetrics />
        </Suspense>
      </div>

      {/* Latest Products */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-200">
          Últimos productos
        </h2>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-zinc-900 border border-zinc-800" />}>
          <LatestProducts />
        </Suspense>
      </div>
    </div>
  );
}
