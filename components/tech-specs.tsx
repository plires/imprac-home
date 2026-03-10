import {
  Gauge, Gem, Award, Recycle, Cigarette,
  Leaf, Anchor, Footprints, Thermometer, Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Spec = { icon: LucideIcon; label: string; detail: string }

const specs: Spec[] = [
  { icon: Gauge,       label: "Alta Densidad",          detail: "Se hunde en agua"              },
  { icon: Gem,         label: "Alta Dureza",            detail: "Máxima resist. al impacto"     },
  { icon: Award,       label: "Norma Unión Europea",    detail: "Certificación CE"              },
  { icon: Recycle,     label: "Material Reciclable",    detail: "Composición degradable"        },
  { icon: Cigarette,   label: "Resist. al cigarrillo",  detail: "Superficie ignífuga"           },
  { icon: Leaf,        label: "Saludable y ecológico",  detail: "Sin sustancias nocivas"        },
  { icon: Anchor,      label: "Alta Estabilidad",       detail: "Sin deformaciones"             },
  { icon: Footprints,  label: "Confort al pisar",       detail: "Suave y ergonómico"            },
  { icon: Thermometer, label: "Conductividad térmica",  detail: "Apto para piso radiante"       },
  { icon: Wrench,      label: "Fácil instalación",      detail: "Sistema click sin pegamento"   },
]

export function TechSpecs() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">

        {/* ── Encabezado ── */}
        <div className="mb-10 flex flex-col items-start gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">
              Especificaciones del producto
            </p>
            <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Construido para durar
            </h3>
          </div>
          <p className="text-sm text-muted-foreground md:max-w-xs md:text-right">
            Cada detalle fue diseñado para superar las exigencias
            del uso residencial y comercial intensivo.
          </p>
        </div>

        {/* ── Grid de specs ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {specs.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Ícono con fondo primario sólido */}
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary transition-colors group-hover:bg-primary/90">
                <Icon className="size-5 text-primary-foreground" />
              </div>

              {/* Texto */}
              <div>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {detail}
                </p>
              </div>

              {/* Borde inferior de acento en primario */}
              <div className="mt-auto h-0.5 w-6 rounded-full bg-primary/30 transition-all duration-300 group-hover:w-full group-hover:bg-primary/50" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
