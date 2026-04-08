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
}

export interface Country {
  code: string;        // ISO alpha-2, e.g. 'br'
  codeDisplay: string; // e.g. 'BRA'
  name: string;        // e.g. 'Brasil'
  featured: boolean;   // true = chip visible in level 1
}
