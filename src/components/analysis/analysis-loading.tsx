import { Progress } from "@radix-ui/react-progress"
import { RefreshCw } from "lucide-react"

export const AnalysisLoading = () => {
  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Analyzing documents...</p>
      </div>
      <Progress value={45} className="w-full" />
    </div>
  )
}