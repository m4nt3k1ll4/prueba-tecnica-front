import { Suspense } from "react";
import Link from "next/link";
import { bebasNeue } from "@/app/ui/fonts";
import { Search } from "@/app/components/Search";
import { ProductsTable } from "@/app/components/ProductsTable";
import { Pagination } from "@/app/components/Pagination";
import { TableSkeleton } from "@/app/components/Skeletons";
import { fetchProducts } from "@/app/helpers/api";
import { FiPlus } from "react-icons/fi";

export default async function ProductsPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;

  const res = await fetchProducts({ search, page: currentPage, per_page: 10 });
  const totalPages = res.meta?.last_page || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className={`${bebasNeue.className} text-3xl tracking-wider text-zinc-100 sm:text-4xl`}
        >
          Productos
        </h1>
        <Link
          href="/dashboard/products/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors w-full sm:w-auto"
        >
          <FiPlus className="h-4 w-4" />
          <span>Crear producto</span>
        </Link>
      </div>

      <Search placeholder="Buscar productos..." />

      <Suspense key={search + currentPage} fallback={<TableSkeleton />}>
        <ProductsTable
          search={search}
          currentPage={currentPage}
        />
      </Suspense>

      <Pagination totalPages={totalPages} />
    </div>
  );
}
