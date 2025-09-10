import { useClientContext } from '../client-screen';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { DocumentEmptyState } from './documents-empty-state';
import { DocumentPreview } from './documents-preview';
import { UploadFiles } from './upload-files';


export const DocumentManager = () => {
  const { files } = useClientContext();

  return (
    <Card className="p-4 sm:p-6 flex flex-col flex-1">
      <UploadFiles />

      <ScrollArea className="min-h-[300px] sm:min-h-[400px]">
        <div className="space-y-2">
          {files.length === 0 ? (
            <DocumentEmptyState />
          ) : (
            files.map((doc) => (
              <DocumentPreview key={doc.id} doc={doc} />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};