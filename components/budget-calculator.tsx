"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Product } from "@/lib/products"
import { formatPrice } from "@/lib/utils"
import { Calculator, Package, DollarSign, Ruler } from "lucide-react"

interface BudgetCalculatorProps {
  product: Product
}

export function BudgetCalculator({ product }: BudgetCalculatorProps) {
  const [m2, setM2] = useState<string>("")

  const area = parseFloat(m2) || 0
  const cajasNecesarias = area > 0 ? Math.ceil(area / product.m2_por_caja) : 0
  const m2Reales = cajasNecesarias * product.m2_por_caja
  const precioEstimado = cajasNecesarias * product.precio_caja

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calculator className="size-4 text-primary" />
        <h4 className="font-semibold text-foreground">
          Calculadora de Presupuesto
        </h4>
      </div>

      <div className="space-y-4">
        <div>
          <Label
            htmlFor="m2-input"
            className="mb-1.5 text-xs font-medium text-muted-foreground"
          >
            Superficie a cubrir (m²)
          </Label>
          <Input
            id="m2-input"
            type="number"
            min="0"
            step="0.5"
            placeholder="Ej: 25"
            value={m2}
            onChange={(e) => setM2(e.target.value)}
            className="bg-background"
          />
        </div>

        {area > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-border bg-background p-3 text-center">
              <Package className="mx-auto mb-1 size-4 text-muted-foreground" />
              <p className="text-lg font-bold text-foreground">
                {cajasNecesarias}
              </p>
              <p className="text-[10px] text-muted-foreground">Cajas</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3 text-center">
              <Ruler className="mx-auto mb-1 size-4 text-muted-foreground" />
              <p className="text-lg font-bold text-foreground">
                {m2Reales.toFixed(1)}
              </p>
              <p className="text-[10px] text-muted-foreground">m² reales</p>
            </div>
            <div className="rounded-md border border-border bg-background p-3 text-center">
              <DollarSign className="mx-auto mb-1 size-4 text-muted-foreground" />
              <p className="text-lg font-bold text-primary">
                {"$"}
                {formatPrice(precioEstimado)}
              </p>
              <p className="text-[10px] text-muted-foreground">Estimado</p>
            </div>
          </div>
        )}

        {area > 0 && (
          <p className="text-[11px] text-muted-foreground">
            *Precio estimado basado en{" "}
            {product.m2_por_caja} m²/caja a ${formatPrice(product.precio_m2)}/m².
            Stock disponible: {product.stock_cajas} cajas.
          </p>
        )}
      </div>
    </div>
  )
}
