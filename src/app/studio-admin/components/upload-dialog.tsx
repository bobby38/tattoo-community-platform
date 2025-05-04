"use client";

import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (imageData: {
    title: string;
    artist: string;
    style: string;
    tags: string[];
    image: string;
  }) => void;
}

export function UploadDialog({ open, onOpenChange, onUpload }: UploadDialogProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [style, setStyle] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setArtist('');
    setStyle('');
    setTags('');
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, and WEBP files are allowed');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Create preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      
      console.log('File selected:', file.name, file.type, file.size);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Manually set the file to the input
      if (fileInputRef.current) {
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        
        // Set the files property
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger change event manually
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  const handleUpload = async () => {
    if (!title || !artist || !style) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Upload the file to storage via our API
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', 'gallery');
      
      // Add metadata to the upload request
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('style', style);
      formData.append('tags', tags);

      console.log('Uploading file:', selectedFile.name);
      console.log('Form data:', {
        title,
        artist,
        style,
        tags,
        folder: 'gallery'
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      
      // Save the image data to the database
      try {
        // Ensure title is not empty
        const safeTitle = title.trim() || 'Untitled';
        console.log('Sending title to API:', safeTitle);
        
        const galleryResponse = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: data.url,
            title: safeTitle,
            description: `Uploaded by ${artist}`,
            artistId: 'system', // This would ideally be the actual user ID
            styleId: style,
            tags: tags.split(',').map(tag => tag.trim()),
          }),
        });
        
        if (!galleryResponse.ok) {
          const errorText = await galleryResponse.text();
          console.error('Gallery API error response:', errorText);
          throw new Error(errorText || 'Failed to save to database');
        }
        
        const galleryData = await galleryResponse.json();
        console.log('Saved to database:', galleryData);
        
        // Call the onUpload callback with the image data including the URL from storage
        onUpload({
          title: safeTitle,
          artist,
          style,
          tags: tags.split(',').map(tag => tag.trim()),
          image: data.url
        });
        
        // Close the dialog and reset the form
        handleClose();
      } catch (err: any) {
        console.error('Error saving to database:', err);
        setError(err.message || 'Failed to save to database. Please try again.');
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload New Image</DialogTitle>
          <DialogDescription>
            Add a new tattoo image to your studio gallery.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4 mt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative w-full h-48 mx-auto">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl('');
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Drag & drop your image here
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    JPEG, PNG or WebP (max. 5MB)
                  </p>
                  
                  {/* Always show a visible button for file selection */}
                  <Button 
                    type="button"
                    variant="secondary"
                    className="mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    Select File
                  </Button>
                </div>
              )}
              
              {/* File Input - Hidden but accessible */}
              <input
                ref={fileInputRef}
                type="file"
                id="fileInput"
                name="fileInput"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload image"
              />
            </div>

            {error && (
              <div className="text-destructive text-sm mt-2">{error}</div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="artist">Artist</Label>
            <Select value={artist} onValueChange={setArtist}>
              <SelectTrigger id="artist">
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Akira Tanaka">Akira Tanaka</SelectItem>
                <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                <SelectItem value="Miguel Rodriguez">Miguel Rodriguez</SelectItem>
                <SelectItem value="Jade Kim">Jade Kim</SelectItem>
                <SelectItem value="David Wilson">David Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="style">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Traditional">Traditional</SelectItem>
                <SelectItem value="Neo-Traditional">Neo-Traditional</SelectItem>
                <SelectItem value="Blackwork">Blackwork</SelectItem>
                <SelectItem value="Watercolor">Watercolor</SelectItem>
                <SelectItem value="Fine Line">Fine Line</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="e.g. dragon, sleeve, color"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleUpload}
            disabled={uploading || !title || !artist || !style}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
