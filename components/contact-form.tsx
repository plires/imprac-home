"use client"

import { useState } from "react"
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)

    const body = {
      nombre:      data.get("nombre")      as string,
      email:       data.get("email")       as string,
      telefono:    data.get("telefono")    as string,
      comentarios: data.get("comentarios") as string,
    }

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error ?? "Error al enviar el mensaje.")
      }

      setSubmitted(true)
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error. Por favor intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">

        {/* ── Encabezado ── */}
        <div className="mb-10 flex flex-col items-start gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">
              Contacto
            </p>
            <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Hablemos de tu proyecto
            </h3>
          </div>
          <p className="text-sm text-muted-foreground md:max-w-xs md:text-right">
            Completá el formulario y nos ponemos en contacto a la brevedad.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card py-16 text-center">
            <CheckCircle className="size-12 text-primary" />
            <h4 className="text-lg font-semibold text-foreground">¡Mensaje enviado!</h4>
            <p className="max-w-sm text-sm text-muted-foreground">
              Gracias por contactarnos. Te responderemos a la brevedad.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8 md:grid-cols-2"
          >
            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre" className="text-xs">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                required
                placeholder="Tu nombre"
                className="bg-background"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="bg-background"
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefono" className="text-xs">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="+54 11 0000-0000"
                className="bg-background"
              />
            </div>

            {/* Comentarios — full width */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="comentarios" className="text-xs">Comentarios</Label>
              <Textarea
                id="comentarios"
                name="comentarios"
                rows={4}
                placeholder="Contanos sobre tu proyecto..."
                className="resize-none bg-background"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 md:col-span-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="md:col-span-2">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

      </div>
    </section>
  )
}
