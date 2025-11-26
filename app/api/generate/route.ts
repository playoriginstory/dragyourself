// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

// Use Node.js runtime (required for Buffer + heic-convert)
export const runtime = "nodejs";

// Configure Fal securely with your API key (set in .env.local)
fal.config({
  credentials: process.env.FAL_KEY,
});

/**
 * Converts HEIC/HEIF image to JPEG (for iPhone uploads)
 */
async function convertHEICIfNeeded(base64Image: string): Promise<string> {
  if (base64Image.startsWith("data:image/heic") || base64Image.startsWith("data:image/heif")) {
    try {
      console.log("🔄 Converting HEIC → JPEG...");
      const heicConvert = await import("heic-convert");
      const convert = heicConvert.default;

      const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");
      const inputBuffer = Buffer.from(base64Data, "base64");
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 0.85,
      });

      return `data:image/jpeg;base64,${outputBuffer.toString("base64")}`;
    } catch (err) {
      console.error("❌ HEIC conversion failed:", err);
      throw new Error(
        "HEIC file conversion failed — please convert to JPG or PNG first."
      );
    }
  }
  return base64Image;
}

/**
 * Upload base64 image to Fal storage and return the URL.
 */
async function uploadReferenceToFal(base64: string): Promise<string> {
  const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer], { type: "image/jpeg" });
  const file = new File([blob], "upload.jpg", { type: "image/jpeg" });
  return fal.storage.upload(file);
}

/**
 * Run a Flux 2 Pro edit request with an “edit-style” instruction prompt.
 */
async function runFalFlux2ProEdit({
  prompt,
  imageUrl,
}: {
  prompt: string;
  imageUrl: string;
}): Promise<string | null> {
  const result = await fal.subscribe("fal-ai/flux-2-pro/edit", {
    input: {
      prompt,
      image_urls: [imageUrl],
      image_size: "portrait_4_3",
      safety_tolerance: "3",
      enable_safety_checker: true,
      output_format: "jpeg",
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs?.forEach((log) => console.log(log.message));
      }
    },
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
  prompt: string;
  isCompetition: false;
};

/**
 * POST /api/generate — main image generation endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CompetitionBody | SingleBody;

    // ✅ Validate image
    if (!body?.file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!/^data:image\/(png|jpe?g|webp|heic|heif);base64,/.test(body.file)) {
      return NextResponse.json({ error: "Invalid base64 image" }, { status: 400 });
    }

    // ✅ Convert HEIC if needed
    const processedFile = await convertHEICIfNeeded(body.file);

    // ✅ Upload to Fal
    const imageUrl = await uploadReferenceToFal(processedFile);

    // 🏁 Multi-style “competition” mode
    if (body.isCompetition) {
      if (!Array.isArray(body.styles) || body.styles.length === 0) {
        return NextResponse.json({ error: "No styles provided" }, { status: 400 });
      }

      const results = await Promise.all(
        body.styles.map(async (style) => {
          // 🔧 Instruction-style prompt works best for Flux 2 Pro Edit
          const editPrompt = `Edit this image to dress the subject in ${style} — authentic 1990s fashion, photorealistic texture, film lighting, true-to-era color tones.`;

          try {
            const url = await runFalFlux2ProEdit({ prompt: editPrompt, imageUrl });
            return { style, imageUrl: url, success: !!url };
          } catch (err: any) {
            console.error(`❌ Style generation failed (${style}):`, err);
            return { style, success: false, error: err.message };
          }
        })
      );

      return NextResponse.json({
        success: true,
        isCompetition: true,
        results,
      });
    }

    // 💄 Single style (Quiz prompt path)
    if (!("prompt" in body) || !body.prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Better phrasing for single prompt too
    const editPrompt = `Edit this image to match: ${body.prompt}. Maintain realistic pose and lighting with a 1990s fashion aesthetic.`;

    const url = await runFalFlux2ProEdit({ prompt: editPrompt, imageUrl });

    if (!url) {
      return NextResponse.json({ error: "No image generated" }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      isCompetition: false,
      imageUrl: url,
    });
  } catch (error: any) {
    console.error("❌ Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
