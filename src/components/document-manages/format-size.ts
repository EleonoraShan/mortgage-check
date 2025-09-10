export const formatFileSize = (bytes: number) => {
  // Handle invalid input
  if (!bytes || isNaN(bytes) || bytes < 0) return 'Unknown size';
  
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Ensure we don't go out of bounds
  const sizeIndex = Math.min(i, sizes.length - 1);
  const size = parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(2));
  
  return `${size} ${sizes[sizeIndex]}`;
};