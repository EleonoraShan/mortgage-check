import { AlertTriangle } from "lucide-react"

export const NoFilesOrAnalysis = ({ noFiles }: { noFiles: boolean }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p>{noFiles ? "No documents selected for analysis" : "No analysis yet"}</p>
      <p className="text-sm">{noFiles ? "Select documents to begin analysis" : "Click analyze to get insights on your clients documents"}</p>
    </div>
  )
}