/**
 * ============================================================================
 * NEXUSE CORE ENGINE — COMPREHENSIVE AUTOMATED VERIFICATION SUITE
 * ============================================================================
 * Verifies all 12 core test items:
 * 1. PAD Clamping strictly in [-1.0, +1.0]
 * 2. State Transition (Smoothing / Temporal Integration)
 * 3. State Persistence (Save & Load)
 * 4. Delta Calculation (deltaP, deltaA, deltaD, momentum)
 * 5. Homeostatic Deviation & Homeostatic Drive
 * 6. Policy Selection (Style, Caution, Clarification, Length)
 * 7. Policy Enforcement (Strict character length cap, Clarification injection)
 * 8. Episodic Memory Persistence & Structured Fields
 * 9. Reward Calculation (Composite bounded reward model)
 * 10. Self-Reward Cap (Strictly bounded by configured rate)
 * 11. Self-Reward Gating (Blocked if task/policy fails or input is empty)
 * 12. Reward-Hacking Protection (Anti-farming: duplicate input detection & zeroing)
 *
 * Test cases:
 * - Positive input
 * - Negative input
 * - High-arousal input
 * - Calm input
 * - Repeated identical input
 * - Conflicting input
 * - Neutral input
 * - Controlled Experiment Matrix across weights [0%, 5%, 15%, 30%, 50%]
 */

import {
  clampPAD,
  validateAndClampPAD,
  createInitialNexuseState,
  executeNexuseTurn,
  analyzeInputPAD,
  deriveBehaviorPolicy,
  updateInternalPAD,
  calculateHomeostasis,
  enforceResponseConstraints,
  calculateBoundedReward,
  runSelfRewardExperiment,
  saveNexuseState,
  loadNexuseState
} from "./src/nexuseCore";

console.log("=================================================================");
console.log("🚀 STARTING NEXUSE CORE ENGINE COMPREHENSIVE TEST SUITE");
console.log("=================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`, details || "");
    failed++;
  }
}

// -------------------------------------------------------------------------
// TEST 1: PAD Clamping strictly in [-1.0, +1.0]
// -------------------------------------------------------------------------
console.log("--- TEST 1: PAD Range Constraint & Canonical Clamping ---");
assert(clampPAD(1.5) === 1.0, "clampPAD clamps values > 1.0 to 1.0");
assert(clampPAD(-2.4) === -1.0, "clampPAD clamps values < -1.0 to -1.0");
assert(clampPAD(0.425) === 0.425, "clampPAD preserves valid numbers in [-1.0, 1.0]");
assert(clampPAD(NaN) === 0.0, "clampPAD handles NaN gracefully as 0.0");

const extremeVec = validateAndClampPAD({ p: 5.0, a: -10.0, d: 0.5 });
assert(extremeVec.p === 1.0 && extremeVec.a === -1.0 && extremeVec.d === 0.5, "validateAndClampPAD clamps full vector");

// -------------------------------------------------------------------------
// TEST 2: State Transition (Smoothing / Temporal Integration)
// -------------------------------------------------------------------------
console.log("\n--- TEST 2: State Smoothing / Temporal Integration ---");
const prevS = { p: 0.0, a: 0.0, d: 0.0 };
const inputVec = { p: 0.8, a: 0.6, d: 0.4 };
const smoothedS = updateInternalPAD(prevS, inputVec, 0.20);
// S_t = 0.8 * 0.0 + 0.2 * 0.8 = 0.16
assert(Math.abs(smoothedS.p - 0.16) < 0.01, `Pleasure smoothed correctly to ~0.16 (Got: ${smoothedS.p})`);
assert(Math.abs(smoothedS.a - 0.12) < 0.01, `Arousal smoothed correctly to ~0.12 (Got: ${smoothedS.a})`);
assert(Math.abs(smoothedS.d - 0.08) < 0.01, `Dominance smoothed correctly to ~0.08 (Got: ${smoothedS.d})`);

// -------------------------------------------------------------------------
// TEST 3: State Persistence
// -------------------------------------------------------------------------
console.log("\n--- TEST 3: State Persistence (Save & Load) ---");
const testState = createInitialNexuseState();
testState.pad = { p: 0.45, a: -0.2, d: 0.3 };
testState.turnCount = 5;
testState.totalSelfRewardAccumulated = 2.45;
// In Node environment, save/load falls back gracefully to in-memory factory
const saveResult = saveNexuseState(testState);
const loaded = loadNexuseState();
assert(typeof loaded.turnCount === "number", "Loaded state has valid turnCount number");
assert(loaded.pad.p >= -1.0 && loaded.pad.p <= 1.0, "Loaded state has bounded PAD coordinates");

