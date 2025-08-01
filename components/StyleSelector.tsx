'use client';
import React from 'react';

export interface StyleOption {
  name: string;
  emoji: string;
  prompt: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    name: "Glamazon Queen",
    emoji: "👑",
    prompt: "A high resolution, realistic photo of a female presenting Glamazon Queen. Bold warrior outfit. She exudes elegance and regality with voluminous, wearing a curly blonde wig. Her makeup is bold with dramatic contouring, long lashes, and a striking red lip. She is adorned in a luxurious, sequined gown with a long train, accessorized with statement jewelry and a sparkling tiara, award-winning, cinematic."
  },
  {
    name: "Cyberpunk Diva",
    emoji: "🤖",
    prompt: "A high resolution, realistic photo of a female presenting Cyberpunk Diva. She has an edgy, futuristic look with oversized neon-blue, spiky hair. Her makeup is sharp with metallic silver eyeshadow and glossy lips. She wears a sleek, form-fitting bodysuit with LED lights, paired with high-tech accessories and platform boots, award-winning, cinematic."
  },
  {
    name: "Disco Inferno",
    emoji: "🕺",
    prompt: "A high resolution, realistic photo of a female presenting iridescent Disco Inferno. She is vibrant and flashy with a big, afro-style wig hair in fiery red. Her makeup is shimmery with gold eyeshadow and glossy lips. She is dressed in a dazzling, metallic disco jumpsuit with bell-bottoms and platform heels, accessorized with chunky, retro jewelry, deatiled, liquid, award-winning, cinematic."
  },
  {
    name: "Baroque Beauty",
    emoji: "🎭",
    prompt: "A high resolution, realistic photo of a female presenting Baroque Beauty. She has an ornate and elaborate gown, wearing a wig of intricately braided dark brown hair, adorned with pearls. Her makeup is classic with soft, rosy cheeks and a muted red lip. She wears an opulent, brocade gown with lace details, accessorized with antique jewelry and a decorative fan,award-winning, cinematic."
  },
  {
    name: "Pastel Princess",
    emoji: "🦄",
    prompt: "A high resolution, realistic photo of a female presenting Pastel Princess. She is soft and dreamy with long, wavy pastel pink wig hair. Her makeup is delicate with light pink eyeshadow and glossy lips. She is dressed in a whimsical, pastel-colored tutu dress with a floral crown and sparkling accessories, vibrant, liquid, award-winning, cinematic."
  },
  {
    name: "Alien Royalty",
    emoji: "👽",
    prompt: "A high resolution, realistic photo of a female presenting Alien Royalty. Outerspace look, with stars.She has an otherworldly and unique look with gravity-defying, metallic silver wig of oversized hair. Her makeup is ethereal with iridescent eyeshadow and glossy, holographic lips. She is adorned in a futuristic, metallic bodysuit with intricate patterns, accessorized with avant-garde jewelry and otherworldly props, award-winning, cinematic."
  },
  {
    name: "Fantasy Fairy",
    emoji: "🧚",
    prompt: "A high resolution, realistic photo of a female presenting Fantasy Fairy. She is whimsical and magical with flowing, flower-adorned golden blonde hair. Her makeup is enchanting with shimmery eyeshadow and glossy, pink lips. She wears a delicate, sheer dress with floral embroidery, paired with wings and nature-inspired accessories,award-winning, cinematic."
  },
  {
    name: "Pop Star Chic",
    emoji: "⭐",
    prompt: "A high resolution, realistic photo of a female presenting Pop Star Chic. She is trendy and glamorous wearing a long, straight, shiny platinum blonde hair wig. Her makeup is glam with smoky eyes and glossy lips. She is dressed in a stylish, sequined mini dress with thigh-high boots and oversized sunglasses,award-winning, cinematic."
  },
  {
    name: "90s Club Kid",
    emoji: "🌈",
    prompt: "A high resolution, realistic photo of a female presenting 90s Club Kid. She is colorful and wild wearing a multi-colored, braided wig of hair in neon shades. Her makeup is bold with bright eyeshadow and glossy lips. She wears a vibrant, patterned outfit with mismatched accessories and chunky platform shoes,award-winning, cinematic."
  },
  {
    name: "Gothic Elegance",
    emoji: "🖤",
    prompt: "A high resolution, realistic photo of a female presenting Gothic Elegance. She is dark and mysterious with a wig of sleek, black, long hair. Her makeup is dramatic with dark eyeshadow and deep red lips. She wears a black, lace gown with Victorian details, accessorized with silver jewelry and a choker necklace,award-winning, cinematic."
  },
  {
    name: "Mermaid Siren",
    emoji: "🧜",
    prompt: "A high resolution, realistic photo of a female presenting Mermaid Siren. She is enchanting and aquatic with a dramatic wig of long, wavy, ocean-blue hair. Her makeup is iridescent with shimmery eyeshadow and glossy lips. She is adorned in a sequined, mermaid-style gown with seashell accessories and a pearl tiara, award-winning, cinematic."
  },
  {
    name: "Carnival Queen",
    emoji: "🎪",
    prompt: "A high resolution, realistic photo of a female presenting Carnival Queen. She is festive and vibrant with curly, rainbow-colored hair. Her makeup is bold with colorful eyeshadow and glossy lips. She wears an elaborate, feathered costume with bright colors and patterns, accessorized with beaded jewelry and a decorative mask, award-winning, cinematic."
  },
  {
    name: "Royal Drag",
    emoji: "💎",
    prompt: "A high resolution, realistic photo of a female presenting Royal Drag. She is majestic and luxurious with a high, elegant updo wig in golden blonde. Her makeup is regal with contoured cheeks and a bold red lip. She is dressed in a royal, velvet gown with a long train, accessorized with a tiara and statement jewelry, award-winning, cinematic."
  },
  {
    name: "Southern Belle",
    emoji: "🌸",
    prompt: "A high resolution, realistic photo of a female presenting Southern Belle. She exudes classic charm and grace with long, wavy auburn wig of hair adorned with delicate flowers. Her makeup is soft with a touch of peach blush and a natural lip. She is dressed in a traditional, elegant antebellum-style gown with lace details, accessorized with a pearl necklace and a wide-brimmed hat, award-winning, cinematic."
  },
  {
    name: "Ice Princess",
    emoji: "❄️",
    prompt: "A high resolution, realistic photo of a female presenting Ice Princess. She is ethereal and cool with oversized, long, sleek platinum blonde wig of human hair that shimmers like ice. Her makeup is frosty with silver eyeshadow and a pale blue lip. She wears a stunning, icy-blue gown with crystal embellishments, accessorized with a diamond tiara and a fur stole, award-winning, cinematic."
  }
];

interface StyleSelectorProps {
  selected: string | null;
  setSelected: (style: string) => void;
}

export default function StyleSelector({ selected, setSelected }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {STYLE_OPTIONS.map((opt) => (
        <label
          key={opt.name}
          className={`cursor-pointer border-2 rounded-lg p-4 transition-all flex flex-col justify-between h-full
            ${selected === opt.name
              ? 'border-pink-500 ring-4 ring-pink-300 bg-pink-50'
              : 'border-gray-200 hover:border-pink-300'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{opt.emoji}</span>
            <span className="font-semibold text-lg">{opt.name}</span>
          </div>
          <input
            type="radio"
            name="dragStyle"
            value={opt.name}
            checked={selected === opt.name}
            onChange={() => setSelected(opt.name)}
            className="hidden"
          />
        </label>
      ))}
    </div>
  );
}
