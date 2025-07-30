// app/api/video/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

// server‑only key
fal.config({ credentials: process.env.FAL_KEY! })

export async function POST(req: NextRequest) {
  const { mode, imageUrl, prompt } = await req.json()
  if (!imageUrl) {
    return NextResponse.json({ error: 'No image URL provided' }, { status: 400 })
  }

  try {
    let jobResult: any

    if (mode === 'basic') {
      // basic stylized video
      jobResult = await fal.video.generate({
        engine: 'fal-ai/basic-video',      // replace with your basic-video model name
        reference_image_url: imageUrl,
        prompt,                             
        duration_seconds: 10,
        framerate: 25,
      })
    } else {
      // Veo2 style via FAL
      jobResult = await fal.video.generate({
        engine: 'fal-ai/veo2',              // your Veo2 model on FAL
        reference_image_url: imageUrl,
        prompt,            // you can rename to voice_prompt if the model expects it
        duration_seconds: 10,
        framerate: 25,
        use_tts: true,      // enable text‐to‐speech layer
      })
    }

    const videoUrl = jobResult.data?.video_url
    if (!videoUrl) throw new Error('Video API returned no URL')
    return NextResponse.json({ videoUrl })

  } catch (err: any) {
    console.error('Video gen error:', err)
    return NextResponse.json(
      { error: err.message || 'Video generation failed' },
      { status: 500 }
    )
  }
}
