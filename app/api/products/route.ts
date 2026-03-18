import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY nombre_comercial"
    )

    const products = (rows as any[]).map((row) => {
      const precio_caja = Number(row.precio_caja)
      const m2_por_caja = Number(row.m2_por_caja)
      return {
        ...row,
        precio_caja,
        m2_por_caja,
        precio_m2:     m2_por_caja > 0 ? precio_caja / m2_por_caja : 0,
        garantia_anos: Number(row.garantia_anos),
        stock_cajas:   Number(row.stock_cajas),
        espesores: typeof row.espesores === "string" ? JSON.parse(row.espesores) : row.espesores ?? [],
        ambiente:  typeof row.ambiente  === "string" ? JSON.parse(row.ambiente)  : row.ambiente  ?? [],
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}
