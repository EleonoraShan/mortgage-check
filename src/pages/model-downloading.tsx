import { RefreshCw } from "lucide-react"

export const ModelDownloading = () => {
  return (
    <div className="flex h-screen justify-center items-center pb-20 px-20 gap">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">The AI model is being downloaded. This can take some time but once completed all future interactions will be completely offline.</p>
      </div>
    </div>
  )
}