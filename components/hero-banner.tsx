import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export function HeroBanner() {
  return (
    <section className="relative flex min-h-[540px] items-center overflow-hidden border-b border-border md:min-h-[640px] lg:min-h-[750px]">

      {/* ── Imagen de fondo ── */}
      <Image
        src="/images/hero-img.webp"
        alt="Ambiente con piso SPC Imprac instalado"
        fill
        className="object-cover object-center"
        priority
      />

      {/* ── Overlay izquierda → derecha (legibilidad del texto) ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/55 to-zinc-950/25 xl:via-zinc-950/28 xl:to-transparent" />

      {/* ── Overlay inferior (profundidad) ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/55 via-transparent to-transparent" />

      {/* ── Contenido ── */}
      <div className="relative z-10 mx-auto w-full lg:pl-32 px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl xl:max-w-xl">

          <Badge
            variant="outline"
            className="mb-6 border-white/20 bg-white/10 text-white/85 backdrop-blur-sm"
          >
            Catálogo 2026
          </Badge>

          <h2 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            Pisos Vinílicos SPC
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              de Alta Performance
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/65 md:text-lg">
            Soluciones de pisos profesionales para arquitectos, constructores
            y proyectos de interiorismo. Núcleo rígido SPC, sistema click de
            instalación rápida y garantía extendida.
          </p>

          {/* ── Línea decorativa ── */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-12 bg-amber-400/60" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Colección profesional
            </p>
          </div>

        </div>
      </div>

    </section>
  )
}
