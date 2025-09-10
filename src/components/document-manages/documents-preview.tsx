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
        className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 p-3 border border-border rounded-lg bg-card"
      >
        <Checkbox
          checked={activeDocuments.includes(doc.id)}
          onCheckedChange={() =>
            toggleIsActive(doc.id)
          }
        />
        <FileText className="h-5 w-5 text-primary" />
        <div className="min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm font-medium truncate cursor-help">
                {doc.name}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs break-words">{doc.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => removeFile(doc.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TooltipProvider>
  )
}