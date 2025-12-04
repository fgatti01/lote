import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  KPICard,
  PerformanceChart,
  RiskGauge,
  AllocationChart,
  DataTable,
  VaRChart,
  CorrelationMatrix,
  type Column,
} from "@/components/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Wallet,
  TrendingUp,
  BarChart3,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react"

interface DashboardProps {
  tradingDesk: string
  refDate: Date
  data: {
    nav?: { value: number; previousValue?: number }
    share?: { value: number; previousValue?: number }
    pl?: { value: number; previousValue?: number }
    performance?: { value: number }
    var1d?: number
    var5d?: number
    stress?: number
    varLimit?: number
    positions?: Array<{
      book: string
      product: string
      quantity: number
      value: number
      pl: number
      plPercent: number
    }>
    performanceHistory?: Array<{ date: string; value: number; benchmark?: number }>
    allocation?: Array<{ name: string; value: number }>
    varByBook?: Array<{ name: string; var1d: number; var5d?: number; stress?: number }>
    correlationLabels?: string[]
    correlationMatrix?: number[][]
  }
  loading?: boolean
}

export function Dashboard({ tradingDesk, refDate, data, loading }: DashboardProps) {
  // Position columns
  const positionColumns: Column<NonNullable<DashboardProps["data"]["positions"]>[0]>[] = useMemo(
    () => [
      { key: "book", header: "Book", sortable: true },
      { key: "product", header: "Product", sortable: true },
      { key: "quantity", header: "Quantity", format: "number", align: "right", sortable: true },
      { key: "value", header: "Value", format: "currency", align: "right", sortable: true },
      { key: "pl", header: "P&L", format: "currency", align: "right", sortable: true },
      { key: "plPercent", header: "P&L %", format: "badge", align: "right", sortable: true },
    ],
    []
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="NAV"
          value={data.nav?.value ?? null}
          previousValue={data.nav?.previousValue}
          format="currency"
          icon={Wallet}
          loading={loading}
        />
        <KPICard
          title="Share Value"
          value={data.share?.value ?? null}
          previousValue={data.share?.previousValue}
          format="currency"
          icon={DollarSign}
          loading={loading}
        />
        <KPICard
          title="Daily P&L"
          value={data.pl?.value ?? null}
          previousValue={data.pl?.previousValue}
          format="currency"
          icon={TrendingUp}
          loading={loading}
          trend={data.pl?.value && data.pl.value > 0 ? "up" : data.pl?.value && data.pl.value < 0 ? "down" : "neutral"}
        />
        <KPICard
          title="Performance MTD"
          value={data.performance?.value ?? null}
          format="percent"
          icon={Activity}
          loading={loading}
        />
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskGauge
          title="VaR 1 Day"
          description="95% confidence"
          value={data.var1d ?? null}
          limit={data.varLimit}
          format="currency"
          loading={loading}
        />
        <RiskGauge
          title="VaR 5 Days"
          description="95% confidence"
          value={data.var5d ?? null}
          limit={data.varLimit ? data.varLimit * 2 : undefined}
          format="currency"
          loading={loading}
        />
        <RiskGauge
          title="Stress"
          description="Worst case scenario"
          value={data.stress ?? null}
          limit={data.varLimit ? data.varLimit * 3 : undefined}
          format="currency"
          loading={loading}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <PerformanceChart
                title="Performance History"
                description={`${tradingDesk} performance vs benchmark`}
                data={data.performanceHistory ?? []}
                loading={loading}
                showBenchmark
              />
            </div>
            <AllocationChart
              title="Portfolio Allocation"
              description="By book/strategy"
              data={data.allocation ?? []}
              loading={loading}
            />
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <DataTable
            title="Current Positions"
            description={`Positions as of ${refDate.toLocaleDateString("pt-BR")}`}
            columns={positionColumns}
            data={data.positions ?? []}
            loading={loading}
            maxRows={15}
          />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <VaRChart
              title="VaR by Book"
              description="Value at Risk breakdown"
              data={data.varByBook ?? []}
              loading={loading}
              limit={data.varLimit}
            />
            <CorrelationMatrix
              title="Correlation Matrix"
              description="Inter-book correlations"
              labels={data.correlationLabels ?? []}
              matrix={data.correlationMatrix ?? []}
              loading={loading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
