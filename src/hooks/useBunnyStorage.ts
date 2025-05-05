import { useState } from 'react';

interface UploadOptions {
  folder?: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
}

interface UseBunnyStorageReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, options?: UploadOptions) => Promise<UploadResult | null>;
  deleteFile: (url: string) => Promise<boolean>;
}

export function useBunnyStorage(): UseBunnyStorageReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file to Bunny.net storage
   */
  const uploadFile = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult | null> => {
    try {
      console.log('Starting file upload:', { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type,
        options
      });
      
      setUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      // For progress tracking with fetch, we'd need to use XMLHttpRequest
      // This is a simplified implementation
      if (options.onProgress) {
        options.onProgress(10); // Started
        setTimeout(() => options.onProgress?.(50), 500); // Halfway
      }

      console.log('Sending upload request to /api/upload');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response received:', { 
        status: response.status, 
        statusText: response.statusText 
      });

      if (options.onProgress) {
        options.onProgress(100); // Completed
      }
      setProgress(100);

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData.error || 'Upload failed';
        console.error('Upload error response:', responseData);
        setError(errorMessage);
        return null;
      }

      console.log('Upload successful:', responseData);
      return responseData as UploadResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload file';
      console.error('Upload error:', err);
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Delete a file from Bunny.net storage
   */
  const deleteFile = async (url: string): Promise<boolean> => {
    try {
      console.log('Starting file deletion:', { url });
      setError(null);
      
      // Extract the path from the URL
      const urlObj = new URL(url);
      const path = urlObj.pathname.startsWith('/') 
        ? urlObj.pathname.substring(1) 
        : urlObj.pathname;

      console.log('Extracted path for deletion:', path);
      
      const response = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });

      console.log('Delete response received:', { 
        status: response.status, 
        statusText: response.statusText 
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData.error || 'Delete failed';
        console.error('Delete error response:', responseData);
        setError(errorMessage);
        return false;
      }

      console.log('Delete successful:', responseData);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete file';
      console.error('Delete error:', err);
      setError(errorMessage);
      return false;
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    deleteFile,
  };
}
