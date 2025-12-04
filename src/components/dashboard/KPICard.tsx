import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: number | string | null
  previousValue?: number
  format?: "currency" | "percent" | "number" | "text"
  icon?: LucideIcon
  loading?: boolean
  className?: string
  trend?: "up" | "down" | "neutral"
}

export function KPICard({
  title,
  value,
  previousValue,
  format = "text",
  icon: Icon,
  loading,
  className,
  trend,
}: KPICardProps) {
  const formatValue = (val: number | string | null) => {
    if (val === null || val === undefined) return "—"
    if (typeof val === "string") return val

    switch (format) {
      case "currency":
        return formatCurrency(val)
      case "percent":
        return formatPercent(val)
      case "number":
        return val.toLocaleString("pt-BR")
      default:
        return String(val)
    }
  }

  const calculateChange = () => {
    if (typeof value !== "number" || !previousValue) return null
    return ((value - previousValue) / previousValue) * 100
  }

  const change = calculateChange()
  const actualTrend = trend || (change !== null ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : undefined)

  const TrendIcon = actualTrend === "up" ? TrendingUp : actualTrend === "down" ? TrendingDown : Minus

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formatValue(value)}</div>
            {actualTrend && change !== null && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs mt-1",
                  actualTrend === "up" && "text-green-500",
                  actualTrend === "down" && "text-red-500",
                  actualTrend === "neutral" && "text-muted-foreground"
                )}
              >
                <TrendIcon className="h-3 w-3" />
                <span>{Math.abs(change).toFixed(2)}%</span>
                <span className="text-muted-foreground">vs previous</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
