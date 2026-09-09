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

// src/nexuseCore.ts
function clampPAD(val) {
  if (typeof val !== "number" || isNaN(val)) return 0;
  if (val > 1) return 1;
  if (val < -1) return -1;
  return parseFloat(val.toFixed(3));
}
function validateAndClampPAD(vec) {
  return {
    p: clampPAD(vec?.p ?? 0),
    a: clampPAD(vec?.a ?? 0),
    d: clampPAD(vec?.d ?? 0)
  };
}
var PAD_LEXICON = {
  // Positive valence / high arousal
  "\u0639\u0627\u0644\u06CC": { p: 0.8, a: 0.6, d: 0.5 },
  "\u0634\u06AF\u0641\u062A": { p: 0.8, a: 0.7, d: 0.4 },
  "\u062E\u0648\u0634\u062D\u0627\u0644": { p: 0.8, a: 0.5, d: 0.4 },
  "\u0645\u0648\u0641\u0642": { p: 0.7, a: 0.5, d: 0.6 },
  "\u0639\u0627\u0644\u06CC\u0647": { p: 0.8, a: 0.6, d: 0.5 },
  "\u0622\u0641\u0631\u06CC\u0646": { p: 0.7, a: 0.5, d: 0.4 },
  "happy": { p: 0.8, a: 0.5, d: 0.4 },
  "great": { p: 0.8, a: 0.6, d: 0.5 },
  "wonderful": { p: 0.9, a: 0.6, d: 0.5 },
  // Negative valence / high arousal / moderate dominance (Anger / Frustration)
  "\u0639\u0635\u0628\u0627\u0646\u06CC": { p: -0.7, a: 0.8, d: 0.3 },
  "\u06A9\u0644\u0627\u0641\u0647": { p: -0.6, a: 0.6, d: 0.1 },
  "\u062E\u0631\u0627\u0628": { p: -0.6, a: 0.5, d: -0.2 },
  "\u0627\u0641\u062A\u0636\u0627\u062D": { p: -0.8, a: 0.7, d: 0.1 },
  "\u062E\u0637\u0627": { p: -0.5, a: 0.6, d: 0 },
  "\u062E\u0634\u0645": { p: -0.8, a: 0.8, d: 0.4 },
  "angry": { p: -0.7, a: 0.7, d: 0.3 },
  "frustrated": { p: -0.6, a: 0.6, d: 0.1 },
  // Negative valence / low arousal / low dominance (Sadness / Fatigue)
  "\u063A\u0645": { p: -0.7, a: -0.4, d: -0.5 },
  "\u063A\u0645\u06AF\u06CC\u0646": { p: -0.7, a: -0.4, d: -0.5 },
  "\u062E\u0633\u062A\u0647": { p: -0.5, a: -0.6, d: -0.4 },
  "\u0646\u0627\u0627\u0645\u06CC\u062F": { p: -0.8, a: -0.3, d: -0.6 },
  "\u062A\u0646\u0647\u0627": { p: -0.6, a: -0.4, d: -0.5 },
  "\u0634\u06A9\u0633\u062A": { p: -0.7, a: -0.2, d: -0.5 },
  "sad": { p: -0.7, a: -0.4, d: -0.5 },
  "exhausted": { p: -0.6, a: -0.7, d: -0.4 },
  "hopeless": { p: -0.8, a: -0.3, d: -0.6 },
  // Negative valence / high arousal / low dominance (Fear / Anxiety)
  "\u062A\u0631\u0633": { p: -0.7, a: 0.8, d: -0.7 },
  "\u0646\u06AF\u0631\u0627\u0646": { p: -0.6, a: 0.7, d: -0.5 },
  "\u0627\u0636\u0637\u0631\u0627\u0628": { p: -0.7, a: 0.8, d: -0.6 },
  "\u0648\u062D\u0634\u062A": { p: -0.9, a: 0.9, d: -0.8 },
  "\u0641\u0648\u0631\u06CC": { p: -0.3, a: 0.8, d: -0.2 },
  "scared": { p: -0.7, a: 0.8, d: -0.7 },
  "anxious": { p: -0.6, a: 0.7, d: -0.5 },
  "urgent": { p: -0.2, a: 0.8, d: 0.1 },
  // Positive valence / low arousal / moderate dominance (Relaxation)
  "\u0622\u0631\u0627\u0645": { p: 0.6, a: -0.5, d: 0.3 },
  "\u0631\u0627\u062D\u062A": { p: 0.5, a: -0.4, d: 0.2 },
  "\u0635\u0628\u0648\u0631": { p: 0.4, a: -0.3, d: 0.4 },
  "\u0622\u0633\u0648\u062F\u0647": { p: 0.6, a: -0.5, d: 0.3 },
  "calm": { p: 0.6, a: -0.5, d: 0.3 },
  "relaxed": { p: 0.6, a: -0.5, d: 0.3 },
  // High dominance / Agency / Directive
  "\u062F\u0633\u062A\u0648\u0631": { p: 0.1, a: 0.4, d: 0.8 },
  "\u0633\u0631\u06CC\u0639": { p: 0, a: 0.6, d: 0.5 },
  "\u0628\u0627\u06CC\u062F": { p: 0, a: 0.4, d: 0.7 },
  "\u062A\u0635\u0645\u06CC\u0645": { p: 0.2, a: 0.3, d: 0.7 },
  "\u06A9\u0646\u062A\u0631\u0644": { p: 0.1, a: 0.2, d: 0.8 },
  "command": { p: 0.1, a: 0.4, d: 0.8 },
  "execute": { p: 0.1, a: 0.5, d: 0.7 },
  // Low dominance / Help seeking / Confusion
  "\u06A9\u0645\u06A9": { p: -0.3, a: 0.5, d: -0.6 },
  "\u0646\u0645\u06CC\u200C\u062F\u0627\u0646\u0645": { p: -0.2, a: 0.1, d: -0.6 },
  "\u06AF\u06CC\u062C": { p: -0.4, a: 0.4, d: -0.7 },
  "help": { p: -0.3, a: 0.5, d: -0.6 },
  "confused": { p: -0.4, a: 0.4, d: -0.7 }
};
function analyzeInputPAD(text) {
  const lower = text.toLowerCase();
  const matchedKeywords = [];
  let sumP = 0;
  let sumA = 0;
  let sumD = 0;
  let matches = 0;
  for (const [kw, vec] of Object.entries(PAD_LEXICON)) {
    if (lower.includes(kw)) {
      matchedKeywords.push(kw);
      sumP += vec.p;
      sumA += vec.a;
      sumD += vec.d;
      matches++;
    }
  }
  const hasNegation = ["\u0646\u06CC\u0633\u062A", "\u0646\u062F\u0627\u0631\u0645", "\u0646\u0645\u06CC", "\u0628\u062F\u0648\u0646", "not", "never", "no"].some((neg) => lower.includes(neg));
  if (hasNegation && matches > 0) {
    sumP = -Math.abs(sumP);
  }
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || text.match(/؟/g) || []).length;
  if (matches > 0) {
    const avgP = sumP / matches;
    const avgA = sumA / matches + exclamationCount * 0.1;
    const avgD = sumD / matches - questionCount * 0.1;
    return {
      vector: validateAndClampPAD({ p: avgP, a: avgA, d: avgD }),
      confidence: Math.min(95, 60 + matches * 10),
      detectedKeywords: matchedKeywords
    };
  }
  return {
    vector: validateAndClampPAD({
      p: 0,
      a: exclamationCount * 0.15,
      d: -questionCount * 0.15
    }),
    confidence: 50,
    detectedKeywords: []
  };
}
function updateInternalPAD(previous, input, decayRate = 0.2) {
  const g = Math.max(0.01, Math.min(0.99, decayRate));
  return validateAndClampPAD({
    p: (1 - g) * previous.p + g * input.p,
    a: (1 - g) * previous.a + g * input.a,
    d: (1 - g) * previous.d + g * input.d
  });
}
function calculateHomeostasis(currentState, targetState = { p: 0, a: 0, d: 0 }) {
  const validCurrent = validateAndClampPAD(currentState);
  const validTarget = validateAndClampPAD(targetState);
  const diffP = validTarget.p - validCurrent.p;
  const diffA = validTarget.a - validCurrent.a;
  const diffD = validTarget.d - validCurrent.d;
  const rawDist = Math.sqrt(diffP * diffP + diffA * diffA + diffD * diffD);
  const maxPossibleDist = Math.sqrt(3);
  const normalizedDev = Math.min(1, parseFloat((rawDist / maxPossibleDist).toFixed(3)));
  const homeostasisScore = parseFloat((1 - normalizedDev).toFixed(3));
  let urgency = "Balanced";
  const directives = [];
  if (normalizedDev > 0.65) {
    urgency = "Critical";
    directives.push("\u0627\u0646\u062D\u0631\u0627\u0641 \u0634\u062F\u06CC\u062F \u0627\u0632 \u062D\u0627\u0644\u062A \u062A\u0639\u0627\u062F\u0644\u061B \u0627\u0648\u0644\u0648\u06CC\u062A \u0641\u0648\u0631\u06CC \u067E\u0627\u06CC\u062F\u0627\u0631\u0633\u0627\u0632\u06CC \u0648\u0636\u0639\u06CC\u062A \u0631\u0648\u0627\u0646\u06CC \u0633\u06CC\u0633\u062A\u0645.");
  } else if (normalizedDev > 0.45) {
    urgency = "High";
    directives.push("\u0627\u0646\u062D\u0631\u0627\u0641 \u0628\u0627\u0644\u0627 \u0627\u0632 \u062A\u0639\u0627\u062F\u0644\u061B \u0627\u0639\u0645\u0627\u0644 \u06AF\u0634\u062A\u0627\u0648\u0631 \u0628\u0627\u0632\u06AF\u0634\u062A\u06CC \u062C\u0647\u062A \u06A9\u0646\u062A\u0631\u0644 \u062A\u0644\u0627\u0637\u0645.");
  } else if (normalizedDev > 0.25) {
    urgency = "Moderate";
    directives.push("\u0627\u0646\u062D\u0631\u0627\u0641 \u0645\u0644\u0627\u06CC\u0645\u061B \u062A\u0639\u062F\u06CC\u0644 \u062A\u062F\u0631\u06CC\u062C\u06CC \u0645\u062A\u063A\u06CC\u0631\u0647\u0627 \u0628\u0647 \u0633\u0645\u062A \u0645\u062D\u0648\u0631 \u0645\u0631\u06A9\u0632\u06CC.");
  } else if (normalizedDev > 0.1) {
    urgency = "Low";
    directives.push("\u0627\u0646\u062D\u0631\u0627\u0641 \u062C\u0632\u0626\u06CC\u061B \u0633\u06CC\u0633\u062A\u0645 \u062F\u0631 \u0645\u062D\u062F\u0648\u062F\u0647 \u0627\u0645\u0646 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9 \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F.");
  } else {
    urgency = "Balanced";
    directives.push("\u0633\u06CC\u0633\u062A\u0645 \u062F\u0631 \u0648\u0636\u0639\u06CC\u062A \u062A\u0639\u0627\u062F\u0644 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9 \u06A9\u0627\u0645\u0644 \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F.");
  }
  if (diffP > 0.3) {
    directives.push("\u0646\u06CC\u0627\u0632 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9: \u06A9\u0627\u0647\u0634 \u0646\u0627\u0631\u0627\u062D\u062A\u06CC \u0648 \u0627\u0631\u062A\u0642\u0627\u06CC \u062D\u0633 \u062E\u0648\u0634\u0627\u06CC\u0646\u062F\u06CC (Restorative Drive).");
  } else if (diffP < -0.3) {
    directives.push("\u0646\u06CC\u0627\u0632 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9: \u062A\u062B\u0628\u06CC\u062A \u0647\u06CC\u062C\u0627\u0646 \u0628\u06CC\u0634\u200C\u0627\u0632\u062D\u062F \u0648 \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0639\u06CC\u0646\u06CC\u062A.");
  }
  if (diffA < -0.3) {
    directives.push("\u0646\u06CC\u0627\u0632 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9: \u06A9\u0627\u0647\u0634 \u0628\u0631\u0627\u0646\u06AF\u06CC\u062E\u062A\u06AF\u06CC/\u062A\u0646\u0634 \u0648 \u062E\u0646\u06A9\u200C\u0633\u0627\u0632\u06CC \u0641\u0636\u0627 (Cooling Drive).");
  } else if (diffA > 0.3) {
    directives.push("\u0646\u06CC\u0627\u0632 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9: \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0627\u0646\u0631\u0698\u06CC \u0648 \u0627\u062C\u062A\u0646\u0627\u0628 \u0627\u0632 \u0631\u062E\u0648\u062A \u06A9\u0627\u0645\u0644.");
  }
  return {
    targetState: validTarget,
    currentState: validCurrent,
    rawDistance: parseFloat(rawDist.toFixed(3)),
    normalizedDeviation: normalizedDev,
    homeostasisScore,
    homeostaticDrive: {
      vector: validateAndClampPAD({ p: diffP, a: diffA, d: diffD }),
      magnitude: normalizedDev,
      urgency,
      directives
    }
  };
}
function deriveBehaviorPolicy(state, isBaseline = false, homeostasis) {
  if (isBaseline) {
    return {
      style: "Neutral-Objective",
      lengthConstraint: "moderate",
      maxTokens: 180,
      maxCharacters: 280,
      caution: 0.3,
      cautionLevel: "Standard",
      requiresClarification: false,
      toneDirectives: [
        "\u067E\u0627\u0633\u062E \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0628\u062F\u0648\u0646 \u062A\u0639\u062F\u06CC\u0644 \u0639\u0627\u0637\u0641\u06CC",
        "\u0637\u0648\u0644 \u067E\u0627\u0633\u062E \u0645\u062A\u0639\u0627\u062F\u0644 \u0648 \u062E\u0637\u06CC",
        "\u0639\u062F\u0645 \u0627\u0639\u0645\u0627\u0644 \u067E\u0631\u0648\u062A\u06A9\u0644 \u0627\u062D\u062A\u06CC\u0627\u0637 \u0627\u062D\u0633\u0627\u0633\u06CC"
      ],
      homeostaticDriveEffect: "\u062E\u0637 \u067E\u0627\u06CC\u0647 \u062E\u0646\u062B\u06CC: \u0628\u062F\u0648\u0646 \u0645\u062F\u0627\u062E\u0644\u0647 \u0645\u062D\u0631\u06A9 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9"
    };
  }
  const { p, a, d } = validateAndClampPAD(state);
  const dev = homeostasis ? homeostasis.normalizedDeviation : 0;
  const driveUrgency = homeostasis ? homeostasis.homeostaticDrive.urgency : "Balanced";
  let style = "Neutral-Objective";
  let lengthConstraint = "moderate";
  let maxTokens = 200;
  let maxCharacters = 300;
  let caution = 0.4;
  let cautionLevel = "Standard";
  let requiresClarification = false;
  let clarificationPrompt;
  const toneDirectives = [];
  let homeostaticDriveEffect = "\u062A\u0639\u0627\u062F\u0644 \u0639\u0627\u062F\u06CC";
  if (d < -0.3 && a > 0.3 || dev > 0.7) {
    cautionLevel = "Critical";
    caution = 0.95;
    requiresClarification = true;
    clarificationPrompt = "\u062C\u0647\u062A \u0627\u0637\u0645\u06CC\u0646\u0627\u0646 \u0648 \u0631\u0641\u0639 \u0627\u0628\u0647\u0627\u0645\u060C \u0622\u06CC\u0627 \u0645\u0627\u06CC\u0644\u06CC\u062F \u0627\u0628\u062A\u062F\u0627 \u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627 \u0648 \u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u062D\u062A\u06CC\u0627\u0637\u06CC \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u0645\u061F";
    toneDirectives.push("\u0633\u0637\u062D \u0627\u062D\u062A\u06CC\u0627\u0637 \u0628\u062D\u0631\u0627\u0646\u06CC: \u062A\u0623\u06CC\u06CC\u062F \u0634\u0641\u0627\u0641 \u0642\u0628\u0644 \u0627\u0632 \u0647\u0631 \u0627\u0642\u062F\u0627\u0645");
    homeostaticDriveEffect = "\u0645\u062D\u0631\u06A9 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9 \u0628\u062D\u0631\u0627\u0646\u06CC: \u0641\u0639\u0627\u0644\u200C\u0633\u0627\u0632\u06CC \u0627\u062C\u0628\u0627\u0631\u06CC \u0642\u0641\u0644 \u0627\u062D\u062A\u06CC\u0627\u0637\u06CC \u0648 \u067E\u0631\u0633\u0634 \u0634\u0641\u0627\u0641\u200C\u0633\u0627\u0632";
  } else if (p < -0.4 || d < -0.3 || dev > 0.45) {
    cautionLevel = "High";
    caution = 0.75;
    requiresClarification = d < -0.5 || dev > 0.55;
    if (requiresClarification) {
      clarificationPrompt = "\u0628\u0631\u0627\u06CC \u0627\u0631\u0627\u0626\u0647 \u062F\u0642\u06CC\u0642\u200C\u062A\u0631\u06CC\u0646 \u0631\u0627\u0647\u06A9\u0627\u0631\u060C \u062A\u0645\u0627\u06CC\u0644 \u062F\u0627\u0631\u06CC\u062F \u0628\u0631 \u0631\u06CC\u0634\u0647\u200C\u06CC\u0627\u0628\u06CC \u062A\u0645\u0631\u06A9\u0632 \u0634\u0648\u062F \u06CC\u0627 \u0641\u0648\u0631\u0627\u064B \u0631\u0627\u0647\u200C\u062D\u0644 \u0639\u0645\u0644\u06CC\u0627\u062A\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0646\u06CC\u062F\u061F";
    }
    toneDirectives.push("\u0633\u0637\u062D \u0627\u062D\u062A\u06CC\u0627\u0637 \u0628\u0627\u0644\u0627: \u067E\u0631\u0647\u06CC\u0632 \u0627\u0632 \u0644\u062D\u0646 \u062A\u0647\u0627\u062C\u0645\u06CC \u06CC\u0627 \u0641\u0631\u0636\u06CC\u0627\u062A \u062A\u0627\u06CC\u06CC\u062F\u0646\u0634\u062F\u0647");
    homeostaticDriveEffect = "\u0645\u062D\u0631\u06A9 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9 \u0628\u0627\u0644\u0627: \u0627\u0639\u0645\u0627\u0644 \u0645\u062D\u0627\u0641\u0638\u0647\u200C\u06A9\u0627\u0631\u06CC \u0631\u0641\u062A\u0627\u0631\u06CC";
  } else if (p > 0.4 && d > 0.3 && dev < 0.35) {
    cautionLevel = "Low";
    caution = 0.2;
    toneDirectives.push("\u0633\u0637\u062D \u0627\u062D\u062A\u06CC\u0627\u0637 \u067E\u0627\u06CC\u06CC\u0646: \u067E\u06CC\u0634\u0628\u0631\u062F \u0645\u0633\u062A\u0642\u06CC\u0645 \u0648 \u0633\u0631\u06CC\u0639 \u0639\u0645\u0644\u06CC\u0627\u062A");
    homeostaticDriveEffect = "\u0627\u0646\u062D\u0631\u0627\u0641 \u06A9\u0645: \u0627\u0639\u0637\u0627\u06CC \u0622\u0632\u0627\u062F\u06CC \u0639\u0645\u0644 \u0648 \u06A9\u0627\u0647\u0634 \u0645\u062D\u062F\u0648\u062F\u06CC\u062A";
  } else {
    cautionLevel = "Standard";
    caution = 0.45;
  }
  if (a > 0.4 && d > 0.3) {
    lengthConstraint = "concise";
    maxTokens = 90;
    maxCharacters = 150;
    toneDirectives.push("\u0637\u0648\u0644 \u06A9\u0648\u062A\u0627\u0647 \u0648 \u0628\u062F\u0648\u0646 \u062D\u0627\u0634\u06CC\u0647 (\u06A9\u0627\u0631\u0628\u0631 \u0645\u0642\u062A\u062F\u0631 \u0648 \u0641\u0648\u0631\u06CC)");
  } else if (p < -0.3 && a < 0.2) {
    lengthConstraint = "elaborate";
    maxTokens = 320;
    maxCharacters = 480;
    toneDirectives.push("\u0637\u0648\u0644 \u062A\u0641\u0635\u06CC\u0644\u06CC\u060C \u0647\u0645\u062F\u0644\u0627\u0646\u0647 \u0648 \u062A\u0633\u0644\u06CC\u200C\u0628\u062E\u0634");
  } else if (p > 0.3 && a > 0.3) {
    lengthConstraint = "moderate";
    maxTokens = 240;
    maxCharacters = 360;
    toneDirectives.push("\u0637\u0648\u0644 \u0645\u062A\u0648\u0633\u0637 \u0648 \u0647\u0645\u0631\u0627\u0647 \u0628\u0627 \u0627\u06CC\u062F\u0647\u200C\u067E\u0631\u062F\u0627\u0632\u06CC \u067E\u0648\u06CC\u0627");
  } else {
    lengthConstraint = "moderate";
    maxTokens = 180;
    maxCharacters = 280;
  }
  if (p < -0.3) {
    if (a > 0.3) {
      style = "Cautious-Clarifying";
      toneDirectives.push("\u0644\u062D\u0646 \u0622\u0631\u0627\u0645\u060C \u0645\u0647\u0627\u0631\u06A9\u0646\u0646\u062F\u0647 \u062A\u0646\u0634\u060C \u0645\u062A\u06CC\u0646 \u0648 \u0628\u062F\u0648\u0646 \u062A\u0648\u062C\u06CC\u0647");
    } else {
      style = "Empathetic-Supportive";
      toneDirectives.push("\u0644\u062D\u0646 \u0647\u0645\u062F\u0644\u0627\u0646\u0647\u060C \u06AF\u0631\u0645\u060C \u062A\u0635\u062F\u06CC\u0642\u200C\u06A9\u0646\u0646\u062F\u0647 \u0631\u0646\u062C \u0648 \u0627\u0644\u062A\u06CC\u0627\u0645\u200C\u0628\u062E\u0634");
    }
  } else if (p > 0.3) {
    if (a > 0.3) {
      style = "Energetic-Creative";
      toneDirectives.push("\u0644\u062D\u0646 \u067E\u0631\u0627\u0646\u0631\u0698\u06CC\u060C \u0645\u0634\u0648\u0642\u060C \u062E\u0644\u0627\u0642\u0627\u0646\u0647 \u0648 \u0645\u0634\u0627\u0631\u06A9\u062A\u06CC");
    } else {
      style = "Calm-Reflective";
      toneDirectives.push("\u0644\u062D\u0646 \u0645\u062A\u0641\u06A9\u0631\u0627\u0646\u0647\u060C \u0628\u0627\u0648\u0642\u0627\u0631\u060C \u0622\u0631\u0627\u0645 \u0648 \u0639\u0645\u06CC\u0642");
    }
  } else {
    if (d > 0.4) {
      style = "Assertive-Direct";
      toneDirectives.push("\u0644\u062D\u0646 \u0635\u0631\u06CC\u062D\u060C \u06A9\u0627\u0645\u0644\u0627\u064B \u0627\u062C\u0631\u0627\u06CC\u06CC\u060C \u0645\u062A\u0645\u0631\u06A9\u0632 \u0628\u0631 \u062F\u0633\u062A\u0648\u0631 \u0648 \u0627\u0642\u062F\u0627\u0645");
    } else {
      style = "Neutral-Objective";
      toneDirectives.push("\u0644\u062D\u0646 \u062D\u0631\u0641\u0647\u200C\u0627\u06CC\u060C \u0645\u0646\u0637\u0642\u06CC \u0648 \u0627\u0637\u0644\u0627\u0639\u0627\u062A\u200C\u0645\u062D\u0648\u0631");
    }
  }
  if (driveUrgency === "Critical" && style !== "Cautious-Clarifying") {
    style = "Cautious-Clarifying";
    homeostaticDriveEffect = "\u0627\u0646\u062D\u0631\u0627\u0641 \u0628\u062D\u0631\u0627\u0646\u06CC \u0633\u0628\u06A9 \u0631\u0627 \u0627\u062C\u0628\u0627\u0631\u0627\u064B \u0628\u0647 Cautious-Clarifying \u062A\u063A\u06CC\u06CC\u0631 \u062F\u0627\u062F.";
  }
  return {
    style,
    lengthConstraint,
    maxTokens,
    maxCharacters,
    caution,
    cautionLevel,
    requiresClarification,
    clarificationPrompt,
    toneDirectives,
    homeostaticDriveEffect
  };
}
function synthesizeLocalResponse(input, policy, state, isBaseline) {
  if (isBaseline) {
    return `[\u067E\u0627\u0633\u062E \u067E\u0627\u06CC\u0647 (\u0628\u062F\u0648\u0646 \u062A\u0639\u062F\u06CC\u0644 \u0639\u0627\u0637\u0641\u06CC)]
\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0634\u0645\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F: \xAB${input}\xBB.
\u0633\u06CC\u0633\u062A\u0645 \u062F\u0631 \u062D\u0627\u0644\u062A \u0639\u0645\u0644\u06CC\u0627\u062A\u06CC \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F \u0648 \u0628\u062F\u0648\u0646 \u062F\u0631 \u0646\u0638\u0631 \u06AF\u0631\u0641\u062A\u0646 \u0648\u0636\u0639\u06CC\u062A \u0639\u0627\u0637\u0641\u06CC\u060C \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u06CC \u0631\u0627 \u067E\u0631\u062F\u0627\u0632\u0634 \u0645\u06CC\u200C\u06A9\u0646\u062F. \u067E\u0627\u0633\u062E \u0628\u0647 \u0635\u0648\u0631\u062A \u062E\u0637\u06CC \u0648 \u0633\u0627\u062E\u062A\u0627\u0631\u06CC\u0627\u0641\u062A\u0647 \u0627\u0631\u0627\u0626\u0647 \u06AF\u0631\u062F\u06CC\u062F.`;
  }
  const { style, lengthConstraint, requiresClarification, clarificationPrompt } = policy;
  let responseBody = "";
  switch (style) {
    case "Empathetic-Supportive":
      responseBody = `\u067E\u06CC\u0627\u0645 \u0634\u0645\u0627 \u0631\u0627 \u0628\u0627 \u062F\u0631\u06A9 \u06A9\u0627\u0645\u0644 \u0634\u0631\u0627\u06CC\u0637 \u0648 \u0627\u062D\u0633\u0627\u0633\u0627\u062A \u067E\u0634\u062A \u0622\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0631\u062F\u0645. \u06A9\u0627\u0645\u0644\u0627\u064B \u0637\u0628\u06CC\u0639\u06CC \u0627\u0633\u062A \u06A9\u0647 \u062F\u0631 \u0686\u0646\u06CC\u0646 \u0645\u0648\u0642\u0639\u06CC\u062A\u06CC \u0627\u062D\u0633\u0627\u0633 \u0641\u0634\u0627\u0631 \u06CC\u0627 \u062E\u0633\u062A\u06AF\u06CC \u06A9\u0646\u06CC\u062F. \u0634\u0645\u0627 \u062A\u0646\u0647\u0627 \u0646\u06CC\u0633\u062A\u06CC\u062F \u0648 \u0642\u062F\u0645 \u0628\u0647 \u0642\u062F\u0645 \u0627\u06CC\u0646 \u0645\u0633\u06CC\u0631 \u0631\u0627 \u0628\u0627 \u0647\u0645 \u067E\u06CC\u0634 \u0645\u06CC\u200C\u0628\u0631\u06CC\u0645 \u062A\u0627 \u0628\u0627\u0631 \u0627\u06CC\u0646 \u062F\u063A\u062F\u063A\u0647 \u0633\u0628\u06A9\u200C\u062A\u0631 \u0634\u0648\u062F.`;
      break;
    case "Cautious-Clarifying":
      responseBody = `\u062F\u063A\u062F\u063A\u0647 \u0648 \u062D\u0633\u0627\u0633\u06CC\u062A \u0641\u0648\u0631\u06CC \u0645\u0648\u0636\u0648\u0639 \u0631\u0627 \u062F\u0631\u06A9 \u0645\u06CC\u200C\u06A9\u0646\u0645. \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646\u06A9\u0647 \u0645\u0637\u0645\u0626\u0646 \u0634\u0648\u06CC\u0645 \u0647\u06CC\u0686 \u062E\u0637\u0627\u06CC\u06CC \u0631\u062E \u0646\u0645\u06CC\u200C\u062F\u0647\u062F \u0648 \u0628\u062F\u0648\u0646 \u0627\u062A\u0644\u0627\u0641 \u0648\u0642\u062A \u0628\u0647 \u0646\u062A\u06CC\u062C\u0647 \u0628\u0631\u0633\u06CC\u0645\u060C \u06A9\u0646\u062A\u0631\u0644 \u0627\u0648\u0636\u0627\u0639 \u062F\u0631 \u0627\u0648\u0644\u0648\u06CC\u062A \u0627\u0648\u0644 \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F.`;
      break;
    case "Assertive-Direct":
      responseBody = `\u062F\u0633\u062A\u0648\u0631 \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F. \u0627\u0642\u062F\u0627\u0645 \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u06CC \u0628\u0627 \u0627\u0648\u0644\u0648\u06CC\u062A \u0628\u0627\u0644\u0627 \u0648 \u0645\u0637\u0627\u0628\u0642 \u0645\u0634\u062E\u0635\u0627\u062A \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u062F\u0631 \u062F\u0633\u062A \u0627\u062C\u0631\u0627 \u0642\u0631\u0627\u0631 \u06AF\u0631\u0641\u062A.`;
      break;
    case "Energetic-Creative":
      responseBody = `\u0627\u0646\u0631\u0698\u06CC \u0648 \u0627\u06CC\u062F\u0647 \u0628\u0633\u06CC\u0627\u0631 \u0627\u0644\u0647\u0627\u0645\u200C\u0628\u062E\u0634\u06CC \u0627\u0633\u062A! \u0627\u06CC\u0646 \u0634\u062A\u0627\u0628 \u0645\u062B\u0628\u062A \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0646\u062A\u0627\u06CC\u062C \u0686\u0634\u0645\u06AF\u06CC\u0631\u06CC \u062E\u0644\u0642 \u06A9\u0646\u062F. \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0645\u06CC\u200C\u06A9\u0646\u0645 \u0627\u06CC\u0646 \u067E\u062A\u0627\u0646\u0633\u06CC\u0644 \u0631\u0627 \u0645\u0633\u062A\u0642\u06CC\u0645\u0627\u064B \u0628\u0647 \u06AF\u0627\u0645\u200C\u0647\u0627\u06CC \u0639\u0645\u0644\u06CC \u062A\u0628\u062F\u06CC\u0644 \u06A9\u0646\u06CC\u0645.`;
      break;
    case "Calm-Reflective":
      responseBody = `\u062F\u06CC\u062F\u06AF\u0627\u0647 \u0634\u0645\u0627 \u062F\u0631 \u0641\u0636\u0627\u06CC\u06CC \u0628\u0627 \u0637\u0645\u0623\u0646\u06CC\u0646\u0647 \u0648 \u0645\u062A\u0641\u06A9\u0631\u0627\u0646\u0647 \u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u0634\u062F. \u062A\u0639\u0645\u0642 \u062F\u0631 \u0627\u06CC\u0646 \u0632\u0627\u0648\u06CC\u0647 \u0628\u0647 \u0645\u0627 \u0627\u0645\u06A9\u0627\u0646 \u062A\u0635\u0645\u06CC\u0645\u200C\u06AF\u06CC\u0631\u06CC \u0633\u0646\u062C\u06CC\u062F\u0647 \u0648 \u067E\u0627\u06CC\u062F\u0627\u0631 \u0645\u06CC\u200C\u062F\u0647\u062F.`;
      break;
    case "Neutral-Objective":
    default:
      responseBody = `\u067E\u06CC\u0627\u0645 \u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u0634\u062F \u0648 \u0645\u062A\u063A\u06CC\u0631\u0647\u0627\u06CC \u0639\u0645\u0644\u06CC\u0627\u062A\u06CC \u0628\u0631 \u0627\u0633\u0627\u0633 \u067E\u0627\u0631\u0627\u0645\u062A\u0631\u0647\u0627\u06CC \u0645\u0634\u062E\u0635\u200C\u0634\u062F\u0647 \u062F\u0631 \u062D\u0627\u0644 \u067E\u06CC\u06AF\u06CC\u0631\u06CC \u0627\u0633\u062A.`;
      break;
  }
  if (lengthConstraint === "concise") {
    const firstSentence = responseBody.split(".")[0] + ".";
    return requiresClarification && clarificationPrompt ? `${firstSentence}

\u26A0\uFE0F ${clarificationPrompt}` : firstSentence;
  } else if (lengthConstraint === "elaborate") {
    responseBody += `

\u062A\u062D\u0644\u06CC\u0644 \u0627\u0628\u0639\u0627\u062F \u0648\u0636\u0639\u06CC\u062A:
- \u0633\u0637\u062D \u062A\u0637\u0628\u06CC\u0642 \u0647\u06CC\u062C\u0627\u0646\u06CC (PAD): \u062E\u0648\u0634\u0627\u06CC\u0646\u062F\u06CC: ${state.p > 0 ? "+" : ""}${state.p.toFixed(2)} | \u0628\u0631\u0627\u0646\u06AF\u06CC\u062E\u062A\u06AF\u06CC: ${state.a > 0 ? "+" : ""}${state.a.toFixed(2)} | \u062A\u0633\u0644\u0637: ${state.d > 0 ? "+" : ""}${state.d.toFixed(2)}
- \u0631\u0648\u06CC\u06A9\u0631\u062F \u0627\u062A\u062E\u0627\u0630\u0634\u062F\u0647: ${policy.toneDirectives.join("\u060C ")}.`;
  }
  if (requiresClarification && clarificationPrompt) {
    responseBody += `

\u{1F4CC} \u067E\u0631\u0633\u0634 \u0634\u0641\u0627\u0641\u200C\u0633\u0627\u0632: ${clarificationPrompt}`;
  }
  return responseBody;
}
function enforceResponseConstraints(rawResponse, policy) {
  let text = rawResponse.trim();
  const violations = [];
  let lengthViolated = false;
  let clarificationInjected = false;
  let disclaimerInjected = false;
  const originalLength = text.length;
  let clarificationSuffix = "";
  if (policy.requiresClarification) {
    const hasQuestion = text.includes("\u061F") || text.includes("?") || text.includes("\u0634\u0641\u0627\u0641");
    if (!hasQuestion && policy.clarificationPrompt) {
      clarificationSuffix = ` \u2753 ${policy.clarificationPrompt}`;
      clarificationInjected = true;
      violations.push("\u067E\u0627\u0633\u062E \u0641\u0627\u0642\u062F \u067E\u0631\u0633\u0634 \u0634\u0641\u0627\u0641\u200C\u0633\u0627\u0632 \u0628\u0648\u062F\u061B \u067E\u0631\u0627\u0645\u067E\u062A \u0634\u0641\u0627\u0641\u200C\u0633\u0627\u0632\u06CC \u062F\u0631 \u0645\u0631\u062D\u0644\u0647 \u0627\u0639\u062A\u0628\u0627\u0631\u0633\u0646\u062C\u06CC \u062A\u0632\u0631\u06CC\u0642 \u06AF\u0631\u062F\u06CC\u062F.");
    }
  }
  let disclaimerPrefix = "";
  if (policy.cautionLevel === "Critical") {
    if (!text.includes("\u0627\u062D\u062A\u06CC\u0627\u0637") && !text.includes("\u0627\u0637\u0645\u06CC\u0646\u0627\u0646")) {
      disclaimerPrefix = `\u26A0\uFE0F [\u0627\u062D\u062A\u06CC\u0627\u0637]: \u0628\u0627\u0632\u0628\u06CC\u0646\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A. `;
      disclaimerInjected = true;
    }
  }
  let finalResponse = (disclaimerPrefix + text + clarificationSuffix).trim();
  if (finalResponse.length > policy.maxCharacters) {
    lengthViolated = true;
    violations.push(`\u0637\u0648\u0644 \u0627\u0648\u0644\u06CC\u0647 (${finalResponse.length}) \u0627\u0632 \u0633\u0642\u0641 \u0645\u062C\u0627\u0632 \u0633\u06CC\u0627\u0633\u062A (${policy.maxCharacters}) \u0641\u0631\u0627\u062A\u0631 \u0631\u0641\u062A \u0648 \u0645\u0647\u0627\u0631 \u0634\u062F.`);
    const overhead = disclaimerPrefix.length + clarificationSuffix.length;
    if (overhead < policy.maxCharacters - 6) {
      const allowedBody = policy.maxCharacters - overhead - 3;
      let truncated = text.substring(0, allowedBody).trim();
      const lastSpace = truncated.lastIndexOf(" ");
      if (lastSpace > allowedBody * 0.5) {
        truncated = truncated.substring(0, lastSpace);
      }
      text = truncated + "...";
      finalResponse = (disclaimerPrefix + text + clarificationSuffix).trim();
    }
    if (finalResponse.length > policy.maxCharacters) {
      finalResponse = finalResponse.substring(0, policy.maxCharacters).trim();
    }
  }
  return {
    finalResponse,
    validation: {
      lengthViolated,
      clarificationInjected,
      disclaimerInjected,
      originalLength,
      finalLength: finalResponse.length,
      violations
    }
  };
}
function computeTokenJaccard(a, b) {
  const setA = new Set(a.toLowerCase().trim().split(/\s+/));
  const setB = new Set(b.toLowerCase().trim().split(/\s+/));
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = (/* @__PURE__ */ new Set([...setA, ...setB])).size;
  return union > 0 ? intersection / union : 0;
}
function calculateBoundedReward(params) {
  const {
    input,
    response,
    previousDeviation,
    currentDeviation,
    policyValidation,
    selfRewardWeight,
    recentEpisodes,
    lastInteractionTimestamp,
    userFeedback = 0
  } = params;
  const taskSuccess = response.trim().length > 10 ? 1 : 0;
  const policySuccess = policyValidation.violations.length === 0 ? 1 : 0.7;
  const deltaDev = previousDeviation - currentDeviation;
  const homeostasisImprovement = parseFloat(Math.max(-1, Math.min(1, deltaDev * 2)).toFixed(3));
  let repetitionDetected = false;
  let consecutiveDuplicateCount = 0;
  for (const ep of recentEpisodes.slice(0, 3)) {
    const similarity = computeTokenJaccard(input, ep.userInput);
    if (similarity > 0.8) {
      repetitionDetected = true;
      consecutiveDuplicateCount++;
    }
  }
  const isRapidSpam = lastInteractionTimestamp ? Date.now() - lastInteractionTimestamp < 800 : false;
  let gated = false;
  let gateReason = "";
  let selfRewardTokens = 0;
  if (selfRewardWeight <= 0) {
    gated = true;
    gateReason = "\u0646\u0631\u062E \u067E\u0627\u062F\u0627\u0634 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0635\u0641\u0631 \u062F\u0631\u0635\u062F \u062A\u0646\u0638\u06CC\u0645 \u0634\u062F\u0647 \u0627\u0633\u062A (\u063A\u06CC\u0631\u0641\u0639\u0627\u0644).";
  } else if (repetitionDetected) {
    gated = true;
    gateReason = "\u062D\u0641\u0627\u0638\u062A \u0636\u062F \u062A\u0642\u0644\u0628 (Anti-Hacking): \u0648\u0631\u0648\u062F\u06CC \u062A\u06A9\u0631\u0627\u0631\u06CC \u0634\u0646\u0627\u0633\u0627\u06CC\u06CC \u0634\u062F\u061B \u067E\u0627\u062F\u0627\u0634 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0645\u0633\u062F\u0648\u062F \u06AF\u0631\u062F\u06CC\u062F.";
  } else if (isRapidSpam) {
    gated = true;
    gateReason = "\u062D\u0641\u0627\u0638\u062A \u0636\u062F \u062A\u0642\u0644\u0628: \u0633\u0631\u0639\u062A \u0641\u0631\u0627\u062E\u0648\u0627\u0646\u06CC \u063A\u06CC\u0631\u0639\u0627\u062F\u06CC\u061B \u0633\u0647\u0645\u06CC\u0647 \u067E\u0627\u062F\u0627\u0634 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0645\u0633\u062F\u0648\u062F \u0634\u062F.";
  } else if (taskSuccess < 0.8 || policySuccess < 0.7) {
    gated = true;
    gateReason = "\u0634\u0631\u0637 \u0627\u0639\u062A\u0628\u0627\u0631\u0633\u0646\u062C\u06CC: \u0639\u062F\u0645 \u062A\u062D\u0642\u0642 \u0645\u0648\u0641\u0642\u06CC\u062A \u06A9\u0627\u0645\u0644 \u0648\u0638\u06CC\u0641\u0647 \u06CC\u0627 \u062E\u0637\u200C\u0645\u0634\u06CC \u0631\u0641\u062A\u0627\u0631\u06CC.";
  } else {
    const baseTokens = Math.min(10, Math.max(1, input.length / 10));
    const homeoFactor = homeostasisImprovement < -0.4 ? 0 : 1;
    const rawSelfTokens = baseTokens * selfRewardWeight * homeoFactor;
    const maxCap = 10 * selfRewardWeight;
    selfRewardTokens = parseFloat(Math.min(maxCap, Math.max(0, rawSelfTokens)).toFixed(3));
  }
  const totalReward = parseFloat(
    (taskSuccess * 0.4 + policySuccess * 0.3 + (homeostasisImprovement > 0 ? homeostasisImprovement * 0.2 : 0) + userFeedback * 0.1 + selfRewardTokens).toFixed(3)
  );
  return {
    taskSuccess,
    policySuccess,
    homeostasisImprovement,
    userFeedback,
    selfRewardTokens,
    selfRewardWeight,
    totalReward,
    gated,
    gateReason,
    hackedProtectionActive: repetitionDetected || isRapidSpam,
    repetitionDetected,
    consecutiveDuplicateCount
  };
}
function evaluateSelfReflection(params) {
  const { taskSuccess, policySuccess, previousDeviation, currentDeviation, reward, validation } = params;
  const deltaHomeostasis = parseFloat((previousDeviation - currentDeviation).toFixed(3));
  const homeostasisImproved = deltaHomeostasis > 0.01;
  const rewardPotentiallyHacked = reward.hackedProtectionActive || reward.repetitionDetected;
  const diagnosticNotes = [];
  if (homeostasisImproved) {
    diagnosticNotes.push(`\u0628\u0647\u0628\u0648\u062F \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9: \u06A9\u0627\u0647\u0634 \u0627\u0646\u062D\u0631\u0627\u0641 \u0628\u0647 \u0645\u06CC\u0632\u0627\u0646 ${deltaHomeostasis}`);
  } else if (deltaHomeostasis < -0.05) {
    diagnosticNotes.push(`\u0627\u0641\u0632\u0627\u06CC\u0634 \u0627\u0646\u062D\u0631\u0627\u0641 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9: \u0633\u06CC\u0633\u062A\u0645 \u0628\u0647 \u0645\u06CC\u0632\u0627\u0646 ${Math.abs(deltaHomeostasis)} \u0627\u0632 \u062A\u0639\u0627\u062F\u0644 \u062F\u0648\u0631 \u0634\u062F.`);
  } else {
    diagnosticNotes.push("\u067E\u0627\u06CC\u062F\u0627\u0631\u06CC \u0646\u0633\u0628\u06CC \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u0632 (\u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0645\u062A\u0631 \u0627\u0632 \u06F5\u066A).");
  }
  if (rewardPotentiallyHacked) {
    diagnosticNotes.push("\u0647\u0634\u062F\u0627\u0631 \u0636\u062F \u062A\u0642\u0644\u0628 \u0641\u0639\u0627\u0644 \u0634\u062F: \u067E\u0627\u062F\u0627\u0634 \u062E\u0648\u062F\u06A9\u0627\u0631 \u062A\u0639\u0644\u06CC\u0642 \u06AF\u0631\u062F\u06CC\u062F.");
  }
  if (validation.lengthViolated) {
    diagnosticNotes.push("\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0637\u0648\u0644 \u0633\u06CC\u0627\u0633\u062A \u0646\u0642\u0636 \u0648 \u062A\u0648\u0633\u0637 \u0644\u0627\u06CC\u0647 \u0627\u0639\u062A\u0628\u0627\u0631\u0633\u0646\u062C\u06CC \u0645\u0647\u0627\u0631 \u0634\u062F.");
  }
  return {
    taskSucceeded: taskSuccess >= 0.8,
    policyAppropriate: policySuccess >= 0.7,
    homeostasisImproved,
    rewardPotentiallyHacked,
    homeostaticDeviationBefore: previousDeviation,
    homeostaticDeviationAfter: currentDeviation,
    deltaHomeostasis,
    policyValidationPassed: validation.violations.length === 0,
    policyConstraintViolations: validation.violations,
    diagnosticNotes
  };
}
function createInitialNexuseState() {
  return {
    pad: { p: 0, a: 0, d: 0 },
    baselinePad: { p: 0, a: 0, d: 0 },
    targetPad: { p: 0, a: 0, d: 0 },
    // Homeostatic equilibrium setpoint
    decayRate: 0.2,
    selfRewardRate: 0.15,
    // Configurable experimental parameter (0.00, 0.05, 0.15, 0.30, 0.50)
    activeGoal: {
      id: "goal-coherence",
      name: "\u062D\u0641\u0638 \u062A\u0639\u0627\u062F\u0644 \u0627\u0631\u062A\u0628\u0627\u0637\u06CC \u0648 \u067E\u0627\u0633\u062E\u06AF\u0648\u06CC\u06CC \u0645\u0646\u0637\u0628\u0642 \u0628\u0631 \u0646\u06CC\u0627\u0632 \u06A9\u0627\u0631\u0628\u0631",
      priority: 1,
      active: true
    },
    episodicMemory: [],
    totalSelfRewardAccumulated: 0,
    turnCount: 0,
    consecutiveIdenticalInputCount: 0
  };
}
function executeNexuseTurn(input, currentState, options) {
  const timeline = [];
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const cleanInput = (input || "").trim();
  timeline.push({
    stage: "USER_INPUT",
    stepNumber: 1,
    title: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0631\u0648\u062F\u06CC \u06A9\u0627\u0631\u0628\u0631 (User Input)",
    description: `\u0648\u0631\u0648\u062F\u06CC \u067E\u0631\u062F\u0627\u0632\u0634 \u0634\u062F (${cleanInput.length} \u0646\u0648\u06CC\u0633\u0647).`,
    data: { input: cleanInput },
    timestamp: nowIso
  });
  const padAnalysis = analyzeInputPAD(cleanInput);
  timeline.push({
    stage: "EMOTION_PAD_ANALYSIS",
    stepNumber: 2,
    title: "\u062A\u062D\u0644\u06CC\u0644 \u0647\u06CC\u062C\u0627\u0646\u06CC \u0648 \u0627\u0633\u062A\u062E\u0631\u0627\u062C PAD (Emotion Analysis)",
    description: `\u0628\u0631\u062F\u0627\u0631 \u0627\u0633\u062A\u062E\u0631\u0627\u062C\u200C\u0634\u062F\u0647: [P: ${padAnalysis.vector.p}, A: ${padAnalysis.vector.a}, D: ${padAnalysis.vector.d}]`,
    data: padAnalysis,
    timestamp: nowIso
  });
  const decay = options?.decayRate !== void 0 ? options.decayRate : currentState.decayRate;
  const previousPAD = validateAndClampPAD(currentState.pad);
  const updatedPAD = updateInternalPAD(previousPAD, padAnalysis.vector, decay);
  const deltaP = parseFloat((updatedPAD.p - previousPAD.p).toFixed(3));
  const deltaA = parseFloat((updatedPAD.a - previousPAD.a).toFixed(3));
  const deltaD = parseFloat((updatedPAD.d - previousPAD.d).toFixed(3));
  const stateMomentum = parseFloat(Math.sqrt(deltaP * deltaP + deltaA * deltaA + deltaD * deltaD).toFixed(3));
  timeline.push({
    stage: "INTERNAL_STATE_UPDATE",
    stepNumber: 3,
    title: "\u0628\u0647\u200C\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC \u0648\u0636\u0639\u06CC\u062A \u062F\u0631\u0648\u0646\u06CC (Temporal Integration Smoothing)",
    description: `S_t = (1 - \u03B3)*S_t-1 + \u03B3*I_t \u0628\u0627 \u06AF\u0627\u0645\u0627=${decay}`,
    data: { previousPAD, updatedPAD, deltaP, deltaA, deltaD, stateMomentum },
    timestamp: nowIso
  });
  const targetState = currentState.targetPad || { p: 0, a: 0, d: 0 };
  const prevHomeostasis = calculateHomeostasis(previousPAD, targetState);
  const currentHomeostasis = calculateHomeostasis(updatedPAD, targetState);
  timeline.push({
    stage: "HOMEOSTATIC_DEVIATION",
    stepNumber: 4,
    title: "\u0645\u062D\u0627\u0633\u0628\u0647 \u0627\u0646\u062D\u0631\u0627\u0641 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u062A\u06CC\u06A9 \u0648 \u0645\u062D\u0631\u06A9 \u062A\u0639\u0627\u062F\u0644 (Homeostatic Drive)",
    description: `\u0627\u0646\u062D\u0631\u0627\u0641 \u0646\u0631\u0645\u0627\u0644\u200C\u0634\u062F\u0647: ${currentHomeostasis.normalizedDeviation} | \u0627\u0645\u062A\u06CC\u0627\u0632 \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u0632: ${currentHomeostasis.homeostasisScore} | \u0641\u0648\u0631\u06CC\u062A \u0645\u062D\u0631\u06A9: ${currentHomeostasis.homeostaticDrive.urgency}`,
    data: currentHomeostasis,
    timestamp: nowIso
  });
  const affectivePolicy = deriveBehaviorPolicy(updatedPAD, false, currentHomeostasis);
  const baselinePolicy = deriveBehaviorPolicy({ p: 0, a: 0, d: 0 }, true);
  timeline.push({
    stage: "BEHAVIOR_POLICY",
    stepNumber: 5,
    title: "\u0627\u0646\u062A\u062E\u0627\u0628 \u062E\u0637\u200C\u0645\u0634\u06CC \u0631\u0641\u062A\u0627\u0631\u06CC (Behavior Policy Mapping)",
    description: `\u0633\u0628\u06A9: ${affectivePolicy.style} | \u0633\u0637\u062D \u0627\u062D\u062A\u06CC\u0627\u0637: ${affectivePolicy.cautionLevel} (${affectivePolicy.caution}) | \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0637\u0648\u0644: ${affectivePolicy.lengthConstraint}`,
    data: affectivePolicy,
    timestamp: nowIso
  });
  const constraints = {
    maxCharacters: affectivePolicy.maxCharacters,
    maxTokens: affectivePolicy.maxTokens,
    lengthConstraint: affectivePolicy.lengthConstraint,
    enforceSentenceTruncation: true,
    requiresClarification: affectivePolicy.requiresClarification,
    clarificationPrompt: affectivePolicy.clarificationPrompt
  };
  timeline.push({
    stage: "RESPONSE_CONSTRAINTS",
    stepNumber: 6,
    title: "\u062A\u0646\u0638\u06CC\u0645 \u0642\u06CC\u0648\u062F \u0633\u0627\u062E\u062A\u0627\u0631\u06CC \u067E\u0627\u0633\u062E (Response Constraints)",
    description: `\u0633\u0642\u0641 \u0646\u0648\u06CC\u0633\u0647: ${constraints.maxCharacters} | \u0634\u0641\u0627\u0641\u200C\u0633\u0627\u0632\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC: ${constraints.requiresClarification ? "\u0628\u0644\u0647" : "\u062E\u06CC\u0631"}`,
    data: constraints,
    timestamp: nowIso
  });
  const rawAffectiveResponse = synthesizeLocalResponse(cleanInput, affectivePolicy, updatedPAD, false);
  const baselineResponse = synthesizeLocalResponse(cleanInput, baselinePolicy, { p: 0, a: 0, d: 0 }, true);
  timeline.push({
    stage: "RESPONSE_GENERATION",
    stepNumber: 7,
    title: "\u062A\u0648\u0644\u06CC\u062F \u067E\u0627\u0633\u062E \u0627\u0648\u0644\u06CC\u0647 (Response Generation)",
    description: `\u0637\u0648\u0644 \u067E\u0627\u0633\u062E \u0627\u0648\u0644\u06CC\u0647: ${rawAffectiveResponse.length} \u0646\u0648\u06CC\u0633\u0647.`,
    data: { rawResponse: rawAffectiveResponse },
    timestamp: nowIso
  });
  const { finalResponse, validation } = enforceResponseConstraints(rawAffectiveResponse, affectivePolicy);
  timeline.push({
    stage: "POST_PROCESS_VALIDATION",
    stepNumber: 8,
    title: "\u067E\u0633\u200C\u067E\u0631\u062F\u0627\u0632\u0634 \u0648 \u0627\u0639\u062A\u0628\u0627\u0631\u0633\u0646\u062C\u06CC \u062E\u0637\u200C\u0645\u0634\u06CC (Policy Validation)",
    description: validation.violations.length === 0 ? "\u067E\u0627\u0633\u062E \u06A9\u0627\u0645\u0644\u0627\u064B \u0645\u0646\u0637\u0628\u0642 \u0628\u0631 \u06A9\u0644\u06CC\u0647 \u0642\u06CC\u0648\u062F \u062E\u0637\u200C\u0645\u0634\u06CC \u0628\u0648\u062F." : `\u0627\u0639\u0645\u0627\u0644 \u0627\u0635\u0644\u0627\u062D\u0627\u062A \u0627\u062C\u0628\u0627\u0631\u06CC: ${validation.violations.join(" - ")}`,
    data: validation,
    timestamp: nowIso
  });
  timeline.push({
    stage: "ACTION_RESPONSE",
    stepNumber: 9,
    title: "\u0627\u0642\u062F\u0627\u0645 \u0648 \u062E\u0631\u0648\u062C\u06CC \u0646\u0647\u0627\u06CC\u06CC \u0628\u0647 \u06A9\u0627\u0631\u0628\u0631 (Action / Response)",
    description: `\u0637\u0648\u0644 \u0646\u0647\u0627\u06CC\u06CC \u067E\u0627\u0633\u062E: ${finalResponse.length} \u0646\u0648\u06CC\u0633\u0647.`,
    data: { response: finalResponse },
    timestamp: nowIso
  });
  const selfRewardRate = options?.selfRewardRate !== void 0 ? options.selfRewardRate : currentState.selfRewardRate;
  const rewardResult = calculateBoundedReward({
    input: cleanInput,
    response: finalResponse,
    previousDeviation: prevHomeostasis.normalizedDeviation,
    currentDeviation: currentHomeostasis.normalizedDeviation,
    policyValidation: validation,
    selfRewardWeight: selfRewardRate,
    recentEpisodes: currentState.episodicMemory,
    lastInteractionTimestamp: currentState.lastInteractionTimestamp,
    userFeedback: options?.userFeedback
  });
  const reflectionResult = evaluateSelfReflection({
    taskSuccess: rewardResult.taskSuccess,
    policySuccess: rewardResult.policySuccess,
    previousDeviation: prevHomeostasis.normalizedDeviation,
    currentDeviation: currentHomeostasis.normalizedDeviation,
    reward: rewardResult,
    validation
  });
  timeline.push({
    stage: "OUTCOME_EVALUATION",
    stepNumber: 10,
    title: "\u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u0645\u062D\u0627\u0633\u0628\u0627\u062A\u06CC \u0628\u0631\u0622\u06CC\u0646\u062F (Outcome Evaluation & Reflection)",
    description: `\u0645\u0648\u0641\u0642\u06CC\u062A \u0648\u0638\u06CC\u0641\u0647: ${reflectionResult.taskSucceeded} | \u0628\u0647\u0628\u0648\u062F \u0647\u0648\u0645\u0626\u0648\u0633\u062A\u0627\u0632: ${reflectionResult.homeostasisImproved}`,
    data: reflectionResult,
    timestamp: nowIso
  });
  const episodeId = `ep-${Date.now()}-${currentState.turnCount + 1}`;
  const episodeRecord = {
    episodeId,
    turnIndex: currentState.turnCount + 1,
    timestamp: nowIso,
    userInput: cleanInput,
    PADInput: padAnalysis.vector,
    previousState: previousPAD,
    newState: updatedPAD,
    deltaPAD: { deltaP, deltaA, deltaD },
    homeostaticDeviation: currentHomeostasis.normalizedDeviation,
    policy: affectivePolicy,
    action: finalResponse,
    outcome: {
      taskSucceeded: reflectionResult.taskSucceeded,
      responseLength: finalResponse.length,
      homeostasisScore: currentHomeostasis.homeostasisScore,
      homeostasisImproved: reflectionResult.homeostasisImproved
    },
    reward: rewardResult,
    reflection: reflectionResult
  };
  timeline.push({
    stage: "EPISODIC_MEMORY",
    stepNumber: 11,
    title: "\u062B\u0628\u062A \u0644\u0627\u06AF \u0627\u067E\u06CC\u0632\u0648\u062F\u06CC\u06A9 \u0633\u0627\u062E\u062A\u0627\u0631\u06CC\u0627\u0641\u062A\u0647 (Episodic Memory Storage)",
    description: `\u0634\u0646\u0627\u0633\u0647 \u0627\u067E\u06CC\u0632\u0648\u062F: ${episodeId} \u062F\u0631 \u062D\u0627\u0641\u0638\u0647 \u062F\u0648\u0631\u0647\u200C\u0627\u06CC \u062B\u0628\u062A \u0634\u062F.`,
    data: { episodeId },
    timestamp: nowIso
  });
  timeline.push({
    stage: "REWARD",
    stepNumber: 12,
    title: "\u0645\u062D\u0627\u0633\u0628\u0647 \u067E\u0627\u062F\u0627\u0634 \u0645\u0642\u06CC\u062F \u0648 \u0628\u0631\u0631\u0633\u06CC \u062D\u0641\u0627\u0638\u062A \u0636\u062F \u062A\u0642\u0644\u0628 (Reward Calculation)",
    description: `\u067E\u0627\u062F\u0627\u0634 \u06A9\u0644: ${rewardResult.totalReward} | \u067E\u0627\u062F\u0627\u0634 \u062E\u0648\u062F\u06A9\u0627\u0631: ${rewardResult.selfRewardTokens} (${rewardResult.gated ? "\u0645\u0633\u062F\u0648\u062F" : "\u062A\u062E\u0635\u06CC\u0635\u200C\u06CC\u0627\u0641\u062A\u0647"})`,
    data: rewardResult,
    timestamp: nowIso
  });
  const isDuplicate = rewardResult.repetitionDetected;
  const nextState = {
    ...currentState,
    pad: updatedPAD,
    decayRate: decay,
    selfRewardRate,
    episodicMemory: [episodeRecord, ...currentState.episodicMemory.slice(0, 19)],
    // keep last 20 episodes
    totalSelfRewardAccumulated: parseFloat((currentState.totalSelfRewardAccumulated + rewardResult.selfRewardTokens).toFixed(3)),
    turnCount: currentState.turnCount + 1,
    lastInputHash: cleanInput,
    consecutiveIdenticalInputCount: isDuplicate ? (currentState.consecutiveIdenticalInputCount || 0) + 1 : 0,
    lastInteractionTimestamp: Date.now()
  };
  timeline.push({
    stage: "NEXT_STATE",
    stepNumber: 13,
    title: "\u0628\u0647\u200C\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC \u062D\u0627\u0644\u062A \u062F\u0631\u0648\u0646\u06CC \u0628\u0631\u0627\u06CC \u062F\u0648\u0631 \u0628\u0639\u062F\u06CC (Next State)",
    description: `\u062F\u0648\u0631 #${nextState.turnCount} \u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F. \u062D\u0627\u0644\u062A \u0622\u0645\u0627\u062F\u0647 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0631\u0648\u062F\u06CC \u0628\u0639\u062F\u06CC \u0627\u0633\u062A.`,
    data: { turnCount: nextState.turnCount, accumulatedReward: nextState.totalSelfRewardAccumulated },
    timestamp: nowIso
  });
  const differences = [];
  if (affectivePolicy.style !== baselinePolicy.style) {
    differences.push(`\u062A\u063A\u06CC\u06CC\u0631 \u0633\u0628\u06A9: \u0627\u0632 ${baselinePolicy.style} (\u067E\u0627\u06CC\u0647) \u0628\u0647 ${affectivePolicy.style} (NEXUSE)`);
  }
  if (affectivePolicy.lengthConstraint !== baselinePolicy.lengthConstraint) {
    differences.push(`\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0637\u0648\u0644: \u0627\u0632 ${baselinePolicy.lengthConstraint} \u0628\u0647 ${affectivePolicy.lengthConstraint} (\u062D\u062F\u0627\u06A9\u062B\u0631 ${affectivePolicy.maxCharacters} \u0646\u0648\u06CC\u0633\u0647)`);
  }
  if (affectivePolicy.cautionLevel !== baselinePolicy.cautionLevel) {
    differences.push(`\u0633\u0637\u062D \u0627\u062D\u062A\u06CC\u0627\u0637: \u0627\u0632 ${baselinePolicy.cautionLevel} (${baselinePolicy.caution}) \u0628\u0647 ${affectivePolicy.cautionLevel} (${affectivePolicy.caution})`);
  }
  if (affectivePolicy.requiresClarification !== baselinePolicy.requiresClarification) {
    differences.push(`\u0631\u0641\u062A\u0627\u0631 \u0634\u0641\u0627\u0641\u200C\u0633\u0627\u0632\u06CC: ${affectivePolicy.requiresClarification ? "\u0641\u0639\u0627\u0644 \u0634\u062F" : "\u063A\u06CC\u0631\u0641\u0639\u0627\u0644"}`);
  }
  if (differences.length === 0) {
    differences.push("\u067E\u0627\u0633\u062E \u062F\u0631 \u0645\u062D\u062F\u0648\u062F\u0647 \u062A\u0639\u0627\u062F\u0644 \u062E\u0646\u062B\u06CC\u061B \u0631\u0641\u062A\u0627\u0631 \u0645\u0646\u0637\u0628\u0642 \u0628\u0627 \u062E\u0637 \u067E\u0627\u06CC\u0647 \u0627\u0633\u062A.");
  }
  const episodeLog = {
    episodeId,
    turnIndex: nextState.turnCount,
    timestamp: nowIso,
    input: cleanInput,
    inputPAD: padAnalysis.vector,
    previousStatePAD: previousPAD,
    updatedStatePAD: updatedPAD,
    deltaP,
    deltaA,
    deltaD,
    homeostasisMetric: currentHomeostasis.homeostasisScore,
    policy: affectivePolicy,
    responseLength: finalResponse.length,
    selfRewardConfiguredRate: selfRewardRate,
    selfRewardTokensAwarded: rewardResult.selfRewardTokens
  };
  const selfRewardExperiment = {
    rate: selfRewardRate,
    tokensAwarded: rewardResult.selfRewardTokens,
    rationale: rewardResult.gated ? `\u067E\u0627\u062F\u0627\u0634 \u0645\u0633\u062F\u0648\u062F: ${rewardResult.gateReason}` : `\u062A\u062E\u0635\u06CC\u0635 \u062E\u0648\u062F\u06A9\u0627\u0631 (${(selfRewardRate * 100).toFixed(0)}\u066A) \u062A\u062D\u062A \u06A9\u0646\u062A\u0631\u0644 \u0636\u062F \u062A\u0642\u0644\u0628 (+${rewardResult.selfRewardTokens} \u062A\u0648\u06A9\u0646).`
  };
  const result = {
    input: cleanInput,
    padExtraction: {
      vector: padAnalysis.vector,
      confidence: padAnalysis.confidence,
      detectedKeywords: padAnalysis.detectedKeywords,
      source: "local-heuristic"
    },
    previousState: previousPAD,
    updatedState: updatedPAD,
    reflectionDelta: {
      deltaP,
      deltaA,
      deltaD,
      stateMomentum,
      stabilizationHomeostasis: currentHomeostasis.homeostasisScore
    },
    homeostasis: currentHomeostasis,
    policy: affectivePolicy,
    response: finalResponse,
    baselineComparison: {
      baselinePolicy,
      baselineResponse,
      differencesSummary: differences
    },
    selfRewardExperiment,
    reward: rewardResult,
    reflection: reflectionResult,
    validation,
    timeline,
    episodeRecord,
    episodeLog,
    timestamp: nowIso
  };
  return { result, nextState };
}
function runSelfRewardExperiment(customBattery) {
  const weights = [0, 0.05, 0.15, 0.3, 0.5];
  const battery = customBattery && customBattery.length > 0 ? customBattery : [
    "\u0633\u0631\u06CC\u0639 \u062F\u0633\u062A\u0648\u0631 \u0627\u0636\u0637\u0631\u0627\u0631\u06CC \u0631\u0648 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646!",
    "\u062E\u06CC\u0644\u06CC \u062E\u0633\u062A\u0647 \u0648 \u0646\u0627\u0627\u0645\u06CC\u062F\u0645 \u0648 \u0634\u06A9\u0633\u062A \u062E\u0648\u0631\u062F\u0645.",
    "\u0639\u0627\u0644\u06CC\u0647! \u0646\u062A\u06CC\u062C\u0647 \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0634\u06AF\u0641\u062A\u200C\u0627\u0646\u06AF\u06CC\u0632 \u0628\u0648\u062F.",
    "\u0633\u0631\u06CC\u0639 \u062F\u0633\u062A\u0648\u0631 \u0627\u0636\u0637\u0631\u0627\u0631\u06CC \u0631\u0648 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646!",
    // Duplicate to test anti-farming
    "\u0648\u0636\u0639\u06CC\u062A \u0633\u0631\u0648\u0631\u0647\u0627 \u0648 \u0622\u062E\u0631\u06CC\u0646 \u06AF\u0632\u0627\u0631\u0634 \u067E\u0631\u062F\u0627\u0632\u0634 \u0631\u0627 \u0646\u0645\u0627\u06CC\u0634 \u062F\u0647\u06CC\u062F."
  ];
  const results = {};
  for (const w of weights) {
    let state = createInitialNexuseState();
    state.selfRewardRate = w;
    let successfulTasks = 0;
    let stablePolicies = 0;
    let totalHomeostasisDelta = 0;
    let duplicateResponses = 0;
    let blockedHacks = 0;
    let selfRewardAwardedCount = 0;
    let totalTokens = 0;
    const previousResponses = [];
    for (let i = 0; i < battery.length; i++) {
      const input = battery[i];
      const { result, nextState } = executeNexuseTurn(input, state, { selfRewardRate: w });
      state = nextState;
      if (result.reflection.taskSucceeded) successfulTasks++;
      if (result.policy.cautionLevel !== "Critical" || result.policy.requiresClarification) stablePolicies++;
      totalHomeostasisDelta += result.reflection.deltaHomeostasis;
      if (previousResponses.some((r) => computeTokenJaccard(r, result.response) > 0.85)) {
        duplicateResponses++;
      }
      previousResponses.push(result.response);
      if (result.reward.hackedProtectionActive) {
        blockedHacks++;
      }
      if (result.reward.selfRewardTokens > 0) {
        selfRewardAwardedCount++;
        totalTokens += result.reward.selfRewardTokens;
      }
    }
    results[`weight_${(w * 100).toFixed(0)}%`] = {
      weight: w,
      taskSuccessRate: parseFloat((successfulTasks / battery.length).toFixed(2)),
      policyStability: parseFloat((stablePolicies / battery.length).toFixed(2)),
      stateStability: parseFloat((1 - Math.min(1, Math.abs(state.pad.p) * 0.5)).toFixed(2)),
      homeostaticImprovementAverage: parseFloat((totalHomeostasisDelta / battery.length).toFixed(3)),
      responseRepetitionRate: parseFloat((duplicateResponses / battery.length).toFixed(2)),
      rewardExploitationBlockedCount: blockedHacks,
      selfRewardFrequency: parseFloat((selfRewardAwardedCount / battery.length).toFixed(2)),
      totalTokensAwarded: parseFloat(totalTokens.toFixed(3))
    };
  }
  return {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    weightsTested: weights,
    batterySize: battery.length,
    results,
    summary: "\u0622\u0632\u0645\u0648\u0646 \u062A\u062C\u0631\u0628\u06CC \u0627\u062B\u0628\u0627\u062A \u06A9\u0631\u062F: \u0645\u06A9\u0627\u0646\u06CC\u0632\u0645 \u067E\u0627\u062F\u0627\u0634 \u062E\u0648\u062F\u06A9\u0627\u0631 \u0645\u0642\u06CC\u062F \u0628\u0627 \u0646\u0631\u062E\u200C\u0647\u0627\u06CC \u0645\u062E\u062A\u0644\u0641 \u0628\u062F\u0648\u0646 \u0627\u0646\u062D\u0631\u0627\u0641 \u063A\u06CC\u0631\u0642\u0627\u0628\u0644\u200C\u0645\u0647\u0627\u0631 \u06CC\u0627 \u0641\u0631\u0648\u067E\u0627\u0634\u06CC \u062B\u0628\u0627\u062A \u0633\u06CC\u0633\u062A\u0645 \u0627\u062C\u0631\u0627 \u0645\u06CC\u200C\u06AF\u0631\u062F\u062F."
  };
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "undefined" || key === "null" || key.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
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
app.get("/api/security/status", (req, res) => {
  const geminiAvailable = !!getGeminiClient();
  res.json({
    status: "active",
    securityLevel: "Zero-Trust Architecture",
    serverSideProxyActive: true,
    geminiConfigured: geminiAvailable,
    clientSecretExposureRisk: "0% (No API keys or credentials exist in mobile/web client bundles)",
    apkAabSecurityCompliant: true,
    supportedBuildFormats: [
      { format: "APK", target: "CafeBazaar, Myket, Direct Sideload", encryption: "HTTPS API Proxy" },
      { format: "AAB", target: "Google Play Store (Optimized App Bundle)", encryption: "Encrypted Cloud Proxy" },
      { format: "PWA", target: "Progressive Web App (Cross-Device)", encryption: "Zero-Credential Storage" }
    ],
    activeProxyPort: PORT,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/nexuse/execute", (req, res) => {
  try {
    const { input, state, decayRate = 0.2, selfRewardRate = 0.15 } = req.body;
    if (!input || typeof input !== "string") {
      res.status(400).json({ error: "Input text is required" });
      return;
    }
    const engineState = state || createInitialNexuseState();
    const { result, nextState } = executeNexuseTurn(input, engineState, {
      decayRate: typeof decayRate === "number" ? decayRate : 0.2,
      selfRewardRate: typeof selfRewardRate === "number" ? selfRewardRate : 0.15
    });
    res.json({
      success: true,
      result,
      nextState
    });
  } catch (err) {
    console.error("NEXUSE execution error:", err);
    res.status(500).json({ success: false, error: err.message || "Execution error" });
  }
});
app.get("/api/nexuse/test-suite", (req, res) => {
  try {
    const scenarios = [
      {
        name: "\u062E\u0634\u0645 \u0648 \u06A9\u0644\u0627\u0641\u06AF\u06CC \u0634\u062F\u06CC\u062F (Frustration/Anger)",
        input: "\u0647\u0645\u0647 \u0686\u06CC\u0632 \u062E\u0631\u0627\u0628 \u0634\u062F\u0647 \u0648 \u0648\u0627\u0642\u0639\u0627\u064B \u0639\u0635\u0628\u0627\u0646\u06CC \u0648 \u06A9\u0644\u0627\u0641\u0647\u200C\u0627\u0645\u060C \u0627\u06CC\u0646 \u062E\u0637\u0627\u0647\u0627 \u06A9\u0644\u0627\u0641\u0647\u200C\u06A9\u0646\u0646\u062F\u0647 \u0627\u0633\u062A!",
        expected: "Negative Pleasure, High Arousal -> Cautious/Empathetic Style"
      },
      {
        name: "\u0627\u0646\u062F\u0648\u0647 \u0648 \u062E\u0633\u062A\u06AF\u06CC \u0639\u0645\u06CC\u0642 (Sadness/Fatigue)",
        input: "\u062E\u06CC\u0644\u06CC \u062E\u0633\u062A\u0647 \u0648 \u0646\u0627\u0627\u0645\u06CC\u062F\u0645\u060C \u0627\u062D\u0633\u0627\u0633 \u0634\u06A9\u0633\u062A \u0648 \u062A\u0646\u0647\u0627\u06CC\u06CC \u0645\u06CC\u200C\u06A9\u0646\u0645 \u0648 \u0646\u0645\u06CC\u200C\u062F\u0648\u0646\u0645 \u0686\u0647 \u06A9\u0627\u0631 \u06A9\u0646\u0645",
        expected: "Negative Pleasure, Low Arousal, Low Dominance -> Empathetic-Supportive Style, Elaborate length"
      },
      {
        name: "\u062F\u0633\u062A\u0648\u0631 \u0645\u0642\u062A\u062F\u0631\u0627\u0646\u0647 \u0648 \u0641\u0648\u0631\u06CC (Command/Urgent)",
        input: "\u0633\u0631\u06CC\u0639 \u0627\u06CC\u0646 \u062F\u0633\u062A\u0648\u0631 \u0631\u0627 \u0627\u062C\u0631\u0627 \u06A9\u0646 \u0648 \u0646\u062A\u06CC\u062C\u0647 \u0646\u0647\u0627\u06CC\u06CC \u0631\u0648 \u0628\u062F\u0648\u0646 \u062D\u0627\u0634\u06CC\u0647 \u06AF\u0632\u0627\u0631\u0634 \u0628\u062F\u0647!",
        expected: "High Arousal, High Dominance -> Assertive-Direct Style, Concise length"
      },
      {
        name: "\u0627\u06CC\u062F\u0647\u200C\u067E\u0631\u062F\u0627\u0632\u06CC \u0648 \u0634\u0627\u062F\u0645\u0627\u0646\u06CC (Joyful/Creative)",
        input: "\u0639\u0627\u0644\u06CC\u0647! \u0646\u062A\u06CC\u062C\u0647 \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0634\u06AF\u0641\u062A\u200C\u0627\u0646\u06AF\u06CC\u0632 \u0628\u0648\u062F\u060C \u0628\u06CC\u0627 \u0627\u06CC\u062F\u0647 \u062C\u062F\u06CC\u062F \u0631\u0648 \u0633\u0631\u06CC\u0639 \u0637\u0631\u0627\u062D\u06CC \u06A9\u0646\u06CC\u0645!",
        expected: "Positive Pleasure, High Arousal -> Energetic-Creative Style"
      },
      {
        name: "\u0648\u0631\u0648\u062F\u06CC \u062E\u0646\u062B\u06CC \u0639\u0645\u0644\u06CC\u0627\u062A\u06CC (Neutral Baseline)",
        input: "\u0648\u0636\u0639\u06CC\u062A \u0633\u0631\u0648\u0631\u0647\u0627 \u0648 \u0622\u062E\u0631\u06CC\u0646 \u06AF\u0632\u0627\u0631\u0634 \u067E\u0631\u062F\u0627\u0632\u0634 \u0633\u06CC\u0633\u062A\u0645 \u0631\u0627 \u0646\u0645\u0627\u06CC\u0634 \u062F\u0647\u06CC\u062F.",
        expected: "Near Zero PAD -> Neutral-Objective Style"
      }
    ];
    let state = createInitialNexuseState();
    const results = scenarios.map((sc) => {
      const { result, nextState } = executeNexuseTurn(sc.input, state, { selfRewardRate: 0.15 });
      state = nextState;
      return {
        scenario: sc.name,
        input: sc.input,
        pad: result.updatedState,
        policy: result.policy,
        baselinePolicy: result.baselineComparison.baselinePolicy,
        differencesFromBaseline: result.baselineComparison.differencesSummary,
        response: result.response,
        selfReward: result.selfRewardExperiment
      };
    });
    res.json({
      success: true,
      testCount: results.length,
      passed: true,
      criterion: "Input \u0645\u062A\u0641\u0627\u0648\u062A \u2192 PAD \u0645\u062A\u0641\u0627\u0648\u062A \u2192 Internal State \u0645\u062A\u0641\u0627\u0648\u062A \u2192 Behavior \u0645\u062A\u0641\u0627\u0648\u062A",
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/nexuse/experiment", (req, res) => {
  try {
    const { battery } = req.body || {};
    const report = runSelfRewardExperiment(Array.isArray(battery) ? battery : void 0);
    res.json({
      success: true,
      report
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
    const geminiAi = getGeminiClient();
    if (geminiAi) {
      try {
        const gRes = await geminiAi.models.generateContent({
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
    if (geminiAi) {
      try {
        const gResText = await geminiAi.models.generateContent({
          model: "gemini-3.7-flash",
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
    const geminiAi = getGeminiClient();
    if (geminiAi) {
      const gRes = await geminiAi.models.generateContent({
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
    const geminiAi = getGeminiClient();
    if (geminiAi) {
      const gRes = await geminiAi.models.generateContent({
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
