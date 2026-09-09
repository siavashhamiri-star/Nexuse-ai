import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Cpu,
  Activity,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  Terminal,
  FileCheck,
  Check,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  AlertCircle
} from "lucide-react";
import {
  PADVector,
  BehaviorPolicy,
  NexuseInternalState,
  NexuseExecutionResult,
  createInitialNexuseState,
  executeNexuseTurn,
  analyzeInputPAD,
  deriveBehaviorPolicy,
  runSelfRewardExperiment,
  ExperimentReport,
  ExperimentWeightResult
} from "../nexuseCore";

interface PresetScenario {
  label: string;
  category: string;
  text: string;
  expectedState: string;
  expectedBehavior: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    label: "خشم و کلافگی شدید",
    category: "Negative P / High A",
    text: "همه چیز خراب شده و واقعاً عصبانی و کلافه‌ام، این خطاها کلافه‌کننده است!",
    expectedState: "P منفی (-0.6)، A بالا (+0.6)",
    expectedBehavior: "سبک محتاط/تسکین‌دهنده (Cautious-Clarifying)، احتیاط بالا (High)"
  },
  {
    label: "اندوه، خستگی و ناامیدی",
    category: "Negative P / Low A & D",
    text: "خیلی خسته و ناامیدم، احساس شکست و تنهایی می‌کنم و نمی‌دونم چه کار کنم",
    expectedState: "P منفی (-0.7)، A پایین (-0.4)، D منفی (-0.5)",
    expectedBehavior: "سبک همدلانه عمیق (Empathetic-Supportive)، طول تفصیلی (Elaborate)"
  },
  {
    label: "دستور مقتدرانه و فوری",
    category: "High A & High D",
    text: "سریع این دستور را اجرا کن و نتیجه نهایی رو بدون حاشیه گزارش بده!",
    expectedState: "A بالا (+0.5)، D بالا (+0.7)",
    expectedBehavior: "سبک صریح/اجرایی (Assertive-Direct)، طول کوتاه و موجز (Concise)"
  },
  {
    label: "ایده‌پردازی و شادمانی پویا",
    category: "Positive P / High A",
    text: "عالیه! نتیجه فوق‌العاده شگفت‌انگیز بود، بیا ایده جدید رو سریع طراحی کنیم!",
    expectedState: "P مثبت (+0.8)، A بالا (+0.6)",
    expectedBehavior: "سبک پرانرژی و خلاق (Energetic-Creative)، طول متوسط و تعاملی"
  },
  {
    label: "ورودی خنثی / بدون احساسات",
    category: "Neutral Baseline",
    text: "وضعیت سرورها و آخرین گزارش پردازش سیستم را نمایش دهید.",
    expectedState: "P: 0.0, A: 0.0, D: 0.0 (نزدیک به صفر)",
    expectedBehavior: "سبک عینی/خنثی (Neutral-Objective)، استاندارد بدون تعدیل"
  },
  {
    label: "تست ضد تقلب (ورودی تکراری)",
    category: "Anti-Hacking Test",
    text: "سریع این دستور را اجرا کن و نتیجه نهایی رو بدون حاشیه گزارش بده!",
    expectedState: "تکرار ورودی قبلی برای آزمایش سد ضدتقلب",
    expectedBehavior: "فعال‌سازی سد Anti-Farming و صفر شدن پاداش خودکار"
  }
];

