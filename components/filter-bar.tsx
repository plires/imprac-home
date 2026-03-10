"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, RotateCcw } from "lucide-react"

interface FilterBarProps {
  tono: string
  ambiente: string
  veta: string
  onTonoChange: (value: string) => void
  onAmbienteChange: (value: string) => void
  onVetaChange: (value: string) => void
  onReset: () => void
}

export function FilterBar({
  tono,
  ambiente,
  veta,
  onTonoChange,
  onAmbienteChange,
  onVetaChange,
  onReset,
}: FilterBarProps) {
  const hasFilters = tono !== "todos" || ambiente !== "todos" || veta !== "todos"

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="size-4" />
          <span className="text-sm font-medium tracking-wide uppercase">
            Filtros
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <Select value={tono} onValueChange={onTonoChange}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Tono" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tonos</SelectItem>
            <SelectItem value="claro">Claro</SelectItem>
            <SelectItem value="medio">Medio</SelectItem>
            <SelectItem value="oscuro">Oscuro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ambiente} onValueChange={onAmbienteChange}>
          <SelectTrigger className="w-[150px] bg-background">
            <SelectValue placeholder="Ambiente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="cocina">Cocina</SelectItem>
            <SelectItem value="living">Living</SelectItem>
            <SelectItem value="oficina">Oficina</SelectItem>
            <SelectItem value="dormitorio">Dormitorio</SelectItem>
          </SelectContent>
        </Select>

        <Select value={veta} onValueChange={onVetaChange}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Intensidad de veta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las vetas</SelectItem>
            <SelectItem value="suave">Suave</SelectItem>
            <SelectItem value="moderada">Moderada</SelectItem>
            <SelectItem value="pronunciada">Pronunciada</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1 size-3" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
