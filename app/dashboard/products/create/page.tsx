import { bebasNeue } from "@/app/ui/fonts";
import { ProductForm } from "@/app/components/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <h1
        className={`${bebasNeue.className} text-3xl tracking-wider text-zinc-100 sm:text-4xl`}
      >
        Crear Producto
      </h1>

      <div className="max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
        <ProductForm />
      </div>
    </div>
  );
}
