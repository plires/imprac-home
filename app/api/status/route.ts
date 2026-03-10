import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Ajustá la ruta según tu proyecto

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    return NextResponse.json({ status: 'Conectado!', data: rows });
  } catch (error: any) {
    return NextResponse.json({ status: 'Error de conexión', error: error.message }, { status: 500 });
  }
}