import { Eye, FileText, Trash2 } from 'lucide-react';
import { useClientContext } from '../client-screen';
import { AttachedFile } from '../client-screen/client-provider';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../ui/use-toast';
import { formatFileSize } from './format-size';

export const DocumentPreview = ({
  doc
}: {
  doc: AttachedFile
}) => {
  const { toast } = useToast();
  const { activeDocuments, toggleIsActive, removeFile } = useClientContext()
  console.log({ activeDocuments })
  console.log({ doc })
  return (
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
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{doc.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(doc.file.size)}
        </p>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            toast({
              title: "Preview",
              description: "Document preview functionality will be available soon",
            });
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
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
  )
}