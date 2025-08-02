'use client';

import React, { useState, useRef } from 'react';

interface UploadProps {
  onUpload: (file: string) => void; // base64 string
}

export default function Upload({ onUpload }: UploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHEICFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    return (
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif')
    );
  };

  const convertHEICToJPEG = async (file: File): Promise<File> => {
    try {
      // Dynamic import with better error handling
      const heic2any = await import('heic2any').then(module => module.default);
      
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
      });

      // Handle both single blob and array of blobs
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      
      if (!blob) {
        throw new Error('Conversion resulted in empty blob');
      }

      // Create new file with proper name and type
      const convertedFile = new File(
        [blob],
        file.name.replace(/\.(heic|heif)$/i, '.jpg'),
        { 
          type: 'image/jpeg',
          lastModified: Date.now()
        }
      );

      return convertedFile;
    } catch (error) {
      console.error('HEIC conversion error:', error);
      throw new Error(
        'Failed to convert HEIC/HEIF image. Please try converting to JPG/PNG first or use a different image.'
      );
    }
  };

  const processImageFile = async (file: File): Promise<File> => {
    // If it's a HEIC file, convert it
    if (isHEICFile(file)) {
      setIsConverting(true);
      try {
        const convertedFile = await convertHEICToJPEG(file);
        return convertedFile;
      } finally {
        setIsConverting(false);
      }
    }
    
    // For other image types, return as-is
    return file;
  };

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const isValidImage = file.type.startsWith('image/') || isHEICFile(file);
    
    if (!isValidImage) {
      alert('Please select a valid image file (JPG, PNG, GIF, HEIC, HEIF)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      // Process the file (convert HEIC if needed)
      const processedFile = await processImageFile(file);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPreview(base64);
        onUpload(base64);
      };
      
      reader.onerror = () => {
        console.error('FileReader failed to read the processed image');
        alert('Failed to read the processed image. Please try again.');
      };

      reader.readAsDataURL(processedFile);
      
    } catch (error) {
      console.error('Image processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong while processing your image.';
      alert(errorMessage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isConverting) {
      fileInputRef.current?.click();
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-pink-500 bg-pink-50'
            : isConverting
            ? 'border-yellow-400 bg-yellow-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
          disabled={isConverting}
        />

        {isConverting ? (
          <div className="space-y-4">
            <div className="text-4xl">⏳</div>
            <div>
              <p className="text-lg font-medium text-yellow-700">
                Converting HEIC image...
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Please wait while we process your image
              </p>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
            />
            <div className="flex space-x-2 justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                Change Photo
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📸</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Upload your photo
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports JPG, PNG, GIF, HEIC, HEIF (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}