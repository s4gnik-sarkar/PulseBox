export const ADJECTIVES = [
  "Pixel",
  "Cosmic",
  "Neon",
  "Fuzzy",
  "Spicy",
  "Cozy",
  "Turbo",
  "Cheeky",
  "Sleepy",
  "Glitchy",
  "Chaotic",
  "Hyped",
  "Sassy",
  "Crispy",
  "Derpy",
  "Zesty",
  "Funky",
  "Breezy",
  "Lucky",
  "Velvet",
  "Giggly",
  "Chill",
  "Wobbly",
  "Sparkly",
];

export const NOUNS = [
  "Panda",
  "Chai",
  "Ninja",
  "Samosa",
  "Boba",
  "Noodle",
  "Dino",
  "Capybara",
  "Ghost",
  "Robo",
  "Duck",
  "Potato",
  "Frog",
  "Cactus",
  "Monster",
  "Wizard",
  "Gecko",
  "Falcon",
  "Taco",
  "Dumpling",
  "Waffle",
  "Mochi",
  "Comet",
  "Pickle",
];

export function generateNickname(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adjective} ${noun}`;
}

export function isValidNickname(value: unknown): value is string {
  if (typeof value !== "string" || value.length < 2 || value.length > 30) {
    return false;
  }

  if (value !== value.trim() || value.includes("  ")) {
    return false;
  }

  return /^[\p{L}\p{N} -]+$/u.test(value);
}
