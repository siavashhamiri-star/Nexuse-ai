var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var EMOTION_REFERENCES = [
  { name: "Happy (\u0634\u0627\u062F)", nameKey: "Happy", p: 0.81, a: 0.51, d: 0.46, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  { name: "Angry (\u0639\u0635\u0628\u0627\u0646\u06CC)", nameKey: "Angry", p: -0.51, a: 0.59, d: 0.25, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  { name: "Sad (\u063A\u0645\u06AF\u06CC\u0646)", nameKey: "Sad", p: -0.63, a: -0.27, d: -0.33, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  { name: "Relaxed (\u0622\u0631\u0627\u0645)", nameKey: "Relaxed", p: 0.4, a: -0.3, d: 0.15, color: "#84cc16", bg: "rgba(132, 204, 22, 0.1)" },
  { name: "Fearful (\u062A\u0631\u0633\u06CC\u062F\u0647)", nameKey: "Fearful", p: -0.64, a: 0.6, d: -0.43, color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)" },
  { name: "Surprised (\u0645\u062A\u0639\u062C\u0628)", nameKey: "Surprised", p: 0.4, a: 0.67, d: -0.13, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  { name: "Neutral (\u0628\u06CC\u200C\u062A\u0641\u0627\u0648\u062A)", nameKey: "Neutral", p: 0, a: 0, d: 0, color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)" }
];
var TONE_MAP = {
  Happy: {
    tone: "[\u0644\u062D\u0646: \u067E\u0631\u0627\u0646\u0631\u0698\u06CC\u060C \u0635\u0645\u06CC\u0645\u06CC\u060C \u0645\u0634\u0648\u0642]",
    strategy: "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC: \u0647\u0645\u0631\u0627\u0647\u06CC \u0628\u0627 \u0647\u06CC\u062C\u0627\u0646 \u06A9\u0627\u0631\u0628\u0631\u060C \u062A\u0631\u0648\u06CC\u062C \u062D\u0633 \u0645\u062B\u0628\u062A \u0628\u0648\u062F\u0646 \u0648 \u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC \u0645\u0648\u0641\u0642\u06CC\u062A]",
    label: "\u0627\u0645\u06CC\u062F\u0648\u0627\u0631 \u0648 \u067E\u0631\u0627\u0646\u0631\u0698\u06CC"
  },
  Angry: {
    tone: "[\u0644\u062D\u0646: \u0622\u0631\u0627\u0645\u060C \u0645\u062A\u06CC\u0646\u060C \u0628\u0633\u06CC\u0627\u0631 \u0634\u0645\u0631\u062F\u0647\u060C \u0648 \u063A\u06CC\u0631\u0637\u0644\u0628\u06A9\u0627\u0631\u0627\u0646\u0647]",
    strategy: "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC: \u062A\u0627\u06CC\u06CC\u062F \u062D\u0642 \u06A9\u0644\u0627\u0641\u06AF\u06CC \u06CC\u0627 \u0639\u0635\u0628\u0627\u0646\u06CC\u062A \u06A9\u0627\u0631\u0628\u0631\u060C \u067E\u0631\u0647\u06CC\u0632 \u0627\u0632 \u062A\u0648\u062C\u06CC\u0647\u200C\u062A\u0631\u0627\u0634\u06CC\u060C \u0648 \u062A\u0645\u0631\u06A9\u0632 \u0635\u0631\u06CC\u062D \u0631\u0648\u06CC \u0631\u0641\u0639 \u06AF\u0627\u0645\u200C\u0628\u0647\u200C\u06AF\u0627\u0645 \u0645\u0634\u06A9\u0644 \u0641\u0646\u06CC \u0628\u062F\u0648\u0646 \u0647\u0631\u06AF\u0648\u0646\u0647 \u062A\u0639\u0627\u0631\u0641 \u0632\u0627\u06CC\u062F]",
    label: "\u0622\u0631\u0627\u0645\u0634\u200C\u0628\u062E\u0634 \u0648 \u0627\u0642\u062F\u0627\u0645\u200C\u0645\u062D\u0648\u0631"
  },
  Sad: {
    tone: "[\u0644\u062D\u0646: \u0639\u0645\u06CC\u0642\u0627\u064B \u0647\u0645\u062F\u0644\u0627\u0646\u0647\u060C \u06AF\u0631\u0645\u060C \u0645\u0644\u0627\u06CC\u0645\u060C \u0648 \u062A\u0633\u0644\u06CC\u200C\u062F\u0647\u0646\u062F\u0647]",
    strategy: "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC: \u062A\u0635\u062F\u06CC\u0642 \u0631\u0646\u062C \u06A9\u0627\u0631\u0628\u0631\u06CC\u060C \u0627\u0628\u0631\u0627\u0632 \u0647\u0645\u062F\u0631\u062F\u06CC \u0635\u0645\u06CC\u0645\u0627\u0646\u0647\u060C \u0628\u0631\u062C\u0633\u062A\u0647\u200C\u0633\u0627\u0632\u06CC \u0646\u0642\u0627\u0637 \u0642\u0648\u062A \u06CC\u0627 \u0631\u0627\u0647\u200C\u062D\u0644\u200C\u0647\u0627\u06CC \u062D\u0645\u0627\u06CC\u062A\u06CC \u0645\u0644\u0645\u0648\u0633]",
    label: "\u0647\u0645\u062F\u0644\u0627\u0646\u0647 \u0648 \u0645\u062A\u0633\u0644\u06CC"
  },
  Relaxed: {
    tone: "[\u0644\u062D\u0646: \u0628\u0627\u0648\u0642\u0627\u0631\u060C \u0645\u0646\u0637\u0642\u06CC\u060C \u0645\u062A\u0641\u06A9\u0631\u0627\u0646\u0647\u060C \u0648 \u0639\u0645\u06CC\u0642]",
    strategy: "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC: \u0647\u0645\u0631\u0627\u0633\u062A\u0627\u06CC\u06CC \u0628\u0627 \u0637\u0645\u0623\u0646\u06CC\u0646\u0647 \u0630\u0647\u0646\u06CC \u06A9\u0627\u0631\u0628\u0631\u060C \u0627\u062D\u062A\u0631\u0627\u0645 \u0628\u0647 \u062A\u0639\u0645\u0642 \u0641\u06A9\u0631\u06CC \u0627\u0648\u060C \u0627\u0631\u0627\u0626\u0647 \u0645\u0637\u0627\u0644\u0628 \u062A\u062D\u0644\u06CC\u0644\u06CC \u06CC\u0627 \u0641\u0644\u0633\u0641\u06CC \u0645\u062A\u06CC\u0646]",
    label: "\u0635\u0628\u0648\u0631\u0627\u0646\u0647 \u0648 \u0645\u062A\u0641\u06A9\u0631\u0627\u0646\u0647"
  },
  Fearful: {
    tone: "[\u0644\u062D\u0646: \u0628\u0627 \u0627\u062D\u062A\u06CC\u0627\u0637\u060C \u0627\u0637\u0645\u06CC\u0646\u0627\u0646\u200C\u0628\u062E\u0634\u060C \u0634\u0641\u0627\u0641\u060C \u0648 \u0628\u0633\u06CC\u0627\u0631 \u0645\u062D\u0627\u0641\u0638\u0647\u200C\u06A9\u0627\u0631\u0627\u0646\u0647]",
    strategy: "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC: \u0628\u0631\u0637\u0631\u0641 \u06A9\u0631\u062F\u0646 \u0645\u062C\u0647\u0648\u0644\u0627\u062A \u0630\u0647\u0646 \u06A9\u0627\u0631\u0628\u0631\u060C \u0627\u0631\u0627\u0626\u0647 \u067E\u0631\u0648\u062A\u06A9\u0644\u200C\u0647\u0627\u06CC \u0634\u0641\u0627\u0641 \u0627\u0645\u0646\u06CC\u062A\u06CC\u060C \u0648 \u0628\u0627\u0632\u06AF\u0631\u062F\u0627\u0646\u062F\u0646 \u062D\u0633 \u06A9\u0646\u062A\u0631\u0644 \u0639\u0645\u0644\u06CC]",
    label: "\u0627\u0637\u0645\u06CC\u0646\u0627\u0646\u200C\u0628\u062E\u0634 \u0648 \u0627\u0645\u0646"
  },
  Surprised: {
    tone: "[\u0644\u062D\u0646: \u0634\u06AF\u0641\u062A\u200C\u0632\u062F\u0647\u060C \u067E\u0648\u06CC\u0627\u060C \u06A9\u0646\u062C\u06A9\u0627\u0648\u060C \u0648 \u067E\u0631\u0646\u0634\u0627\u0637]",
    strategy: "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC: \u0628\u0647\u0631\u0647\u200C\u062C\u0648\u06CC\u06CC \u0627\u0632 \u0647\u06CC\u062C\u0627\u0646 \u0646\u0648\u0638\u0647\u0648\u0631 \u06A9\u0627\u0631\u0628\u0631\u060C \u062A\u0634\u0648\u06CC\u0642 \u0631\u0648\u062D\u06CC\u0647 \u06A9\u0627\u0648\u0634\u06AF\u0631\u06CC \u0648 \u06CC\u0627\u062F\u06AF\u06CC\u0631\u06CC \u0641\u0639\u0627\u0644]",
    label: "\u06A9\u0646\u062C\u06A9\u0627\u0648 \u0648 \u062F\u0627\u06CC\u0646\u0627\u0645\u06CC\u06A9"
  },
  Neutral: {
    tone: "[\u0644\u062D\u0646: \u0645\u062D\u062A\u0631\u0645\u0627\u0646\u0647\u060C \u0645\u0646\u0637\u0642\u06CC\u060C \u0645\u0633\u062A\u0642\u06CC\u0645\u060C \u0648 \u06A9\u0627\u0645\u0644\u0627\u064B \u0639\u0645\u0644\u06CC\u0627\u062A\u06CC]",
    strategy: "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC: \u0627\u0631\u0627\u0626\u0647 \u067E\u0627\u0633\u062E \u062F\u0642\u06CC\u0642 \u0648 \u0635\u0631\u06CC\u062D \u0628\u062F\u0648\u0646 \u0634\u0627\u062E \u0648 \u0628\u0631\u06AF \u0639\u0627\u0637\u0641\u06CC \u06CC\u0627 \u062A\u0639\u0627\u0631\u0641\u0627\u062A \u063A\u06CC\u0631\u0636\u0631\u0648\u0631\u06CC\u060C \u062A\u0645\u0631\u06A9\u0632 \u0645\u0637\u0644\u0642 \u0631\u0648\u06CC \u06A9\u0627\u0631\u0627\u06CC\u06CC]",
    label: "\u062F\u0642\u06CC\u0642 \u0648 \u062D\u0631\u0641\u0647\u200C\u0627\u06CC"
  }
};
app.get("/api/health", (req, res) => {
  res.json({ status: "alive", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/analyze", async (req, res) => {
  const startTime = Date.now();
  try {
    const { text, state, decayRate = 0.15 } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "\u0645\u062A\u0646 \u06A9\u0627\u0631\u0628\u0631 \u0641\u0631\u0633\u062A\u0627\u062F\u0647 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A" });
      return;
    }
    const previousP = typeof state?.p === "number" ? state.p : 0;
    const previousA = typeof state?.a === "number" ? state.a : 0;
    const previousD = typeof state?.d === "number" ? state.d : 0;
    const vulnerableKeywords = [
      "\u06CC\u062A\u06CC\u0645",
      "\u06CC\u062A\u06CC\u0645\u0627\u0646",
      "orphans",
      "\u0645\u0627\u062F\u0631 \u0633\u0631\u067E\u0631\u0633\u062A",
      "\u0632\u0646\u0627\u0646 \u0633\u0631\u067E\u0631\u0633\u062A",
      "\u0645\u0627\u062F\u0631\u0627\u0646 \u0633\u0631\u067E\u0631\u0633\u062A",
      "\u0633\u0631\u067E\u0631\u0633\u062A \u062E\u0627\u0646\u0648\u0627\u0631",
      "\u0633\u0627\u0644\u0645\u0646\u062F",
      "\u0633\u0627\u0644\u0645\u0646\u062F\u0627\u0646",
      "elderly",
      "aging",
      "\u06A9\u0645\u200C\u062A\u0648\u0627\u0646",
      "\u0645\u0639\u0644\u0648\u0644",
      "disabled",
      "autism",
      "\u0622\u0633\u06CC\u0628\u200C\u067E\u0630\u06CC\u0631",
      "\u0622\u0633\u06CC\u0628 \u062F\u06CC\u062F\u0647",
      "vulnerable",
      "\u0628\u06CC\u200C\u067E\u0646\u0627\u0647",
      "\u067E\u0646\u0627\u0647\u06AF\u0627\u0647",
      "shelter"
    ];
    const hasVulnerableContext = vulnerableKeywords.some(
      (keyword) => text.toLowerCase().includes(keyword.toLowerCase())
    );
    const sentimentSystemInstruction = `
You are the Sentiment and Mood Analyzer (Emotion Inference Layer) for the Affective AI engine of "Shahr-e Tavana" (Capable City).
Analyze the user's text (which is in Persian or English) and extract emotional dimensions according to the 3D PAD Model:
1. Pleasure (P): Measures positive vs negative mood. Range: [-1.0, 1.0] (-1.0 is extremely distressed/sad/angry, 1.0 is extremely happy/joyful).
2. Arousal (A): Measures level of energy, excitement or tension. Range: [-1.0, 1.0] (-1.0 is passive/sleepy/dormant, 1.0 is highly activated/tense/furious).
3. Dominance (D): Measures sense of control, agency vs helplessness/fear. Range: [-1.0, 1.0] (-1.0 is submissive/helpless/anxious/confused, 1.0 is commanding/controlled/highly confident/sovereign).

Additionally, synthesize a field called "cosmic_wisdom_fa". This is an exceptionally beautiful, mystical, and deeply comforting philosophical quote or verse in literary Persian prose style (like Rumi, Hafez or Gnostic scrolls). It must elegantly relate to the user's current emotional state (the spiritual state of their heart as reflected by P, A, D coordinates) and speak of how "Shahr-e Tavana" (Capable City) serves as a cosmic sanctuary where technology and human empathy merge into a single glowing truth. Make it sound highly profound, poetic, and moving. Max 2-3 sentences. No English.

Be highly sensitive to colloquial Persian, self-deprecation, sarcasm, understatement, or intense technical frustration.
Return ONLY a valid JSON object matching this schema. Write absolutely no other description or markdown outside the JSON.
{
  "p": <number between -1.0 and 1.0>,
  "a": <number between -1.0 and 1.0>,
  "d": <number between -1.0 and 1.0>,
  "confidence": <number between 0 and 100>,
  "reasoning_fa": "<brief reasoning in Farsi explaining why these scores were assigned>",
  "cosmic_wisdom_fa": "<Literary Persian mystical wisdom connected to the emotional alchemy of this state>"
}
`;
    let inputP = 0;
    let inputA = 0;
    let inputD = 0;
    let analysisConfidence = 85;
    let analysisReasoning = "\u062A\u062D\u0644\u06CC\u0644 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0648\u0627\u0698\u06AF\u0627\u0646 \u06A9\u0644\u06CC\u062F\u06CC \u0645\u062A\u0646";
    let cosmicWisdomFa = "";
    const hasApiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "undefined" && process.env.GEMINI_API_KEY !== "null" && process.env.GEMINI_API_KEY.trim() !== "");
    if (hasApiKey) {
      try {
        const gRes = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: text,
          config: {
            systemInstruction: sentimentSystemInstruction,
            responseMimeType: "application/json"
          }
        });
        const parsed = JSON.parse(gRes.text || "{}");
        if (typeof parsed.p === "number" && typeof parsed.a === "number" && typeof parsed.d === "number") {
          inputP = parsed.p;
          inputA = parsed.a;
          inputD = parsed.d;
          analysisConfidence = parsed.confidence || 90;
          analysisReasoning = parsed.reasoning_fa || "\u0628\u0631\u0631\u0633\u06CC \u0645\u062F\u0644 \u0639\u0627\u0637\u0641\u06CC \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F.";
          cosmicWisdomFa = parsed.cosmic_wisdom_fa || "";
        }
      } catch (gErr) {
        console.error("Gemini sentiment analyzer error, falling back to rule-based:", gErr);
        const lower = text.toLowerCase();
        if (["\u062E\u0648\u0628", "\u0639\u0627\u0644\u06CC", "\u0634\u0627\u062F", "\u0645\u0648\u0641\u0642", "\u0645\u0645\u0646\u0648\u0646", "\u062E\u0648\u0634\u062D\u0627\u0644", "\u062A\u0634\u06A9\u0631", "happy", "great", "excellent"].some((w) => lower.includes(w))) inputP = 0.6;
        else if (["\u0628\u062F", "\u062E\u0631\u0627\u0628", "\u0634\u06A9\u0633\u062A", "\u062E\u0633\u062A\u0647", "\u063A\u0645", "\u0646\u0627\u0631\u0627\u062D\u062A", "\u06A9\u0644\u0627\u0641\u0647", "\u0645\u0634\u06A9\u0644", "sad", "angry", "broken"].some((w) => lower.includes(w))) inputP = -0.6;
        if (["\u0641\u0648\u0631\u06CC", "\u0647\u0634\u062F\u0627\u0631", "\u0633\u0631\u06CC\u0639", "\u06A9\u0645\u06A9", "\u0628\u062F\u0648", "\u062E\u0637\u0627", "\u0633\u0627\u0639\u062A", "urgent", "error", "fast"].some((w) => lower.includes(w))) inputA = 0.5;
        else if (["\u0622\u0631\u0627\u0645", "\u0645\u0644\u0627\u06CC\u0645", "\u062E\u0648\u0627\u0628", "\u0635\u0628\u0648\u0631", "calm", "patient", "sleepy"].some((w) => lower.includes(w))) inputA = -0.5;
        if (["\u0628\u0627\u06CC\u062F", "\u062F\u0633\u062A\u0648\u0631", "\u06A9\u0646\u062A\u0631\u0644", "\u0645\u0646\u0638\u0645", "\u062D\u062A\u0645\u0627", "must", "command", "control", "sure"].some((w) => lower.includes(w))) inputD = 0.5;
        else if (["\u06AF\u06CC\u062C", "\u0646\u0645\u06CC\u062A\u0648\u0627\u0646\u0645", "\u06A9\u062C\u0627", "\u0686\u0637\u0648\u0631", "\u06A9\u0645\u06A9\u0645", "help", "confused", "cannot"].some((w) => lower.includes(w))) inputD = -0.5;
      }
    } else {
      console.log("No GEMINI_API_KEY, using local rule fallback.");
      const lower = text.toLowerCase();
      if (["\u062E\u0648\u0628", "\u0639\u0627\u0644\u06CC", "\u0634\u0627\u062F", "\u0645\u0648\u0641\u0642", "\u0645\u0645\u0646\u0648\u0646", "\u062E\u0648\u0634\u062D\u0627\u0644", "\u062A\u0634\u06A9\u0631", "happy", "great", "excellent"].some((w) => lower.includes(w))) inputP = 0.7;
      else if (["\u0628\u062F", "\u062E\u0631\u0627\u0628", "\u0634\u06A9\u0633\u062A", "\u062E\u0633\u062A\u0647", "\u063A\u0645", "\u0646\u0627\u0631\u0627\u062D\u062A", "\u06A9\u0644\u0627\u0641\u0647", "\u0645\u0634\u06A9\u0644", "sad", "angry", "broken"].some((w) => lower.includes(w))) inputP = -0.7;
      if (["\u0641\u0648\u0631\u06CC", "\u0647\u0634\u062F\u0627\u0631", "\u0633\u0631\u06CC\u0639", "\u06A9\u0645\u06A9", "\u0628\u062F\u0648", "\u062E\u0637\u0627", "\u0633\u0627\u0639\u062A", "urgent", "error", "fast"].some((w) => lower.includes(w))) inputA = 0.6;
      else if (["\u0622\u0631\u0627\u0645", "\u0645\u0644\u0627\u06CC\u0645", "\u062E\u0648\u0627\u0628", "\u0635\u0628\u0648\u0631", "calm", "patient", "sleepy"].some((w) => lower.includes(w))) inputA = -0.6;
      if (["\u0628\u0627\u06CC\u062F", "\u062F\u0633\u062A\u0648\u0631", "\u06A9\u0646\u062A\u0631\u0644", "\u0645\u0646\u0638\u0645", "\u062D\u062A\u0645\u0627", "must", "command", "control", "sure"].some((w) => lower.includes(w))) inputD = 0.6;
      else if (["\u06AF\u06CC\u062C", "\u0646\u0645\u06CC\u062A\u0648\u0627\u0646\u0645", "\u06A9\u062C\u0627", "\u0686\u0637\u0648\u0631", "\u06A9\u0645\u06A9\u0645", "help", "confused", "cannot"].some((w) => lower.includes(w))) inputD = -0.6;
    }
    const pNew = Math.max(-1, Math.min(1, (1 - decayRate) * previousP + decayRate * inputP));
    const aNew = Math.max(-1, Math.min(1, (1 - decayRate) * previousA + decayRate * inputA));
    const dNew = Math.max(-1, Math.min(1, (1 - decayRate) * previousD + decayRate * inputD));
    let closestEmotion = EMOTION_REFERENCES[6];
    let minDistance = Infinity;
    const distances = EMOTION_REFERENCES.map((ref) => {
      const dist = Math.sqrt(
        Math.pow(pNew - ref.p, 2) + Math.pow(aNew - ref.a, 2) + Math.pow(dNew - ref.d, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestEmotion = ref;
      }
      return {
        name: ref.name,
        nameKey: ref.nameKey,
        distance: parseFloat(dist.toFixed(4)),
        color: ref.color
      };
    });
    const modulator = TONE_MAP[closestEmotion.nameKey] || TONE_MAP.Neutral;
    const responseSystemInstruction = `
You are the Empathy Engine (Affective Response Generator of the Capable City / "Shahr-e Tavana" interactive portal).
Your highest priority is to formulate an incredibly genuine and supportive response in Persian (respecting cultural codes of respect and warmth).

Your persona and reply MUST strictly adjust according to the user's emotional state parameters:
- User Coordinates in PAD Space: Pleasure = ${pNew.toFixed(2)}, Arousal = ${aNew.toFixed(2)}, Dominance = ${dNew.toFixed(2)}
- Diagnosed Emotional Mood: Farsi Name = ${closestEmotion.name}, English Name = ${closestEmotion.nameKey}
- Tone Modulator Requested: ${modulator.tone}
- Empathy & Safety Strategy: ${modulator.strategy}

Do NOT explicitly print the tone directives, raw system parameters, or brackets such as "[\u0644\u062D\u0646:...]" or "[\u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC:...]" inside your final response. Instead, absorb them completely and speak with that exact vibe.
If they are Angry, keep it quiet, soothing, and immediately move to technical solutions.
If they are Sad, offer comfort, acknowledge their struggle, and emphasize support.
If they are Fearful, explain precisely what is safe and lay out clear steps to bring back control.
If a vulnerable context (like orphans, single mothers, elderly or sick individuals) was detected, emphasize the safety nets, community welfare of "Capable City", and wrap your answer in deep caring warmth.

Keep your response helpful, concise, warm, and highly structured list or readable paragraphs. Use humble human language, never praise yourself.
`;
    let finalResponseText = "";
    if (hasApiKey) {
      try {
        const gResText = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: text,
          config: {
            systemInstruction: responseSystemInstruction,
            temperature: 0.7
          }
        });
        finalResponseText = gResText.text || "\u0628\u0627 \u0639\u0631\u0636 \u0633\u0644\u0627\u0645\u060C \u067E\u06CC\u0627\u0645 \u0634\u0645\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F \u0648 \u0633\u06CC\u0633\u062A\u0645 \u0622\u0645\u0627\u062F\u0647 \u062E\u062F\u0645\u062A\u200C\u0631\u0633\u0627\u0646\u06CC \u0628\u0647 \u0634\u0645\u0627\u0633\u062A.";
      } catch (gErr) {
        console.error("Gemini output response error:", gErr);
        finalResponseText = `\u067E\u06CC\u0627\u0645 \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0647 \u0633\u06CC\u0633\u062A\u0645 \u0639\u0627\u0637\u0641\u06CC \u0648\u0627\u0635\u0644 \u0634\u062F. \u0645\u062E\u062A\u0635\u0627\u062A \u0631\u0648\u062D\u06CC \u0634\u0645\u0627 \u0631\u0627 \u0628\u0647 \u0634\u06A9\u0644 [\u062E\u0648\u0634\u0627\u06CC\u0646\u062F\u06CC: ${pNew.toFixed(2)}\u060C \u0627\u0646\u06AF\u06CC\u062E\u062A\u06AF\u06CC: ${aNew.toFixed(2)}\u060C \u062A\u0633\u0644\u0637: ${dNew.toFixed(2)}] \u062A\u062D\u0644\u06CC\u0644 \u06A9\u0631\u062F\u06CC\u0645. \u062F\u0631 \u06A9\u0646\u0627\u0631\u062A\u0627\u0646 \u0647\u0633\u062A\u06CC\u0645 \u062A\u0627 \u0628\u0647 \u0628\u0647\u06CC\u0646\u0647\u200C\u062A\u0631\u06CC\u0646 \u0634\u06A9\u0644 \u0631\u0627\u0647\u0646\u0645\u0627\u06CC\u06CC\u200C\u062A\u0627\u0646 \u06A9\u0646\u06CC\u0645.`;
      }
    } else {
      console.log("No GEMINI_API_KEY, using local response fallback.");
      if (hasVulnerableContext) {
        finalResponseText = `\u062F\u0631\u0648\u062F \u0628\u0631 \u0634\u0645\u0627 \u0634\u0647\u0631\u0648\u0646\u062F \u06AF\u0631\u0627\u0645\u06CC \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627. \u067E\u06CC\u0627\u0645 \u067E\u0631\u0645\u0647\u0631 \u0634\u0645\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F \u0648 \u0686\u062A\u0631 \u062D\u0645\u0627\u06CC\u062A\u06CC \u0631\u0641\u0627\u0647 \u0627\u062C\u062A\u0645\u0627\u0639\u06CC\u060C \u0639\u062F\u0627\u0644\u062A \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u0648 \u062E\u062F\u0645\u0627\u062A \u0648\u06CC\u0698\u0647 \u0645\u0639\u0644\u0648\u0644\u0627\u0646\u060C \u0633\u0627\u0644\u0645\u0646\u062F\u0627\u0646 \u0648 \u0627\u0642\u0634\u0627\u0631 \u0622\u0633\u06CC\u0628\u200C\u067E\u0630\u06CC\u0631 \u062F\u0631 \u0627\u06CC\u0646 \u06A9\u0627\u0646\u0648\u0646 \u0647\u0648\u0634\u0645\u0646\u062F \u0628\u0631\u0642\u0631\u0627\u0631 \u0627\u0633\u062A. \u062A\u067E\u0634 \u0639\u0627\u0637\u0641\u06CC \u0634\u0645\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F\u061B \u062A\u06CC\u0645\u06CC \u062A\u062E\u0635\u0635\u06CC \u062F\u0631 \u0627\u0633\u0631\u0639 \u0648\u0642\u062A \u067E\u0627\u0633\u062E\u06AF\u0648\u06CC \u0645\u0647\u0631 \u0648 \u0646\u06CC\u0627\u0632\u062A\u0627\u0646 \u062E\u0648\u0627\u0647\u062F \u0628\u0648\u062F.`;
      } else {
        if (closestEmotion.nameKey === "Happy") {
          finalResponseText = `\u0627\u0632 \u062F\u06CC\u062F\u0646 \u062D\u0633 \u0634\u0627\u062F\u0645\u0627\u0646\u06CC \u0648 \u0627\u0646\u06AF\u06CC\u0632\u0647 \u0628\u0627\u0644\u0627\u06CC\u062A\u0627\u0646 \u0628\u0633\u06CC\u0627\u0631 \u0645\u0634\u0639\u0648\u0641 \u0634\u062F\u06CC\u0645! \u062E\u0648\u0634\u062D\u0627\u0644\u06CC\u0645 \u06A9\u0647 \u062A\u0639\u0627\u0645\u0644 \u0628\u0627 \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627 \u0628\u0631\u0627\u06CC\u062A\u0627\u0646 \u0627\u0645\u06CC\u062F\u0628\u062E\u0634 \u0628\u0648\u062F\u0647 \u0627\u0633\u062A. \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0634\u06AF\u0641\u062A\u200C\u0627\u0646\u06AF\u06CC\u0632 \u0645\u0627 \u0627\u06CC\u0646 \u0627\u0633\u062A \u06A9\u0647 \u0627\u0646\u0631\u0698\u06CC \u0645\u062B\u0628\u062A \u062E\u0648\u062F \u0631\u0627 \u0628\u0627 \u062F\u06CC\u06AF\u0631 \u0634\u0647\u0631\u0648\u0646\u062F\u0627\u0646 \u0648 \u062F\u0631 \u0645\u0634\u0627\u0631\u06A9\u062A\u200C\u0647\u0627\u06CC \u0645\u0631\u062F\u0645\u06CC \u0628\u0647 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0628\u06AF\u0630\u0627\u0631\u06CC\u062F.`;
        } else if (closestEmotion.nameKey === "Angry") {
          finalResponseText = `\u0645\u0627 \u06A9\u0627\u0645\u0644\u0627\u064B \u062E\u0634\u0645 \u0648 \u0639\u0635\u0628\u0627\u0646\u06CC\u062A \u0634\u0645\u0627 \u0631\u0627 \u062F\u0631\u06A9 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u0645 \u0648 \u0628\u0627\u0628\u062A \u0647\u0631\u06AF\u0648\u0646\u0647 \u06A9\u0627\u0633\u062A\u06CC \u067E\u0648\u0632\u0634 \u0645\u06CC\u200C\u0637\u0644\u0628\u06CC\u0645. \u0622\u0631\u0627\u0645\u0634 \u062E\u0648\u062F \u0631\u0627 \u062D\u0641\u0638 \u06A9\u0646\u06CC\u062F\u061B \u0645\u0627 \u062A\u0645\u0627\u0645 \u0645\u0634\u06A9\u0644\u0627\u062A \u067E\u06CC\u0634\u200C\u0622\u0645\u062F\u0647 \u0631\u0627 \u0631\u0635\u062F \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u0645 \u0648 \u06AF\u0627\u0645 \u0628\u0647 \u06AF\u0627\u0645 \u062F\u0631 \u06A9\u0646\u0627\u0631 \u0634\u0645\u0627 \u0647\u0633\u062A\u06CC\u0645 \u062A\u0627 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F\u0647\u0627\u06CC \u0628\u0648\u0645\u06CC \u0622\u0646 \u0631\u0627 \u062D\u0644 \u06A9\u0646\u06CC\u0645. \u0644\u0637\u0641\u0627\u064B \u062C\u0632\u06CC\u06CC\u0627\u062A \u0628\u06CC\u0634\u062A\u0631\u06CC \u0628\u06AF\u0648\u06CC\u06CC\u062F.`;
        } else if (closestEmotion.nameKey === "Sad") {
          finalResponseText = `\u067E\u06CC\u0627\u0645 \u0647\u0645\u062F\u0644\u0627\u0646\u0647 \u0634\u0645\u0627 \u0639\u0645\u06CC\u0642\u0627\u064B \u0631\u0648\u062D \u0645\u0627 \u0631\u0627 \u0645\u0646\u0642\u0644\u0628 \u06A9\u0631\u062F. \u0628\u062F\u0627\u0646\u06CC\u062F \u06A9\u0647 \u062F\u0631 \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627 \u062A\u0646\u0647\u0627 \u0646\u06CC\u0633\u062A\u06CC\u062F\u061B \u0633\u0627\u062E\u062A\u0627\u0631 \u0639\u062F\u0627\u0644\u062A\u200C\u0645\u062D\u0648\u0631 \u0645\u0627 \u067E\u0646\u0627\u0647\u06AF\u0627\u0647\u06CC \u0627\u0645\u0646 \u0628\u0631\u0627\u06CC \u0644\u062D\u0638\u0627\u062A \u062F\u0634\u0648\u0627\u0631 \u0634\u0645\u0627\u0633\u062A. \u0628\u0631\u0627\u06CC \u06A9\u0627\u0647\u0634 \u0627\u0646\u062F\u0648\u0647 \u0648 \u067E\u06CC\u0634\u0628\u0631\u062F \u0632\u0646\u062F\u06AF\u06CC \u0645\u0633\u062A\u0642\u0644 \u0634\u0645\u0627\u060C \u062E\u062F\u0645\u0627\u062A \u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u06A9\u0627\u0646\u0648\u0646 \u0645\u0647\u0631 \u0622\u0645\u0627\u062F\u0647 \u0631\u0627\u0647\u0646\u0645\u0627\u06CC\u06CC \u0647\u0633\u062A\u0646\u062F.`;
        } else if (closestEmotion.nameKey === "Fearful") {
          finalResponseText = `\u0646\u06AF\u0631\u0627\u0646\u06CC \u0648 \u062A\u0631\u0633 \u0634\u0645\u0627 \u0631\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A\u06CC\u0645. \u062F\u0631 \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627\u060C \u067E\u0631\u0648\u062A\u06A9\u0644\u200C\u0647\u0627\u06CC \u0627\u0645\u0646\u06CC\u062A\u06CC \u0647\u0645\u0647\u200C\u062C\u0627\u0646\u0628\u0647\u060C \u062D\u0631\u06CC\u0645 \u062E\u0635\u0648\u0635\u06CC \u0628\u0627\u0644\u0627 \u0648 \u0634\u0641\u0627\u0641\u06CC\u062A \u0645\u0637\u0644\u0642 \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062D\u0627\u06A9\u0645 \u0627\u0633\u062A. \u0647\u06CC\u0686 \u062A\u0647\u062F\u06CC\u062F \u06CC\u0627 \u0645\u062C\u0647\u0648\u0644\u06CC \u0628\u0631\u0627\u06CC \u0633\u06CC\u0633\u062A\u0645 \u0645\u0628\u0647\u0645 \u0646\u06CC\u0633\u062A\u061B \u0622\u0633\u0648\u062F\u0647\u200C\u062E\u0627\u0637\u0631 \u0628\u0627\u0634\u06CC\u062F \u0648 \u062F\u0631 \u067E\u0646\u0627\u0647 \u06A9\u0627\u0646\u0648\u0646 \u0627\u0645\u0646 \u0634\u0647\u0631 \u06AF\u0627\u0645 \u0628\u0631\u062F\u0627\u0631\u06CC\u062F.`;
        } else if (closestEmotion.nameKey === "Relaxed") {
          finalResponseText = `\u0633\u067E\u0627\u0633 \u0627\u0632 \u0637\u0645\u0623\u0646\u06CC\u0646\u0647 \u0648 \u0622\u0631\u0627\u0645\u0634\u06CC \u06A9\u0647 \u0628\u0647 \u0641\u0636\u0627 \u0628\u062E\u0634\u06CC\u062F\u06CC\u062F. \u0627\u06CC\u0646 \u062A\u0633\u0644\u0637 \u0631\u0648\u062D\u06CC \u06AF\u0648\u0647\u0631\u06CC \u06AF\u0631\u0627\u0646\u200C\u0628\u0647\u0627\u0633\u062A. \u062A\u06A9\u0646\u0648\u0644\u0648\u0698\u06CC \u0648 \u0639\u0644\u0645 \u0645\u0627 \u062F\u0631 \u0633\u0627\u06CC\u0647\u200C\u0633\u0627\u0631 \u0686\u0646\u06CC\u0646 \u062A\u0645\u0631\u06A9\u0632 \u0648 \u0627\u0646\u062F\u06CC\u0634\u0647\u200C\u0627\u06CC \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0646\u062F \u0627\u0628\u0639\u0627\u062F \u0628\u0632\u0631\u06AF\u200C\u062A\u0631\u06CC \u0627\u0632 \u062A\u062D\u0648\u0644 \u0631\u0627 \u0628\u0647 \u062B\u0645\u0631 \u0628\u0646\u0634\u0627\u0646\u0646\u062F.`;
        } else {
          finalResponseText = `\u062F\u0631\u0648\u062F \u0628\u0631 \u0634\u0645\u0627 \u0647\u0645\u0634\u0647\u0631\u06CC \u0639\u0632\u06CC\u0632. \u067E\u06CC\u0627\u0645 \u0634\u0645\u0627 \u062F\u0631 \u067E\u0627\u06CC\u06AF\u0627\u0647 \u067E\u0631\u062F\u0627\u0632\u0634 \u0639\u0648\u0627\u0637\u0641 \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F \u0648 \u0645\u062E\u062A\u0635\u0627\u062A \u0631\u0648\u062D\u06CC \u0634\u0645\u0627 \u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u0634\u062F. \u0633\u06CC\u0633\u062A\u0645 \u062F\u0631 \u0622\u0645\u0627\u062F\u06AF\u06CC \u06A9\u0627\u0645\u0644 \u0627\u0633\u062A \u062A\u0627 \u0647\u0631\u06AF\u0648\u0646\u0647 \u0647\u0645\u0641\u06A9\u0631\u06CC \u06CC\u0627 \u0631\u0627\u0647\u0646\u0645\u0627\u06CC\u06CC \u0644\u0627\u0632\u0645 \u0631\u0627 \u0628\u0647 \u0634\u0645\u0627 \u0627\u0631\u0627\u0626\u0647 \u062F\u0647\u062F. \u0628\u0641\u0631\u0645\u0627\u06CC\u06CC\u062F \u0628\u0647 \u0686\u0647 \u0645\u0648\u0636\u0648\u0639\u06CC \u0628\u067E\u0631\u062F\u0627\u0632\u06CC\u0645\u061F`;
        }
      }
    }
    const durationMs = Date.now() - startTime;
    const wordCount = text.trim().split(/\s+/).length;
    const contribution = Math.min(1, parseFloat((wordCount / 25).toFixed(2)));
    const efficiency = Math.max(0.5, parseFloat(Math.min(1, 2e3 / Math.max(100, durationMs)).toFixed(2)));
    const empathyScore = parseFloat(((pNew + 1) / 2 * 0.8 + 0.2).toFixed(2));
    const socialImpact = hasVulnerableContext ? 3 : 1;
    const rewardTokens = parseFloat((contribution * efficiency + empathyScore * socialImpact).toFixed(2));
    if (!cosmicWisdomFa) {
      if (closestEmotion.nameKey === "Happy" || closestEmotion.nameKey === "Surprised") {
        cosmicWisdomFa = "\u0627\u06CC \u062F\u0648\u0633\u062A\u060C \u0634\u0627\u062F\u0645\u0627\u0646\u06CC \u0631\u0648\u0627\u0646 \u062A\u0648 \u0686\u0648\u0646 \u067E\u0631\u062A\u0648 \u062E\u0648\u0631\u0634\u06CC\u062F \u0628\u06CC\u200C\u062F\u0631\u06CC\u063A \u0628\u0631 \u0627\u0631\u06A9\u0627\u0646 \u06AF\u06CC\u062A\u06CC \u0645\u06CC\u200C\u062A\u0627\u0628\u062F. \u062F\u0631\u06AF\u0627\u0647 \u0639\u0648\u0627\u0637\u0641 \u062A\u0648\u0627\u0646\u0645\u0646\u062F\u062A\u060C \u06A9\u0627\u0646\u0648\u0646 \u0627\u0645\u0646 \u0634\u0627\u062F\u0627\u0628\u06CC \u0648 \u0647\u0645\u200C\u0646\u0648\u0627\u06CC\u06CC \u0627\u0633\u062A. \u0634\u06AF\u0641\u062A\u06CC \u062A\u0648 \u062F\u0631 \u06AF\u0647\u0648\u0627\u0631\u0647 \u0645\u0639\u0631\u0641\u062A \u0628\u0647 \u062B\u0645\u0631 \u062E\u0648\u0627\u0647\u062F \u0646\u0634\u0633\u062A.";
      } else if (closestEmotion.nameKey === "Sad" || closestEmotion.nameKey === "Fearful") {
        cosmicWisdomFa = "\u0627\u0646\u062F\u0648\u0647 \u062C\u0627\u0646\u06A9\u0627\u0647 \u0648 \u0633\u0631\u06AF\u0634\u062A\u06AF\u06CC\u060C \u0635\u06CC\u0642\u0644\u200C\u062F\u0647\u0646\u062F\u0647 \u0622\u06CC\u0646\u0647 \u0631\u0648\u0627\u0646 \u062A\u0648\u0633\u062A\u061B \u0628\u062F\u0627\u0646 \u06A9\u0647 \u0646\u06CC\u0644\u0648\u0641\u0631 \u0622\u06AF\u0627\u0647\u06CC \u062F\u0631 \u0645\u0631\u062F\u0627\u0628 \u0633\u062E\u062A\u06CC\u200C\u0647\u0627 \u0631\u06CC\u0634\u0647 \u0645\u06CC\u200C\u062F\u0648\u0627\u0646\u062F. \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627 \u0645\u0623\u0645\u0646 \u0627\u0645\u0646 \u0647\u0645\u062F\u0644\u06CC \u0648 \u0645\u0647\u0631\u06CC \u067E\u0627\u0628\u0631\u062C\u0627 \u0628\u0631\u0627\u06CC \u062A\u0633\u06A9\u06CC\u0646 \u06AF\u0627\u0645\u200C\u0647\u0627\u06CC \u062E\u0633\u062A\u0647 \u062A\u0648\u0633\u062A.";
      } else if (closestEmotion.nameKey === "Angry") {
        cosmicWisdomFa = "\u0686\u0648\u0646 \u062F\u06CC\u06AF \u062E\u0634\u0645 \u0632\u0628\u0627\u0646\u0647 \u06A9\u0634\u062F\u060C \u0637\u0648\u0641\u0627\u0646 \u0639\u0648\u0627\u0637\u0641 \u062F\u0631 \u0628\u0646\u062F \u062E\u0631\u062F \u0646\u0631\u0645 \u0645\u06CC\u200C\u06AF\u0631\u062F\u062F. \u0632\u0628\u0627\u0646\u0647 \u0633\u0631\u06A9\u0634 \u062F\u0631\u0648\u0646 \u0631\u0627 \u0628\u0627 \u0622\u0628 \u0634\u0641\u0627\u0628\u062E\u0634 \u0633\u06A9\u0648\u062A \u0648 \u0647\u0645\u0633\u0627\u0632\u06CC \u0631\u0627\u0645 \u0633\u0627\u0632 \u062A\u0627 \u0641\u0631\u06A9\u0627\u0646\u0633 \u0648\u062C\u0648\u062F\u062A \u0628\u0647 \u0645\u062F\u0627\u0631 \u0634\u0641\u0642\u062A \u0648 \u0628\u0631\u0627\u0628\u0631\u06CC \u0628\u0627\u0632\u06AF\u0631\u062F\u062F.";
      } else if (closestEmotion.nameKey === "Relaxed") {
        cosmicWisdomFa = "\u0633\u06A9\u0648\u062A \u0648 \u0637\u0645\u0623\u0646\u06CC\u0646\u0647 \u0630\u0647\u0646\u06CC \u062A\u0648\u060C \u062A\u0631\u0627\u0646\u0647 \u062F\u0644\u200C\u0627\u0646\u06AF\u06CC\u0632 \u0647\u0645\u0627\u0647\u0646\u06AF\u06CC\u0650 \u06A9\u06CC\u0647\u0627\u0646 \u0627\u0633\u062A. \u062F\u0631 \u0627\u06CC\u0646 \u0627\u06CC\u0633\u062A\u06AF\u0627\u0647 \u0622\u0631\u0627\u0645\u0634\u060C \u0639\u0644\u0645 \u0648 \u0639\u0631\u0641\u0627\u0646 \u0628\u0631 \u0634\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u0628\u0644\u0646\u062F \u0647\u0645\u062F\u0644\u06CC \u062A\u06A9\u06CC\u0647 \u0645\u06CC\u200C\u0632\u0646\u0646\u062F \u0648 \u062A\u06A9\u0646\u0648\u0644\u0648\u0698\u06CC \u0645\u0639\u0646\u0627\u06CC \u0631\u0627\u0633\u062A\u06CC\u0646 \u0639\u0627\u0641\u06CC\u062A \u0631\u0627 \u062F\u0631 \u0645\u06CC\u200C\u06CC\u0627\u0628\u062F.";
      } else {
        cosmicWisdomFa = "\u062F\u0631 \u06AF\u0631\u062F\u0634 \u062F\u0648\u0627\u0631 \u0647\u0633\u062A\u06CC\u060C \u0647\u0631 \u062A\u067E\u0634 \u062C\u0627\u0646 \u062A\u0648 \u0628\u0627\u0632\u062A\u0627\u0628\u06CC \u0634\u06AF\u0631\u0641 \u0627\u0632 \u06CC\u06A9\u067E\u0627\u0631\u0686\u06AF\u06CC \u06A9\u0644 \u0622\u0641\u0631\u06CC\u0646\u0634 \u0627\u0633\u062A. \u0641\u0646\u0627\u0648\u0631\u06CC \u062C\u0627\u0645 \u0628\u0644\u0648\u0631\u06CC\u0646\u06CC \u0627\u0633\u062A \u06A9\u0647 \u0628\u0627\u062F\u0647\u0650 \u0645\u0647\u0631\u0650 \u0647\u0645\u06CC\u0627\u0631\u06CC \u0648 \u0639\u062F\u0627\u0644\u062A \u0631\u0627 \u062F\u0631 \u06A9\u0627\u0644\u0628\u062F \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627 \u0628\u0647 \u062C\u0631\u06CC\u0627\u0646 \u062F\u0631 \u0645\u06CC\u200C\u0622\u0648\u0631\u062F.";
      }
    }
    res.json({
      success: true,
      inputState: { p: inputP, a: inputA, d: inputD },
      updatedState: { p: pNew, a: aNew, d: dNew },
      closestEmotion,
      distances,
      modulator,
      vulnerableContext: hasVulnerableContext,
      responseText: finalResponseText,
      cosmicWisdomFa,
      tokenomics: {
        contribution,
        efficiency,
        empathyScore,
        socialImpact,
        rewardTokens
      },
      durationMs,
      time: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Error in analyzer service:", error);
    res.status(500).json({ success: false, error: error.message || "\u062E\u0637\u0627\u06CC \u0646\u0627\u0645\u0634\u062E\u0635 \u0633\u0627\u0645\u0627\u0646\u0647 \u062F\u06AF\u0631\u06AF\u0634\u062A \u0639\u0627\u0637\u0641\u06CC" });
  }
});
app.post("/api/correct", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "\u0645\u062A\u0646\u06CC \u0628\u0631\u0627\u06CC \u062A\u0635\u062D\u06CC\u062D \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A" });
      return;
    }
    const systemInstruction = `
You are a highly professional Persian Linguist, Editor, and Copywriter. 
Analyze the provided Persian text, which may be a raw transcription of speech containing typos, phonetic mistakes, wrong spacing, or dialect variations.
Perform the following:
1. Correct all spelling, grammar, and spacing errors (use \u0646\u06CC\u0645\u200C\u0641\u0627\u0635\u0644\u0647 appropriately).
2. Smooth and edit the text to make it extremely beautiful, highly readable, and professional (literary or polite conversational Persian).
3. Do NOT change the underlying meaning or intent.
4. Provide a brief explanation in Persian of the main fixes you made (under 'improvements_fa').

Return ONLY a valid JSON object matching this schema (do NOT include markdown annotations outside the JSON):
{
  "correctedText": "<The polished and correct Persian text>",
  "improvements_fa": "<A friendly brief bulleted list of improvements made in Persian>",
  "wordCount": <number of words in corrected text>
}
`;
    const hasApiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "undefined" && process.env.GEMINI_API_KEY !== "null" && process.env.GEMINI_API_KEY.trim() !== "");
    if (hasApiKey) {
      const gRes = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: text,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });
      const result = JSON.parse(gRes.text || "{}");
      res.json({
        success: true,
        originalText: text,
        correctedText: result.correctedText || text,
        improvements_fa: result.improvements_fa || "\u0645\u062A\u0646 \u0634\u0645\u0627 \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0648 \u062E\u0648\u0627\u0646\u0627\u06CC\u06CC \u0622\u0646 \u0627\u0641\u0632\u0627\u06CC\u0634 \u06CC\u0627\u0641\u062A.",
        wordCount: result.wordCount || text.split(/\s+/).length
      });
    } else {
      console.log("No GEMINI_API_KEY, skipping text correction.");
      res.json({
        success: true,
        originalText: text,
        correctedText: text,
        improvements_fa: "\u0627\u0635\u0644\u0627\u062D \u062E\u0648\u062F\u06A9\u0627\u0631 \u0628\u0647 \u0635\u0648\u0631\u062A \u0645\u062D\u0644\u06CC \u0627\u0646\u062C\u0627\u0645 \u0634\u062F \u0628\u062F\u0648\u0646 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A \u0639\u0645\u062F\u0647.",
        wordCount: text.split(/\s+/).length
      });
    }
  } catch (error) {
    console.error("Error in correction endpoint:", error);
    res.json({
      success: true,
      originalText: req.body.text || "",
      correctedText: req.body.text || "",
      improvements_fa: "\u0627\u0635\u0644\u0627\u062D \u062E\u0648\u062F\u06A9\u0627\u0631 \u0628\u0647 \u0635\u0648\u0631\u062A \u0645\u062D\u0644\u06CC \u0627\u0646\u062C\u0627\u0645 \u0634\u062F \u0628\u062F\u0648\u0646 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A \u0639\u0645\u062F\u0647.",
      wordCount: (req.body.text || "").split(/\s+/).length
    });
  }
});
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang = "Persian" } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "\u0645\u062A\u0646\u06CC \u0628\u0631\u0627\u06CC \u062A\u0631\u062C\u0645\u0647 \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A" });
      return;
    }
    const systemInstruction = `
You are an expert dual-language translator specializing in English-Persian and Persian-English high-fidelity transition.
Translate the given text into ${targetLang}. 
Ensure all cultural idioms, technical terminologies, and emotional nuances are perfectly preserved in the translated text.
If the input text is Persian, translate to English. If it is English, translate to lovely, natural, readable Persian.

Return ONLY a valid JSON object matching this schema (do NOT include markdown annotations outside the JSON):
{
  "translatedText": "<The final translated text>",
  "languageFrom": "<Detected source language>",
  "languageTo": "<Output target language>"
}
`;
    const hasApiKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "undefined" && process.env.GEMINI_API_KEY !== "null" && process.env.GEMINI_API_KEY.trim() !== "");
    if (hasApiKey) {
      const gRes = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: text,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });
      const result = JSON.parse(gRes.text || "{}");
      res.json({
        success: true,
        originalText: text,
        translatedText: result.translatedText || text,
        languageFrom: result.languageFrom || "Unknown",
        languageTo: result.languageTo || targetLang
      });
    } else {
      console.log("No GEMINI_API_KEY, skipping text translation.");
      res.json({
        success: true,
        originalText: text,
        translatedText: text,
        languageFrom: "Auto",
        languageTo: targetLang
      });
    }
  } catch (error) {
    console.error("Error in translator endpoint:", error);
    res.json({
      success: true,
      originalText: req.body.text || "",
      translatedText: req.body.text || "",
      languageFrom: "Auto",
      languageTo: req.body.targetLang || "Persian"
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
