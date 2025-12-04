# Lote45 Dashboard

A modern, high-style dashboard built with React, shadcn/ui, and Tailwind CSS for visualizing financial data from the Lote45 API.

## Features

- **Real-time Data Visualization** - KPI cards, charts, and tables with live API data
- **Risk Analytics** - VaR (Value at Risk), Stress testing, Correlation matrices
- **Performance Tracking** - Historical performance charts with benchmark comparison
- **Portfolio Overview** - Position details, P&L, allocation breakdown
- **Dark Mode** - Full dark mode support
- **Responsive Design** - Works on desktop and tablet devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components (Radix UI based)
- **Recharts** - Charts and data visualization
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd lote
```

2. Install dependencies:
```bash
npm install
```

3. Configure your API key:
```bash
cp .env.example .env
# Edit .env and add your Lote45 API key
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── api/
│   ├── client.ts      # Lote45 API client
│   └── hooks.ts       # React hooks for API calls
├── components/
│   ├── dashboard/     # Dashboard-specific components
│   │   ├── KPICard.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── RiskGauge.tsx
│   │   ├── AllocationChart.tsx
│   │   ├── DataTable.tsx
│   │   ├── VaRChart.tsx
│   │   └── CorrelationMatrix.tsx
│   ├── layout/        # Layout components
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── ui/            # shadcn/ui components
├── lib/
│   └── utils.ts       # Utility functions
├── pages/
│   └── Dashboard.tsx  # Main dashboard page
├── styles/
│   └── globals.css    # Global styles & CSS variables
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## API Integration

The dashboard connects to the Lote45 API. The client supports all major endpoints:

### Book Endpoints
- `getBook()` - Get book data
- `getBookPerformance()` - Get performance metrics
- `getBookFinancialPerformance()` - Get financial performance

### Risk Calculations
- `getVaR()` - Value at Risk (1 Day)
- `get5DayVaR()` - Value at Risk (5 Day)
- `getStress()` - Stress test results
- `getCorrelationTable()` - Correlation matrix
- `getHistVaRTable()` - Historical VaR

### Load Endpoints
- `getOverview()` - Portfolio overview
- `getNAV()` - Net Asset Value
- `getNAVAndShare()` - NAV and share value
- `getTrades()` - Trade history
- `getMovements()` - Fund movements

### Usage Example

```typescript
import { Lote45Client } from '@/api/client'

const client = new Lote45Client({
  baseUrl: 'https://api.lote45.norte.link',
  apiKey: 'your-api-key'
})

// Fetch NAV
const nav = await client.getNAVAndShare(new Date(), 'TradingDesk1')

// Fetch VaR
const var = await client.getVaR('TradingDesk1', new Date(), 1, 'Default')
```

### Using React Hooks

```typescript
import { useNAVAndShare, useVaR } from '@/api/hooks'

function MyComponent() {
  const { data: nav, loading, error } = useNAVAndShare('TradingDesk1', new Date())
  const { data: var } = useVaR('TradingDesk1', new Date(), 1, 'Default')

  if (loading) return <Spinner />
  if (error) return <Error message={error} />

  return <div>NAV: {nav?.value}</div>
}
```

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_LOTE45_API_KEY` | Your Lote45 API authentication key |

### Theme Customization

Edit `src/styles/globals.css` to customize the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

Private - All rights reserved
