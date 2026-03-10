"use client"

import { useState, useMemo, useEffect } from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { HeroBanner } from "@/components/hero-banner"
import { FilterBar } from "@/components/filter-bar"
import { ProductGrid } from "@/components/product-grid"
import { ProductDetail } from "@/components/product-detail"
import { ProductFeatures } from "@/components/product-features"
import { TechSpecs } from "@/components/tech-specs"
import { ImageCarousel } from "@/components/image-carousel"
import { CatalogFooter } from "@/components/catalog-footer"
import { type Product } from "@/lib/products"

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [tono, setTono] = useState("todos")
  const [ambiente, setAmbiente] = useState("todos")
  const [veta, setVeta] = useState("todos")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (tono !== "todos" && product.tono !== tono) return false
      if (ambiente !== "todos" && !product.ambiente.includes(ambiente))
        return false
      if (veta !== "todos" && product.intensidad_veta !== veta) return false
      return true
    })
  }, [products, tono, ambiente, veta])

  function handleProductSelect(product: Product) {
    setSelectedProduct(product)
    setSheetOpen(true)
  }

  function handleReset() {
    setTono("todos")
    setAmbiente("todos")
    setVeta("todos")
  }

  return (
    <main className="min-h-screen bg-background">
      <CatalogHeader />
      <HeroBanner />
      <FilterBar
        tono={tono}
        ambiente={ambiente}
        veta={veta}
        onTonoChange={setTono}
        onAmbienteChange={setAmbiente}
        onVetaChange={setVeta}
        onReset={handleReset}
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-baseline justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "producto" : "productos"}{" "}
            encontrados
          </p>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando productos...</p>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onProductSelect={handleProductSelect}
          />
        )}
      </section>

      <ProductDetail
        product={selectedProduct}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      <ProductFeatures />
      <TechSpecs />
      <ImageCarousel />
      <CatalogFooter />
    </main>
  )
}
