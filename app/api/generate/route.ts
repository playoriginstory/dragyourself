// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure FAL with server-side API key
fal.config({
  credentials: process.env.FAL_KEY, // Server-side only
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file, styles, isCompetition } = body;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!styles || styles.length === 0) {
      return NextResponse.json({ error: 'No styles selected' }, { status: 400 });
    }

    // Convert base64 to File object for upload
    const base64Data = file.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileBlob = new Blob([buffer], { type: 'image/jpeg' });
    const uploadFile = new File([fileBlob], 'uploaded-image.jpg', { type: 'image/jpeg' });

    // Upload file to FAL storage
    const reference_image_url = await fal.storage.upload(uploadFile);

    if (isCompetition) {
      // Generate all 8 variations for competition
      const results = await Promise.all(
        styles.map(async (style: string, index: number) => {
          const prompt = `A drag queen with ${style} style, professional makeup, dramatic lighting, high fashion photography`;
          
          try {
            const result = await fal.subscribe("fal-ai/flux-pulid", {
              input: {
                prompt,
                reference_image_url,
                image_size: "portrait_4_3",
                num_inference_steps: 20,
                guidance_scale: 4,
                negative_prompt: "bad quality, worst quality, text, signature, watermark, extra limbs, deformed, blurry",
                enable_safety_checker: true,
                id_weight: 1,
                true_cfg: 1,
                max_sequence_length: "128",
                seed: 42 + index, // Different seed for each style
              },
              logs: false,
            });

            return {
              style,
              imageUrl: result.data?.images?.[0]?.url,
              success: true,
            };
          } catch (error) {
            console.error(`Error generating ${style}:`, error);
            return {
              style,
              imageUrl: null,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        })
      );

      return NextResponse.json({ 
        success: true, 
        isCompetition: true,
        results 
      });

    } else {
      // Single generation
      const prompt = `A drag queen with ${styles.join(", ")} style, professional makeup, dramatic lighting, high fashion photography`;
      
      const result = await fal.subscribe("fal-ai/flux-pulid", {
        input: {
          prompt,
          reference_image_url,
          image_size: "portrait_4_3",
          num_inference_steps: 20,
          guidance_scale: 4,
          negative_prompt: "bad quality, worst quality, text, signature, watermark, extra limbs, deformed, blurry",
          enable_safety_checker: true,
          id_weight: 1,
          true_cfg: 1,
          max_sequence_length: "128",
        },
        logs: false,
      });

      const imageUrl = result.data?.images?.[0]?.url;
      
      if (!imageUrl) {
        return NextResponse.json({ error: 'No image generated' }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        isCompetition: false,
        imageUrl 
      });
    }

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}