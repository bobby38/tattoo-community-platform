"use client";

import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBunnyStorage } from '@/hooks/useBunnyStorage';
import { Trash2 } from 'lucide-react';

export default function BunnyStorageExample() {
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const { deleteFile } = useBunnyStorage();

  const handleUploadComplete = (fileUrl: string) => {
    // Extract a name from the URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    
    setUploadedFiles([...uploadedFiles, { url: fileUrl, name: fileName }]);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    alert(`Upload failed: ${error}`);
  };

  const handleDeleteFile = async (fileUrl: string) => {
    const success = await deleteFile(fileUrl);
    if (success) {
      setUploadedFiles(uploadedFiles.filter(file => file.url !== fileUrl));
    } else {
      alert("Failed to delete file. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bunny.net Storage Example</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Files to Bunny.net</CardTitle>
          <CardDescription>
            Upload images to your Bunny.net storage. Files will be stored in the 'examples/' folder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            folder="examples/"
            buttonText="Upload Image"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={5}
          />
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Files you've uploaded to Bunny.net storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div className="truncate text-sm">{file.name}</div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteFile(file.url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
