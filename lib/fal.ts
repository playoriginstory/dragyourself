import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY || "",
});

export async function uploadImageAndGenerate(prompt: string, file: File) {
  const reference_image_url = await fal.storage.upload(file);

  const result = await fal.subscribe("fal-ai/flux-pulid", {
    input: {
      prompt,
      reference_image_url,
      image_size: "portrait_4_3",
      num_inference_steps: 20,
      guidance_scale: 4,
      negative_prompt: "bad quality, worst quality, text, signature, watermark, extra limbs",
      enable_safety_checker: true,
    },
  });

  return result.data?.images?.[0]?.url || null;
}
