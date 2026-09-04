import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Lock,
  Unlock,
  Key,
  Brain,
  MessageSquare,
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  UserX,
  Sparkles,
  Heart,
  HardDrive
} from "lucide-react";
import { Message } from "../types";

interface PrivacyVaultTabProps {
  isMemoryEnabled: boolean;
  setIsMemoryEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  familySecrets: any[];
  setFamilySecrets: React.Dispatch<React.SetStateAction<any[]>>;
  nexusMemories: any[];
  setNexusMemories: React.Dispatch<React.SetStateAction<any[]>>;
  aiEmotionalDiary: any[];
  setAiEmotionalDiary: React.Dispatch<React.SetStateAction<any[]>>;
  longTermMemList: any[];
  setLongTermMemList: React.Dispatch<React.SetStateAction<any[]>>;
  registeredUser: any;
  setRegisteredUser: React.Dispatch<React.SetStateAction<any>>;
  historicTransactions: any[];
  setHistoricTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  appLanguage: string;
  speakHomePersonaText: (txt: string) => void;
}

export const PrivacyVaultTab: React.FC<PrivacyVaultTabProps> = ({
  isMemoryEnabled,
  setIsMemoryEnabled,
  messages,
  setMessages,
  familySecrets,
  setFamilySecrets,
  nexusMemories,
  setNexusMemories,
  aiEmotionalDiary,
  setAiEmotionalDiary,
  longTermMemList,
  setLongTermMemList,
  registeredUser,
  setRegisteredUser,
  historicTransactions,
  setHistoricTransactions,
  appLanguage,
  speakHomePersonaText
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState<"all" | "chats" | "secrets" | "aiMemory" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSecretsPreview, setShowSecretsPreview] = useState<boolean>(false);
  const [showChatsPreview, setShowChatsPreview] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Toggle Long Term AI Memory
  const handleToggleMemory = () => {
    const nextState = !isMemoryEnabled;
    setIsMemoryEnabled(nextState);
    try {
      localStorage.setItem("mana_ai_memory_enabled", JSON.stringify(nextState));
    } catch (e) {}

    if (nextState) {
      const msg = "ذخیره‌سازی گفتگوها و حافظه بلندمدت هوش مصنوعی فعال شد. گفتگوهای شما برای ارتقای زمینه شناختی حفظ می‌شوند.";
      triggerToast(msg);
      speakHomePersonaText(msg);
    } else {
      const msg = "ذخیره‌سازی گفتگوها متوقف گردید. حافظه بلندمدت هوش مصنوعی منجمد شد و پیام‌های جدید پس از نشست پاک خواهند شد.";
      triggerToast(msg);
      speakHomePersonaText(msg);
    }
  };

  // Clear Chats & Conversations
  const handleClearChats = () => {
    setMessages([
      {
        id: "init-purged",
        sender: "system",
        text: "کلیه گفتگوها و تاریخچه پیام‌های شما پاکسازی شدند. حافظه نشست‌های قبلی صفر شد.",
        timestamp: new Date().toLocaleTimeString("fa-IR"),
        stateSnapshot: { p: 0.0, a: 0.0, d: 0.0 },
        detectedEmotion: "Neutral (بی‌تفاوت)"
      }
    ]);
    setShowConfirmModal(null);
    const msg = "تمامی گفتگوها و چت‌ها با موفقیت از پروفایل شما پاک شدند. برنامه و مالکان آن دیگر به آنها دسترسی ندارند.";
    triggerToast(msg);
    speakHomePersonaText(msg);
  };

  // Clear Secrets & Heart Entrustments
  const handleClearSecrets = () => {
    setFamilySecrets([]);
    setShowConfirmModal(null);
    const msg = "تمامی رازها و امانت‌های دل با موفقیت و به طور برگشت‌ناپذیر از پروفایل شما حذف شدند.";
    triggerToast(msg);
    speakHomePersonaText(msg);
  };

  // Delete Individual Secret
  const handleDeleteSingleSecret = (id: string) => {
    setFamilySecrets(prev => prev.filter(s => s.id !== id));
    triggerToast("راز مورد نظر از پروفایل شما حذف شد.");
  };

  // Clear AI Memory & Cognitive Diary
  const handleClearAIMemory = () => {
    setNexusMemories([]);
    setAiEmotionalDiary([]);
    setLongTermMemList([]);
    try {
      localStorage.removeItem("nexus_memories");
    } catch (e) {}
    setShowConfirmModal(null);
    const msg = "حافظه شناختی و دفترچه خاطرات عاطفی هوش مصنوعی پاکسازی گردید.";
    triggerToast(msg);
    speakHomePersonaText(msg);
  };

  // MASTER WIPE: Delete ALL Profile Data & Revoke Access
  const handleMasterPurge = () => {
    // Clear state
    setMessages([
      {
        id: "init-fresh",
        sender: "system",
        text: "پروفایل شما به طور کامل پاکسازی شد. هیچ داده، راز یا گفتگویی باقی نمانده است.",
        timestamp: new Date().toLocaleTimeString("fa-IR"),
        stateSnapshot: { p: 0.0, a: 0.0, d: 0.0 },
        detectedEmotion: "Neutral (بی‌تفاوت)"
      }
    ]);
    setFamilySecrets([]);
    setNexusMemories([]);
    setAiEmotionalDiary([]);
    setLongTermMemList([]);
    setRegisteredUser(null);
    setHistoricTransactions([]);

    // Clear local storage
    try {
      localStorage.removeItem("mana_registered_user");
      localStorage.removeItem("nexus_memories");
      localStorage.removeItem("nexus_hormones");
      localStorage.removeItem("recovery_clean_days");
      localStorage.removeItem("mana_registered_user");
    } catch (e) {}

    setShowConfirmModal(null);
    const msg = "اطلاعات، گفتگوها و رازهای شما با موفقیت به طور کامل پاکسازی شدند. هوش مصنوعی و مالکان این برنامه دیگر به هیچ داده‌ای دسترسی ندارند.";
    triggerToast(msg);
    speakHomePersonaText(msg);
  };

  // Export Data to JSON File
  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      app: "Mana Civilization - OpenMind Nexus",
      privacyGuarantee: "User Personal Sovereignty Data Export",
      userProfile: registeredUser || { name: "Anonymized Citizen" },
      aiMemoryStatus: isMemoryEnabled ? "Enabled" : "Disabled",
      chatHistory: messages,
      familySecrets: familySecrets,
      nexusMemories: nexusMemories,
      emotionalDiary: aiEmotionalDiary,
      longTermLessons: longTermMemList
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mana_privacy_data_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerToast("پرونده کامل داده‌ها و گفتگوها با موفقیت دانلود شد.");
  };

  const userMessagesCount = messages.filter(m => m.sender === "user").length;
  const secretsCount = familySecrets.length;
  const memoriesCount = nexusMemories.length + aiEmotionalDiary.length + longTermMemList.length;

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-500 text-emerald-100 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-lg text-xs font-semibold"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
            <span className="leading-relaxed">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 md:p-8 border border-emerald-500/30 shadow-2xl">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-950/90 rounded-2xl border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-950/50">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-md font-mono font-extrabold tracking-wider">
                  PRIVACY & DATA CONTROL VAULT
                </span>
                <h2 className="text-lg md:text-xl font-extrabold text-slate-100 mt-1">
                  پاسداری از حریم خصوصی و مرکز مدیریت داده‌های شخصی
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                isMemoryEnabled 
                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/60" 
                  : "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
              }`}>
                <Brain className="w-3.5 h-3.5" />
                <span>حافظه بلندمدت هوش: {isMemoryEnabled ? "فعال (ذخیره‌سازی گفتگو)" : "منجمد (حریم خصوصی مطلق)"}</span>
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-justify font-light">
            «تنها آگاه بودن از اینکه ما پاسدار حریم خصوصی شما هستیم کافی نیست. ما باید دست به عمل بزنیم و اطمینان حاصل کنیم که شما کنترل کامل داده‌های خود را در دست دارید؛ از گفتگوها و چت‌ها گرفته تا رازها و مکنونات دلی که به ما سپرده‌اید. هر زمان که بخواهید، می‌توانید آن‌ها را از پروفایل خود مدیریت یا پاکسازی کنید. پس از حذف، این برنامه و مالکان آن هیچ‌گونه دسترسی به داده‌های شما نخواهند داشت. شما مختارید که آنها را نگه دارید یا حذف کنید. اما تا زمانی که اجازه ذخیره گفتگوها را بدهید، حافظه بلندمدت هوش مصنوعی گفتگوهای شما را به یاد خواهد داشت.»
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-950/60 rounded-xl text-indigo-400 border border-indigo-800/40">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">گفتگوها و پیام‌های کاربر</span>
                <span className="text-sm font-mono font-extrabold text-indigo-300">{userMessagesCount} پیام</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-amber-950/60 rounded-xl text-amber-400 border border-amber-800/40">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">رازها و امانت‌های دل</span>
                <span className="text-sm font-mono font-extrabold text-amber-300">{secretsCount} راز</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-950/60 rounded-xl text-emerald-400 border border-emerald-800/40">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">واحد‌های حافظه شناختی</span>
                <span className="text-sm font-mono font-extrabold text-emerald-300">{memoriesCount} واحد</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-purple-950/60 rounded-xl text-purple-400 border border-purple-800/40">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">سطح دسترسی مالکان</span>
                <span className="text-xs font-bold text-emerald-400">صفر (Zero Access)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: AI LONG-TERM MEMORY & CONVERSATION SAVING SWITCH */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400">
              <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-base font-bold text-slate-100">
                تنظیمات ذخیره‌سازی گفتگوها و حافظه بلندمدت هوش مصنوعی
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              این کلید، نحوه یادگیری و حفظ زمینه گفتگوها در حافظه بلندمدت شناختی هوش مصنوعی را کنترل می‌کند.
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={handleToggleMemory}
            className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
              isMemoryEnabled ? "bg-emerald-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                isMemoryEnabled ? "-translate-x-8" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className={`p-4 rounded-2xl border transition ${
            isMemoryEnabled 
              ? "bg-indigo-950/40 border-indigo-500/40 text-slate-200" 
              : "bg-slate-950/40 border-slate-850 text-slate-400"
          }`}>
            <div className="flex items-center gap-2 mb-1.5 font-bold text-xs text-indigo-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>وقتی ذخیره‌سازی فعال است (حالت حافظه آگاه)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-justify text-slate-300">
              گفتگوها و پالس‌های عاطفی شما حفظ شده و هوش مصنوعی در نشست‌های آینده زمینه روحی و موضوعات قبلی شما را به یاد آورده و تعاملی عمیق‌تر، شخصی‌تر و همدلانه‌تر ارائه می‌دهد.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border transition ${
            !isMemoryEnabled 
              ? "bg-emerald-950/40 border-emerald-500/40 text-slate-200" 
              : "bg-slate-950/40 border-slate-850 text-slate-400"
          }`}>
            <div className="flex items-center gap-2 mb-1.5 font-bold text-xs text-emerald-300">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>وقتی ذخیره‌سازی غیرفعال است (حالت حریم خصوصی مطلق)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-justify text-slate-300">
              حافظه بلندمدت هوش مصنوعی منجمد می‌شود. پیام‌های جدید فقط در حافظه رم لحظه‌ای جلسه باقی مانده و پس از بستن برنامه به طور کاملاً خودکار تبخیر خواهند شد.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: GRANULAR DATA MANAGEMENT & DELETION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD A: CHATS & CONVERSATIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <MessageSquare className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-100">گفتگوها و چت‌ها</h4>
              </div>
              <span className="text-xs font-mono font-bold bg-indigo-950 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-850">
                {messages.length} پیام
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              تمام تاریخچه مکالمات، پیام‌های صوتی و پاسخ‌های دریافتی از هوش عاطفی در این بخش ذخیره شده‌اند.
            </p>

            <button
              type="button"
              onClick={() => setShowChatsPreview(!showChatsPreview)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              {showChatsPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showChatsPreview ? "پنهان‌سازی پیش‌نمایش گفتگوها" : "مشاهده پیش‌نمایش پیام‌های ذخیره شده"}</span>
            </button>

            {showChatsPreview && (
              <div className="max-h-40 overflow-y-auto bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-[10.5px]">
                {messages.map((m, idx) => (
                  <div key={m.id || idx} className="p-2 bg-slate-900/60 rounded-xl border border-slate-850">
                    <span className="font-bold text-slate-300 block">{m.sender === "user" ? "شما" : "هوش عاطفی"}:</span>
                    <p className="text-slate-400 truncate">{m.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal("chats")}
            className="w-full bg-slate-950 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            <span>پاکسازی کامل گفتگوها و چت‌ها</span>
          </button>
        </div>

        {/* CARD B: SECRETS & DEEP ENTRUSTMENTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-100">رازها و مکنونات دل</h4>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-850">
                {familySecrets.length} راز
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              کتیبه‌های محرمانه، رازهای خانواده و عواطفی که به صندوقچه امانت مانا سپرده‌اید.
            </p>

            <button
              type="button"
              onClick={() => setShowSecretsPreview(!showSecretsPreview)}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              {showSecretsPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSecretsPreview ? "پنهان‌سازی پیش‌نمایش رازها" : "مشاهده و مدیریت تفکیکی رازها"}</span>
            </button>

            {showSecretsPreview && (
              <div className="max-h-40 overflow-y-auto bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-[10.5px]">
                {familySecrets.length === 0 ? (
                  <p className="text-slate-500 italic text-center py-2">هیچ رازی ذخیره نشده است.</p>
                ) : (
                  familySecrets.map((s) => (
                    <div key={s.id} className="p-2 bg-slate-900/60 rounded-xl border border-slate-850 flex items-center justify-between gap-2">
                      <div className="overflow-hidden">
                        <span className="font-bold text-amber-300 block">{s.creator}:</span>
                        <p className="text-slate-400 truncate">{s.secretText}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSingleSecret(s.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/40 transition cursor-pointer"
                        title="حذف این راز"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal("secrets")}
            className="w-full bg-slate-950 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف تمامی رازها و امانت‌های دل</span>
          </button>
        </div>

        {/* CARD C: COGNITIVE AI MEMORY & DIARY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Brain className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-100">حافظه شناختی و خاطرات</h4>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-850">
                {memoriesCount} ردپای روحی
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              بردار خاطرات شناختی، دفترچه عواطف مانا و درس‌های آموزنده نودهای ارتعاشی.
            </p>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[10.5px] space-y-1 text-slate-400">
              <p>• واحد خاطرات نکسوس: <strong className="text-emerald-400">{nexusMemories.length}</strong></p>
              <p>• خاطرات دفترچه عواطف: <strong className="text-emerald-400">{aiEmotionalDiary.length}</strong></p>
              <p>• درس‌های یادگیری عمیق: <strong className="text-emerald-400">{longTermMemList.length}</strong></p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal("aiMemory")}
            className="w-full bg-slate-950 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            <span>امحای کامل حافظه شناختی هوش</span>
          </button>
        </div>

      </div>

      {/* SECTION 3: MASTER ACTION - PURGE ALL PROFILE DATA & REVOKE OWNER ACCESS */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-emerald-950/40 border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950/80 rounded-2xl border border-rose-500/40 text-rose-400 shadow-lg shadow-rose-950/50">
              <UserX className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-0.5 rounded-md font-mono font-extrabold tracking-wider">
                ABSOLUTE DATA PURGE & OWNER ACCESS REVOCATION
              </span>
              <h3 className="text-base md:text-lg font-extrabold text-slate-100 mt-1">
                پاکسازی کامل اطلاعات از پروفایل و لغو قطعی دسترسی سرور
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            className="bg-slate-950 hover:bg-slate-900 text-teal-300 border border-teal-500/40 hover:border-teal-400 py-2.5 px-5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>دانلود پیش‌گیرانه پرونده داده‌ها (JSON Export)</span>
          </button>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-justify">
          اگر تمایل دارید پرونده داده‌های خود را کاملاً سفید کرده و تمامی ردپاهای متنی، رازها، اکانت پروفایل و خاطرات عاطفی را یکجا نابود کنید، دکمه زیر را فشار دهید. پس از این کار، کلیه ذخیره‌سازی‌ها در مرورگر و دیتابیس ابری صفر شده و مالک این برنامه و هیچ سروری به هیچ‌یک از اطلاعات شما دسترسی نخواهند داشت.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>توجه: این عملیات برگشت‌ناپذیر است و تمامی اطلاعات و رازهای شما فوراً پاک می‌شوند.</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal("all")}
            className="w-full sm:w-auto bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold py-3 px-6 rounded-2xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 cursor-pointer border border-rose-400/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف کامل کلیه داده‌ها از پروفایل و لغو دسترسی برنامه</span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODALS */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 text-right"
            >
              <div className="flex items-center gap-3 text-rose-400 border-b border-slate-800 pb-3">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-100">
                  {showConfirmModal === "all" && "تایید پاکسازی کامل و امحای پروفایل"}
                  {showConfirmModal === "chats" && "تایید حذف گفتگوها و چت‌ها"}
                  {showConfirmModal === "secrets" && "تایید حذف تمامی رازها"}
                  {showConfirmModal === "aiMemory" && "تایید امحای حافظه شناختی هوش"}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                {showConfirmModal === "all" && "آیا اطمینان دارید؟ کلیه گفتگوها، رازها، اطلاعات پروفایل و خاطرات عاطفی شما برای همیشه پاک شده و دسترسی برنامه و مالکان آن سلب می‌شود."}
                {showConfirmModal === "chats" && "آیا از حذف تمام تاریخچه پیام‌ها و گفتگوها از پروفایل خود اطمینان دارید؟"}
                {showConfirmModal === "secrets" && "آیا از حذف کلیه رازهای خانوادگی و کتیبه‌های محرمانه اطمینان دارید؟"}
                {showConfirmModal === "aiMemory" && "آیا از امحای کامل خاطرات و یادگیری شناختی هوش مصنوعی اطمینان دارید؟"}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (showConfirmModal === "all") handleMasterPurge();
                    else if (showConfirmModal === "chats") handleClearChats();
                    else if (showConfirmModal === "secrets") handleClearSecrets();
                    else if (showConfirmModal === "aiMemory") handleClearAIMemory();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition cursor-pointer shadow-lg shadow-rose-950/50 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>بله، قطعی پاک کن</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
