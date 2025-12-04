import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPercent, formatCurrency } from "@/lib/utils"

interface PerformanceData {
  date: string
  value: number
  benchmark?: number
}

interface PerformanceChartProps {
  title: string
  description?: string
  data: PerformanceData[]
  loading?: boolean
  type?: "line" | "area"
  valueFormat?: "percent" | "currency"
  showBenchmark?: boolean
}

export function PerformanceChart({
  title,
  description,
  data,
  loading,
  type = "area",
  valueFormat = "percent",
  showBenchmark = false,
}: PerformanceChartProps) {
  const formatValue = (val: number) =>
    valueFormat === "percent" ? formatPercent(val) : formatCurrency(val)

  const Chart = type === "area" ? AreaChart : LineChart

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
            <Chart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#888888" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#888888" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={formatValue}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [formatValue(value), ""]}
              />
              <Legend />
              {type === "area" ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Performance"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                  {showBenchmark && (
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      name="Benchmark"
                      stroke="#888888"
                      fillOpacity={1}
                      fill="url(#colorBenchmark)"
                      strokeWidth={2}
                    />
                  )}
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Performance"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  {showBenchmark && (
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="Benchmark"
                      stroke="#888888"
                      strokeWidth={2}
                      dot={false}
                    />
                  )}
                </>
              )}
            </Chart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
