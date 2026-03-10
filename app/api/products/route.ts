import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://imprac.com.ar/api/products.php", {
      next: { revalidate: 60 },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    )
  }
}
