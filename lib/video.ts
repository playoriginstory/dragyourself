// lib/video.ts
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.NEXT_PUBLIC_FAL_KEY || "" });

export async function generateBasicVideo(image_url: string, prompt: string) {
  const result = await fal.subscribe("fal-ai/wan/v2.2-5b/image-to-video", {
    input: {
      image_url,
      prompt,
      resolution: "720p",
      num_frames: 81,
      frames_per_second: 24,
      negative_prompt:
        "bright colors, overexposed, static, blurred details, subtitles, style, artwork, painting, picture, still, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, malformed limbs, fused fingers, still picture, cluttered background, three legs, many people in the background, walking backwards",
      aspect_ratio: "auto",
      num_inference_steps: 40,
      enable_safety_checker: true,
      enable_prompt_expansion: false,
      guidance_scale: 3.5,
      shift: 5,
      interpolator_model: "film",
      num_interpolated_frames: 0,
      adjust_fps_for_interpolation: true,
    },
  });

  return result.data?.video?.url || null;
}

export async function generateVeo2Video(image_url: string, prompt: string) {
  const result = await fal.subscribe("fal-ai/veo2/image-to-video", {
    input: {
      image_url,
      prompt,
      aspect_ratio: "auto",
      duration: "5s",
    },
  });

  return result.data?.video?.url || null;
}
