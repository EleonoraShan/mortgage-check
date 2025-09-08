import { Upload } from 'lucide-react';
import { useRef } from 'react';
import { useToast } from '../../hooks/use-toast';
import { processDocument } from '../../lib/process-pdf';
import { useClientContext } from '../client-screen';
import { Message } from '../client-screen/client-provider';
import { Button } from '../ui/button';


export const UploadFiles = () => {
  const { addFiles, addChatMessages, toggleIsActive } = useClientContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) { return; }

    const newFilePromises = Array.from(files).map(async file => ({
      id: Date.now().toString() + Math.random(),
      file,
      selected: true, // Default to selected
      fileText: await processDocument(file),
      name: file.name,
    }));
    const processedFiles = await Promise.all(newFilePromises)
    addFiles(processedFiles);

    // Add new file to ollama context
    processedFiles.forEach((file) => {
      const systemFileContextMessage: Message = {
        id: file.id,
        content: `The following is the text of the file ${file.file.name} which should be used as context for answering questions about the mortgage application: ${file.fileText}`,
        role: "system",
        timestamp: new Date(),
      };
      addChatMessages(systemFileContextMessage);
      toggleIsActive(file.id)
    })

    toast({
      title: "Documents added",
      description: `${files.length} document(s) added successfully`,
    });

  };


  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary hover:bg-primary-hover"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

    </>
  );
};