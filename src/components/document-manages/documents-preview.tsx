import { FileText, Trash2 } from 'lucide-react';
import { useClientContext } from '../client-screen';
import { AttachedFile } from '../client-screen/client-provider';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const DocumentPreview = ({
  doc
}: {
  doc: AttachedFile
}) => {
  const { activeDocuments, toggleIsActive, removeFile } = useClientContext()
  console.log({ activeDocuments })
  console.log({ doc })
  return (
    <TooltipProvider>
      <div
        key={doc.id}
        className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card"
      >
        <Checkbox
          checked={activeDocuments.includes(doc.id)}
          onCheckedChange={() =>
            toggleIsActive(doc.id)
          }
        />
        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm font-medium truncate cursor-help">{doc.name}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs break-words">{doc.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => removeFile(doc.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}