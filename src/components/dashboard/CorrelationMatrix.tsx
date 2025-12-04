import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CorrelationMatrixProps {
  title: string
  description?: string
  labels: string[]
  matrix: number[][]
  loading?: boolean
}

export function CorrelationMatrix({
  title,
  description,
  labels,
  matrix,
  loading,
}: CorrelationMatrixProps) {
  const getColor = (value: number) => {
    // Value ranges from -1 to 1
    if (value >= 0.7) return "bg-green-500"
    if (value >= 0.3) return "bg-green-300"
    if (value >= -0.3) return "bg-gray-200 dark:bg-gray-700"
    if (value >= -0.7) return "bg-red-300"
    return "bg-red-500"
  }

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
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {labels.map((label) => (
                    <th
                      key={label}
                      className="p-2 text-center font-medium text-muted-foreground truncate max-w-[80px]"
                      title={label}
                    >
                      {label.slice(0, 8)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    <td
                      className="p-2 font-medium text-muted-foreground truncate max-w-[80px]"
                      title={labels[i]}
                    >
                      {labels[i]?.slice(0, 8)}
                    </td>
                    {row.map((value, j) => (
                      <td key={j} className="p-1">
                        <div
                          className={cn(
                            "w-full h-8 rounded flex items-center justify-center text-xs font-medium",
                            getColor(value),
                            value >= 0.3 || value <= -0.7 ? "text-white" : "text-foreground"
                          )}
                          title={`${labels[i]} / ${labels[j]}: ${value.toFixed(2)}`}
                        >
                          {value.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Strong Negative</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <span>Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Strong Positive</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
