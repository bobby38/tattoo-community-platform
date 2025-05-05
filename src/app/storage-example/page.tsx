"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StorageExamplePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'examples/');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedUrl(data.url);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bunny.net Storage Example</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Files to Bunny.net</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={uploading || !file}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload to Bunny.net'}
            </Button>
            
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-md">
                {error}
              </div>
            )}
            
            {uploadedUrl && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Uploaded Successfully:</h3>
                <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={uploadedUrl} 
                    alt="Uploaded file" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-2 text-sm break-all">
                  <a 
                    href={uploadedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {uploadedUrl}
                  </a>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
