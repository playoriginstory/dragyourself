// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Use Node.js runtime (required for Buffer + heic-convert)
export const runtime = 'nodejs';

// Configure FAL with server-side API key
fal.config({
  credentials: process.env.FAL_KEY, // Server-side only
});

const NEGATIVE_PROMPT =
  "bad quality, worst quality, text, caption, signature, watermark, extra fingers, extra limbs, deformed, distorted, blurry, duplicated face, multiple people";

const DEFAULT_STEPS = 22;
const DEFAULT_GUIDANCE = 4;
const IMAGE_SIZE: "portrait_4_3" = "portrait_4_3";

async function convertHEICIfNeeded(base64Image: string): Promise<string> {
  if (base64Image.startsWith('data:image/heic') || base64Image.startsWith('data:image/heif')) {
    try {
      console.log('HEIC image detected, converting to JPEG...');
      const heicConvert = await import('heic-convert');
      const convert = heicConvert.default;

      const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
      const inputBuffer = Buffer.from(base64Data, 'base64');

      if (inputBuffer.length === 0) {
        throw new Error('Empty HEIC buffer - file may be corrupted');
      }
      if (inputBuffer.length < 100) {
        throw new Error('HEIC buffer too small - file may be corrupted');
      }

      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.85,
      });

      if (!outputBuffer || outputBuffer.length === 0) {
        throw new Error('HEIC conversion produced empty result');
      }

      return `data:image/jpeg;base64,${outputBuffer.toString('base64')}`;
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      if (error instanceof Error) {
        if (error.message.includes('corrupted')) {
          throw new Error('This HEIC file appears to be corrupted. Please try a different photo or convert to JPG first.');
        }
        if (error.message.includes('empty')) {
          throw new Error('HEIC file is empty or invalid. Please try a different photo.');
        }
        if (error.message.includes('format')) {
          throw new Error('This HEIC file format is not supported. Please convert to JPG/PNG first.');
        }
      }
      throw new Error(
        "Failed to convert HEIC image. Please convert to JPG/PNG first using your phone's Photos app."
      );
    }
  }
  return base64Image;
}

/**
 * Upload base64 image to FAL storage and return the URL.
 */
async function uploadReferenceToFal(base64: string): Promise<string> {
  const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  const fileBlob = new Blob([buffer], { type: 'image/jpeg' });
  const uploadFile = new File([fileBlob], 'uploaded-image.jpg', { type: 'image/jpeg' });
  return fal.storage.upload(uploadFile);
}

/**
 * Call the FAL model once and return the first image URL.
 */
async function runFalOnce({
  prompt,
  reference_image_url,
  seed
}: {
  prompt: string;
  reference_image_url: string;
  seed?: number;
}): Promise<string | null> {
  const result = await fal.subscribe("fal-ai/flux-pulid", {
    input: {
      prompt,
      reference_image_url,
      image_size: IMAGE_SIZE,
      num_inference_steps: DEFAULT_STEPS,
      guidance_scale: DEFAULT_GUIDANCE,
      negative_prompt: NEGATIVE_PROMPT,
      enable_safety_checker: true,
      id_weight: 1,
      true_cfg: 1,
      max_sequence_length: "128",
      ...(typeof seed === 'number' ? { seed } : {})
    },
    logs: false,
  });

  return result.data?.images?.[0]?.url ?? null;
}

type CompetitionBody = {
  file: string;
  styles: string[];
  isCompetition: true;
};

type SingleBody = {
  file: string;
  prompt: string; // already built on the client from the 4 quiz answers
  isCompetition: false;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CompetitionBody | SingleBody;

    // Basic checks
    if (!body?.file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!/^data:image\/(png|jpe?g|webp|heic|heif);base64,/.test(body.file)) {
      return NextResponse.json({ error: 'Invalid base64 image' }, { status: 400 });
    }

    // Convert HEIC if necessary
    let processedFile: string;
    try {
      processedFile = await convertHEICIfNeeded(body.file);
    } catch (conversionError) {
      return NextResponse.json({
        error: conversionError instanceof Error ? conversionError.message : 'Image conversion failed'
      }, { status: 400 });
    }

    // Upload reference image once
    const reference_image_url = await uploadReferenceToFal(processedFile);

    // Competition (presets / multiple styles)
    if (body.isCompetition) {
      const { styles } = body;
      if (!Array.isArray(styles) || styles.length === 0) {
        return NextResponse.json({ error: 'No styles selected' }, { status: 400 });
      }

      const results = await Promise.all(
        styles.map(async (style, idx) => {
          // Style is already an iconic 90s preset string
          // Add light server-side framing to keep photoreal/period-correct
          const prompt =
            `${style}, 90s supermodel fashion portrait, photoreal, studio or runway, beauty lighting, film look, subtle halation`;

          try {
            const imageUrl = await runFalOnce({
              prompt,
              reference_image_url,
              seed: 100 + idx
            });
            return { style, imageUrl, success: !!imageUrl };
          } catch (err) {
            console.error(`Error generating style "${style}":`, err);
            return {
              style,
              imageUrl: null,
              success: false,
              error: err instanceof Error ? err.message : 'Unknown error'
            };
          }
        })
      );

      return NextResponse.json({
        success: true,
        isCompetition: true,
        results
      });
    }

    // Single (quiz prompt path)
    if (!('prompt' in body) || !body.prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const singleUrl = await runFalOnce({
      prompt: body.prompt,
      reference_image_url
    });

    if (!singleUrl) {
      return NextResponse.json({ error: 'No image generated' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      isCompetition: false,
      imageUrl: singleUrl
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
