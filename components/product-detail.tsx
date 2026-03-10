"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BudgetCalculator } from "@/components/budget-calculator"
import { QuoteForm } from "@/components/quote-form"
import type { Product } from "@/lib/products"
import { formatPrice } from "@/lib/utils"
import { Shield, Layers, MousePointerClick, FileText } from "lucide-react"

interface ProductDetailProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetail({
  product,
  open,
  onOpenChange,
}: ProductDetailProps) {
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [imageView, setImageView] = useState<"product" | "installed">("product")

  if (!product) return null

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full p-0 sm:max-w-xl md:max-w-2xl"
        >
          <ScrollArea className="h-full">
            <div className="flex flex-col">
              {/* Image comparison section */}
              <div className="relative">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={
                      imageView === "product"
                        ? product.url_imagen_principal
                        : product.url_imagen_installed
                    }
                    alt={product.nombre_comercial}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                </div>

                {/* Image toggle */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 overflow-hidden rounded-full border border-border bg-background/90 p-0.5 backdrop-blur-sm">
                  <button
                    onClick={() => setImageView("product")}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      imageView === "product"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Producto
                  </button>
                  <button
                    onClick={() => setImageView("installed")}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      imageView === "installed"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Instalado
                  </button>
                </div>
              </div>

              {/* Product info */}
              <div className="flex flex-col gap-6 p-6">
                <SheetHeader className="gap-0 p-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <SheetTitle className="text-xl">
                        {product.nombre_comercial}
                      </SheetTitle>
                      <SheetDescription className="mt-1 font-mono text-xs tracking-wider">
                        {product.codigo_modelo}
                      </SheetDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {"$"}
                        {formatPrice(product.precio_m2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        por m²
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {product.espesores.map((espesor) => (
                      <Badge key={espesor} variant="secondary">
                        {espesor}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="capitalize">
                      Tono {product.tono}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      Veta {product.intensidad_veta}
                    </Badge>
                  </div>
                </SheetHeader>

                <Separator />

                {/* Technical specs */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Especificaciones Tecnicas
                  </h4>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                            <Layers className="size-3.5 shrink-0" />
                            Nucleo
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {product.material_nucleo}
                          </td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/20">
                          <td className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                            <Shield className="size-3.5 shrink-0" />
                            Capa de desgaste
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {product.capa}
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                            <MousePointerClick className="size-3.5 shrink-0" />
                            Sistema Click
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {product.sistema_click}
                          </td>
                        </tr>
                        <tr className="bg-secondary/20">
                          <td className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                            <FileText className="size-3.5 shrink-0" />
                            Garantia
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {product.garantia_anos} anos
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <Separator />

                {/* Budget calculator */}
                <BudgetCalculator product={product} />

                <Separator />

                {/* CTA */}
                <Button
                  size="lg"
                  className="w-full text-base"
                  onClick={() => setShowQuoteForm(true)}
                >
                  <FileText className="mr-2 size-5" />
                  Solicitar Presupuesto Formal
                </Button>

                <p className="text-center text-[11px] text-muted-foreground">
                  Respuesta dentro de 24hs habiles. Sin compromiso.
                </p>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <QuoteForm
        product={product}
        open={showQuoteForm}
        onOpenChange={setShowQuoteForm}
      />
    </>
  )
}
