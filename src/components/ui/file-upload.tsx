import React, { useState, useRef, ChangeEvent } from 'react';
import { useBunnyStorage } from '@/hooks/useBunnyStorage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete?: (fileUrl: string) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  folder = 'uploads/',
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  buttonText = 'Upload File',
  className = '',
  variant = 'default',
}: FileUploadProps) {
  const { uploadFile, uploading, progress, error } = useBunnyStorage();
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeBytes) {
      const errorMsg = `File size exceeds the ${maxSizeMB}MB limit`;
      onUploadError?.(errorMsg);
      return;
    }

    setShowProgress(true);
    
    const result = await uploadFile(file, {
      folder,
      onProgress: (p) => {
        // Progress is handled by the hook
      }
    });

    if (result) {
      setUploadedUrl(result.url);
      onUploadComplete?.(result.url);
    } else if (error) {
      onUploadError?.(error);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Hide progress after a delay
    setTimeout(() => {
      setShowProgress(false);
    }, 2000);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={uploading}
      />
      
      <Button 
        type="button" 
        onClick={handleButtonClick} 
        disabled={uploading}
        variant={variant}
        className="w-full"
      >
        {uploading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        ) : uploadedUrl ? (
          <span className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Upload Complete
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            {buttonText}
          </span>
        )}
      </Button>
      
      {showProgress && (
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-destructive flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {uploadedUrl && (
        <div className="mt-2 text-sm text-muted-foreground truncate">
          File uploaded successfully
        </div>
      )}
    </div>
  );
}
