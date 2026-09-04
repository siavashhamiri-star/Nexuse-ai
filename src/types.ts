/**
 * Global Type Definitions for Affective AI Simulator
 */

export interface PADState {
  p: number; // Pleasure [-1.0, 1.0]
  a: number; // Arousal [-1.0, 1.0]
  d: number; // Dominance [-1.0, 1.0]
}

export interface EmotionReference {
  name: string;
  nameKey: string;
  p: number;
  a: number;
  d: number;
  color: string;
  bg: string;
}

export interface EmotionDistance {
  name: string;
  nameKey: string;
  distance: number;
  color: string;
}

export interface TokenomicsRecord {
  contribution: number;
  efficiency: number;
  empathyScore: number;
  socialImpact: number;
  rewardTokens: number;
}

export interface Message {
  id: string;
  sender: "user" | "system";
  text: string;
  timestamp: string;
  stateSnapshot?: PADState;
  detectedEmotion?: string;
  rewardTokensEarned?: number;
  cosmicWisdomFa?: string;
}

export interface AnalysisResponse {
  success: boolean;
  inputState: PADState;
  updatedState: PADState;
  closestEmotion: EmotionReference;
  distances: EmotionDistance[];
  modulator: {
    tone: string;
    strategy: string;
    label: string;
  };
  vulnerableContext: boolean;
  responseText: string;
  tokenomics: TokenomicsRecord;
  durationMs: number;
  time: string;
  cosmicWisdomFa?: string;
}
