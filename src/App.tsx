import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Dashboard } from "@/pages/Dashboard"
import { initializeLote45Client, getLote45Client } from "@/api/hooks"
import { TooltipProvider } from "@/components/ui/tooltip"

// Initialize the API client - Replace with your actual API key
const API_CONFIG = {
  baseUrl: "https://api.lote45.norte.link",
  apiKey: import.meta.env.VITE_LOTE45_API_KEY || "YOUR_API_KEY_HERE",
}

// Mock data for demo purposes
const MOCK_DATA = {
  nav: { value: 125847632.50, previousValue: 124950000 },
  share: { value: 1.0547, previousValue: 1.0501 },
  pl: { value: 897632.50, previousValue: 450000 },
  performance: { value: 0.0254 },
  var1d: 1250000,
  var5d: 2800000,
  stress: 4500000,
  varLimit: 5000000,
  positions: [
    { book: "Macro", product: "DI1F25", quantity: 1500, value: 15000000, pl: 250000, plPercent: 0.0168 },
    { book: "Macro", product: "DOL", quantity: -200, value: -10000000, pl: -75000, plPercent: -0.0075 },
    { book: "Equities", product: "PETR4", quantity: 50000, value: 1750000, pl: 35000, plPercent: 0.0204 },
    { book: "Equities", product: "VALE3", quantity: 30000, value: 2100000, pl: -42000, plPercent: -0.0196 },
    { book: "FX", product: "USD/BRL", quantity: 5000000, value: 25000000, pl: 450000, plPercent: 0.0183 },
    { book: "Fixed Income", product: "LFT", quantity: 10000, value: 12500000, pl: 125000, plPercent: 0.0101 },
    { book: "Fixed Income", product: "NTN-B", quantity: 5000, value: 5750000, pl: 87500, plPercent: 0.0154 },
    { book: "Options", product: "PETR4 Call", quantity: 100000, value: 350000, pl: 67132.50, plPercent: 0.2372 },
  ],
  performanceHistory: [
    { date: "Jan", value: 0.0125, benchmark: 0.0098 },
    { date: "Feb", value: 0.0087, benchmark: 0.0112 },
    { date: "Mar", value: 0.0234, benchmark: 0.0156 },
    { date: "Apr", value: -0.0045, benchmark: 0.0023 },
    { date: "May", value: 0.0312, benchmark: 0.0245 },
    { date: "Jun", value: 0.0178, benchmark: 0.0134 },
    { date: "Jul", value: 0.0256, benchmark: 0.0189 },
    { date: "Aug", value: 0.0145, benchmark: 0.0167 },
    { date: "Sep", value: -0.0089, benchmark: -0.0056 },
    { date: "Oct", value: 0.0298, benchmark: 0.0212 },
    { date: "Nov", value: 0.0187, benchmark: 0.0145 },
    { date: "Dec", value: 0.0254, benchmark: 0.0178 },
  ],
  allocation: [
    { name: "Macro", value: 35000000 },
    { name: "Equities", value: 25000000 },
    { name: "Fixed Income", value: 28000000 },
    { name: "FX", value: 22000000 },
    { name: "Options", value: 8000000 },
    { name: "Cash", value: 7847632.50 },
  ],
  varByBook: [
    { name: "Macro", var1d: 450000, var5d: 1000000, stress: 1500000 },
    { name: "Equities", var1d: 350000, var5d: 780000, stress: 1200000 },
    { name: "Fixed Income", var1d: 200000, var5d: 450000, stress: 700000 },
    { name: "FX", var1d: 180000, var5d: 400000, stress: 800000 },
    { name: "Options", var1d: 70000, var5d: 170000, stress: 300000 },
  ],
  correlationLabels: ["Macro", "Equities", "FI", "FX", "Options"],
  correlationMatrix: [
    [1.0, 0.35, -0.12, 0.45, 0.28],
    [0.35, 1.0, 0.08, 0.22, 0.65],
    [-0.12, 0.08, 1.0, -0.35, -0.15],
    [0.45, 0.22, -0.35, 1.0, 0.18],
    [0.28, 0.65, -0.15, 0.18, 1.0],
  ],
}

const TRADING_DESKS = [
  "Lote45 Main",
  "Lote45 Macro",
  "Lote45 Equities",
  "Compass Fund",
]

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDesk, setSelectedDesk] = useState(TRADING_DESKS[0])
  const [refDate, setRefDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState(MOCK_DATA)

  // Initialize API client
  useEffect(() => {
    initializeLote45Client(API_CONFIG)
  }, [])

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  // Fetch data from API
  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const client = getLote45Client()

      // Fetch data in parallel
      const [navResponse, overviewResponse, varResponse] = await Promise.all([
        client.getNAVAndShare(refDate, selectedDesk),
        client.getOverview(refDate, selectedDesk),
        client.getVaR(selectedDesk, refDate, 1, "Default"),
      ])

      // If we got real data, use it; otherwise keep mock data
      if (navResponse.data || overviewResponse.data || varResponse.data) {
        // Transform API responses to dashboard format
        // This is where you'd map the actual API response to your data structure
        console.log("API Data:", { navResponse, overviewResponse, varResponse })
      }

      // For now, keep using mock data
      // In production, you'd transform the API responses here
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedDesk, refDate])

  // Fetch on mount and when parameters change
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = () => {
    fetchDashboardData()
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard"
      case "performance":
        return "Performance Analysis"
      case "risk":
        return "Risk & VaR"
      case "positions":
        return "Positions"
      case "trades":
        return "Trades"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={getPageTitle()}
            tradingDesks={TRADING_DESKS}
            selectedDesk={selectedDesk}
            onDeskChange={setSelectedDesk}
            refDate={refDate}
            onRefDateChange={setRefDate}
            onRefresh={handleRefresh}
            loading={loading}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />

          <main className="flex-1 overflow-auto">
            {currentPage === "dashboard" && (
              <Dashboard
                tradingDesk={selectedDesk}
                refDate={refDate}
                data={dashboardData}
                loading={loading}
              />
            )}
            {currentPage !== "dashboard" && (
              <div className="p-6">
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  {getPageTitle()} page - Coming soon
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default App
