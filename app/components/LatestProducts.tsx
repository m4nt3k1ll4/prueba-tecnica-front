import { fetchProducts } from "@/app/helpers/api";
import { formatCurrency, formatDate } from "@/app/helpers/utils";
import { FiBox } from "react-icons/fi";

export async function LatestProducts() {
  const res = await fetchProducts({ per_page: 5 });

  if (!res.success || !res.data) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-sm text-red-400">
        Error al cargar productos: {res.message}
      </div>
    );
  }

  const products = res.data;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-zinc-500">
        <FiBox className="mb-3 h-10 w-10" />
        <p>No hay productos aún.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider sm:px-4">
                Nombre
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider sm:px-4">
                Precio
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden sm:table-cell sm:px-4">
                Características
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell sm:px-4">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-zinc-800/50"
              >
                <td className="px-3 py-3 sm:px-4">
                  <p className="text-sm font-medium text-zinc-200 max-w-35 truncate sm:max-w-none">
                    {product.name}
                  </p>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <span className="text-sm text-emerald-400 font-medium whitespace-nowrap">
                    {formatCurrency(Number(product.price))}
                  </span>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell sm:px-4">
                  <p className="text-sm text-zinc-400 truncate max-w-xs">
                    {product.features || "—"}
                  </p>
                </td>
                <td className="px-3 py-3 hidden md:table-cell sm:px-4">
                  <span className="text-sm text-zinc-500">
                    {formatDate(product.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
