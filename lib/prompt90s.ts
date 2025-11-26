// lib/prompt90s.ts

export type QuizAnswers = {
  style: string;
};

// 4 variations per style
const STYLE_PROMPTS: Record<string, string[]> = {
  "Lad Britpop / Madchester": [
    "gritty 90s britpop editorial, parka jacket, Adidas tracksuit, bucket hat, brick wall backdrop, Northern street scene, Oasis swagger",
    "90s indie lad look, jeans, trainers, pub alley background, smoky lens, Manchester youth culture vibe",
    "Britpop energy, parkas and vintage tees, urban rooftop scene, film grain aesthetic, attitude and swagger",
    "street photography, 90s Madchester club kid, sweat-soaked, neon beer sign lighting, Britpop revolution energy"
  ],

  "Sophisticated Britpop": [
    "sleek 90s London fashion editorial, tailored suit, trench coat, moody monochrome lighting, Blur meets Vogue energy",
    "smart-casual 90s menswear, cigarette in hand, overcast day, style and restraint, minimalist palette",
    "90s editorial portrait, slim suit and turtleneck, soft film light, black and white tones",
    "elegant Britpop era look, long coat and scarf, city street at dusk, cinematic frame"
  ],

  "Britpop Casual": [
    "relaxed 90s Britpop outfit, jeans and Fred Perry polo, festival crowd, film camera grain",
    "indie fan fashion, denim jacket, Doc Martens, record shop setting, cool British youth aesthetic",
    "Britpop street scene, beer garden, sunglasses, playful smile, natural daylight",
    "retro UK park shoot, guitar, vintage sneakers, unposed charm and warmth"
  ],

  "90s Pop Female": [
    "bubblegum 90s pop glamour, metallic outfit, candy colors, MTV lighting, teen magazine look",
    "female pop star photo shoot, silver two-piece, pastel background, glossy sparkle lighting",
    "girl group inspired outfit, glitter crop top, playful expression, stage lights",
    "neon pink lighting, glossy hair and makeup, stylized bubblegum 90s editorial"
  ],

  "All Saints urban cool": [
    "90s R&B streetwear editorial, cargo pants, neutral tones, moody London street, All Saints energy",
    "monochrome street look, crop top and leather jacket, grainy urban photo, attitude and edge",
    "fashion editorial, baggy denim and slick ponytail, glossy lip, underpass lighting",
    "90s cool girl energy, white tank, khakis, minimalist background, confident pose"
  ],

  "Boy Band": [
    "matching 90s boyband outfits, studio lighting, soft lens glow, synchronized pose",
    "denim and leather 90s pop group photo, confident smiles, pop magazine aesthetic",
    "boyband fashion editorial, white backdrop, coordinated outfits, youthful charm",
    "stage lighting, microphones, energetic choreography, pop heartthrob look"
  ],

  "Red Carpet Glamour": [
    "Hollywood red carpet photo, sparkling gown, flashbulbs, velvet backdrop, 90s prestige",
    "fashion editorial in red carpet style, golden hour lighting, sequins, sophisticated poise",
    "celebrity portrait, floor-length gown, paparazzi flashes, glitz and shine",
    "90s award show energy, luxury fabric dress, bold lipstick, spotlights and smiles"
  ],

  "90s Grunge": [
    "Seattle grunge editorial, flannel shirt, ripped jeans, film grain, moody rain-soaked street",
    "90s basement gig, messy hair, leather jacket, indie rock aesthetic",
    "grunge bedroom scene, VHS filter, Nirvana-era attitude, smudged eyeliner",
    "vintage photography, thrift fashion, gloomy overcast tone, anti-glamour energy"
  ],

  "90s Rave": [
    "warehouse rave energy, baggy sportswear, glowsticks, strobe lighting, euphoric crowd",
    "neon club photo, UV paint, whistles and visors, 90s dancefloor chaos",
    "underground rave editorial, vapor haze, tracksuit, orange and green lights",
    "electronic music culture photo, energy drink can in hand, happy hardcore vibe"
  ],

  "US Hip Hop - Street Wear": [
    "New York streetwear fashion, oversized denim, gold chain, graffiti backdrop, 90s hip-hop attitude",
    "East Coast hip-hop look, Timberlands, bomber jacket, stoop portrait, film grain texture",
    "hip-hop editorial photo, boombox, street energy, confident expression, baggy clothes",
    "studio shoot, rapper-inspired look, thick jewelry, serious face, minimal lighting"
  ],

  "Supermodel": [
    "high-fashion 90s supermodel shoot, Naomi Campbell energy, couture gown, strong pose",
    "Vogue 1990s cover look, glossy lighting, elegant silhouette, high-glamour photography",
    "supermodel runway pose, metallic dress, fashion week flashbulbs, flawless styling",
    "iconic studio portrait, slick hair, beauty close-up, timeless editorial allure"
  ],

  "Garage | Drums and Bass Look": [
    "UK garage 90s club style, metallic fabrics, Versace-inspired look, blue neon lights",
    "late-90s underground vibe, Moschino mini-dress, dancefloor haze, bassline rhythm",
    "fashion shoot, cropped jacket, silver eyeshadow, London nightlife aesthetic",
    "90s DnB party look, club lighting, street glamour, confident pose and attitude"
  ]
};

// helper to get a random variant
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function build90sPrompt(a: QuizAnswers) {
  const base =
    "90s fashion editorial, 3:4 portrait, shot on 35mm film, subtle halation, crisp detail, no text";
  const styleOptions = STYLE_PROMPTS[a.style];
  const stylePrompt = styleOptions
    ? randomFrom(styleOptions)
    : "90s fashion lookbook aesthetic";

  return `${base}, ${stylePrompt}.`;
}
