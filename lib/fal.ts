import { fal } from "@fal-ai/client";

// ✅ Use server-side key only (keep secret)
fal.config({
  credentials: process.env.FAL_KEY || "",
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
      negative_prompt:
        "bad quality, worst quality, text, signature, watermark, extra limbs, deformed, blurry",
      enable_safety_checker: true,
      id_weight: 1,
      true_cfg: 1,
      max_sequence_length: "128",
    },
    logs: false,
  });

  return result.data?.images?.[0]?.url || null;
}
