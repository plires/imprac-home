import Image from "next/image"

const catalogLinks = [
  "Todos los productos",
  "Colección Claro",
  "Colección Oscuro",
  "Especificaciones técnicas",
]

const contactInfo = [
  { label: "Email",      value: "ventas@imprac.com" },
  { label: "Teléfono",   value: "+54 11 0000-0000" },
  { label: "Ubicación",  value: "Buenos Aires, Argentina" },
]

export function CatalogFooter() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">

        {/* ── Columnas principales ── */}
        <div className="grid grid-cols-1 gap-10 border-b border-zinc-800/60 pb-10 md:grid-cols-3">

          {/* Marca */}
          <div>
            <Image
              src="/images/logo-footer-imprac-home.webp"
              alt="Imprac Home"
              width={140}
              height={42}
              className="mb-5 h-9 w-auto object-contain brightness-0 invert opacity-70"
            />
            <p className="text-sm leading-relaxed text-zinc-400">
              Catálogo profesional de pisos vinílicos SPC para
              arquitectos, constructores y diseñadores de interiores.
            </p>
          </div>

          {/* Catálogo */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Catálogo
            </h4>
            <ul className="space-y-3">
              {catalogLinks.map((item) => (
                <li key={item}>
                  <span className="cursor-pointer text-sm text-zinc-400 transition-colors hover:text-white">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Contacto
            </h4>
            <ul className="space-y-4">
              {contactInfo.map(({ label, value }) => (
                <li key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    {label}
                  </span>
                  <span className="text-sm text-zinc-400">{value}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Barra inferior ── */}
        <div className="flex flex-col items-center justify-between gap-3 pt-8 md:flex-row">
          <p className="text-xs text-zinc-600">
            © 2026 Imprac Home. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-600">
            Precios de referencia sujetos a cambios sin previo aviso.
          </p>
        </div>

      </div>
    </footer>
  )
}
