export interface PhotoTransform {
  scale: number;   // multiplier on top of cover-scale (1.0 = automatic fit)
  offsetX: number; // horizontal offset in canvas pixels
  offsetY: number; // vertical offset in canvas pixels
}

export const DEFAULT_PHOTO_TRANSFORM: PhotoTransform = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
}

export interface StampData {
  name: string;
  role: string;
  area: string;
  email: string;
  countryCode: string;
}

export interface ParticipantRecord {
  nome: string;
  email: string;
  pais: string;
  paisCode: string;
  timestamp: string; // ISO 8601
  cargo: string;
  area: string;
}

export interface Country {
  code: string;        // ISO alpha-2, e.g. 'br'
  codeDisplay: string; // e.g. 'BRA'
  name: string;        // e.g. 'Brasil'
  featured: boolean;   // true = chip visible in level 1
}
