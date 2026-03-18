"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export function ContactForm() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", comentarios: "" })
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
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

        {sent ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Send className="size-6 text-primary" />
            </div>
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
              <label htmlFor="nombre" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none ring-offset-background transition focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none ring-offset-background transition focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="telefono" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+54 11 0000-0000"
                className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none ring-offset-background transition focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Comentarios — ocupa columna completa en md */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="comentarios" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Comentarios
              </label>
              <textarea
                id="comentarios"
                name="comentarios"
                rows={4}
                value={form.comentarios}
                onChange={handleChange}
                placeholder="Contanos sobre tu proyecto..."
                className="resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none ring-offset-background transition focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Send className="size-4" />
                Enviar mensaje
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  )
}
