"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { EmblaCarouselType } from "embla-carousel"
import { Badge } from "@/components/ui/badge"

// ── Slides: reemplazá los src por tus imágenes hero definitivas ──────────────
const SLIDES = [
  { src: "/images/hero-img.webp",         alt: "Ambiente con piso SPC Imprac instalado" },
  { src: "/images/hero-img-2.webp",       alt: "Sala de estar con piso SPC Imprac"      },
  { src: "/images/hero-img-3.webp",       alt: "pista de baile con piso SPC Imprac instalado"  },
  { src: "/images/hero-img-4.webp",       alt: "cocina con piso SPC Imprac instalado"  },
  { src: "/images/hero-img-5.webp",       alt: "comedor con piso SPC Imprac instalado"  },
  { src: "/images/hero-img-6.webp",       alt: "alfombra sobre piso SPC Imprac instalado"  },
  { src: "/images/hero-img-7.webp",       alt: "piso waterproof SPC Imprac instalado"  },
]

const AUTOPLAY_MS = 5000

function useDotButton(emblaApi: EmblaCarouselType | undefined) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps,   setScrollSnaps]   = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      onSelect()
    }
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onReInit)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onReInit)
    }
  }, [emblaApi])

  return { selectedIndex, scrollSnaps, onDotButtonClick }
}

export function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 })
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return
    const timer = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [emblaApi])

  return (
    <section className="relative flex min-h-[540px] items-center overflow-hidden border-b border-border md:min-h-[640px] lg:min-h-[750px]">

      {/* ── Carrusel de fondo ── */}
      <div ref={emblaRef} className="absolute inset-0">
        <div className="flex h-full">
          {SLIDES.map(({ src, alt }) => (
            <div key={src} className="relative min-w-full flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay ajustado para desvanecerse antes de la mitad o al 60% */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent xl:w-2/3" />

      {/* ── Overlay inferior (profundidad) ── */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/55 via-transparent to-transparent" /> */}

      {/* ── Contenido ── */}
      <div className="relative z-10 mx-auto w-full px-6 py-16 md:py-24 lg:py-32 lg:pl-32">
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

          {/* ── Dots ── */}
          <div className="mt-8 flex gap-2">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => onDotButtonClick(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "w-6 bg-amber-400"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}
