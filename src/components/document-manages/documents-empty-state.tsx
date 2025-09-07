import { FileText } from "lucide-react"

export const DocumentEmptyState = () => {
  return <div className="text-center py-8 text-muted-foreground">
    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
    <p>No documents uploaded yet</p>
    <p className="text-sm">Upload documents to begin analysis</p>
  </div>
}