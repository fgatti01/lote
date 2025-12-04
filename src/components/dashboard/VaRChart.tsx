import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

interface VaRData {
  name: string
  var1d: number
  var5d?: number
  stress?: number
}

interface VaRChartProps {
  title: string
  description?: string
  data: VaRData[]
  loading?: boolean
  limit?: number
}

export function VaRChart({
  title,
  description,
  data,
  loading,
  limit,
}: VaRChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis
                type="number"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(val) => formatCurrency(Math.abs(val))}
              />
              <YAxis
                type="category"
                dataKey="name"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [formatCurrency(Math.abs(value)), ""]}
              />
              <Bar
                dataKey="var1d"
                name="VaR 1D"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="var5d"
                name="VaR 5D"
                fill="#22c55e"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="stress"
                name="Stress"
                fill="#f97316"
                radius={[0, 4, 4, 0]}
              />
              {limit && (
                <ReferenceLine
                  x={limit}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{
                    value: `Limit: ${formatCurrency(limit)}`,
                    position: "top",
                    fill: "#ef4444",
                    fontSize: 12,
                  }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
