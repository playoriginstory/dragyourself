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
    const fileType = file.type.toLowerCase();
    return (
      fileType === 'image/heic' ||
      fileType === 'image/heif' ||
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif')
    );
  };

  const convertHEICToJPEG = async (file: File): Promise<File> => {
    try {
      // Try to load heic2any with better error handling
      let heic2any;
      try {
        const module = await import('heic2any');
        heic2any = module.default;
      } catch (importError) {
        console.error('Failed to load heic2any:', importError);
        throw new Error('HEIC conversion library not available. Please convert your image to JPG/PNG first.');
      }

      if (!heic2any) {
        throw new Error('HEIC conversion library not properly loaded.');
      }

      console.log('Starting HEIC conversion...');
      
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
      });

      console.log('HEIC conversion completed, processing result...');

      // Handle both single blob and array of blobs
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      
      if (!blob || !(blob instanceof Blob)) {
        throw new Error('Conversion failed - invalid result from converter');
      }

      // Verify the converted blob has content
      if (blob.size === 0) {
        throw new Error('Conversion failed - empty result');
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

      console.log('HEIC conversion successful, file size:', convertedFile.size);
      return convertedFile;

    } catch (error) {
      console.error('HEIC conversion error details:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('not available') || error.message.includes('not properly loaded')) {
          throw error; // Re-throw library loading errors as-is
        }
        throw new Error(`HEIC conversion failed: ${error.message}`);
      }
      
      throw new Error('HEIC conversion failed with unknown error. Please try converting to JPG/PNG first.');
    }
  };

  const processImageFile = async (file: File): Promise<File> => {
    // If it's a HEIC file, try to convert it
    if (isHEICFile(file)) {
      console.log('HEIC file detected, attempting conversion...');
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
    console.log('File selected:', file.name, file.type, file.size);

    // For HEIC files, show a more helpful message upfront
    if (isHEICFile(file)) {
      const shouldProceed = window.confirm(
        'This is a HEIC/HEIF image file. We\'ll try to convert it to JPG format. ' +
        'If conversion fails, please manually convert your image to JPG or PNG first. ' +
        'Continue with conversion?'
      );
      
      if (!shouldProceed) {
        return;
      }
    }

    // Validate file type (more permissive check)
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
      
      console.log('Processed file:', processedFile.name, processedFile.type, processedFile.size);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        console.log('Base64 conversion completed, length:', base64.length);
        setPreview(base64);
        onUpload(base64);
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Failed to read the processed image. Please try again.');
      };

      reader.readAsDataURL(processedFile);
      
    } catch (error) {
      console.error('Image processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong while processing your image.';
      
      // Show a more user-friendly message for HEIC conversion failures
      if (isHEICFile(file)) {
        alert(
          'HEIC conversion failed. Please try one of these options:\n\n' +
          '1. Convert your HEIC image to JPG/PNG using your phone\'s photo app\n' +
          '2. Use a different image in JPG/PNG format\n' +
          '3. Try uploading the image again\n\n' +
          `Technical error: ${errorMessage}`
        );
      } else {
        alert(errorMessage);
      }
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
      {/* Add helpful notice for HEIC users */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="text-blue-800">
          📱 <strong>iPhone users:</strong> If you have issues with HEIC images, 
          go to Settings → Camera → Formats and select "Most Compatible" for better compatibility.
        </p>
      </div>

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
            <div className="text-4xl animate-spin">⏳</div>
            <div>
              <p className="text-lg font-medium text-yellow-700">
                Converting HEIC image to JPG...
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                This may take a few seconds, please wait
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
              <p className="text-xs text-gray-500 mt-1">
                For best results, use JPG or PNG format
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}