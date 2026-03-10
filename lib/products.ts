export interface Product {
  id: string
  nombre_comercial: string
  codigo_modelo: string
  url_imagen_principal: string
  url_imagen_installed: string
  tono: "claro" | "medio" | "oscuro"
  ambiente: string[]
  intensidad_veta: "suave" | "moderada" | "pronunciada"
  espesores: string[]
  precio_caja: number
  precio_m2: number
  material_nucleo: string
  capa: string
  sistema_click: string
  garantia_anos: number
  stock_cajas: number
  m2_por_caja: number
}

export const products: Product[] = [
  {
    id: "spc-001",
    nombre_comercial: "Roble Natural Classic",
    codigo_modelo: "SPC-OAK-001",
    url_imagen_principal: "/images/floor-oak-natural.jpg",
    url_imagen_installed: "/images/room-oak-natural.jpg",
    tono: "claro",
    ambiente: ["living", "oficina", "dormitorio"],
    intensidad_veta: "moderada",
    espesores: ["4mm", "5mm", "6mm"],
    precio_m2: 28.50,
    material_nucleo: "SPC Virgin (Stone Polymer Composite)",
    capa: "Capa de desgaste 0.5mm UV Coating",
    sistema_click: "Unilin Click 5G",
    garantia_anos: 25,
    stock_cajas: 340,
    m2_por_caja: 2.22,
  },
  {
    id: "spc-002",
    nombre_comercial: "Nogal Oscuro Premium",
    codigo_modelo: "SPC-WNT-002",
    url_imagen_principal: "/images/floor-walnut-dark.jpg",
    url_imagen_installed: "/images/room-walnut-dark.jpg",
    tono: "oscuro",
    ambiente: ["cocina", "living", "oficina"],
    intensidad_veta: "pronunciada",
    espesores: ["5mm", "6mm"],
    precio_m2: 35.90,
    material_nucleo: "SPC Virgin High Density",
    capa: "Capa de desgaste 0.55mm UV + Ceramic",
    sistema_click: "Valinge 5G-i",
    garantia_anos: 30,
    stock_cajas: 185,
    m2_por_caja: 2.22,
  },
  {
    id: "spc-003",
    nombre_comercial: "Pizarra Gris Urbano",
    codigo_modelo: "SPC-SLT-003",
    url_imagen_principal: "/images/floor-grey-slate.jpg",
    url_imagen_installed: "/images/room-grey-slate.jpg",
    tono: "medio",
    ambiente: ["oficina", "cocina", "living"],
    intensidad_veta: "suave",
    espesores: ["4mm", "5mm"],
    precio_m2: 26.00,
    material_nucleo: "SPC Virgin Limestone Blend",
    capa: "Capa de desgaste 0.3mm UV Coating",
    sistema_click: "Unilin Click 5G",
    garantia_anos: 20,
    stock_cajas: 520,
    m2_por_caja: 2.50,
  },
  {
    id: "spc-004",
    nombre_comercial: "Arce Miel Elegance",
    codigo_modelo: "SPC-MPL-004",
    url_imagen_principal: "/images/floor-maple-honey.jpg",
    url_imagen_installed: "/images/room-maple-honey.jpg",
    tono: "medio",
    ambiente: ["dormitorio", "living", "oficina"],
    intensidad_veta: "moderada",
    espesores: ["4mm", "5mm", "6mm"],
    precio_m2: 31.20,
    material_nucleo: "SPC Virgin (Stone Polymer Composite)",
    capa: "Capa de desgaste 0.5mm UV + Anti-scratch",
    sistema_click: "Valinge 5G-i",
    garantia_anos: 25,
    stock_cajas: 290,
    m2_por_caja: 2.22,
  },
  {
    id: "spc-005",
    nombre_comercial: "Fresno Blanco Nordic",
    codigo_modelo: "SPC-ASH-005",
    url_imagen_principal: "/images/floor-ash-white.jpg",
    url_imagen_installed: "/images/room-ash-white.jpg",
    tono: "claro",
    ambiente: ["dormitorio", "living", "cocina"],
    intensidad_veta: "suave",
    espesores: ["4mm", "5mm"],
    precio_m2: 24.80,
    material_nucleo: "SPC Virgin Lightweight",
    capa: "Capa de desgaste 0.3mm UV Coating",
    sistema_click: "Unilin Click 5G",
    garantia_anos: 20,
    stock_cajas: 410,
    m2_por_caja: 2.50,
  },
  {
    id: "spc-006",
    nombre_comercial: "Hickory Rustico Heritage",
    codigo_modelo: "SPC-HCK-006",
    url_imagen_principal: "/images/floor-hickory-rustic.jpg",
    url_imagen_installed: "/images/room-hickory-rustic.jpg",
    tono: "oscuro",
    ambiente: ["living", "dormitorio"],
    intensidad_veta: "pronunciada",
    espesores: ["5mm", "6mm"],
    precio_m2: 38.50,
    material_nucleo: "SPC Virgin High Density",
    capa: "Capa de desgaste 0.55mm UV + Ceramic + EIR",
    sistema_click: "Valinge 5G-i",
    garantia_anos: 30,
    stock_cajas: 150,
    m2_por_caja: 2.22,
  },
]
