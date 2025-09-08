
import ollama from 'ollama/browser'
import { useEffect, useRef, useState } from "react";
import { processDocument } from '../lib/process-pdf';
import "./Chatbot.css";

interface Message {
  id: string;
  content: string;
  role: "user" | "bot" | "system";
  timestamp: Date;
}

interface AttachedFile {
  id: string;
  file: File;
  fileText: string;
  preview?: string;
  selected: boolean;
}


export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "You are a helpful assigtant for a UK based mortgage broker. Your role is to analyse the documents and information submitted by the broker and determine if the client can be safely lended to. You should amongs other things verify consistency of provided information, their expenditure and any concerning spending and whether they can afford the morgage",
      role: "system",
      timestamp: new Date(),
    },
    {
      id: "2",
      content: "Hello! I'm your AI Mortgage Broker assistant. You can attach the document you want to analyse for you clients on the left. Please include any other information like the clients name, how much they are looking to borrow and the value of the property they are looking to buy in the chat ",
      role: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const response = await ollama.chat({
      model: 'gpt-oss:20b',
      messages: [...messages, { role: 'user', content: userMessage }],
    })
    return response.message.content;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFilePromises = Array.from(files).map(async file => ({
        id: Date.now().toString() + Math.random(),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        selected: true, // Default to selected
        fileText: await processDocument(file)
      }));
      const processedFiles = await Promise.all(newFilePromises)

      setAttachedFiles(prev => [...prev, ...processedFiles]);

      // Add new file to ollama context
      processedFiles.forEach((file) => {
        const systemFileContextMessage: Message = {
          id: Date.now().toString(),
          content: `The following is the text of the file ${file.file.name} which should be used as context for answering questions about the mortgage application: ${file.fileText}. This message does not need a response.`,
          role: "system",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, systemFileContextMessage]);
      })


    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const toggleFileSelection = (fileId: string) => {
    setAttachedFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, selected: !file.selected } : file
      )
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string): string => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('text')) return '📄';
    return '📎';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.filter(f => f.selected).length === 0) return;

    const selectedFiles = attachedFiles.filter(f => f.selected);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Create a message that includes file information
      let messageContent = inputValue;
      if (selectedFiles.length > 0) {
        const fileInfo = selectedFiles.map(f =>
          `[Attached: ${f.file.name} (${formatFileSize(f.file.size)})]`
        ).join('\n');
        messageContent = `${inputValue}\n\nAttached files:\n${fileInfo}`;
      }

      const botResponse = await generateBotResponse(messageContent);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        role: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedFilesCount = attachedFiles.filter(f => f.selected).length;

  return (
    <div className="chatbot-fullscreen">
      {/* Left Panel - File Management */}
      <div className="file-panel">
        <div className="file-panel-header">
          <h3>📁 Document Library</h3>
          <button
            className="add-files-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Add files"
          >
            ➕
          </button>
        </div>

        <div className="file-panel-content">
          {attachedFiles.length === 0 ? (
            <div className="no-files">
              <p>No files attached</p>
              <p>Click ➕ to add documents</p>
            </div>
          ) : (
            <div className="files-list">
              {attachedFiles.map((file) => (
                <div key={file.id} className={`file-item ${file.selected ? 'selected' : ''}`}>
                  <div className="file-item-content">
                    <label className="file-checkbox">
                      <input
                        type="checkbox"
                        checked={file.selected}
                        onChange={() => toggleFileSelection(file.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <div className="file-icon">{getFileIcon(file.file.type)}</div>
                    <div className="file-info">
                      <div className="file-name">{file.file.name}</div>
                      <div className="file-size">{formatFileSize(file.file.size)}</div>
                    </div>
                    <button
                      className="file-remove-btn"
                      onClick={() => removeFile(file.id)}
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {attachedFiles.length > 0 && (
          <div className="file-panel-footer">
            <div className="selection-info">
              {selectedFilesCount} of {attachedFiles.length} files selected
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="chat-area">
        <div className="chatbot-header">
          <h3>AI Assistant</h3>
          <div className="status-indicator">
            <span className={`status-dot ${isLoading ? "loading" : "online"}`}></span>
            {isLoading ? "Typing..." : "Online"}
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => {
            if (message.role === "system") { return null }
            return <div
              key={message.id}
              className={`message ${message.role === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-content">
                {message.content}
                {/* {message.attachments && message.attachments.length > 0 && (
                  <div className="message-attachments">
                    {message.attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <span className="attachment-icon">{getFileIcon(file.type)}</span>
                        <span className="attachment-name">{file.name}</span>
                        <span className="attachment-size">({formatFileSize(file.size)})</span>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          })}
          {isLoading && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-row">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={1}
            />
            <div className="input-actions">
              <button
                onClick={handleSendMessage}
                disabled={(!inputValue.trim() && selectedFilesCount === 0) || isLoading}
                className="send-button"
              >
                ➤
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
