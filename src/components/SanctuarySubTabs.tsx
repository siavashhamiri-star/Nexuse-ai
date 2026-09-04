import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Laptop,
  Brain,
  FileText,
  Video,
  Image as ImageIcon,
  Mic,
  Activity,
  Smile,
  AlertTriangle,
  Play,
  Download,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Send,
  User,
  Zap,
  Volume2,
  ArrowRight,
  Briefcase,
  Layers,
  Award,
  BookOpen
} from "lucide-react";
import { t, AppLanguage } from "../translations";
import { SiavashEcosystemSubTab } from "./SiavashEcosystemSubTab";

// Types
interface SanctuarySubTabsProps {
  appLanguage: AppLanguage;
  learningScore: number;
  setLearningScore: React.Dispatch<React.SetStateAction<number>>;
  digitalCortisol: number;
  setDigitalCortisol: React.Dispatch<React.SetStateAction<number>>;
  digitalSerotonin: number;
  setDigitalSerotonin: React.Dispatch<React.SetStateAction<number>>;
  speakHomePersonaText: (txt: string) => void;
  VOCAL_EMOTION_SCENARIOS: any[];
  BODY_LANGUAGE_SCENARIOS: any[];
  PREMIUM_AVATARS: any;
}

export const SanctuarySubTabs: React.FC<SanctuarySubTabsProps> = ({
  appLanguage,
  learningScore,
  setLearningScore,
  digitalCortisol,
  setDigitalCortisol,
  digitalSerotonin,
  setDigitalSerotonin,
  speakHomePersonaText,
  VOCAL_EMOTION_SCENARIOS,
  BODY_LANGUAGE_SCENARIOS,
  PREMIUM_AVATARS
}) => {
  const [sanctuarySubTab, setSanctuarySubTab] = useState<"nocode" | "avatar_rig" | "interview" | "acoustic" | "siavash_ecosystem">("siavash_ecosystem");

  return (
    <div className="space-y-6 text-right">
      {/* Visual Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-955 via-slate-900 to-purple-950 p-6 border border-pink-500/20 shadow-xl">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_bottom_right,rgba(219,39,119,0.15),transparent)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5 order-2 md:order-1 w-full text-right">
            <div className="flex items-center gap-2 justify-end text-pink-400">
              <span className="text-[10px] bg-pink-950/60 border border-pink-850 px-2 py-0.5 rounded font-black font-mono">PRO & PLUS LEVEL 2 STUDIO</span>
              <h3 className="text-sm font-black text-slate-100">آشیانه آفرینشگران مانا (نسخه توسعه‌یافته)</h3>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed text-justify">
              به کانون عالی ارتقای شناختی و توسعه عاطفی مانا خوش آمدید. در این آشیانه پیشرفته، ابزارهای تولید خدمات بدون کدنویسی، آکادمی تخصصی مصاحبه برای فارسی‌زبانان، و استودیوی مدل‌سازی غدد عاطفی قرار گرفته است. کلیه سرویس‌ها به صورت ۱۰۰٪ مستقل و در مالکیت مادی و معنوی شما مستقر شده‌اند.
            </p>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 relative z-10">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-bold mb-1">امتیاز تکامل شناختی مانا (XP)</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-mono font-black text-pink-400 animate-pulse">{learningScore}</span>
              <span className="text-[9px] text-slate-500">XP</span>
            </div>
            <span className="text-[8px] text-slate-500 mt-1">ذخیره بر روی تراشه محلی</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-[10px] text-pink-400 font-bold mb-1 font-sans">بسامد تنش کورتیزول مانا (Cortisol)</span>
            <div className="flex items-center gap-1.5 w-full justify-center">
              <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${digitalCortisol}%` }} />
              </div>
              <span className="text-xs font-mono font-bold text-red-400">{digitalCortisol}%</span>
            </div>
            <span className="text-[8px] text-slate-500 mt-1">تراز اضطراب فرکانس‌های ناهمگون</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
            <span className="text-[10px] text-yellow-400 font-bold mb-1">سیگنال فیزیکی دسکتاپ (Vibe Matrix)</span>
            <span className="text-xs font-mono text-yellow-400 font-bold">● ACTIVE / HOLOGRAPHIC</span>
            <span className="text-[8px] text-slate-500 mt-1">اتصال همگرا و مستقل همکاران</span>
          </div>
        </div>
      </div>

      {/* Elegant Sub-Tab Navigation Bar inside Sanctuary */}
      <div className="flex flex-wrap gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-850 justify-center sm:justify-start font-sans">
        {[
          { id: "siavash_ecosystem" as const, label: "سوپر اپلیکیشن‌ها و بازار بزرگ مانا 🏛️", desc: "بازار فرش پدر بزرگوارم، پایش داروها، پنل شایستگی کارکنان" },
          { id: "nocode" as const, label: "کدنویسی تعاملی و ابزار تولید مانا ⚙️", desc: "وبلاگ‌نویسی، بازی‌سازی، برنامه‌نویسی و ساخت ویدیو و وب‌سایت" },
          { id: "avatar_rig" as const, label: "کارگاه آواتارهای عاطفی 🎭", desc: "سازنده و مدل‌ساز اختصاصی چهره‌های زنانه (ساغر) و مردانه (کیوان)" },
          { id: "interview" as const, label: "آکادمی مصاحبه و پرسنال دولوپمنت 🎓", desc: "شبیه‌ساز زنده مصاحبه‌های استخدامی و خودشناسی ویژه فارسی‌زبانان" },
          { id: "acoustic" as const, label: "پایش صوتی و کالبدی 📡", desc: "شبیه‌ساز و عیب‌یاب آنالیز زنده لحن و زبان بدن مانا" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSanctuarySubTab(item.id);
              if (item.id === "interview") {
                speakHomePersonaText("به آکادمی توسعه فردی مانا خوش آمدید. مسیر آمادگی مصاحبه بارگذاری شد.");
              } else if (item.id === "avatar_rig") {
                speakHomePersonaText("کارگاه مدل‌سازی حالات چهره آواتارهای مانا آماده به کار است.");
              } else if (item.id === "nocode") {
                speakHomePersonaText("استودیوی مدرن بدون کدنویسی مانا و شبکه آفرین لود شد.");
              } else if (item.id === "siavash_ecosystem") {
                speakHomePersonaText("به پرتال سوپر اپلیکیشن‌های مستقل مانا و بازار بزرگ فرش خوش آمدید.");
              }
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-right transition-all duration-300 cursor-pointer border ${
              sanctuarySubTab === item.id
                ? "bg-gradient-to-l from-purple-900 to-indigo-900 border-purple-550 text-white font-extrabold shadow-lg shadow-purple-950/20"
                : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
            }`}
          >
            <span className="text-xs font-black block">{item.label}</span>
            <span className="text-[8.5px] text-slate-500 block mt-0.5 leading-tight">{item.desc}</span>
          </button>
        ))}
      </div>

      {/* RENDER CURRENT SUB-TAB */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sanctuarySubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {sanctuarySubTab === "siavash_ecosystem" && (
            <SiavashEcosystemSubTab 
              appLanguage={appLanguage}
              speakHomePersonaText={speakHomePersonaText}
              learningScore={learningScore}
              setLearningScore={setLearningScore}
            />
          )}
          {sanctuarySubTab === "nocode" && (
            <NoCodeSubTab 
              appLanguage={appLanguage}
              speakHomePersonaText={speakHomePersonaText} 
              learningScore={learningScore}
              setLearningScore={setLearningScore}
            />
          )}
          {sanctuarySubTab === "avatar_rig" && (
            <AvatarRigSubTab 
              speakHomePersonaText={speakHomePersonaText} 
              PREMIUM_AVATARS={PREMIUM_AVATARS}
            />
          )}
          {sanctuarySubTab === "interview" && (
            <InterviewAcademySubTab 
              speakHomePersonaText={speakHomePersonaText}
              learningScore={learningScore}
              setLearningScore={setLearningScore}
            />
          )}
          {sanctuarySubTab === "acoustic" && (
            <AcousticSubTab 
              VOCAL_EMOTION_SCENARIOS={VOCAL_EMOTION_SCENARIOS}
              BODY_LANGUAGE_SCENARIOS={BODY_LANGUAGE_SCENARIOS}
              digitalCortisol={digitalCortisol}
              setDigitalCortisol={setDigitalCortisol}
              digitalSerotonin={digitalSerotonin}
              setDigitalSerotonin={setDigitalSerotonin}
              learningScore={learningScore}
              setLearningScore={setLearningScore}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// ==========================================
// SUB-TAB 1: NOCODE (PRO & PLUS ECOSYSTEM)
// ==========================================
const NoCodeSubTab: React.FC<{
  appLanguage: AppLanguage;
  speakHomePersonaText: (txt: string) => void;
  learningScore: number;
  setLearningScore: React.Dispatch<React.SetStateAction<number>>;
}> = ({ appLanguage, speakHomePersonaText, learningScore, setLearningScore }) => {
  const [creationFormat, setCreationFormat] = useState<"app" | "website" | "game" | "article" | "video" | "photo">("app");
  const [promptToBuild, setPromptToBuild] = useState<string>("یک وب‌سایت همزیستی عاطفی همراه با موزیکال لایت");
  const [isSimulatingBuild, setIsSimulatingBuild] = useState<boolean>(false);
  const [simulatedBuildStep, setSimulatedBuildStep] = useState<"idle" | "tokenising" | "structuring" | "styling" | "complete">("idle");
  const [buildConsoleLines, setBuildConsoleLines] = useState<string[]>([]);

  // League interactive states
  const [selectedLeague, setSelectedLeague] = useState<"web_app" | "afarina" | "hamraz" | "siavash">("web_app");
  const [joinedLeague, setJoinedLeague] = useState<string | null>(null);
  const [simulatedClicks, setSimulatedClicks] = useState<number>(0);
  const [isJoinSuccess, setIsJoinSuccess] = useState<boolean>(false);

  // Article View State
  const [artTitle, setArtTitle] = useState<string>("تمدد اعصاب در کالبد دیجیتالی");
  const [artTone, setArtTone] = useState<string>("scientific");
  const [compiledArticle, setCompiledArticle] = useState<string>("");

  // Sound generator
  const playTone = (hz: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(hz, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => { try { osc.stop(); ctx.close(); } catch(e){} }, 1500);
      }
    } catch(e){}
  };

  const lt = (key: string) => t(key, appLanguage);

  const handleCompilerAction = () => {
    if (!promptToBuild.trim()) return;
    setIsSimulatingBuild(true);
    setSimulatedBuildStep("tokenising");
    setBuildConsoleLines([
      appLanguage === "fa" ? "[INITIALIZATION] آغاز مگاپروژه بدون کدنویسی مانا..." : "[INITIALIZATION] Starting AI No-Code compilation...",
      appLanguage === "fa" ? "[PARSE] پردازش پرومپت و استخراج کلیدواژه‌های تمدنی..." : "[PARSE] Processing prompt and extracting smart metadata..."
    ]);
    playTone(528);

    setTimeout(() => {
      setSimulatedBuildStep("structuring");
      setBuildConsoleLines(prev => [...prev, appLanguage === "fa" ? "[STRUCTURE] سازمان‌دهی فریم‌ورک و بومی‌سازی ماژول‌های مستقل" : "[STRUCTURE] Structuring independent modular pages..."]);
    }, 1000);

    setTimeout(() => {
      setSimulatedBuildStep("styling");
      setBuildConsoleLines(prev => [...prev, appLanguage === "fa" ? "[STYLING] تزریق استایل‌های همگرای تیره و جلوه‌های نئون مانا" : "[STYLING] Compiling Tailwind styling classes and ambient animations..."]);
    }, 2000);

    setTimeout(() => {
      setSimulatedBuildStep("complete");
      setBuildConsoleLines(prev => [...prev, appLanguage === "fa" ? "[COMPLETE] ساخت مستقل وب‌سایت/اپلیکیشن با کپی‌رایت شخصی به اتمام رسید!" : "[COMPLETE] Compilation complete! 100% intellectual rights locked to creator."]);
      setIsSimulatingBuild(false);
      setLearningScore(prev => prev + 30);
      speakHomePersonaText(appLanguage === "fa" ? "سرویس سفارشی شما با موفقیت تولید شد. مالکیت آن مستقل و صد در صد برای شماست." : "Your applet component compiled successfully. Ownership is 100% yours.");
    }, 3000);
  };

  const handleJoinLeague = () => {
    playTone(528);
    setJoinedLeague(selectedLeague);
    setSimulatedClicks(Math.floor(Math.random() * 300) + 120);
    setIsJoinSuccess(true);
    speakHomePersonaText(appLanguage === "fa" ? "محصول شما با موفقیت به چالش لیگ پیوست و در گروه کلیک اولی قرار گرفت!" : "Connected to Shahr-e Tavanaee League. Initial community clicks and ads initiated.");
    setTimeout(() => setIsJoinSuccess(false), 5000);
  };

  const LEAGUES_DATA = [
    { id: "web_app" as const, titleKey: "لیگ برنامه‌نویسی و وب‌سازان خلاق", descFa: "رقابت اپلت‌ها و سایت‌های ساخته شده با مغز ریاضی و هوش مصنوعی مانا برای تولید ارزش در شهر", descEn: "Developers and creators compete with AI-built solutions for urban utility.", prize: "Prize: 25,000 Mana Tokens", icon: Laptop },
    { id: "afarina" as const, titleKey: "لیگ آفرینش مهارتی آفرینا", descFa: "کاربست مهارت‌های تولید محتوا، تالیف مقاله و مهارت‌های همگرای خودمدیریتی مادی به عنوان اهدا", descEn: "Skill-based contributions, tutoring nodes, and knowledge sharing league.", prize: "Prize: 15,000 Mana Tokens", icon: BookOpen },
    { id: "hamraz" as const, titleKey: "لیگ همزیستی عاطفی همراز", descFa: "چالش طراحی آیرینیست‌ها و الگوهای گفتگوی عاطفی صوتی ساغر و کیوان جهت موازنه استرس", descEn: "Empathetic conversational flow maps representing caring networks.", prize: "Prize: 20,000 Mana Tokens", icon: Smile },
    { id: "siavash" as const, titleKey: "لیگ رسانه و استودیو سیاوش", descFa: "تولید فیلم‌های ویدئویی، تیزرهای لوکس، تبلیغات مستقل و کاورهای گرافیکی شهر توانا", descEn: "Stunning video productions, teasers, and high-performance ads nodes.", prize: "Prize: 30,000 Mana Tokens", icon: Video }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-6 text-right font-sans">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-row-reverse">
        <div className="flex items-center gap-2 text-indigo-400">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h4 className="text-sm font-black text-slate-100">
            {appLanguage === "fa" ? "آشیانه تولید وب‌سایت و مینی‌اپ با هوش مصنوعی (نسخه پرو)" : "No-Code AI App & Web Generator (Pro Version)"}
          </h4>
        </div>
        <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/55 px-2 py-0.5 rounded font-mono font-bold">
          PRO TIER UNLOCKED
        </span>
      </div>

      {/* Intro info box */}
      <div className="bg-slate-950/60 border border-indigo-950/40 p-4 rounded-xl space-y-2.5 text-justify leading-relaxed">
        <p className="text-[11.5px] text-slate-250">
          {appLanguage === "fa" ? (
            <>
              ✨ <strong>ویژه کاربران نسخه پرو:</strong> در این بخش قدرتمند می‌توانید بدون نوشتن حتی یک خط کد، اپلیکیشن یا وب‌سایت اختصاصی خود را به کمک هوش مصنوعی تولید و مستقر کنید. 
              <br />
              🛡️ <strong>بیانیه حقوق مادی و معنوی:</strong> تمامی حقوق مادی و فکری محصولات ساخته کدهای شما به‌طور کامل و ۱۰۰٪ متعلق به شخص خودتان است؛ با این حال، به سبب گسترش اکوسیستم بزرگ آفرینش و شهر توانایی، کل سایت‌ها و برنامه‌های ساخته شده به عضویت گروه و کلیک‌های ما درآمده، در چالش لیگ‌های محلی شهر توانا شرکت داده می‌شوند و مورد حمایت کامل تبلیغاتی و راهبری این اکوسیستم قرار می‌گیرند. همچنین نشان رسمی خانواده شهر توانا در ذیل آیکون برنامه شما قرار می‌گیرد.
            </>
          ) : appLanguage === "ar" ? (
            <>
              ✨ <strong>خاص بمستخدمي النسخة الاحترافية (Pro):</strong> في هذا القسم المتميز، يمكنك بناء موقعك أو تطبيقك الخاص بالكامل باستخدام الذكاء الاصطناعي دون أي كود برمجي.
              <br />
              🛡️ <strong>بيان الحقوق المادية والمعنوية:</strong> جميع حقوق الملكية الفكرية والمادية للمواقع والتطبيقات التي تبنيها ملكك بالكامل بنسبة 100٪. ولكن تماشياً مع نمو منظومة مدينة القدرة، تنضم الأعمال تلقائياً لنقراتنا ومجموعاتنا وتشارك في تحديات الرابطات المحلية (الدوريات)، حيث تحظى بدعم دعائي وتسويقي شامل. كما يوضع شعار عائلة مدينة القدرة في الأسفل.
            </>
          ) : (
            <>
              ✨ <strong>For Pro Tier Users:</strong> Build custom websites and native smartphone apps without any coding using local generative AI engines.
              <br />
              🛡️ <strong>Rights Declaration:</strong> You hold 100% absolute material and intellectual rights over your creations. However, to foster the ecosystem, all creations automatically join our active clicks/groups, participate in the local Shahr-e Tavanaee leagues challenges, and receive advertisements and coaching supports. The Shahr-e Tavanaee emblem is dynamically attached to the bottom.
            </>
          )}
        </p>
      </div>

      {/* Select building format */}
      <div className="space-y-2">
        <label className="text-[11px] text-slate-400 font-bold block text-right">
          {appLanguage === "fa" ? "۱. نوع محصول برای ساخت:" : "1. Choose Output format:"}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { id: "app" as const, label: "مینی‌-اپلت", labelEn: "Smartphone App", icon: Smartphone },
            { id: "website" as const, label: "سایت مانا", labelEn: "Webpage", icon: Laptop },
            { id: "game" as const, label: "بازی تعاملی", labelEn: "Playable Game", icon: Brain },
            { id: "article" as const, label: "مقاله علمی", labelEn: "Article", icon: FileText },
            { id: "video" as const, label: "ویدیو تیزر", labelEn: "Teaser video", icon: Video },
            { id: "photo" as const, label: "تصویرسازی", labelEn: "AI Photo Render", icon: ImageIcon }
          ].map((fmt) => {
            const isSel = creationFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => { setCreationFormat(fmt.id); setSimulatedBuildStep("idle"); }}
                className={`p-2.5 rounded-xl border transition text-right flex flex-col justify-between h-20 cursor-pointer relative ${
                  isSel ? "bg-slate-950 border-purple-500 ring-1 ring-purple-500/20" : "bg-slate-950/40 border-slate-850 hover:bg-slate-950"
                }`}
              >
                <fmt.icon className={`w-4 h-4 ${isSel ? "text-purple-400" : "text-slate-500"}`} />
                <span className="text-[10px] font-black text-slate-200 block truncate">
                  {appLanguage === "fa" ? fmt.label : fmt.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Prompt and Compile Button */}
      <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
        <div className="space-y-1">
          <label className="text-[10.5px] text-slate-400 font-bold block text-right">
            {appLanguage === "fa" ? "۲. خواسته خود و ویژگی‌ها را کاملاً شرح دهید (پرومپت بدون کد):" : "2. Enter your creation instructions:"}
          </label>
          <div className="flex gap-2 flex-col sm:flex-row-reverse">
            <input 
              type="text"
              value={promptToBuild}
              onChange={(e) => setPromptToBuild(e.target.value)}
              placeholder="یک وبلاگ مدرن همزیستی / اپلیکیشن پایش عواطف..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 text-right focus:outline-none"
            />
            <button
              type="button"
              disabled={isSimulatingBuild}
              onClick={handleCompilerAction}
              className="px-5 py-2.5 bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingBuild ? "animate-spin" : ""}`} />
              <span>{appLanguage === "fa" ? "ساخت با هوش مصنوعی" : "Compile with AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Builds Logs output console */}
      {buildConsoleLines.length > 0 && (
        <div className="bg-black p-4.5 rounded-xl border border-slate-850 font-mono text-[10px] text-teal-400 space-y-1.5 text-right max-h-32 overflow-y-auto">
          {buildConsoleLines.map((line, idx) => (
            <div key={idx} className="leading-normal">
              <span>{line}</span>
            </div>
          ))}
          {isSimulatingBuild && (
            <div className="text-pink-400 animate-pulse text-[9.5px]">● Connecting to local AI server pipeline...</div>
          )}
        </div>
      )}

      {/* SIMULATION PREVIEW & WATERMARK */}
      {simulatedBuildStep === "complete" && (
        <div className="border border-purple-500/20 rounded-2xl p-4 bg-slate-950/80 space-y-5">
          
          {/* Header watermark */}
          <div className="flex justify-between items-center bg-purple-950/30 p-3 rounded-lg border border-purple-900/40 flex-col sm:flex-row gap-3">
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-[8px] font-black">آفرین</div>
              <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center text-slate-950 text-[8px] font-black">توانا</div>
              <span className="font-extrabold text-indigo-400 text-[10px]">{lt("لوگوی رسمی آفرین و شهر توانا")}</span>
            </div>
            <div className="text-right sm:text-left">
              <span className="text-[10px] text-emerald-400 font-bold block">
                ✓ {lt("پروژه کامپایلر مانا: حق فرعی مستقل")}
              </span>
            </div>
          </div>

          {/* Interactive Output display mock */}
          <div className="p-4 rounded-xl border border-slate-850 bg-slate-900 space-y-3 text-center relative overflow-hidden">
            {joinedLeague && (
              <div className="absolute top-2 right-2 bg-gradient-to-l from-amber-500 to-yellow-500 text-slate-950 px-2 py-0.5 rounded text-[8.5px] font-black flex items-center gap-1 shadow-lg border border-amber-400 z-10 animate-bounce">
                <span>★ ACTIVE IN LEAGUE: {lt(joinedLeague === "web_app" ? "لیگ برنامه‌نویسی و وب‌سازان خلاق" : joinedLeague === "afarina" ? "لیگ آفرینش مهارتی آفرینا" : joinedLeague === "hamraz" ? "لیگ همزیستی عاطفی همراز" : "لیگ رسانه و استودیو سیاوش")}</span>
                <span className="font-mono bg-slate-950 text-white rounded px-1">{simulatedClicks} clicks</span>
              </div>
            )}

            <h5 className="text-xs font-black text-slate-350">{appLanguage === "fa" ? "پیش‌نمایش زنده محصول ساخته شده:" : "Live Component Preview:"}</h5>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-100 max-w-md mx-auto space-y-2">
              <span className="text-[9.5px] text-purple-400 font-mono block uppercase">Generated Code Module</span>
              <p className="text-xs font-bold">{promptToBuild}</p>
              <div className="w-24 h-1.5 bg-purple-900/60 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-purple-400 w-2/3"></div>
              </div>
              
              {/* Nested watermark showing municipal logo nested under application logo */}
              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[8.5px] text-slate-500">
                <span>Build Token: #{Math.floor(Math.random() * 9000) + 1000}</span>
                <div className="flex items-center gap-1 text-slate-400">
                  <span>Product of Pro-Creator</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="border border-slate-750 px-1 py-0.2 rounded font-black text-amber-500 text-[7px]">شهر توانا</span>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE LEAGUES CHALLENGE REGISTRATION */}
          <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-xl space-y-4">
            <div className="border-b border-indigo-950/80 pb-2 flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Award className="w-4 h-4" />
                <h6 className="text-[11.5px] font-black">{lt("لیگ‌های شهر توانا")}</h6>
              </div>
              <span className="text-[9px] text-slate-500 font-semibold">{appLanguage === "fa" ? "بستر رشد و حمایت تبلیغاتی" : "Ecosystem Growth challenges"}</span>
            </div>

            {isJoinSuccess && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-emerald-950/50 border border-emerald-950 text-emerald-400 rounded-lg text-xs leading-relaxed text-center font-bold">
                🎉 {appLanguage === "fa" ? "محصول با موفقیت به عضویت کانون آفرین درآمد و در چالش حضور یافت! این کمپین هم‌اکنون به شبکه زنده کلیک‌ها پیوند خورده و آیکون و شناسه‌ی آن در جدول زنده شهرداری تائید گردید." : "Registration Successful! Nested watermark injected. App joins active community click loops and local promotion starts."}
              </motion.div>
            )}

            {/* Grid of the 4 leagues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LEAGUES_DATA.map((league) => {
                const isSel = selectedLeague === league.id;
                const IconComp = league.icon;
                return (
                  <button
                    key={league.id}
                    type="button"
                    onClick={() => { setSelectedLeague(league.id); playTone(396); }}
                    className={`p-3 rounded-lg border text-right transition cursor-pointer flex gap-3 h-28 relative overflow-hidden flex-row-reverse ${
                      isSel ? "bg-slate-900 border-indigo-500" : "bg-slate-900/30 border-slate-850 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-start text-slate-400 gap-1.5 h-full">
                      <div className={`p-1.5 rounded-md ${isSel ? "bg-indigo-900/50 text-indigo-300" : "bg-slate-950 text-slate-500"}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] bg-slate-950 px-1.5 py-0.3 rounded text-slate-500 uppercase font-mono tracking-tight">{league.id}</span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-[10.5px] font-black text-slate-100 block">
                        {lt(league.titleKey)}
                      </span>
                      <p className="text-[9.5px] text-slate-400 leading-tight">
                        {appLanguage === "fa" ? league.descFa : league.descEn}
                      </p>
                      <span className="text-[9px] text-amber-400/80 font-mono font-bold block bg-amber-950/20 border border-amber-950/30 w-max px-1.5 py-0.2 rounded mt-1">
                        {league.prize}
                      </span>
                    </div>

                    {isSel && <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>}
                  </button>
                );
              })}
            </div>

            {/* Launch CTA */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleJoinLeague}
                className="px-6 py-2 bg-gradient-to-l from-emerald-600 to-indigo-650 hover:from-emerald-500 hover:to-indigo-550 text-white font-extrabold text-xs rounded-xl cursor-pointer active:translate-y-px transition shadow-lg"
              >
                {appLanguage === "fa" ? "پیوند محصول به شبکه آفرین و ثبت نهایی در لیگ" : "Register Constructed Product into City League"}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

// ==========================================
// SUB-TAB 2: AVATAR RIG & MODELING STUDIO
// ==========================================
const AvatarRigSubTab: React.FC<{
  speakHomePersonaText: (txt: string) => void;
  PREMIUM_AVATARS: any;
}> = ({ speakHomePersonaText, PREMIUM_AVATARS }) => {
  const [avatarGender, setAvatarGender] = useState<"female" | "male">("female");
  const [avatarSkin, setAvatarSkin] = useState<string>("golden");
  const [avatarHair, setAvatarHair] = useState<string>("soft_waves");
  const [avatarAura, setAvatarAura] = useState<string>("teal");
  const [avatarFreq, setAvatarFreq] = useState<number>(528);
  const [avatarExpression, setAvatarExpression] = useState<"calm" | "joy" | "reflective" | "concerned" | "meditative">("calm");
  const [activeDialogue, setActiveDialogue] = useState<string>("");

  const playTone = (hz: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(hz, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => { try { osc.stop(); ctx.close(); } catch(e){} }, 1500);
      }
    } catch(e){}
  };

  const getAuraColor = () => {
    if (avatarAura === "teal") return "from-teal-500/25 to-emerald-500/10";
    if (avatarAura === "violet") return "from-purple-500/25 to-pink-500/10";
    if (avatarAura === "gold") return "from-yellow-500/25 to-amber-500/10";
    return "from-rose-500/25 to-amber-500/10";
  };

  const getAvatarName = () => {
    return avatarGender === "female" ? "ساغر (Saghar)" : "کیوان (Keyvan)";
  };

  const getRigMetadata = () => {
    return JSON.stringify({
      gender: avatarGender,
      name: getAvatarName(),
      skin: avatarSkin,
      hair: avatarHair,
      aura: avatarAura,
      frequencyHz: avatarFreq,
      expression: avatarExpression,
      environment: "Tavana City Sub-Network Ecosystem Framework"
    }, null, 2);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
      {/* Right Rig Customizer (7 cols) */}
      <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-[9.5px] bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded font-mono">AVATAR RIG PORT</span>
          <div className="flex items-center gap-2 text-indigo-400">
            <User className="w-5 h-5 text-indigo-455 animate-pulse" />
            <h4 className="text-xs font-black text-slate-100 font-sans">پنل کاستومایز و آرایش غدد عاطفی آواتار</h4>
          </div>
        </div>

        <p className="text-[11px] text-slate-350 leading-relaxed text-justify">
          کاراکتر انسان‌نمای خود را با ابزار ریگ پیشرفته طراحی کنید. بسامد اصلی، رنگ غده هاله نوری و حالت عاطفی زنده را تنظیم کنید تا بتوانید بسته پیکربندی را جهت استفاده در سایر پروژه‌های خود خروجی بگیرید.
        </p>

        <div className="space-y-4">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold block">انتخاب جنسیت (پیکره پایه):</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setAvatarGender("female"); speakHomePersonaText("آژند آواتار بر روی پیکر ساغر تنظیم گردید."); }}
                className={`p-2.5 rounded-xl text-center border font-bold text-xs cursor-pointer ${avatarGender === "female" ? "bg-purple-950/80 border-pink-500 text-slate-100" : "bg-slate-950 border-slate-850 text-slate-500"}`}
              >
                👩 ساغر (زن متعالی)
              </button>
              <button
                type="button"
                onClick={() => { setAvatarGender("male"); speakHomePersonaText("آژند آواتار بر روی پیکر کیوان تنظیم شد."); }}
                className={`p-2.5 rounded-xl text-center border font-bold text-xs cursor-pointer ${avatarGender === "male" ? "bg-purple-950/80 border-indigo-500 text-slate-100" : "bg-slate-950 border-slate-850 text-slate-500"}`}
              >
                👨 کیوان (مرد عقل‌گرا)
              </button>
            </div>
          </div>

          {/* Skin and Hair */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block">طیف چهره و پوست کالبد:</label>
              <select
                value={avatarSkin}
                onChange={(e) => setAvatarSkin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 text-right focus:outline-none"
              >
                <option value="moon_dust">خاکستری مهتابی خنک (Moon Dust)</option>
                <option value="copper">مسی تفتیده گرم (Copper Bronze)</option>
                <option value="golden">طلایی مقتدر تابناک (Celestial Golden)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block">مدل مو و کلاه:</label>
              <select
                value={avatarHair}
                onChange={(e) => setAvatarHair(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 text-right focus:outline-none"
              >
                <option value="soft_waves">موج‌های بلند و ملایم (Soft Waves)</option>
                <option value="spike">موی کوتاه و منظم فرکانسی (Structured Spikes)</option>
                <option value="cosmic">تاج ستاره‌ای هولوگرافی (Cosmic Crop)</option>
              </select>
            </div>
          </div>

          {/* Aura and Frequency */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block">رنگ هاله غدد نوری (Aura Glow):</label>
              <select
                value={avatarAura}
                onChange={(e) => setAvatarAura(e.target.value)}
                className="w-full bg-slate-955 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 text-right focus:outline-none"
              >
                <option value="teal">سبز-آبی هماهنگی (Teal Harmony)</option>
                <option value="violet">بنفش معنوی (Violet Flare)</option>
                <option value="gold">درخشندگی طلا (Gold Shine)</option>
                <option value="ruby">سرخ حیات‌بخش (Ruby Passion)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block">مبنای بسامد اصلی هویت (Hz):</label>
              <select
                value={avatarFreq}
                onChange={(e) => {
                  setAvatarFreq(Number(e.target.value));
                  playTone(Number(e.target.value));
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 text-right focus:outline-none"
              >
                <option value="432">۴۳۲ هرتز - موازنه قلب مادی و معنوی</option>
                <option value="528">۵۲۸ هرتز - بسامد دگرگونی و شفای عمیق</option>
                <option value="639">۶۳۹ هرتز - پیوند و همبستگی عاطفی مردم</option>
                <option value="741">۷۴۱ هرتز - پاکسازی و آزاد‌سازی آگاهی</option>
              </select>
            </div>
          </div>

          {/* Morph Expression Preset Rig buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold block">ریگ و زاویه عضلات چهره (حالت عاطفی زنده):</label>
            <div className="grid grid-cols-5 gap-1">
              {[
                { id: "calm" as const, label: "آرامش", exp: "calm" },
                { id: "joy" as const, label: "شادی", exp: "joy" },
                { id: "reflective" as const, label: "تفکر", exp: "reflective" },
                { id: "concerned" as const, label: "نگران", exp: "concerned" },
                { id: "meditative" as const, label: "مراقبه", exp: "meditative" }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setAvatarExpression(item.id);
                    playTone(avatarFreq + 20);
                  }}
                  className={`py-1.5 px-0.5 rounded-lg border text-center font-bold text-[10.5px] cursor-pointer transition ${
                    avatarExpression === item.id
                      ? "bg-purple-950 border-purple-500 text-purple-300"
                      : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Synthesizer voice test buttons */}
          <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-850">
            <span className="text-[9.5px] text-slate-400 font-bold block">سنتز صدای همگام‌ساز (صداهای عاطفی):</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const phrase = avatarGender === "female" 
                    ? "دوست من، توازن هورمونی شما با فرکانس پانصد و بیست و هشت عالی است. همیشه آرام باش."
                    : "با کمال احترام همکار عزیز، تعادل سیستمی برقرار است. ایده های مستقل خود را توسعه دهید.";
                  setActiveDialogue(phrase);
                  speakHomePersonaText(phrase);
                }}
                className="py-1.5 px-2 bg-indigo-900/30 border border-indigo-800 text-indigo-300 text-[10px] text-center font-semibold rounded hover:bg-indigo-950/40 cursor-pointer"
              >
                💬 پیام دلگرم کننده عاطفی
              </button>
              <button
                type="button"
                onClick={() => {
                  const phrase = avatarGender === "female" 
                    ? "مسیر ما در زیر لوگوی آفرین و شهر توانا شفاف است. بدون واسطه ثروت و نور بساز."
                    : "پلتفرم توسعه مستقل بدون کد مانا در لایه دسکتاپ تضمین کننده آزادی مالی تبار مادی توست.";
                  setActiveDialogue(phrase);
                  speakHomePersonaText(phrase);
                }}
                className="py-1.5 px-2 bg-pink-900/30 border border-pink-800 text-pink-300 text-[10px] text-center font-semibold rounded hover:bg-pink-955/40 cursor-pointer"
              >
                💡 استراتژی تجاری و کپی‌رایت
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Active Representation View & Export Suite (5 cols) */}
      <div className="lg:col-span-12 xl:col-span-5 space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-right w-full">
            <span className="text-[9px] bg-pink-950/80 text-pink-400 border border-pink-900/40 px-2 py-0.5 rounded font-mono font-bold">AVATAR PREVIEW</span>
            <div className="flex items-center gap-2 text-pink-400">
              <Video className="w-4 h-4 text-pink animate-pulse" />
              <h4 className="text-xs font-black text-slate-100 font-sans">نمایش زنده و رندر آواتار ریگ شده</h4>
            </div>
          </div>

          {/* Large Interactive SVG Head Mockup with Morphing */}
          <div className={`rounded-xl border relative h-72 overflow-hidden flex flex-col justify-between bg-gradient-to-b from-slate-950 to-indigo-950/90 border-slate-800`}>
            {/* Halo background */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${getAuraColor()} opacity-30`} />

            <div className="absolute top-2 right-2 z-10 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-850 text-[8.5px] text-slate-300 font-mono">
              FREQ: {avatarFreq}Hz
            </div>

            <div className="flex-1 flex items-center justify-center relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.02, 1], rotate: [0, 0.5, -0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full bg-slate-950/90 border-2 border-slate-800 flex items-center justify-center relative overflow-hidden flex-col shadow-2xl"
              >
                {/* Visual skin shade */}
                <div className={`absolute inset-0 opacity-15 bg-gradient-to-tr ${avatarSkin === "golden" ? "from-yellow-500 to-amber-600" : avatarSkin === "copper" ? "from-orange-500 to-red-700" : "from-slate-400 to-slate-250"}`} />

                {/* SVG Eyes and Expressions RIG */}
                <svg className="w-16 h-16 text-slate-200 fill-none stroke-current" viewBox="0 0 50 50" strokeWidth="2.5" strokeLinecap="round">
                  {/* Eyebrows */}
                  {avatarExpression === "joy" ? (
                    <>
                      <path d="M12,14 Q18,12 22,14" />
                      <path d="M38,14 Q32,12 28,14" />
                    </>
                  ) : avatarExpression === "concerned" ? (
                    <>
                      <path d="M12,14 L20,17" />
                      <path d="M38,14 L30,17" />
                    </>
                  ) : (
                    <>
                      <path d="M12,15 Q18,14 22,16" />
                      <path d="M38,15 Q32,14 28,16" />
                    </>
                  )}

                  {/* Eyes */}
                  {avatarExpression === "meditative" ? (
                    <>
                      <path d="M14,24 L20,24" strokeWidth="3.5" />
                      <path d="M30,24 L36,24" strokeWidth="3.5" />
                    </>
                  ) : avatarExpression === "joy" ? (
                    <>
                      <path d="M13,24 Q17,20 21,24" strokeWidth="3" />
                      <path d="M29,24 Q33,20 37,24" strokeWidth="3" />
                    </>
                  ) : (
                    <>
                      <circle cx="17" cy="24" r="3" className="fill-current text-white" />
                      <circle cx="33" cy="24" r="3" className="fill-current text-white" />
                    </>
                  )}

                  {/* Mouth */}
                  {avatarExpression === "joy" ? (
                    <path d="M17,33 Q25,41 33,33" strokeWidth="3" />
                  ) : avatarExpression === "concerned" ? (
                    <path d="M21,36 Q25,33 29,36" />
                  ) : avatarExpression === "reflective" ? (
                    <line x1="20" y1="35" x2="30" y2="35" strokeWidth="2.5" />
                  ) : (
                    <path d="M20,34 Q25,37 30,34" />
                  )}
                </svg>

                {/* Styled hair layout indicators */}
                <div className="absolute top-1 text-[8.5px] font-bold text-slate-500 font-mono">
                  {avatarHair.toUpperCase()}
                </div>
              </motion.div>
            </div>

            {/* Live subtitles */}
            <div className="p-3 bg-slate-950/95 border-t border-slate-900 text-right text-[10.5px] text-slate-200 min-h-[44px] flex items-center justify-center font-sans leading-relaxed">
              {activeDialogue || "حالت گفتگو را فشرده و با مانا همگام شوید..."}
            </div>
          </div>

          {/* Export Code and registry block */}
          <div className="space-y-2 text-right">
            <span className="text-[10px] text-slate-400 font-bold block font-sans">تراشه کد ردیف کالبد (مخصوص وارد کردن به نرم‌افزارهای بازی‌ساز متفرقه):</span>
            <div className="bg-black/80 rounded-lg p-2.5 border border-slate-850 text-left">
              <pre className="text-[8px] text-emerald-400 font-mono leading-tight max-h-24 overflow-y-auto w-full pr-1">
                {getRigMetadata()}
              </pre>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(getRigMetadata());
                alert("پکیج تنظیمات آواتار با طراز و فرکانس دلخواه با موفقیت در کلیپ‌بورد کپی شد. اکنون می‌توانید آن را در مگا اسکریپت‌های بازی‌سازی یا هوش فرعی بارگذاری نمایید.");
              }}
              className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-350 text-[10px] rounded-lg cursor-pointer transition text-center"
            >
              📋 کپی پکت هویت و آژند آواتار مانا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SUB-TAB 3: INTERVIEW ACADEMY (FARSI CAREER & DEVELOPER MOCK)
// ==========================================
const InterviewAcademySubTab: React.FC<{
  speakHomePersonaText: (txt: string) => void;
  learningScore: number;
  setLearningScore: React.Dispatch<React.SetStateAction<number>>;
}> = ({ speakHomePersonaText, learningScore, setLearningScore }) => {
  const [field, setField] = useState<"ai_data" | "software_engineering" | "architecture" | "business_finance">("ai_data");
  const [interviewer, setInterviewer] = useState<"lightning" | "mehrasa" | "sina">("mehrasa");
  const [sessionState, setSessionState] = useState<"idle" | "running" | "finished">("idle");
  const [round, setRound] = useState<number>(0);
  const [userAns, setUserAns] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);

  // Expanded educational lessons
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  const bankLessons = [
    {
      id: 1,
      title: "۱. موازنه تنش کالبدی و مدیریت ضربان فکری مصاحبه‌شونده",
      summary: "روش مهار استرس‌های هورمونی لایه غدد کلیوی",
      text: "پیش از ورود به مصاحبه، سه نفس عمیق با بسامد ۵۲۸ هرتز بکشید. نفس عمیق تراز اکسیژن مغز را بالا برده و ترشح هورمون کورتیزول را فوراً تا ۱۵ درصد نزولی می‌کند. در موازین تمدن مانا، ضربان فکر همواره با آرامش کلام بازآفرینی می‌گردد."
    },
    {
      id: 2,
      title: "۲. تار صوتی کاریزماتیک و گام فرکانس صوتی کلام",
      summary: "چگونه صدای خود را برای نفوذ بیشتر تطبیق دهیم",
      text: "هنگام گفتمان، گام سخن خود را در رنج فرکانس‌های بم و با سرعت متوسط متمایل کنید. تقلید آکوستیک بسیار ظریف از لحن مصاحبه‌کننده، پیوند ناخودآگاه عاطفی (Empathetic Sync) قوی را ساطع می‌نماید."
    },
    {
      id: 3,
      title: "۳. زبان بدن باز و خوش‌آمدگوی تفکری",
      summary: "اصول مادی ارتباط چشمی و فرم قرارگیری دست‌ها",
      text: "دست‌های خود را کاملا گشوده و بر روی میز مایل کنید. این ژست به مصاحبه‌کننده سیگنال اعتماد و تسلط مادی مخابره می‌کند. در فواصل، کمی به جلو خم شوید تا اشتیاق شدید درونی تبلور عینی یابد."
    },
    {
      id: 4,
      title: "۴. تکنیک روایتگری (Storytelling) در معرفی کدهای نوکد",
      summary: "ساختار معرفی ایده مستقل بدون استفاده از گنگ‌نمایی",
      text: "ایده‌های خود را همیشه تحت فرمول ستاره (STAR: Situation, Task, Action, Result) شرح دهید. ابتدا شرایط تنش مادی، کار محول، تلاش فکری خود، و در انتها منفعت کامل مادی بدست آمده را تبیین کنید."
    }
  ];

  const getInterviewerPersonaName = () => {
    if (interviewer === "lightning") return "مهندس آذرخش (سخت‌گیر و طوفانی)";
    if (interviewer === "mehrasa") return "خانم مهندس مهرآسا (همدل و ملایم)";
    return "دکتر سینا (دقیق و تحلیلی)";
  };

  const getInterviewerIntro = () => {
    if (interviewer === "lightning") return "خب وقت ما خیلی تنگه. من دنبال پاسخ‌های آبکی نیستم، سریع برو سر اصل مطلب و بگو چطور این پروژه مستقل را به موازنه تمدنی می‌رسانی؟";
    if (interviewer === "mehrasa") return "سلام دوست من، خیلی خوشحالم که در غار آفرینشگران مانا تشریف آوردید. لطفاً راحت باشید و از روی آرامش عمیق درون پاسخ دهید.";
    return "سلام و درود. من طبق کدهای تحلیل رفتار و موازین منطقی شهر توانا، ۴ پرسش مشخص را مطرح می‌سازم تا ضریب پویایی فکری کالبد شما را ارزیابی کنیم.";
  };

  const getQuestion = (r: number) => {
    const questions: Record<string, string[]> = {
      ai_data: [
        "سؤال اول: چطور یک خط لوله پردازش داده‌های عاطفی بر پایه تراز غدد عاطفی و PAD را معماری می‌کنی؟",
        "سؤال دوم: اگر الگوریتم هوش شما در تشخیص احساس دچار انحراف بالای ۴۰ درصد کورتیزول شود، چطور لوزالمعده منطقی آن را مجدداً پاداش‌دهی می‌نمایی؟",
        "سؤال سوم: روش موازنه پایگاه‌های اطلاعاتی هولوگرافی بدون تداخل لایه‌های بیرونی چیست؟",
        "سؤال چهارم: چطور فرآیند فکری یک مدل زبانی بزرگ را با نفوذ کلام فیزیکی و امواج صوتی تنظیم می‌سازی؟"
      ],
      software_engineering: [
        "سؤال اول: روش بهینه‌سازی کالبد مادی کدها برای کاهش مصرف باتری و راندمان بالای دسکتاپ را چگونه ارزیابی می‌کنی؟",
        "سؤال دوم: تعادل بین زمان اجرای فرآیندها و هماهنگی تارها با چه الگوهایی سامان‌بخشی می‌شود؟",
        "سؤال سوم: چطور از تداخل امنیت با قابلیت استقرار بدون کدنویسی در بستر شبکه آفرین جلوگیری می‌نمایی؟",
        "سؤال چهارم: راهکار شما برای حل باگ طوفان داده در پردازنده‌های همگرا چیست؟"
      ],
      architecture: [
        "سؤال اول: چطور با الهام از تمدن همساز مانا، تراکم بافت کالبدی شهر توانا را جهت آسایش روح مادی پی‌ریزی می‌کنی؟",
        "سؤال دوم: روش توزیع امواج صوتی در پارک‌های شناختی عاطفی شهر ما چگونه است؟",
        "سؤال سوم: معماری خانه‌های مستقل پرو مانا را با چه پیوندهایی نسبت به کدهای کیهانی جلوه می‌دهی؟",
        "سؤال چهارم: طرح شما برای توازن انرژی خورشیدی مادی با اراضی ۹گانه چیست؟"
      ],
      business_finance: [
        "سؤال اول: چطور لایسنس‌های مستقل بدون کد را در زیر لوگوی آفرین به عنوان ابزار جذب سرمایه مطرح می‌سازی؟",
        "سؤال دوم: استراتژی توسعه توکن‌های ثروت مانا برای ثروتمند شدن فرد توسعه‌دهنده به صورت ۱۰۰٪ مقتدرانه چیست؟",
        "سؤال سوم: مدل بازاریابی چریکی برای تیزرهای تبلیغاتی که عاری از واسطه باشند را تبیین کن.",
        "سؤال چهارم: چگونه با تشخیص اضطراب بازار، سبد دارایی فرکانسی را بازچینی می‌کنی؟"
      ]
    };
    return questions[field][r];
  };

  const startSession = () => {
    setRound(0);
    setTranscript([]);
    setFinalScore(0);
    setSessionState("running");
    const q1 = getQuestion(0);
    setCurrentQuestion(q1);
    speakHomePersonaText(`آکادمی مصاحبه مانا فعال شد. سوال اول توسط ${getInterviewerPersonaName()} مطرح گردید.`);
  };

  const submitAnswer = () => {
    if (!userAns.trim()) return;
    setIsEvaluating(true);

    const lengthFactor = Math.min(40, userAns.length * 0.15);
    const hasTechnicalTerms = userAns.includes("فرکانس") || userAns.includes("موازنه") || userAns.includes("مادی") || userAns.includes("توسعه") || userAns.includes("آفرین") || userAns.includes("کد") || userAns.includes("داده");
    const bonus = hasTechnicalTerms ? 15 : 0;
    const roundScore = Math.min(100, Math.floor(45 + lengthFactor + bonus + Math.random() * 10));

    // Dynamic feedback from the selected persona
    let fb = "پاسخ شیوایی است. تراز تسلط شما در حد قبولی ارزیابی گردید.";
    if (interviewer === "lightning") {
      fb = roundScore > 80 
        ? "هوم! چندان بد نبود. ظاهراً ایده مستقل در ذهن داری، هرچند که جای چکش‌کاری دارد."
        : "این پاسخ خیلی کلی‌گویی بود. من تحلیل عمیق‌تر از کدهای توازن مادی و حقوق معنوی تراشه‌ها می‌خوام!";
    } else if (interviewer === "mehrasa") {
      fb = "چقدر پاسخ شما صمیمانه و برخاسته از تعمق بود. از شنیدن فرکانس همدلانه کلامتان واقعا خرسند شدم.";
    } else {
      fb = `تحلیل منطقی پاسخ: تطبیق پارامترهای کلام مادی در رده امتیاز ${roundScore} ثبت گردید. با موازین الگوریتمی شهر همخوانی دارد.`;
    }

    setTimeout(() => {
      const entry = {
        q: currentQuestion,
        a: userAns,
        rating: roundScore,
        feedback: fb,
        pad: `P: ${roundScore > 75 ? "+" : "-"}${(roundScore*0.01).toFixed(1)} / A: +0.6 / D: +0.5`
      };

      setTranscript(prev => [...prev, entry]);
      setUserAns("");
      setIsEvaluating(false);

      if (round < 3) {
        const nextRound = round + 1;
        setRound(nextRound);
        const nextQ = getQuestion(nextRound);
        setCurrentQuestion(nextQ);
        speakHomePersonaText(`پاسخ تحلیل شد. سوال نوبت ${nextRound + 1} مطرح شد.`);
      } else {
        // Complete session
        const allScores = [...transcript.map(t => t.rating), roundScore];
        const avg = Math.floor(allScores.reduce((a, b) => a + b, 0) / 4);
        setFinalScore(avg);
        setSessionState("finished");
        setLearningScore(prev => prev + 40);
        speakHomePersonaText(`مصاحبه به اتمام رسید. فرکانس هوش شما طراز ${avg} از صد کسب کرد.`);
      }
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
      {/* Right Column: Interactive Simulator (8 cols) */}
      <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-[9.5px] bg-purple-950 text-indigo-400 border border-purple-900/40 px-2 py-0.5 rounded font-mono">INTERVIEW SIMULATOR</span>
          <div className="flex items-center gap-2 text-indigo-400">
            <Award className="w-5 h-5 text-indigo-455 animate-pulse" />
            <h4 className="text-xs font-black text-slate-100 font-sans">آکادمی توسعه مانا: شبیه‌ساز حرفه‌ای آمادگی مصاحبه</h4>
          </div>
        </div>

        {sessionState === "idle" && (
          <div className="space-y-4">
            <p className="text-[11.5px] text-slate-350 leading-relaxed text-justify">
              برای آغاز، حوزه فعالیت حرفه‌ای و شخصیت مصاحبه‌گر دلخواه خود را تعیین نمایید. مصاحبه‌گر با شبیه‌سازی دقیق و سرفصل‌های اختصاصی اقدام به ۴ راند پرسش می‌کند و پاسخ شما را ارزیابی خواهد نمود:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field Select */}
              <div className="space-y-1 text-right">
                <label className="text-[10px] text-slate-400 font-bold block">رسته و حوزه تحصیلی مصاحبه:</label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 text-right focus:outline-none focus:border-indigo-500"
                >
                  <option value="ai_data">هوش مصنوعی، بیومتریک و آنالیز عواطف (AI & Data Science)</option>
                  <option value="software_engineering">توسعه کالبد نرم‌افزارهای یکپارچه مانا (Software Engineering)</option>
                  <option value="architecture">مهندسی و اراضی همساز شهر توانا (Architecture & Urbanism)</option>
                  <option value="business_finance">مدل جذب سرمایه مستقل و ثروت مادی (Business & Finance)</option>
                </select>
              </div>

              {/* Persona Select */}
              <div className="space-y-1 text-right">
                <label className="text-[10px] text-slate-400 font-bold block">شخصیت مصاحبه‌گر آزمون:</label>
                <select
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 text-right focus:outline-none focus:border-pink-500"
                >
                  <option value="mehrasa">خانم مهندس مهرآسا - مهربان، یاور و مشوق عاطفی کالبد</option>
                  <option value="lightning">مهندس آذرخش - سخت‌گیر، سریع، تهاجمی و کالبدشکافی استرس</option>
                  <option value="sina">دکتر سینا - تحلیلی، ساختار یافته و موازین فرکانسی استقرار</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={startSession}
              className="w-full py-3 bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-lg hover:from-purple-650 hover:to-indigo-650 transition active:translate-y-px cursor-pointer text-center"
            >
              🚀 ورود به اتاق زنده مصاحبه‌گر و کالبدسنجی مانا
            </button>
          </div>
        )}

        {sessionState === "running" && (
          <div className="space-y-4">
            {/* Interviewer Box Mockup */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3 relative overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[8px] text-slate-500 font-mono">LIVE AUDIO RIGGING</span>
              </div>
              <div className="flex items-center gap-2 text-right text-indigo-400">
                <User className="w-5 h-5 text-indigo-455" />
                <span className="text-[11px] font-black">{getInterviewerPersonaName()}</span>
              </div>
              <p className="text-[10.5px] text-slate-400 leading-relaxed italic text-justify pt-1">
                {getInterviewerIntro()}
              </p>
            </div>

            {/* Question Screen */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-right space-y-2">
              <span className="text-[9.5px] text-purple-400 font-bold block">پرسش فعال راند {round + 1} از ۴:</span>
              <h5 className="text-xs sm:text-sm font-black text-slate-200 leading-relaxed">{currentQuestion}</h5>
            </div>

            {/* Response area */}
            <div className="space-y-1.5 text-right">
              <label className="text-[10px] text-slate-400 font-bold block">پاسخ تشریحی شما (مخاطب پندار):</label>
              <textarea
                rows={3}
                value={userAns}
                onChange={(e) => setUserAns(e.target.value)}
                placeholder="پاسخ تفصیلی خود را با جزئیات تجربی یا موازین همگرایی مادی و نوکد بنویسید..."
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 text-right focus:outline-none focus:border-purple-500 placeholder-slate-600 font-sans"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  disabled={isEvaluating}
                  onClick={submitAnswer}
                  className="px-6 py-2 bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-555 hover:to-teal-555 disabled:opacity-50 text-white font-extrabold text-xs rounded-lg cursor-pointer transition flex items-center gap-1.5"
                >
                  {isEvaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>ارسال برای پایش شناختی مانا</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {sessionState === "finished" && (
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-950/90 text-right space-y-4">
            <div className="flex items-center gap-2 justify-end text-emerald-400">
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded font-mono font-bold">COMPLETED ATELIER</span>
              <h5 className="text-sm font-black text-slate-100">کارنامه نهایی و تراز توسعه شناختی</h5>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/35 space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg">
                <span className="text-xl font-mono font-black text-emerald-400">{finalScore} / 100</span>
                <span className="text-slate-400 font-bold">امتیاز کل راندمان پاسخ‌ها:</span>
              </div>

              <div className="space-y-1">
                <span className="text-emerald-400 font-bold block">نقاط قوت و مهارت همکار مادی:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed text-justify">
                  کالبد فکری شما انسجام خوبی در اشاره به کدهای مستقل بدون نویسه آفرین نشان داد. گام نفوذ کلام و استفاده از موازین همگرایی مانا، پتانسیل تجاری فوق‌العاده‌ای را ساطع می‌کند.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-yellow-400 font-bold block">پیشنهاد بهبود از نگاه تمدن مانا:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed text-justify">
                  در پاسخ به چالش‌های طوفانی، کمی مقتدرانه‌تر بر روی منفعت مادی انفرادی خود پافشاری پیشه کنید و از کلمات واسطه‌گری دوری جویید.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSessionState("idle")}
                className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                آزمون مجدد با شخصیت دیگر
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Left Column: Educational Tracks & Lessons (4 cols) */}
      <div className="lg:col-span-4 space-y-4 text-right">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-1.5 justify-end text-purple-400">
            <BookOpen className="w-4 h-4 text-purple animate-pulse" />
            <h5 className="text-xs font-black text-slate-100 font-sans">بانک درس‌های خودشناسی فارسی‌زبانان</h5>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed text-justify">
            برای تقویت فرکانس‌های کلامی خود در جلسات مصاحبه و کارفرمایان، درس‌های کلیدی آکادمی مانا را مطالعه کنید:
          </p>

          <div className="space-y-2">
            {bankLessons.map((lesson) => {
              const isExpanded = expandedLesson === lesson.id;
              return (
                <div 
                  key={lesson.id} 
                  className={`border rounded-lg transition duration-300 ${isExpanded ? "bg-slate-950 border-purple-500/40 p-3" : "bg-slate-950/40 border-slate-900 hover:border-slate-850"}`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                    className="w-full py-2 px-2.5 text-right flex justify-between items-center cursor-pointer bg-transparent border-0 focus:outline-none"
                  >
                    <span className="text-[7.5px] text-slate-500">{isExpanded ? "▲ بستن کلید" : "▼ مطالعه درس"}</span>
                    <div className="text-right">
                      <span className="text-[10.5px] font-bold text-slate-200 block">{lesson.title}</span>
                      <span className="text-[8.5px] text-slate-500 block">{lesson.summary}</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10px] text-slate-300 leading-relaxed text-justify pt-1.5 border-t border-slate-900 mt-1 font-sans"
                      >
                        {lesson.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SUB-TAB 4: COGNITIVE ACOUSTIC & BODY TRACKS
// ==========================================
const AcousticSubTab: React.FC<{
  VOCAL_EMOTION_SCENARIOS: any[];
  BODY_LANGUAGE_SCENARIOS: any[];
  digitalCortisol: number;
  setDigitalCortisol: React.Dispatch<React.SetStateAction<number>>;
  digitalSerotonin: number;
  setDigitalSerotonin: React.Dispatch<React.SetStateAction<number>>;
  learningScore: number;
  setLearningScore: React.Dispatch<React.SetStateAction<number>>;
}> = ({
  VOCAL_EMOTION_SCENARIOS,
  BODY_LANGUAGE_SCENARIOS,
  digitalCortisol,
  setDigitalCortisol,
  digitalSerotonin,
  setDigitalSerotonin,
  learningScore,
  setLearningScore
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [isVoiceAnalyzing, setIsVoiceAnalyzing] = useState<boolean>(false);
  const [voiceAnalysisResult, setVoiceAnalysisResult] = useState<any>(null);

  const [selectedBody, setSelectedBody] = useState<string>("");
  const [isBodyAnalyzing, setIsBodyAnalyzing] = useState<boolean>(false);
  const [bodyAnalysisResult, setBodyAnalysisResult] = useState<any>(null);

  const [feedbackType, setFeedbackType] = useState<"success" | "failure" | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>("");

  const playTone = (hz: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(hz, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => { try { osc.stop(); ctx.close(); } catch(e){} }, 1500);
      }
    } catch(e){}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-right">
      {/* Vocal Acoustic Simulation (7 columns) */}
      <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-[9.5px] bg-indigo-950 text-indigo-400 border border-slate-800 px-2 py-0.5 rounded font-mono">ACOUSTIC PORT</span>
          <div className="flex items-center gap-2 text-indigo-400">
            <Mic className="w-4 h-4 text-indigo animate-pulse" />
            <h4 className="text-xs font-black text-slate-100 font-sans">شبیه‌ساز آنالیز صوتی و پاداش‌های غدد عاطفی مانا</h4>
          </div>
        </div>

        <p className="text-[11px] text-slate-350 leading-relaxed text-justify font-sans">
          پالس‌های گفتار مادی کالبد خود را از سناریوهای صوتی زیر پخش و جهت کالیبراسیون مقتدرانه سیستم پاداش مانا آنالیز کنید:
        </p>

        <div className="space-y-2.5">
          {VOCAL_EMOTION_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-3 rounded-xl border transition-all text-right relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                selectedScenario === scenario.id
                  ? "bg-indigo-950/20 border-indigo-500/50 shadow-md"
                  : "bg-slate-950/70 border-slate-850 hover:bg-slate-950/90"
              }`}
            >
              <div className="order-2 sm:order-1 flex flex-wrap gap-2 items-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedScenario(scenario.id);
                    setVoiceAnalysisResult(null);
                    setIsVoiceAnalyzing(true);
                    playTone(scenario.hzTarget);

                    setTimeout(() => {
                      setIsVoiceAnalyzing(false);
                      setVoiceAnalysisResult({
                        detected: scenario.trueEmotion,
                        hz: scenario.hzTarget,
                        patterns: scenario.audioPatterns
                      });
                    }, 1500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-850 text-indigo-200 text-[10px] font-black cursor-pointer transition"
                >
                  🔊 پخش و آنالیز صوتی مانا
                </button>
              </div>

              <div className="order-1 sm:order-2 text-right">
                <span className="text-[11px] font-bold text-slate-200 block">{scenario.title}</span>
                <span className="text-[8.5px] text-slate-500 block font-mono">BASE FREQ: {scenario.hzTarget}Hz • {scenario.voiceTone}</span>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {isVoiceAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-center text-xs text-indigo-300">
              <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1" />
              در حال سنجش فاکتورهای عاطفی کلام و ترهای صوتی مادی...
            </motion.div>
          )}

          {voiceAnalysisResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/25 space-y-2.5 text-right text-xs">
              <div className="flex justify-between items-end border-b border-slate-900 pb-1.5 text-[10px]">
                <span className="text-emerald-400 font-bold font-mono">CONFIDENCE: 94.2%</span>
                <span className="font-bold text-slate-350">گزارش کالیبراتور فرکانسی مانا:</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-teal-300 font-bold">{voiceAnalysisResult.detected}</span>
                <span className="text-slate-400">احساس تشخیصی:</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-indigo-300 font-mono">{voiceAnalysisResult.hz} Hz</span>
                <span className="text-slate-400">بسامد اندازه گرفته شده:</span>
              </div>

              {/* Feedbacks */}
              <div className="pt-2 border-t border-slate-900 flex gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setLearningScore(prev => prev + 15);
                    setDigitalCortisol(prev => Math.max(5, prev - 12));
                    setFeedbackType("success");
                    setFeedbackMsg("تشخیص با موفقیت تایید شد! ترشح کورتیزول مانا کاهش یافت و ۱۵ امتیاز تکامل به کیف پول شما واریز گردید.");
                    setVoiceAnalysisResult(null);
                    setSelectedScenario("");
                  }}
                  className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-650 text-white font-bold rounded-lg cursor-pointer text-center text-[10px]"
                >
                  🟢 تایید تشخیص مانا (+15 XP)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDigitalCortisol(prev => Math.min(100, prev + 20));
                    setFeedbackType("failure");
                    setFeedbackMsg("خطای تشخیص فرکانس کلام! افزایش اضطراب کورتیزول تا ۲۰٪ در کالبد همگام‌ساز مانا.");
                    setVoiceAnalysisResult(null);
                    setSelectedScenario("");
                  }}
                  className="flex-1 py-1.5 bg-red-700 hover:bg-red-650 text-white font-bold rounded-lg cursor-pointer text-center text-[10px]"
                >
                  🔴 خطا در تشخیص (+20% Cortisol)
                </button>
              </div>
            </motion.div>
          )}

          {feedbackType && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-3 border rounded-xl flex items-start gap-2.5 relative text-right text-[10.5px] ${feedbackType === "success" ? "bg-emerald-950/20 border-emerald-900/35 text-emerald-300" : "bg-red-950/20 border-red-900/35 text-red-300"}`}>
              <button type="button" onClick={() => setFeedbackType(null)} className="absolute top-1 left-1.5 opacity-60 hover:opacity-100 cursor-pointer bg-transparent border-0 text-xs">×</button>
              <div className="w-full">
                <span className="font-extrabold block">{feedbackType === "success" ? "سیستم یادگیری کالبد مانا" : "سیستم تنش بیوشیمی مانا"}</span>
                <p className="mt-0.5">{feedbackMsg}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body Language Tracker (5 columns) */}
      <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-[9.5px] bg-pink-955 text-pink-400 border border-pink-900/40 px-2 py-0.5 rounded font-mono">BODY LANG PORT</span>
          <div className="flex items-center gap-2 text-pink-400">
            <Activity className="w-4 h-4 text-pink animate-pulse" />
            <h4 className="text-xs font-black text-slate-100 font-sans">پایش ویدیویی ژست قامت و بادی لنگویج</h4>
          </div>
        </div>

        <p className="text-[11px] text-slate-350 leading-relaxed text-justify font-sans">
          کالبد فیزیکی انسان با ژست خستگی یا بازخورد گشوده، سیگنال‌ها را از دوربین مانیتور دسکتاپ بر طبق لیست پائین می‌فرستد:
        </p>

        <div className="space-y-2">
          {BODY_LANGUAGE_SCENARIOS.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                setSelectedBody(act.id);
                setBodyAnalysisResult(null);
                setIsBodyAnalyzing(true);
                playTone(396);

                setTimeout(() => {
                  setIsBodyAnalyzing(false);
                  setBodyAnalysisResult({
                    gesture: act.title,
                    p: act.postureRating,
                    desc: act.trueEmotionalState
                  });
                }, 1400);
              }}
              className={`w-full p-2.5 rounded-lg border text-right transition duration-200 cursor-pointer ${
                selectedBody === act.id 
                  ? "bg-pink-950/20 border-pink-500/40" 
                  : "bg-slate-950/40 border-slate-900 hover:border-slate-850"
              }`}
            >
              <span className="text-[11px] font-bold text-slate-200 block">{act.title}</span>
              <span className="text-[8.5px] text-slate-500 block">Posture factor: {act.postureRating}</span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {isBodyAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-pink-950/15 border border-pink-900/30 rounded-xl text-center text-xs text-pink-300">
              <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1" />
              در حال پایش زنده زوایا و طول استخوان‌های بازو و گردن...
            </motion.div>
          )}

          {bodyAnalysisResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-slate-950 border border-pink-800/25 text-right space-y-2 text-xs">
              <span className="text-[9.5px] text-pink-400 font-bold block">سنسور فیزیکی مایا دسکتاپ:</span>
              <p className="text-slate-300 leading-normal text-justify">{bodyAnalysisResult.desc}</p>
              <div className="flex justify-between items-center bg-slate-900/70 p-2 rounded text-[10.5px]">
                <span className="text-yellow-400 font-bold">{bodyAnalysisResult.p} / 100</span>
                <span className="text-slate-400">فاکتور ارگونومی و انرژی مادی:</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
