"use client";

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  previewUrl?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileDropzone({
  onFileSelect,
  onClear,
  previewUrl,
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 5,
  className = "",
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return false;
    }
    
    // Check file type if accept is specified
    if (accept && !accept.split(',').some(type => file.type === type.trim())) {
      setError(`File type not allowed. Only ${accept.replace(/image\//g, '').toUpperCase()} are supported.`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
        } ${previewUrl ? 'border-primary' : ''} ${className}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
        
        {previewUrl ? (
          <div className="relative w-full h-40">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-md"
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept.replace(/image\//g, '').toUpperCase()} (max. {maxSizeMB}MB)
            </p>
          </>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
