// 2% chance (1 in 50) of getting a rare sticker
export function rollRarity(): boolean {
  return Math.random() < 0.02
}