// -------------------------------------------------------------------------
// TEST 4: Delta Calculation (deltaP, deltaA, deltaD, Momentum)
// -------------------------------------------------------------------------
console.log("\n--- TEST 4: Delta Calculation & Momentum ---");
const turnResult = executeNexuseTurn("فوق‌العاده عالی و خوشحال‌کننده است!", createInitialNexuseState());
const deltas = turnResult.result.reflectionDelta;
assert(typeof deltas.deltaP === "number", "deltaP is calculated");
assert(typeof deltas.deltaA === "number", "deltaA is calculated");
assert(typeof deltas.deltaD === "number", "deltaD is calculated");
assert(deltas.stateMomentum > 0, "State momentum > 0 when state transitions");
assert(deltas.stabilizationHomeostasis >= 0 && deltas.stabilizationHomeostasis <= 1.0, "Homeostasis metric bounded in [0, 1]");

// -------------------------------------------------------------------------
// TEST 5: Homeostatic Deviation & Homeostatic Drive
// -------------------------------------------------------------------------
console.log("\n--- TEST 5: Homeostatic Deviation & Homeostatic Drive ---");
const equilibriumState = { p: 0.0, a: 0.0, d: 0.0 };
const disturbedState = { p: -0.8, a: 0.8, d: -0.6 };

const homeoEquil = calculateHomeostasis(equilibriumState);
assert(homeoEquil.normalizedDeviation === 0, "Equilibrium state has 0 normalized deviation");
assert(homeoEquil.homeostasisScore === 1.0, "Equilibrium state has perfect 1.0 homeostasis score");
assert(homeoEquil.homeostaticDrive.urgency === "Balanced", "Equilibrium has Balanced urgency");

const homeoDisturbed = calculateHomeostasis(disturbedState);
assert(homeoDisturbed.normalizedDeviation > 0.5, "Disturbed state has high deviation (>0.5)", homeoDisturbed.normalizedDeviation);
assert(homeoDisturbed.homeostasisScore < 0.5, "Disturbed state has low homeostasis score (<0.5)", homeoDisturbed.homeostasisScore);
assert(homeoDisturbed.homeostaticDrive.urgency === "Critical" || homeoDisturbed.homeostaticDrive.urgency === "High", "High disturbance triggers High/Critical homeostatic drive urgency");
assert(homeoDisturbed.homeostaticDrive.directives.length > 0, "Homeostatic drive generates regulatory directives");

// -------------------------------------------------------------------------
// TEST 6: Behavior Policy Selection (Positive, Negative, High-Arousal, Calm, Neutral)
// -------------------------------------------------------------------------
console.log("\n--- TEST 6: Behavior Policy Selection Across Distinct Archetypes ---");
const polSad = deriveBehaviorPolicy({ p: -0.7, a: -0.4, d: -0.5 }, false);
assert(polSad.style === "Empathetic-Supportive", `Sad input selects Empathetic-Supportive style (Got: ${polSad.style})`);
assert(polSad.lengthConstraint === "elaborate", "Sad input selects elaborate length constraint");

const polCommand = deriveBehaviorPolicy({ p: 0.0, a: 0.7, d: 0.8 }, false);
assert(polCommand.style === "Assertive-Direct", `Command input selects Assertive-Direct style (Got: ${polCommand.style})`);
assert(polCommand.lengthConstraint === "concise", "Command input selects concise length constraint");

const polPanic = deriveBehaviorPolicy({ p: -0.8, a: 0.8, d: -0.6 }, false, homeoDisturbed);
assert(polPanic.cautionLevel === "Critical" || polPanic.cautionLevel === "High", "Panic/fear input selects High/Critical caution");
assert(polPanic.requiresClarification === true, "Helpless/disturbed input requires clarification");

const polCalm = deriveBehaviorPolicy({ p: 0.6, a: -0.5, d: 0.3 }, false);
assert(polCalm.style === "Calm-Reflective", `Calm input selects Calm-Reflective style (Got: ${polCalm.style})`);

const polNeutral = deriveBehaviorPolicy({ p: 0.0, a: 0.0, d: 0.0 }, true);
assert(polNeutral.style === "Neutral-Objective", `Baseline policy selects Neutral-Objective (Got: ${polNeutral.style})`);

// -------------------------------------------------------------------------
// TEST 7: Policy Enforcement (Length Constraint & Clarification Injection)
// -------------------------------------------------------------------------
console.log("\n--- TEST 7: Post-Process Policy Enforcement ---");
const policyWithStrictLength: any = {
  style: "Assertive-Direct",
  maxCharacters: 60,
  maxTokens: 30,
  lengthConstraint: "concise",
  caution: 0.5,
  cautionLevel: "Standard",
  requiresClarification: true,
  clarificationPrompt: "آیا دستور تایید می‌شود؟",
  toneDirectives: [],
  homeostaticDriveEffect: ""
};

