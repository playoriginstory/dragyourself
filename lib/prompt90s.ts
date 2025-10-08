// lib/prompt90s.ts
export type QuizAnswers = {
    runway: string;
    house: string;
    editorial: string;
    glam: string;
    custom?: string;
  };
  
  export const ICONIC_PRESETS = [
    "Naomi Campbell runway glam, Versace Baroque, late-90s flash photography",
    "Cindy Crawford all-American denim, Pepsi Super Bowl vibe, sunlit studio",
    "Claudia Schiffer Versace couture, opulent Barocco prints, rich gold accents",
    "Linda Evangelista haute couture chameleon, sharp bobs, blue backdrop studio",
    "Christy Turlington Calvin Klein minimalism, soft natural light, clean lines",
    "Tyra Banks bombshell runway, satin set, feathered styling",
    "Kate Moss grunge editorial, 35mm film grain, slip dress, subdued palette",
    "Helena Christensen wet-look studio, glossy skin, 90s beauty lighting"
  ];
  
  export function build90sPrompt(a: QuizAnswers) {
    const core = [
      "90s supermodel fashion portrait, 3:4, editorial-grade, beauty lighting",
      a.runway, a.house, a.editorial, a.glam, a.custom?.trim() ?? ""
    ].filter(Boolean).join(", ");
  
    const guidance =
      "shot on 35mm/120 film look, subtle halation, fashion retouch, crisp eyes, detailed hair, runway attitude, avoid cartoons/anime, photorealistic, no text overlay, no logos";
  
    return `${core}. ${guidance}.`;
  }
  