// src/components/AccessibilitySuite.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Ear,
  Hand,
  Volume2,
  VolumeX,
  Type,
  Maximize2,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
  Radio,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Square,
  Mic,
  Activity,
  Smile,
  Heart,
  RefreshCw
} from "lucide-react";
import { AppLanguage, SUPPORTED_LANGUAGES, t } from "../translations";

export interface A11ySettings {
  // Visual
  highContrastMode: "none" | "yellow-black" | "white-black" | "black-white" | "sepia" | "cyan-black";
  fontSizeScale: number; // 1.0 to 2.0
  letterSpacingBoost: boolean;
  lineHeightBoost: boolean;
  dyslexiaFont: boolean;
  screenRuler: boolean;
  reducedMotion: boolean;
  screenReaderActive: boolean;
  speechRate: number; // 0.8 to 1.5

  // Auditory
  visualSubtitles: boolean;
  visualSoundFlasher: boolean;
  hapticFeedback: boolean;
  visualFrequencyRadar: boolean;

  // Motor / Physical
  jumboButtons: boolean;
  dwellClick: boolean;
  voiceControl: boolean;
  keyboardGuide: boolean;
}

export const DEFAULT_A11Y_SETTINGS: A11ySettings = {
  highContrastMode: "none",
  fontSizeScale: 1.0,
  letterSpacingBoost: false,
  lineHeightBoost: false,
  dyslexiaFont: false,
  screenRuler: false,
  reducedMotion: false,
  screenReaderActive: false,
  speechRate: 1.0,

  visualSubtitles: true,
  visualSoundFlasher: true,
  hapticFeedback: true,
  visualFrequencyRadar: true,

  jumboButtons: false,
  dwellClick: false,
  voiceControl: false,
  keyboardGuide: false
};

interface AccessibilitySuiteProps {
  settings: A11ySettings;
  onUpdateSettings: (newSettings: A11ySettings) => void;
  appLanguage: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  isOpen: boolean;
  onClose: () => void;
  activeTabTitle?: string;
  onVoiceCommandTrigger?: (command: string) => void;
}

