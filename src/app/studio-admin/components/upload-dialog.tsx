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
  onUploadComplete?: () => void;
}

export function UploadDialog({ open, onOpenChange, onUpload, onUploadComplete }: UploadDialogProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [style, setStyle] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    console.log('File input change event triggered');
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    const file = files[0];
    console.log('File selected:', file.name, file.type, file.size);
    
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
  };

  const handleSelectFile = () => {
    console.log('Select file button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    console.log('🔍 [Upload] Upload button clicked');
    
    if (!selectedFile) {
      console.error('❌ [Upload] No file selected');
      setError('Please select a file to upload');
      return;
    }

    if (!title) {
      console.error('❌ [Upload] No title provided');
      setError('Please enter a title');
      return;
    }

    console.log('🔍 [Upload] Starting upload process', {
      file: selectedFile.name,
      title,
      artist,
      style,
      tags
    });

    setUploading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('description', '');
      formData.append('folder', 'gallery');
      formData.append('style', style);
      formData.append('artist', artist);
      formData.append('tags', tags);

      console.log('🔍 [Upload] Form data created, sending to API...');
      
      // Upload the file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('🔍 [Upload] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [Upload] API error response:', errorData);
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      console.log('✅ [Upload] Upload successful:', data);

      // Reset form
      setTitle('');
      setArtist('');
      setStyle('');
      setTags('');
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Close the dialog
      handleClose();
      
      // Refresh the gallery
      if (onUploadComplete) {
        console.log('🔍 [Upload] Triggering gallery refresh');
        onUploadComplete();
      }
    } catch (err: any) {
      console.error('❌ [Upload] Error during upload:', err);
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
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
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Image</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center transition-colors hover:border-primary">
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
                      onClick={handleClearFile}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>
                    
                    {/* Always visible button for file selection */}
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm"
                      className="mt-4"
                      onClick={handleSelectFile}
                    >
                      Select File
                    </Button>
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-upload"
                      name="file-upload"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
              
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
