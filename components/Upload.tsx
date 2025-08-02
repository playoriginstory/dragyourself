'use client';

import React, { useState, useRef } from 'react';

interface UploadProps {
  onUpload: (file: string) => void; // base64 string
}

export default function Upload({ onUpload }: UploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHEICFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return (
      fileType === 'image/heic' ||
      fileType === 'image/heif' ||
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif')
    );
  };

  const convertHEICOnServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/convert-heic', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'HEIC conversion failed');
      }

      const result = await response.json();
      return result.base64Image; // Server returns converted base64 image
    } catch (error) {
      console.error('Server HEIC conversion error:', error);
      throw new Error('Failed to convert HEIC image. Please try converting to JPG/PNG first.');
    }
  };

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type - allow HEIC since we'll convert server-side
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
      setIsProcessing(true);

      let base64Image: string;

      if (isHEICFile(file)) {
        // Send HEIC to server for conversion
        console.log('HEIC file detected, sending to server for conversion...');
        base64Image = await convertHEICOnServer(file);
      } else {
        // Handle standard formats locally
        const reader = new FileReader();
        base64Image = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });
      }

      console.log('Image processing completed');
      setPreview(base64Image);
      onUpload(base64Image);
      
    } catch (error) {
      console.error('Image processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong while processing your image.';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
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
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Success message for HEIC support */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
        <p className="text-green-800">
          ✅ <strong>iPhone HEIC support enabled!</strong> We'll automatically convert HEIC images to JPG for you.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-pink-500 bg-pink-50'
            : isProcessing
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
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="space-y-4">
            <div className="text-4xl animate-pulse">🔄</div>
            <div>
              <p className="text-lg font-medium text-yellow-700">
                Processing image...
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Converting HEIC to JPG format
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
              <p className="text-xs text-gray-600 mt-2 font-medium">
                Supports: JPG, PNG, GIF, HEIC, HEIF (max 10MB)
              </p>
              <p className="text-xs text-green-600 mt-1">
                ✨ HEIC files automatically converted!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}