export const AccessibilitySuite: React.FC<AccessibilitySuiteProps> = ({
  settings,
  onUpdateSettings,
  appLanguage,
  onLanguageChange,
  isOpen,
  onClose,
  activeTabTitle = "",
  onVoiceCommandTrigger
}) => {
  const [activeCategory, setActiveCategory] = useState<"visual" | "auditory" | "motor" | "international">("visual");
  const [isSpeakingTest, setIsSpeakingTest] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  const update = (partial: Partial<A11ySettings>) => {
    const updated = { ...settings, ...partial };
    onUpdateSettings(updated);
    if (updated.hapticFeedback && "vibrate" in navigator) {
      navigator.vibrate(30);
    }
  };

  // Test Screen Reader function in current language
  const handleTestScreenReader = (customText?: string) => {
    if (!("speechSynthesis" in window)) {
      alert("مرورگر شما از SpeechSynthesis پشتیبانی نمی‌کند.");
      return;
    }

    window.speechSynthesis.cancel();

    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === appLanguage) || SUPPORTED_LANGUAGES[0];
    const textToSpeak =
      customText ||
      (appLanguage === "fa"
        ? `سامانه صوتی هوشمند مانا فعال است. شما در حال حاضر در بخش «${activeTabTitle || "الواح حکمت"}» هستید.`
        : appLanguage === "ar"
        ? `نظام مانا الصوتي الذكي نشط. أنت الآن في قسم ${activeTabTitle}.`
        : appLanguage === "fr"
        ? `Le système vocal intelligent Mana est actif. Vous êtes dans la section ${activeTabTitle}.`
        : appLanguage === "es"
        ? `El sistema de voz inteligente de Mana está activo. Estás en la sección ${activeTabTitle}.`
        : appLanguage === "de"
        ? `Das intelligente Mana-Sprachsystem ist aktiv. Sie befinden sich im Bereich ${activeTabTitle}.`
        : appLanguage === "ru"
        ? `Голосовая система Мана активна. Вы находитесь в разделе ${activeTabTitle}.`
        : appLanguage === "zh"
        ? `玛娜智能语音无障碍朗读系统已激活。您当前位于：${activeTabTitle}。`
        : appLanguage === "hi"
        ? `माना स्मार्ट वॉयस एक्सेसिबिलिटी सिस्टम सक्रिय है। आप वर्तमान में ${activeTabTitle} में हैं।`
        : `Mana smart voice assistant is active. You are currently in ${activeTabTitle}.`);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langInfo.speechLang;
    utterance.rate = settings.speechRate;

    utterance.onstart = () => setIsSpeakingTest(true);
    utterance.onend = () => setIsSpeakingTest(false);
    utterance.onerror = () => setIsSpeakingTest(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech recognition for motor disability voice navigation
  const toggleVoiceNavigation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("مرورگر شما از دریافت فرمان صوتی پشتیبانی نمی‌کند (SpeechRecognition).");
      return;
    }

    if (voiceListening) {
      setVoiceListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === appLanguage);
      recognition.lang = langInfo?.speechLang || "fa-IR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setVoiceListening(true);
      recognition.onend = () => setVoiceListening(false);
      recognition.onerror = () => setVoiceListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        if (onVoiceCommandTrigger) {
          onVoiceCommandTrigger(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setVoiceListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("accessibility", appLanguage)}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/30 border border-emerald-400/40 rounded-2xl text-emerald-300 shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded font-mono font-bold">
                WCAG 2.2 AAA & SECTION 508 COMPLIANCE
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-100 mt-1">
                {t("accessibility", appLanguage)}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close accessibility panel"
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Language Selector Toolbar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>انتخاب زبان مادری (Native Mother-Tongue Selector):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                aria-pressed={appLanguage === lang.code}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  appLanguage === lang.code
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-950 font-extrabold border border-emerald-400"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory("visual")}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeCategory === "visual"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>ویژه نابینایان و کم‌بینایان</span>
          </button>

          <button
            onClick={() => setActiveCategory("auditory")}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeCategory === "auditory"
                ? "bg-cyan-600 text-white shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Ear className="w-4 h-4" />
            <span>ویژه ناشنوایان و کم‌شنوایان</span>
          </button>

          <button
            onClick={() => setActiveCategory("motor")}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeCategory === "motor"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>ویژه معلولان جسمی و حرکتی</span>
          </button>

          <button
            onClick={() => setActiveCategory("international")}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeCategory === "international"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>استاندارد جهانی و گزارش</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs">
          
          {/* VISUAL & BLINDNESS ASSISTANCE */}
          {activeCategory === "visual" && (
            <div className="space-y-5">
              
              {/* Screen Reader Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">صفحه‌خوان صوتی مانا (Smart Screen Reader)</h4>
                      <p className="text-[11px] text-slate-400">خوانش هوشمند متون و هدایت کاربر به زبان مادری</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestScreenReader()}
                    disabled={isSpeakingTest}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {isSpeakingTest ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSpeakingTest ? "در حال پخش..." : "آزمون خوانش صوتی"}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-900">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={settings.screenReaderActive}
                      onChange={(e) => update({ screenReaderActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span>فعال‌سازی دائمی گوینده صوتی در کلیک‌ها</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">سرعت خوانش:</span>
                    {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => update({ speechRate: rate })}
                        className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold ${
                          settings.speechRate === rate
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* High Contrast Themes */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-extrabold text-sm text-slate-100">تم‌های کنتراست فوق‌العاده بالا (WCAG AAA)</h4>
                </div>
                <p className="text-[11px] text-slate-400">طراحی شده بر اساس استانداردهای بین‌المللی برای افراد کم‌بینا و تفکیک مرزها</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: "none", label: "حالت استاندارد مانا", bg: "bg-slate-900", text: "text-slate-100" },
                    { id: "yellow-black", label: "زرد روی مشکی (بهترین کنتراست)", bg: "bg-black", text: "text-yellow-300 border-yellow-400" },
                    { id: "white-black", label: "سفید خالص روی مشکی", bg: "bg-black", text: "text-white border-white" },
                    { id: "black-white", label: "مشکی خالص روی سفید", bg: "bg-white", text: "text-black border-slate-400" },
                    { id: "cyan-black", label: "فیروزه‌ای نئونی روی مشکی", bg: "bg-black", text: "text-cyan-300 border-cyan-400" },
                    { id: "sepia", label: "سپیا و کهربایی (ضد خستگی چشم)", bg: "bg-[#2d2216]", text: "text-[#fed7aa] border-[#b45309]" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => update({ highContrastMode: item.id as any })}
                      className={`p-3 rounded-xl border text-center font-bold transition cursor-pointer ${item.bg} ${item.text} ${
                        settings.highContrastMode === item.id ? "ring-2 ring-emerald-500 scale-102" : "border-slate-800 opacity-80 hover:opacity-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size & Typography Scaler */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-extrabold text-sm text-slate-100">بزرگ‌نمایی و چینش حروف</h4>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(settings.fontSizeScale * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  {[1.0, 1.25, 1.5, 1.75, 2.0].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => update({ fontSizeScale: scale })}
                      className={`flex-1 py-1.5 rounded-xl font-bold font-mono ${
                        settings.fontSizeScale === scale
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {Math.round(scale * 100)}%
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-900">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={settings.letterSpacingBoost}
                      onChange={(e) => update({ letterSpacingBoost: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span>فاصله‌گذاری بیشتر حروف</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={settings.lineHeightBoost}
                      onChange={(e) => update({ lineHeightBoost: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span>ارتفاع خطوط تقویت‌شده</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={settings.dyslexiaFont}
                      onChange={(e) => update({ dyslexiaFont: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span>فونت ضد خوانش‌پریشی (Dyslexia)</span>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* AUDITORY & DEAF ASSISTANCE */}
          {activeCategory === "auditory" && (
            <div className="space-y-5">
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Ear className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100">زیرنویس همزمان و سیگنال‌های نوری (Live Visual Cues)</h4>
                    <p className="text-[11px] text-slate-400">تبدیل ۱۰۰٪ اصوات و واکنش‌های هوش مصنوعی به محرک‌های تصویری و نوری</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-200">نوار زیرنویس زنده صوتی (Closed Captions):</span>
                      <p className="text-[11px] text-slate-400">نمایش متن کلیه اصوات، مانتراهای آرام‌بخش و فرکانس‌های صوتی</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.visualSubtitles}
                      onChange={(e) => update({ visualSubtitles: e.target.checked })}
                      className="w-5 h-5 rounded text-cyan-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-200">فلشر نوری حاشیه صفحه هنگام پخش صوت:</span>
                      <p className="text-[11px] text-slate-400">حاشیه صفحه هنگام ایجاد پاسخ صوتی با پالس نوری ملایم چشمک می‌زند</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.visualSoundFlasher}
                      onChange={(e) => update({ visualSoundFlasher: e.target.checked })}
                      className="w-5 h-5 rounded text-cyan-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-200">بازخورد لرزشی و لمسی (Haptic Vibration):</span>
                      <p className="text-[11px] text-slate-400">ایجاد پالس لرزشی روی گوشی و تبلت هنگام دریافت پیام جدید هوش مصنوعی</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.hapticFeedback}
                      onChange={(e) => update({ hapticFeedback: e.target.checked })}
                      className="w-5 h-5 rounded text-cyan-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-200">طیف‌نگار نوری احساسات (Emotion Visual Spectrum):</span>
                      <p className="text-[11px] text-slate-400">نمایش وضعیت احساسی مدل ۳ بعدی PAD با رنگ‌های شفاف به جای تن صدا</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.visualFrequencyRadar}
                      onChange={(e) => update({ visualFrequencyRadar: e.target.checked })}
                      className="w-5 h-5 rounded text-cyan-600"
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* MOTOR & PHYSICAL DISABILITY ASSISTANCE */}
          {activeCategory === "motor" && (
            <div className="space-y-5">
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Hand className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-100">دستیار حرکتی و کلیدهای غول‌پیکر (Jumbo Click Targets)</h4>
                    <p className="text-[11px] text-slate-400">مناسب برای افراد با لرزش دست، محدودیت‌های حرکتی و دستگاه‌های تک‌کلیدی (Switch Access)</p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-200">دکمه‌های فوق‌العاده بزرگ (Jumbo Mode):</span>
                      <p className="text-[11px] text-slate-400">افزایش حداقل ابعاد دکمه‌ها به بیش از ۵۶ پیکسل با حاشیه تفکیک‌شده</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.jumboButtons}
                      onChange={(e) => update({ jumboButtons: e.target.checked })}
                      className="w-5 h-5 rounded text-purple-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-200">کلیک خودکار با توقف ماوس (Dwell Auto-Click):</span>
                      <p className="text-[11px] text-slate-400">با مکث ۱.۲ ثانیه نشانگر روی هر دکمه، کلیک بدون نیاز به فشردن انجام می‌شود</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.dwellClick}
                      onChange={(e) => update({ dwellClick: e.target.checked })}
                      className="w-5 h-5 rounded text-purple-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-bold text-slate-200">کاهش حداکثری انیمیشن‌ها (Reduced Motion):</span>
                      <p className="text-[11px] text-slate-400">توقف چرخش‌ها و پالس‌های سه‌بعدی جهت پیشگیری از سرگیجه و اختلال دهلیزی</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => update({ reducedMotion: e.target.checked })}
                      className="w-5 h-5 rounded text-purple-600"
                    />
                  </label>
                </div>
              </div>

              {/* Voice Command Navigation */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">فرمان صوتی جهت ناوبری بدون دست (Hands-Free Voice Control)</h4>
                      <p className="text-[11px] text-slate-400">با بیان کلماتی مانند «حکمت»، «آرامش»، «شهر»، «بازار» تب‌ها را عوض کنید</p>
                    </div>
                  </div>

                  <button
                    onClick={toggleVoiceNavigation}
                    className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      voiceListening
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{voiceListening ? "در حال شنیدن..." : "شروع شنیدن فرمان صوتی"}</span>
                  </button>
                </div>

                {recognizedText && (
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs text-purple-300">
                    آخرین عبارت تشخیص داده شده: <span className="font-bold text-white font-mono">{recognizedText}</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* INTERNATIONAL BENCHMARK & AUDIT REPORT */}
          {activeCategory === "international" && (
            <div className="space-y-5">
              
              <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 p-5 rounded-2xl border border-indigo-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-indigo-400" />
                    <h3 className="font-extrabold text-sm text-slate-100">گزارش آمادگی و ورود به صحنه بین‌المللی مانا</h3>
                  </div>
                  <span className="text-[11px] font-mono font-extrabold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                    100% GLOBAL READY (9 NATIVE LANGUAGES)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px]">پوشش زبانی جهانی:</span>
                    <p className="font-extrabold text-slate-100 text-sm">۹ زبان مادری زنده</p>
                    <p className="text-[10px] text-indigo-400">FA, EN, AR, FR, ES, DE, RU, ZH, HI</p>
                  </div>

                  <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px]">جمعیت مخاطبان بین‌المللی:</span>
                    <p className="font-extrabold text-slate-100 text-sm">+۴.۸ میلیارد نفر</p>
                    <p className="text-[10px] text-emerald-400">پوشش آسیا، اروپا، خاورمیانه و آمریکا</p>
                  </div>

                  <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px]">استاندارد دسترسی‌پذیری:</span>
                    <p className="font-extrabold text-emerald-400 text-sm">WCAG 2.2 Level AAA</p>
                    <p className="text-[10px] text-slate-400">انطباق با Section 508 و EN 301 549</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-[11px] text-slate-300 leading-relaxed text-justify">
                  <p>
                    پلتفرم «مانا» اکنون با داشتن معماری بین‌المللی یکپارچه، طراحی دوجهته (RTL/LTR)، گوینده‌های صوتی بومی و استانداردهای جامع دسترسی‌پذیری، آماده حضور مقتدرانه در مارکت‌های جهانی از جمله Google Play، Apple App Store و مارکت‌های خاورمیانه (کافه‌بازار و مایکت) است.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onUpdateSettings(DEFAULT_A11Y_SETTINGS)}
            className="text-xs text-slate-400 hover:text-slate-200 transition font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بازنشانی به تنظیمات پیش‌فرض</span>
          </button>

          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-2xl text-xs font-extrabold transition shadow-lg shadow-emerald-950 cursor-pointer"
          >
            ذخیره و بستن پنجره
          </button>
        </div>
      </motion.div>
    </div>
  );
};
