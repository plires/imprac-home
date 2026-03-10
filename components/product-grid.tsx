"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { formatPrice } from "@/lib/utils"

interface ProductGridProps {
  products: Product[]
  onProductSelect: (product: Product) => void
}

export function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <svg
            className="size-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Sin resultados
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          No se encontraron productos con los filtros seleccionados. Intenta
          ajustar los criterios de busqueda.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductSelect(product)}
          className="group relative overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-300 hover:border-primary/30 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={product.url_imagen_principal}
              alt={product.nombre_comercial}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />

            {/* Thickness badges */}
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {product.espesores.map((espesor) => (
                <Badge
                  key={espesor}
                  variant="secondary"
                  className="border-none bg-background/90 text-foreground backdrop-blur-sm"
                >
                  {espesor}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold leading-tight text-foreground">
                  {product.nombre_comercial}
                </h3>
                <p className="mt-0.5 font-mono text-xs tracking-wider text-muted-foreground">
                  {product.codigo_modelo}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-primary">
                {"$"}
                {formatPrice(product.precio_m2)}
                <span className="text-xs text-muted-foreground">/m²</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[10px] capitalize">
                {product.tono}
              </Badge>
              <Badge variant="outline" className="text-[10px] capitalize">
                Veta {product.intensidad_veta}
              </Badge>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
