// app/api/video/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

fal.config({ credentials: process.env.FAL_KEY! });

export async function POST(req: NextRequest) {
    const { mode, imageUrl, phrase } = await req.json();
  
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }
  
    try {
      const engine =
        mode === 'basic'
          ? 'fal-ai/wan/v2.2-5b/image-to-video'
          : 'fal-ai/veo2/image-to-video';
  
      const input: Record<string, any> = {
        image_url: imageUrl,
        prompt: phrase,
      };
  
      if (mode === 'veo2') {
        input.use_tts = true;
        input.duration_seconds = 10;
        input.framerate = 25;
      }
  
      const result = await fal.subscribe(engine, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
  
      const videoUrl = result.data?.video_url || result.data?.url;
      if (!videoUrl) throw new Error('Video API returned no URL');
  
      return NextResponse.json({ videoUrl });
    } catch (err: any) {
      console.error('Video gen error:', err);
      return NextResponse.json(
        { error: err.message || 'Video generation failed' },
        { status: 500 }
      );
    }
  }
  