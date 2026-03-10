"use client"

import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"

const IMAGES = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/carrusel/piso-${i + 1}.webp`,
  alt: `Instalación de piso SPC Imprac — ambiente ${i + 1}`,
}))

export function ImageCarousel() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,       // arrastre libre (sin snap forzado) → ideal para swipe mobile
      watchDrag: true,
    },
    [
      AutoScroll({
        speed: 1,                  // ~120 px/frame a 60 fps — más rápido que antes
        startDelay: 0,             // arranca sin retardo
        stopOnInteraction: false,  // el auto-scroll se retoma solo tras el swipe
        stopOnMouseEnter: true,    // pausa al hacer hover en desktop
      }),
    ]
  )

  return (
    <section className="bg-zinc-950 py-12 md:py-16">

      {/* ── Encabezado ── */}
      <div className="mx-auto mb-10 max-w-7xl px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/70">
          Galería de instalaciones
        </p>
        <h3 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          Nuestros pisos en distintos ambientes
        </h3>
      </div>

      {/* ── Viewport de Embla ── */}
      <div className="relative">

        {/* Fades laterales */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-zinc-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-zinc-950 to-transparent" />

        {/* Viewport: el overflow:hidden lo maneja Embla desde aquí */}
        <div
          ref={emblaRef}
          className="cursor-grab overflow-hidden active:cursor-grabbing"
        >
          <div className="flex">
            {IMAGES.map(({ src, alt }, i) => (
              <div key={i} className="shrink-0 px-2">
                <div
                  className="relative h-52 overflow-hidden rounded-2xl md:h-64 lg:h-72"
                  style={{ aspectRatio: "4/3" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt}
                    draggable={false}   // evita el drag nativo del browser sobre la img
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