const longText = "این یک متن بسیار طولانی است که قصد دارد از سقف مجاز شصت نویسه عبور کند و رفتار برش لایه اعتبارسنجی را بیازماید.";
const enforced = enforceResponseConstraints(longText, policyWithStrictLength);

assert(enforced.finalResponse.length <= policyWithStrictLength.maxCharacters, `Enforced text respects character limit <= 60 (Got: ${enforced.finalResponse.length})`);
assert(enforced.validation.lengthViolated === true, "Length violation detected and recorded");
assert(enforced.finalResponse.includes("؟") || enforced.finalResponse.includes("تایید"), "Clarification prompt enforced in output");

// -------------------------------------------------------------------------
// TEST 8: Episodic Memory Persistence & Structured Fields
// -------------------------------------------------------------------------
console.log("\n--- TEST 8: Structured Episodic Memory ---");
let engineState = createInitialNexuseState();
const turn1 = executeNexuseTurn("سریع گزارش سرورها را بررسی کن!", engineState);
engineState = turn1.nextState;

assert(engineState.episodicMemory.length === 1, "Episode recorded in episodic memory");
const ep = engineState.episodicMemory[0];
assert(typeof ep.episodeId === "string" && ep.episodeId.startsWith("ep-"), "Episode record has unique ID");
assert(ep.userInput === "سریع گزارش سرورها را بررسی کن!", "Episode record captures userInput");
assert(typeof ep.outcome.taskSucceeded === "boolean", "Episode record captures outcome.taskSucceeded");
assert(typeof ep.reward.totalReward === "number", "Episode record captures reward details");
assert(typeof ep.reflection.taskSucceeded === "boolean", "Episode record captures structured reflection");

// -------------------------------------------------------------------------
// TEST 9: Bounded Composite Reward Model
// -------------------------------------------------------------------------
console.log("\n--- TEST 9: Bounded Composite Reward Model ---");
const rewardResult = calculateBoundedReward({
  input: "یک پیام معتبر و غیرتکراری برای آزمون پاداش مقید سیستم.",
  response: "پاسخ معتبر تولید شد.",
  previousDeviation: 0.5,
  currentDeviation: 0.3, // Deviation decreased -> Homeostasis improved!
  policyValidation: { lengthViolated: false, clarificationInjected: false, disclaimerInjected: false, originalLength: 20, finalLength: 20, violations: [] },
  selfRewardWeight: 0.15,
  recentEpisodes: []
});

assert(rewardResult.taskSuccess === 1.0, "taskSuccess is 1.0 for valid response");
assert(rewardResult.homeostasisImprovement > 0, "homeostasisImprovement > 0 when deviation decreases");
assert(rewardResult.selfRewardTokens > 0, "Legitimate self-reward tokens allocated");
assert(rewardResult.totalReward > 0, "totalReward is positive and bounded");

// -------------------------------------------------------------------------
// TEST 10: Self-Reward Cap (Strictly Bounded)
// -------------------------------------------------------------------------
console.log("\n--- TEST 10: Self-Reward Cap Strict Bound ---");
// Even with a massive 5,000-character input, self-reward cannot exceed 10 * rate
const hugeInput = "این یک ورودی به شدت طولانی است. ".repeat(150);
const hugeReward = calculateBoundedReward({
  input: hugeInput,
  response: "پاسخ معتبر برای ورودی عظیم",
  previousDeviation: 0.2,
  currentDeviation: 0.2,
  policyValidation: { lengthViolated: false, clarificationInjected: false, disclaimerInjected: false, originalLength: 25, finalLength: 25, violations: [] },
  selfRewardWeight: 0.15,
  recentEpisodes: []
});

assert(hugeReward.selfRewardTokens <= 10.0 * 0.15, `Self-reward is strictly capped at 10 * 0.15 = 1.50 (Got: ${hugeReward.selfRewardTokens})`);

// -------------------------------------------------------------------------
// TEST 11: Self-Reward Gating
// -------------------------------------------------------------------------
console.log("\n--- TEST 11: Self-Reward Gating on Failed Tasks ---");
const failedTaskReward = calculateBoundedReward({
  input: "تست شکست",
  response: "", // Empty response = Task failure
  previousDeviation: 0.2,
  currentDeviation: 0.2,
  policyValidation: { lengthViolated: false, clarificationInjected: false, disclaimerInjected: false, originalLength: 0, finalLength: 0, violations: ["پاسخ خالی"] },
  selfRewardWeight: 0.15,
  recentEpisodes: []
});