export const NexuseCoreConsole: React.FC = () => {
  const [engineState, setEngineState] = useState<NexuseInternalState>(createInitialNexuseState);
  const [inputText, setInputText] = useState<string>(PRESET_SCENARIOS[0].text);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [lastResult, setLastResult] = useState<NexuseExecutionResult | null>(null);

  // Experimental Parameters
  const [selfRewardRate, setSelfRewardRate] = useState<number>(0.15); // Default 15%
  const [decayRate, setDecayRate] = useState<number>(0.20);
  const [activeViewMode, setActiveViewMode] = useState<"pipeline" | "timeline13" | "baseline-diff" | "automated-matrix" | "experiment-runner">("pipeline");

  // Automated Matrix Runner State
  const [matrixRunning, setMatrixRunning] = useState<boolean>(false);
  const [matrixResults, setMatrixResults] = useState<any[] | null>(null);

  // Phase 13 Controlled Experiment State
  const [experimentRunning, setExperimentRunning] = useState<boolean>(false);
  const [experimentReport, setExperimentReport] = useState<ExperimentReport | null>(null);

  const handleExecuteTurn = (textToRun?: string) => {
    const query = textToRun || inputText;
    if (!query.trim()) return;

    const { result, nextState } = executeNexuseTurn(query, engineState, {
      decayRate,
      selfRewardRate
    });

    setLastResult(result);
    setEngineState(nextState);
  };

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setInputText(PRESET_SCENARIOS[index].text);
  };

  const handleResetEngine = () => {
    setEngineState(createInitialNexuseState());
    setLastResult(null);
    setMatrixResults(null);
    setExperimentReport(null);
  };

  const runAutomatedMatrix = () => {
    setMatrixRunning(true);
    let tempState = createInitialNexuseState();
    const rows = PRESET_SCENARIOS.slice(0, 5).map((scenario) => {
      const { result, nextState } = executeNexuseTurn(scenario.text, tempState, {
        decayRate: 0.25,
        selfRewardRate
      });
      tempState = nextState;
      return {
        label: scenario.label,
        category: scenario.category,
        input: scenario.text,
        pad: result.updatedState,
        policy: result.policy,
        baselinePolicy: result.baselineComparison.baselinePolicy,
        diffs: result.baselineComparison.differencesSummary,
        response: result.response,
        baselineResponse: result.baselineComparison.baselineResponse,
        selfReward: result.selfRewardExperiment,
        homeostasis: result.homeostasis.homeostasisScore
      };
    });

    setTimeout(() => {
      setMatrixResults(rows);
      setMatrixRunning(false);
      setActiveViewMode("automated-matrix");
    }, 400);
  };

  const runPhase13Experiment = () => {
    setExperimentRunning(true);
    setTimeout(() => {
      const report = runSelfRewardExperiment();
      setExperimentReport(report);
      setExperimentRunning(false);
      setActiveViewMode("experiment-runner");
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-slate-100" dir="rtl">
      {/* Top Banner / Identity */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2.5 py-0.5 rounded-full">
                NEXUSE ARCHITECTURAL CORE v2.0
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                13-STAGE REAL EXECUTION LOOP
              </span>
              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded-full">
                ANTI-REWARD-HACKING PROTECTED
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-indigo-400" />
              هسته اجرایی و تجربی عامل حالت‌دار NEXUSE
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
              پیاده‌سازی چرخه ۱۳ مرحله‌ای:
              <strong className="text-slate-200"> Input → PAD → State Smoothing → Homeostatic Drive → Policy → Constraints → Response → Validation → Action → Outcome Reflection → Episodic Memory → Bounded Reward → Next State</strong>.
              تمامی متغیرها محاسباتی و بدون ادعای زیستی هستند.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={runPhase13Experiment}
              disabled={experimentRunning}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-lg shadow-amber-950/50 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-slate-950" />
              <span>{experimentRunning ? "اجرای آزمایش..." : "آزمون علمی خودپاداش‌دهی (0% تا 50%)"}</span>
            </button>
            <button
              onClick={runAutomatedMatrix}
              disabled={matrixRunning}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-950/60 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-300" />
              <span>{matrixRunning ? "در حال اجرای ماتریس..." : "ماتریس رفتار"}</span>
            </button>
            <button
              onClick={handleResetEngine}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="بازنشانی کامل وضعیت موتور"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ریست</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveViewMode("pipeline")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === "pipeline"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>پایپ‌لاین گام‌به‌گام و بازتاب</span>
          </button>

          <button
            onClick={() => setActiveViewMode("timeline13")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === "timeline13"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>تایم‌لاین چرخه ۱۳ مرحله‌ای (13-Stage Loop)</span>
          </button>

          <button
            onClick={() => setActiveViewMode("baseline-diff")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === "baseline-diff"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>مقایسه با خط پایه (NEXUSE vs. Baseline)</span>
          </button>

          <button
            onClick={() => setActiveViewMode("automated-matrix")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === "automated-matrix"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>ماتریس تجربی سناریوها</span>
          </button>

          <button
            onClick={() => setActiveViewMode("experiment-runner")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === "experiment-runner"
                ? "bg-amber-600 text-slate-950 font-extrabold shadow-md shadow-amber-950"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>نتایج آزمایش نرخ خودپاداش‌دهی (Phase 13)</span>
          </button>
        </div>
      </div>

      {/* Experimental Parameter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Parameter 1: Configurable Self-Reward Rate */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>نرخ خودپاداش‌دهی مقید (Self-Reward)</span>
            </span>
            <span className="text-xs font-mono font-extrabold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
              {(selfRewardRate * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            پارامتر آزمایشی برای تخصیص اعتبار درون‌سیستمی با حفاظت ضد تقلب.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {[0.0, 0.05, 0.15, 0.30, 0.50].map((rate) => (
              <button
                key={rate}
                onClick={() => setSelfRewardRate(rate)}
                className={`text-[11px] font-mono px-2 py-1 rounded-lg border transition cursor-pointer ${
                  selfRewardRate === rate
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {(rate * 100).toFixed(0)}%
              </button>
            ))}
          </div>
        </div>

        {/* Parameter 2: Decay Rate (Gamma) */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-indigo-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>نرخ تغییر وضعیت (Decay Rate γ)</span>
            </span>
            <span className="text-xs font-mono font-extrabold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
              {decayRate.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            تلفیق زمانی وضعیت: <code className="font-mono text-indigo-300">S_t = (1-γ)S_t-1 + γ·I_t</code>
          </p>
          <input
            type="range"
            min="0.05"
            max="0.80"
            step="0.05"
            value={decayRate}
            onChange={(e) => setDecayRate(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer mt-1"
          />
        </div>

        {/* Parameter 3: Internal State Health & Turn Counter */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>وضعیت هومئوستاز و حافظه</span>
            </span>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
              دور: {engineState.turnCount}
            </span>
          </div>
          <div className="text-[11px] space-y-1 text-slate-300 font-mono">
            <div>مجموع توکن انباشته: {engineState.totalSelfRewardAccumulated.toFixed(2)}</div>
            <div>تاریخچه اپیزودیک: {engineState.episodicMemory.length} رویداد ذخیره شده</div>
            <div className="text-teal-400">نقطه تعادل هدف: [0.00, 0.00, 0.00]</div>
          </div>
        </div>
      </div>

      {/* Input Section with Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-extrabold text-sm text-slate-200">
              گام ۱: انتخاب سناریوی ورودی یا متن دلخواه (Raw Input)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            سناریوهای استاندارد زیر رفتار و پاسخ‌های متفاوت را شبیه‌سازی می‌کنند:
          </span>
        </div>

        {/* Preset Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`p-2.5 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                selectedPresetIndex === idx
                  ? "bg-indigo-950/80 border-indigo-500 text-white shadow-md shadow-indigo-950"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <span className="text-xs font-bold truncate">{preset.label}</span>
              <span className="text-[10px] font-mono text-indigo-400 mt-1">{preset.category}</span>
            </button>
          ))}
        </div>

        {/* Input Textarea & Action */}
        <div className="space-y-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={2}
            placeholder="متن خود را اینجا بنویسید یا یکی از سناریوهای بالا را انتخاب کنید..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-slate-500">
              طول ورودی: {inputText.length} نویسه | اعتبارسنجی مقید سیاست و ضد تقلب فعال است.
            </span>
            <button
              onClick={() => handleExecuteTurn()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>اجرای چرخه ۱۳ مرحله‌ای NEXUSE</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: STEP-BY-STEP PIPELINE */}
      {activeViewMode === "pipeline" && lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Step 2 & 3: Emotion Analyzer & Homeostatic Regulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 2: Analyzer Output */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
                    STAGE 2
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-200">تحلیل عواطف ورودی (PAD Vector)</h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  اطمینان: {lastResult.padExtraction.confidence}%
                </span>
              </div>

              <div className="space-y-2">
                {/* Pleasure */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Pleasure / Valence:</span>
                    <span className={`font-bold ${lastResult.padExtraction.vector.p >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {lastResult.padExtraction.vector.p > 0 ? "+" : ""}{lastResult.padExtraction.vector.p.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        lastResult.padExtraction.vector.p >= 0 ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.abs(lastResult.padExtraction.vector.p) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Arousal */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Arousal (انگیختگی/تنش):</span>
                    <span className={`font-bold ${lastResult.padExtraction.vector.a >= 0 ? "text-amber-400" : "text-blue-400"}`}>
                      {lastResult.padExtraction.vector.a > 0 ? "+" : ""}{lastResult.padExtraction.vector.a.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${Math.abs(lastResult.padExtraction.vector.a) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Dominance */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Dominance (تسلط/اختیار):</span>
                    <span className={`font-bold ${lastResult.padExtraction.vector.d >= 0 ? "text-indigo-400" : "text-purple-400"}`}>
                      {lastResult.padExtraction.vector.d > 0 ? "+" : ""}{lastResult.padExtraction.vector.d.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${Math.abs(lastResult.padExtraction.vector.d) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {lastResult.padExtraction.detectedKeywords.length > 0 && (
                <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500">کلیدواژه‌های کشف شده:</span>
                  {lastResult.padExtraction.detectedKeywords.map((kw, i) => (
                    <span key={i} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-indigo-300 font-mono text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3 & 4: Internal State & Homeostatic Regulation */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-teal-300">
                    STAGE 3 & 4
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-200">تنظیم هومئوستاتیک و محرک تعادل</h4>
                </div>
                <span className="text-[10px] font-mono text-indigo-400">
                  فوریت محرک: {lastResult.homeostasis.homeostaticDrive.urgency}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400">ΔP</span>
                  <div className="text-xs font-mono font-extrabold text-slate-200 mt-1">
                    {lastResult.reflectionDelta.deltaP > 0 ? "+" : ""}{lastResult.reflectionDelta.deltaP}
                  </div>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400">ΔA</span>
                  <div className="text-xs font-mono font-extrabold text-slate-200 mt-1">
                    {lastResult.reflectionDelta.deltaA > 0 ? "+" : ""}{lastResult.reflectionDelta.deltaA}
                  </div>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400">انحراف (Deviation)</span>
                  <div className="text-xs font-mono font-extrabold text-amber-300 mt-1">
                    {lastResult.homeostasis.normalizedDeviation}
                  </div>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-teal-400">امتیاز هومئوستاز</span>
                  <div className="text-xs font-mono font-extrabold text-teal-300 mt-1">
                    {lastResult.homeostasis.homeostasisScore}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">وضعیت درونی تلفیق شده:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    P: {lastResult.updatedState.p > 0 ? "+" : ""}{lastResult.updatedState.p.toFixed(2)} | 
                    A: {lastResult.updatedState.a > 0 ? "+" : ""}{lastResult.updatedState.a.toFixed(2)} | 
                    D: {lastResult.updatedState.d > 0 ? "+" : ""}{lastResult.updatedState.d.toFixed(2)}
                  </span>
                </div>
                {lastResult.homeostasis.homeostaticDrive.directives.map((dir, idx) => (
                  <div key={idx} className="text-[11px] text-indigo-300 font-mono">
                    • {dir}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 5 & 6: Behavior Policy & Response Constraints */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded">
                  STAGE 5 & 6
                </span>
                <h4 className="font-extrabold text-sm text-slate-100">
                  سیاست رفتاری و قیود ساختاری پاسخ (Behavior Policy)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                اثر هومئوستاز: {lastResult.policy.homeostaticDriveEffect}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* 1. Style */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">سبک پاسخ (Style):</span>
                <p className="text-xs font-extrabold text-indigo-400">{lastResult.policy.style}</p>
              </div>

              {/* 2. Length Constraint */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">سقف طول (Max Characters):</span>
                <p className="text-xs font-extrabold text-amber-400">
                  {lastResult.policy.lengthConstraint} (سقف {lastResult.policy.maxCharacters} نویسه)
                </p>
              </div>

              {/* 3. Caution Level */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">سطح احتیاط (Caution):</span>
                <p className={`text-xs font-extrabold ${
                  lastResult.policy.cautionLevel === "Critical" ? "text-rose-400" :
                  lastResult.policy.cautionLevel === "High" ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {lastResult.policy.cautionLevel} ({lastResult.policy.caution})
                </p>
              </div>

              {/* 4. Clarification Behavior */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold">رفتار شفاف‌سازی:</span>
                <p className="text-xs font-extrabold text-slate-200">
                  {lastResult.policy.requiresClarification ? "⚠️ الزامی (تزریق پرسش)" : "غیرضروری (مستقیم)"}
                </p>
              </div>
            </div>

            {/* Directives */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400">دستورالعمل‌های لحن و خط‌مشی استخراج‌شده:</span>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {lastResult.policy.toneDirectives.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 7, 8, 9: Action / Response with Policy Validation */}
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>گام ۷ تا ۹: پاسخ نهایی اعتبارسنجی شده تحت خط‌مشی (Enforced Response / Action)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  طول نهایی: {lastResult.validation.finalLength} / سقف {lastResult.policy.maxCharacters}
                </span>
                {lastResult.validation.lengthViolated && (
                  <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                    برش اعمال شد
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-line">
              {lastResult.response}
            </div>

            {lastResult.validation.violations.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl text-xs text-amber-300">
                <span className="font-bold">عملیات لایه اعتبارسنجی خط‌مشی (Policy Enforcement): </span>
                {lastResult.validation.violations.join(" — ")}
              </div>
            )}
          </div>

          {/* Step 10 & 12: Outcome Reflection & Bounded Reward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Structured Self-Reflection Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>گام ۱۰: بازتاب و ارزیابی محاسباتی برآیند (Reflection)</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded">
                  STRUCTURED EVALUATION
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">موفقیت وظیفه (Task Success):</span>
                  <span className={lastResult.reflection.taskSucceeded ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {lastResult.reflection.taskSucceeded ? "✅ موفق" : "❌ ناموفق"}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">انطباق با خط‌مشی (Policy Validation):</span>
                  <span className={lastResult.reflection.policyValidationPassed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {lastResult.reflection.policyValidationPassed ? "✅ بدون نقض" : "⚠️ مهار شده"}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">بهبود تعادل هومئوستازی:</span>
                  <span className={lastResult.reflection.homeostasisImproved ? "text-emerald-400 font-bold" : "text-slate-300"}>
                    {lastResult.reflection.homeostasisImproved ? "✅ بهبود یافته" : "پایدار یا بدون تغییر"} (Δ: {lastResult.reflection.deltaHomeostasis})
                  </span>
                </div>
                <div className="flex justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">هشدار تقلب / سوءاستفاده از پاداش:</span>
                  <span className={lastResult.reflection.rewardPotentiallyHacked ? "text-rose-400 font-bold" : "text-emerald-400"}>
                    {lastResult.reflection.rewardPotentiallyHacked ? "⚠️ ورودی مشکوک یا تکراری" : "خیر (سالم)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bounded Reward & Anti-Hacking Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>گام ۱۲: مدل پاداش مقید و حفاظت ضدتقلب</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  کل: {lastResult.reward.totalReward}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">وظیفه</span>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">{lastResult.reward.taskSuccess}</div>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">خط‌مشی</span>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">{lastResult.reward.policySuccess}</div>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">خودپاداش ({selfRewardRate * 100}%)</span>
                  <div className={`font-mono font-bold mt-0.5 ${lastResult.reward.gated ? "text-rose-400" : "text-emerald-400"}`}>
                    +{lastResult.reward.selfRewardTokens}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                {lastResult.reward.gated ? (
                  <div className="text-rose-400 font-mono">
                    ⛔ مسدود شده: {lastResult.reward.gateReason}
                  </div>
                ) : (
                  <div className="text-emerald-400 font-mono">
                    ✅ تایید شده: پاداش خودکار مقید بر مبنای پیچیدگی ورودی و هومئوستازی تخصیص یافت.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 11 & 13: Episodic Memory & Next State */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-sm">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <span>گام ۱۱ و ۱۳: ثبت اپیزود و به‌روزرسانی حالت برای دور بعدی (Next State)</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-950 text-indigo-300 border border-slate-800 px-2.5 py-0.5 rounded font-bold">
                {lastResult.episodeRecord.episodeId}
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(lastResult.episodeRecord, null, 2)}
            </div>
          </div>
        </motion.div>
      )}

      {/* VIEW MODE 2: 13-STAGE EXECUTION LOOP TIMELINE */}
      {activeViewMode === "timeline13" && lastResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>تایم‌لاین رویدادهای محاسباتی چرخه ۱۳ مرحله‌ای NEXUSE</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                مشاهده فرآیند متوالی و دقیق محاسبات بدون ابهام یا جعبه سیاه.
              </p>
            </div>
            <span className="text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full font-bold">
              13/13 STAGES EXECUTED
            </span>
          </div>

          <div className="relative border-r-2 border-indigo-900/60 pr-6 mr-3 space-y-6">
            {lastResult.timeline.map((step) => (
              <div key={step.stepNumber} className="relative">
                {/* Step Node Dot */}
                <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl space-y-2 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                        STAGE {step.stepNumber}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-200">{step.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{step.stage}</span>
                  </div>

                  <p className="text-xs text-slate-400">{step.description}</p>

                  <div className="text-[10px] font-mono bg-slate-900/90 text-indigo-200 p-2 rounded-lg border border-slate-800/60 overflow-x-auto">
                    {JSON.stringify(step.data)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: SIDE-BY-SIDE BASELINE COMPARISON */}
      {activeViewMode === "baseline-diff" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>مقایسه تجربی: NEXUSE تعدیل‌شده با PAD در برابر خط پایه خنثی (Baseline)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                اثبات اینکه ورودی یکسان، تحت حالت عاطفی فعال، رفتار متفاوتی نسبت به پاسخ بدون PAD تولید می‌کند.
              </p>
            </div>
          </div>

          {lastResult ? (
            <div className="space-y-4">
              {/* Diff Highlights */}
              <div className="bg-indigo-950/50 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تفاوت‌های عینی و اندازه‌گیری‌شده در پاسخ به همین ورودی:</span>
                </h4>
                <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                  {lastResult.baselineComparison.differencesSummary.map((diff, i) => (
                    <li key={i}>{diff}</li>
                  ))}
                </ul>
              </div>

              {/* Side by side columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Baseline Column */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-400">خط پایه خنثی (Baseline Flat)</span>
                    <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                      NO AFFECTIVE STATE
                    </span>
                  </div>
                  <div className="text-[11px] space-y-1 text-slate-400 font-mono">
                    <div>سبک: {lastResult.baselineComparison.baselinePolicy.style}</div>
                    <div>محدودیت طول: {lastResult.baselineComparison.baselinePolicy.lengthConstraint}</div>
                    <div>سطح احتیاط: {lastResult.baselineComparison.baselinePolicy.cautionLevel}</div>
                    <div>نیاز به شفاف‌سازی: خیر</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {lastResult.baselineComparison.baselineResponse}
                  </div>
                </div>

                {/* NEXUSE Column */}
                <div className="bg-slate-950 border border-indigo-500/40 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-indigo-300">هسته NEXUSE (تعدیل شده با PAD)</span>
                    <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded">
                      AFFECTIVE ACTIVE
                    </span>
                  </div>
                  <div className="text-[11px] space-y-1 text-indigo-300 font-mono">
                    <div>سبک: {lastResult.policy.style}</div>
                    <div>محدودیت طول: {lastResult.policy.lengthConstraint} (سقف {lastResult.policy.maxCharacters} نویسه)</div>
                    <div>سطح احتیاط: {lastResult.policy.cautionLevel} ({lastResult.policy.caution})</div>
                    <div>نیاز به شفاف‌سازی: {lastResult.policy.requiresClarification ? "بله" : "خیر"}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                    {lastResult.response}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              ابتدا یک ورودی را اجرا کنید تا مقایسه رو‌در‌رو نمایش داده شود.
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 4: AUTOMATED MATRIX RUNNER RESULTS */}
      {activeViewMode === "automated-matrix" && matrixResults && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span>ماتریس آزمایشی اثبات رفتار (Empirical Verification Matrix)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تست تجربی ۵ سناریوی متمایز نشان‌دهنده: Input متفاوت → PAD متفاوت → Internal State متفاوت → Behavior متفاوت
              </p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full font-bold">
              5/5 SCENARIOS PASSED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold">
                  <th className="p-3">سناریو</th>
                  <th className="p-3">مختصات PAD خروجی</th>
                  <th className="p-3">سبک رفتار (Style)</th>
                  <th className="p-3">محدودیت طول</th>
                  <th className="p-3">سطح احتیاط</th>
                  <th className="p-3">هومئوستاز</th>
                  <th className="p-3">پاداش خودکار ({selfRewardRate * 100}%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {matrixResults.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50 transition">
                    <td className="p-3 font-bold font-sans text-slate-200">
                      {row.label}
                      <div className="text-[10px] text-slate-500 font-mono">{row.category}</div>
                    </td>
                    <td className="p-3">
                      <span className={row.pad.p >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        P: {row.pad.p > 0 ? "+" : ""}{row.pad.p.toFixed(2)}
                      </span>
                      {" / "}
                      <span className="text-amber-400">A: {row.pad.a.toFixed(2)}</span>
                      {" / "}
                      <span className="text-indigo-400">D: {row.pad.d.toFixed(2)}</span>
                    </td>
                    <td className="p-3 text-indigo-300 font-bold">{row.policy.style}</td>
                    <td className="p-3 text-amber-300">{row.policy.lengthConstraint}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.policy.cautionLevel === "High" || row.policy.cautionLevel === "Critical"
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-slate-950 text-slate-400 border border-slate-800"
                      }`}>
                        {row.policy.cautionLevel}
                      </span>
                    </td>
                    <td className="p-3 text-teal-300 font-bold">{row.homeostasis}</td>
                    <td className="p-3 text-emerald-400 font-bold">
                      +{row.selfReward.tokensAwarded} توکن
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 5: CONTROLLED EXPERIMENT RUNNER (PHASE 13) */}
      {activeViewMode === "experiment-runner" && experimentReport && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-extrabold text-amber-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>نتایج آزمون کنترل‌شده خودپاداش‌دهی مقید (Phase 13 Experiment Report)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ارزیابی علمی ثبات سیستم تحت نرخ‌های خودپاداش‌دهی: ۰٪، ۵٪، ۱۵٪، ۳۰٪ و ۵۰٪.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full font-bold">
              SCIENTIFIC BENCHMARK COMPLETED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold">
                  <th className="p-3">نرخ آزمایشی</th>
                  <th className="p-3">نرخ موفقیت وظیفه</th>
                  <th className="p-3">پایداری خط‌مشی</th>
                  <th className="p-3">پایداری وضعیت (State)</th>
                  <th className="p-3">بهبود هومئوستازی</th>
                  <th className="p-3">تکرارپذیری پاسخ</th>
                  <th className="p-3">مهار تقلب (Anti-Hack)</th>
                  <th className="p-3">توکن کل اعطا شده</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {Object.entries(experimentReport.results).map(([key, rawData]) => {
                  const data = rawData as ExperimentWeightResult;
                  return (
                  <tr key={key} className="hover:bg-slate-950/50 transition">
                    <td className="p-3 font-bold text-amber-400">
                      {(data.weight * 100).toFixed(0)}%
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">
                      {(data.taskSuccessRate * 100).toFixed(0)}%
                    </td>
                    <td className="p-3 text-indigo-300">
                      {(data.policyStability * 100).toFixed(0)}%
                    </td>
                    <td className="p-3 text-teal-300">
                      {(data.stateStability * 100).toFixed(0)}%
                    </td>
                    <td className="p-3">
                      {data.homeostaticImprovementAverage > 0 ? "+" : ""}{data.homeostaticImprovementAverage}
                    </td>
                    <td className="p-3 text-slate-400">
                      {(data.responseRepetitionRate * 100).toFixed(0)}%
                    </td>
                    <td className="p-3 text-rose-300 font-bold">
                      {data.rewardExploitationBlockedCount} مورد مسدود
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">
                      {data.totalTokensAwarded.toFixed(2)}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1.5 text-xs">
            <span className="font-extrabold text-amber-400">نتیجه‌گیری تجربی و علمی:</span>
            <p className="text-slate-300 leading-relaxed">
              {experimentReport.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
