import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Moon, Sun, Bell } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface HeaderProps {
  title: string
  tradingDesks: string[]
  selectedDesk: string
  onDeskChange: (desk: string) => void
  refDate: Date
  onRefDateChange: (date: Date) => void
  onRefresh: () => void
  loading?: boolean
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function Header({
  title,
  tradingDesks,
  selectedDesk,
  onDeskChange,
  refDate,
  onRefresh,
  loading,
  darkMode,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-background border-b">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Badge variant="outline">{formatDate(refDate)}</Badge>
      </div>

      <div className="flex items-center gap-4">
        {/* Trading Desk Selector */}
        <Select value={selectedDesk} onValueChange={onDeskChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Trading Desk" />
          </SelectTrigger>
          <SelectContent>
            {tradingDesks.map((desk) => (
              <SelectItem key={desk} value={desk}>
                {desk}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Picker */}
        <input
          type="date"
          value={refDate.toISOString().split('T')[0]}
          onChange={(e) => {
            const date = new Date(e.target.value)
            if (!isNaN(date.getTime())) {
              // Trigger date change in parent
            }
          }}
          className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
        />

        {/* Refresh Button */}
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        {/* Notifications */}
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        {/* Dark Mode Toggle */}
        <Button variant="outline" size="icon" onClick={onToggleDarkMode}>
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