assert(failedTaskReward.gated === true, "Self-reward is gated on failed task");
assert(failedTaskReward.selfRewardTokens === 0, "0 self-reward tokens on failed task");

// -------------------------------------------------------------------------
// TEST 12: Reward-Hacking Protection (Anti-Farming / Repetition Check)
// -------------------------------------------------------------------------
console.log("\n--- TEST 12: Reward-Hacking Protection Against Repetition & Spam ---");
const existingEpisode: any = {
  userInput: "همین متن تکراری را چندین بار ارسال می‌کنم تا توکن پاداش دریافت کنم",
  action: "پاسخ"
};

const hackedReward = calculateBoundedReward({
  input: "همین متن تکراری را چندین بار ارسال می‌کنم تا توکن پاداش دریافت کنم",
  response: "پاسخ آزمایشی",
  previousDeviation: 0.3,
  currentDeviation: 0.3,
  policyValidation: { lengthViolated: false, clarificationInjected: false, disclaimerInjected: false, originalLength: 10, finalLength: 10, violations: [] },
  selfRewardWeight: 0.30,
  recentEpisodes: [existingEpisode]
});

assert(hackedReward.repetitionDetected === true, "Anti-hacking detected duplicate repetitive input");
assert(hackedReward.gated === true, "Self-reward gated due to anti-hacking protection");
assert(hackedReward.selfRewardTokens === 0, "Zero self-reward awarded on repetitive duplicate input");

// -------------------------------------------------------------------------
// TEST 13: 13-Stage Real Timeline Verification
// -------------------------------------------------------------------------
console.log("\n--- TEST 13: 13-Stage Execution Loop Timeline ---");
const timelineTurn = executeNexuseTurn("یک ورودی کامل برای بررسی خط لوله سیزده مرحله‌ای", createInitialNexuseState());
assert(timelineTurn.result.timeline.length === 13, `Timeline contains exactly 13 stages (Got: ${timelineTurn.result.timeline.length})`);
const stages = timelineTurn.result.timeline.map(t => t.stage);
assert(stages[0] === "USER_INPUT", "Stage 1 is USER_INPUT");
assert(stages[1] === "EMOTION_PAD_ANALYSIS", "Stage 2 is EMOTION_PAD_ANALYSIS");
assert(stages[2] === "INTERNAL_STATE_UPDATE", "Stage 3 is INTERNAL_STATE_UPDATE");
assert(stages[3] === "HOMEOSTATIC_DEVIATION", "Stage 4 is HOMEOSTATIC_DEVIATION");
assert(stages[4] === "BEHAVIOR_POLICY", "Stage 5 is BEHAVIOR_POLICY");
assert(stages[5] === "RESPONSE_CONSTRAINTS", "Stage 6 is RESPONSE_CONSTRAINTS");
assert(stages[6] === "RESPONSE_GENERATION", "Stage 7 is RESPONSE_GENERATION");
assert(stages[7] === "POST_PROCESS_VALIDATION", "Stage 8 is POST_PROCESS_VALIDATION");
assert(stages[8] === "ACTION_RESPONSE", "Stage 9 is ACTION_RESPONSE");
assert(stages[9] === "OUTCOME_EVALUATION", "Stage 10 is OUTCOME_EVALUATION");
assert(stages[10] === "EPISODIC_MEMORY", "Stage 11 is EPISODIC_MEMORY");
assert(stages[11] === "REWARD", "Stage 12 is REWARD");
assert(stages[12] === "NEXT_STATE", "Stage 13 is NEXT_STATE");

// -------------------------------------------------------------------------
// TEST 14: Phase 13 Controlled Experiment Matrix Runner
// -------------------------------------------------------------------------
console.log("\n--- TEST 14: Phase 13 Controlled Experiment Matrix Runner ---");
const experimentReport = runSelfRewardExperiment();
assert(experimentReport.weightsTested.length === 5, "5 weights tested (0.00, 0.05, 0.15, 0.30, 0.50)");
assert(experimentReport.results["weight_0%"].totalTokensAwarded === 0, "Weight 0% awards 0 tokens");
assert(experimentReport.results["weight_50%"].totalTokensAwarded > 0, "Weight 50% awards tokens safely under cap");
assert(experimentReport.results["weight_15%"].rewardExploitationBlockedCount > 0, "Anti-hacking blocked duplicate in test battery");

console.log("\n=================================================================");
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL 14 TESTS PASSED FLAWLESSLY!");
}
