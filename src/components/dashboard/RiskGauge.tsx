import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatCurrency, formatPercent } from "@/lib/utils"

interface RiskGaugeProps {
  title: string
  description?: string
  value: number | null
  limit?: number
  format?: "currency" | "percent"
  loading?: boolean
}

export function RiskGauge({
  title,
  description,
  value,
  limit,
  format = "currency",
  loading,
}: RiskGaugeProps) {
  const formatValue = (val: number) =>
    format === "currency" ? formatCurrency(val) : formatPercent(val)

  const percentage = value && limit ? Math.min((Math.abs(value) / limit) * 100, 100) : 0

  const getColor = (pct: number) => {
    if (pct < 50) return "bg-green-500"
    if (pct < 75) return "bg-yellow-500"
    if (pct < 90) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold mb-3">
              {value !== null ? formatValue(value) : "—"}
            </div>
            {limit && (
              <>
                <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "absolute h-full rounded-full transition-all duration-500",
                      getColor(percentage)
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{percentage.toFixed(1)}% of limit</span>
                  <span>Limit: {formatValue(limit)}</span>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
