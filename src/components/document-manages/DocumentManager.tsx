import { useClientContext } from '../client-screen';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { DocumentEmptyState } from './documents-empty-state';
import { DocumentPreview } from './documents-preview';
import { UploadFiles } from './upload-files';


export const DocumentManager = () => {
  const { files } = useClientContext();

  return (
    <Card className="p-6">
      <UploadFiles />

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {files.length === 0 ? (
            <DocumentEmptyState />
          ) : (
            files.map((doc) => (
              <DocumentPreview doc={doc} />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};