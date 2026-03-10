"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/products"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface QuoteFormProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuoteForm({ product, open, onOpenChange }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const body = {
      nombre:             formData.get("name") as string,
      empresa:            formData.get("company") as string,
      email:              formData.get("email") as string,
      telefono:           formData.get("phone") as string,
      superficie_m2:      parseFloat(formData.get("m2") as string),
      notas:              formData.get("notes") as string,
      producto_nombre:    product.nombre_comercial,
      producto_codigo:    product.codigo_modelo,
      producto_precio_m2: product.precio_m2,
    }

    try {
      const res = await fetch("https://plires.test/api/quote.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? "Error al enviar la solicitud.")
      }

      setSubmitted(true)
      form.reset()
      setTimeout(() => {
        setSubmitted(false)
        onOpenChange(false)
      }, 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error. Por favor intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar Presupuesto Formal</DialogTitle>
          <DialogDescription>
            Producto: {product.nombre_comercial} ({product.codigo_modelo})
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle className="size-12 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Solicitud enviada
            </h3>
            <p className="text-sm text-muted-foreground">
              Nos pondremos en contacto dentro de las proximas 24 horas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="mb-1.5 text-xs">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Juan Perez"
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="company" className="mb-1.5 text-xs">
                  Empresa
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Constructora XYZ"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="mb-1.5 text-xs">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="juan@empresa.com"
                  className="bg-background"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5 text-xs">
                  Telefono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  className="bg-background"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="m2" className="mb-1.5 text-xs">
                Superficie estimada (m²)
              </Label>
              <Input
                id="m2"
                name="m2"
                type="number"
                min="1"
                required
                placeholder="Ej: 50"
                className="bg-background"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="mb-1.5 text-xs">
                Notas adicionales
              </Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Detalles del proyecto, plazos, requerimientos especiales..."
                className="bg-background"
              />
            </div>

            <div className="rounded-md border border-border bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Producto seleccionado:</span>{" "}
                {product.nombre_comercial} &mdash; {product.codigo_modelo}
                <br />
                Precio referencia: ${product.precio_m2.toFixed(2)}/m²
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
