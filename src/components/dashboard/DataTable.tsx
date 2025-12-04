import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency, formatPercent, formatNumber } from "@/lib/utils"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"

export interface Column<T> {
  key: keyof T | string
  header: string
  format?: "currency" | "percent" | "number" | "text" | "badge"
  align?: "left" | "center" | "right"
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  title: string
  description?: string
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  maxRows?: number
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  loading,
  maxRows = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal
    }
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })

  const displayData = sortedData.slice(0, maxRows)

  const formatValue = (value: unknown, format?: string) => {
    if (value === null || value === undefined) return "—"
    switch (format) {
      case "currency":
        return formatCurrency(Number(value))
      case "percent":
        return formatPercent(Number(value))
      case "number":
        return formatNumber(Number(value))
      default:
        return String(value)
    }
  }

  const renderCell = (row: T, column: Column<T>) => {
    const value = row[column.key as keyof T]

    if (column.render) {
      return column.render(value, row)
    }

    if (column.format === "badge") {
      const numValue = Number(value)
      return (
        <Badge
          variant={numValue > 0 ? "success" : numValue < 0 ? "destructive" : "secondary"}
        >
          {formatValue(value, "percent")}
        </Badge>
      )
    }

    return formatValue(value, column.format)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      column.sortable && "cursor-pointer select-none"
                    )}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && (
                        sortKey === column.key ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground py-8"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={cn(
                          column.align === "right" && "text-right",
                          column.align === "center" && "text-center"
                        )}
                      >
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        {data.length > maxRows && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {maxRows} of {data.length} rows
          </div>
        )}
      </CardContent>
    </Card>
  )
}
