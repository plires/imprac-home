"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Catálogo",        href: "#catalogo"         },
  { label: "Especificaciones", href: "#especificaciones" },
  { label: "Contacto",        href: "#contacto"          },
]

function scrollTo(href: string) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function CatalogHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [active,     setActive]     = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 6)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Highlight the nav item whose section is currently in view
  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.href.slice(1))
    const observers: IntersectionObserver[] = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: "-40% 0px -55% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  function handleNav(href: string) {
    scrollTo(href)
    setMobileOpen(false)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-card/85",
        scrolled && "shadow-md shadow-foreground/5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* ── Logo ── */}
        <a href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo-imprac-home.webp"
            alt="Imprac Home"
            width={152}
            height={46}
            className="h-10 w-auto object-contain"
            priority
          />
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = active === href.slice(1)
            return (
              <button
                key={label}
                onClick={() => handleNav(href)}
                className={cn(
                  "relative cursor-pointer select-none rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── Hamburger ── */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          className="flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent md:hidden"
        >
          <span
            className={cn(
              "absolute transition-all duration-200",
              mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
            )}
          >
            <X className="size-5" />
          </span>
          <span
            className={cn(
              "absolute transition-all duration-200",
              mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
            )}
          >
            <Menu className="size-5" />
          </span>
        </button>

      </div>

      {/* ── Mobile dropdown ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          mobileOpen ? "max-h-56 border-t border-border" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-0.5 bg-card px-4 py-3">
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = active === href.slice(1)
            return (
              <button
                key={label}
                onClick={() => handleNav(href)}
                className={cn(
                  "cursor-pointer select-none rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
