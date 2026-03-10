import { Shield, Droplets, Volume2, Flame } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type MainFeature = { icon: LucideIcon; index: string; label: string; description: string }

const features: MainFeature[] = [
  { icon: Shield,   index: "01", label: "Alta Resistencia",   description: "Capa de desgaste premium UV" },
  { icon: Droplets, index: "02", label: "100% Waterproof",    description: "Núcleo SPC impermeable" },
  { icon: Volume2,  index: "03", label: "Aislación Acústica", description: "Pad integrado IXPE" },
  { icon: Flame,    index: "04", label: "Clase B1",           description: "Retardante al fuego" },
]

export function ProductFeatures() {
  return (
    <section className="border-y border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">

        {/* ── Encabezado ── */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/70">
            Tecnología SPC
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Ingeniería que marca la diferencia
          </h3>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, index, label, description }) => (
            <div
              key={label}
              className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-8 transition-all duration-300 hover:border-amber-400/25 hover:bg-white/[0.06]"
            >
              <span className="absolute right-6 top-5 text-xs font-bold tracking-widest text-white/10 transition-colors group-hover:text-amber-400/20">
                {index}
              </span>
              <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/15 transition-colors group-hover:bg-amber-400/15 group-hover:ring-amber-400/30">
                <Icon className="size-6 text-amber-400" />
              </div>
              <p className="mb-2 text-base font-bold text-white">{label}</p>
              <p className="text-sm leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-300">
                {description}
              </p>
              <div className="mt-8 h-px w-8 rounded-full bg-amber-400/25 transition-all duration-300 group-hover:w-14 group-hover:bg-amber-400/50" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
