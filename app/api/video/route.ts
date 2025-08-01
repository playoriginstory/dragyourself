import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

fal.config({ credentials: process.env.FAL_KEY! });

interface LumaDreamMachineInput {
  image_url: string;
  prompt: string;
}

interface AvatarSingleTextInput {
  image_url: string;
  text_input: string;
  voice: string;
  prompt: string;
}

export async function POST(req: NextRequest) {
  const { mode, imageUrl, textInput, voice } = await req.json();

  if (!imageUrl) {
    return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
  }

  try {
    let engine, input;

    if (mode === 'premium') {
      engine = 'fal-ai/ai-avatar/single-text';
      input = {
        image_url: imageUrl,
        text_input: textInput,
        voice: voice,
        prompt: "A drag queen speaks her mind with confidence and flair, engaging the audience with expressive gestures and a vibrant personality.",
        num_frames: 81 
      };
    } else {
      engine = 'fal-ai/luma-dream-machine/ray-2-flash/image-to-video';
      input = {
        image_url: imageUrl,
        prompt: textInput,
      };
    }

    const job = await fal.subscribe(engine, {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const requestId = job.requestId;
    console.log('Submitted requestId:', requestId);

    // Poll result (simple version)
    let result;
    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await fal.queue.status(engine, { requestId });
      if (res.status === 'COMPLETED') {
        result = await fal.queue.result(engine, { requestId });
        break;
      }
      if (res.status !== 'IN_PROGRESS' && res.status !== 'IN_QUEUE') {
        throw new Error('Video generation failed');
      }
    }

    if (!result) throw new Error('Video generation timed out');

    const videoUrl = result.data?.video?.url || result.data?.url;

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
