// app/api/convert-heic/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate it's a HEIC file
    const fileName = file.name.toLowerCase();
    const isHEIC = file.type === 'image/heic' || 
                   file.type === 'image/heif' || 
                   fileName.endsWith('.heic') || 
                   fileName.endsWith('.heif');

    if (!isHEIC) {
      return NextResponse.json({ error: 'Only HEIC/HEIF files are supported' }, { status: 400 });
    }

    // Validate file size (5MB limit for HEIC conversion)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'HEIC file size must be less than 5MB for conversion' }, { status: 400 });
    }

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Try to import heic-convert
      let convert;
      try {
        const heicConvert = await import('heic-convert');
        convert = heicConvert.default;
      } catch (importError) {
        console.error('Failed to import heic-convert:', importError);
        return NextResponse.json({ 
          error: 'HEIC conversion not available. Please install heic-convert package.' 
        }, { status: 500 });
      }

      // Convert HEIC to JPEG
      console.log('Converting HEIC to JPEG...');
      const outputBuffer = await convert({
        buffer: buffer,
        format: 'JPEG',
        quality: 0.9, // High quality
      });

      // Convert to base64
      const base64Image = `data:image/jpeg;base64,${outputBuffer.toString('base64')}`;

      console.log('HEIC conversion successful');
      return NextResponse.json({ 
        success: true, 
        base64Image,
        originalName: file.name,
        convertedSize: outputBuffer.length
      });

    } catch (conversionError) {
      console.error('HEIC conversion failed:', conversionError);
      return NextResponse.json({ 
        error: 'Failed to convert HEIC image. The file may be corrupted or unsupported.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('HEIC conversion API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}