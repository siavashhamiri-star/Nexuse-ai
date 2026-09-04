import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Briefcase,
  Layers,
  Heart,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Sliders,
  Eye,
  Settings,
  Volume2,
  Activity,
  ShoppingBag,
  Clock,
  Sparkles,
  Check,
  TrendingUp,
  Coins,
  Shield,
  Smartphone,
  Laptop,
  Brain,
  FileText,
  Video,
  Image as ImageIcon,
  Smile,
  AlertTriangle,
  Flame,
  Scale
} from "lucide-react";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";

// --- Types ---
export interface CarpetItem {
  id: string;
  name: string;
  type: string; // e.g., "تبریز", "کاشان", "اصفهان"
  density: string; // رج‌شمار
  material: string;
  price: number;
  description: string;
  imageColor: string; // Background visual representation
}

export interface CarpetDesign {
  id: string;
  title: string;
  pattern: string[][]; // 8x8 matrix representing colors
  createdAt: string;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  gender: "زن" | "مرد";
  role: string;
  cooperationScore: number; // ۱. تمایل به همکاری
  devotionScore: number;    // ۲. فداکاری در کار
  lawAdherenceScore: number; // ۳. پایبندی به قوانین و مقررات
  seniorSupportScore: number; // ۴. تعهد به حمایت و راهنمایی مدیران ارشد
  welfareDignityScore: number; // ۵. رفاه و کرامت انسانی
  notes: string;
  createdAt: string;
}

export interface HamrastSimulation {
  id: string;
  scenarioName: string;
  aiAlignmentScore: number; // هم‌راستایی هوش مصنوعی
  businessGrowthImpact: number; // اثرگذاری بر بازار فرش
  employeeWelfareIndex: number; // شاخص کرامت کارکنان
  createdAt: string;
}

interface SiavashEcosystemSubTabProps {
  appLanguage: string;
  learningScore: number;
  setLearningScore: React.Dispatch<React.SetStateAction<number>>;
  speakHomePersonaText: (txt: string) => void;
}

export const SiavashEcosystemSubTab: React.FC<SiavashEcosystemSubTabProps> = ({
  appLanguage,
  learningScore,
  setLearningScore,
  speakHomePersonaText
}) => {
  // --- Accessibility Settings ---
  const [largeFont, setLargeFont] = useState<boolean>(true); // Enabled by default for easy reading

  // --- active mini-app state ---
  // We have the 9 super apps slot, with Carpet Market and Employee app as first priorities!
  const [selectedApp, setSelectedApp] = useState<number>(0); // 0: Carpet Market, 1: Employee Welfare, 2: Medication Scheduler, 3-8: Other 6 apps

  // --- Firebase / LocalStorage Dual State ---
  const [dbStatus, setDbStatus] = useState<"connecting" | "cloud" | "offline">("connecting");
  const [userId, setUserId] = useState<string>("anonymous_siavash");

  // --- App 0: Farsh Bazar (Carpet Market) States ---
  const [carpets, setCarpets] = useState<CarpetItem[]>([
    {
      id: "carpet_1",
      name: "فرش ابریشم تبریز طرح علیا",
      type: "تبریز",
      density: "۶۰ رج اعلا",
      material: "چله و گل ابریشم طبیعی",
      price: 4500,
      description: "بافته شده با گره‌های ممتد هنرمندان آذربایجان، گل‌های شاه‌عباسی و حاشیه اسلیمی متقارن.",
      imageColor: "from-red-950 via-rose-900 to-amber-950"
    },
    {
      id: "carpet_2",
      name: "قالی کرک و ابریشم کاشان طرح شکارگاه",
      type: "کاشان",
      density: "۵۰ رج",
      material: "کرک اصفهان و گل ابریشم",
      price: 3200,
      description: "نقوش بی‌بدیل مینیاتوری شکارگاه، رنگرزی کاملاً گیاهی و ثبات رنگ ابدی در گذر نسل‌ها.",
      imageColor: "from-blue-950 via-indigo-900 to-slate-900"
    },
    {
      id: "carpet_3",
      name: "گلیم نقش‌برجسته ابریشمی قم دوجانبه",
      type: "قم",
      density: "۸۰ رج فوق‌نفیس",
      material: "۱۰۰٪ تار و پود ابریشم خاص",
      price: 8900,
      description: "ظرافت مبهوت‌کننده تار و پود، شاهکار بافت تمدنی ایران زمین با نشان رسمی اصالت تجاری.",
      imageColor: "from-emerald-950 via-teal-900 to-stone-900"
    },
    {
      id: "carpet_4",
      name: "فرش دستباف ابریشم اصفهان طرح شاه عباسی دنا",
      type: "اصفهان",
      density: "۷۵ رج نفیس",
      material: "تار و پود ابریشم و خامه کرک طبیعی اصفهان",
      price: 9500,
      description: "شاهکار ابدی بافته شده در اصفهان، نقوش قرینه اسلیمی با گره‌های ریز فوق العاده متراکم و رنگ‌های گرم روناسی زنده.",
      imageColor: "from-amber-900 via-rose-950 to-orange-950"
    },
    {
      id: "wood_1",
      name: "منبت‌کاری چوب گردوی کهنسال اصفهان",
      type: "اصفهان (چوب)",
      density: "منبت دست سه بعدی اعلا",
      material: "چوب گردوی جنگلی خشک سنتی",
      price: 2800,
      description: "کنده‌کاری اصیل سنتی دست استادکاران متبحر اصفهان، جزئیات مینیاتوری از طرح‌های اسلیمی، آغشته به روغن گیاهی محافظ.",
      imageColor: "from-amber-955/30 via-stone-900 to-amber-950/40"
    },
    {
      id: "silver_1",
      name: "ظرف نقره‌کوب قلم‌زنی اسلیمی اصفهان",
      type: "اصفهان (نقره)",
      density: "قلم‌زنی اعلا (تراکم بالا)",
      material: "نقره خالص ۹۲۵ و پایه مس سرخ اصفهان",
      price: 5400,
      description: "قلم‌زنی مینیاتوری نفیس با چکش‌کاری دستی سنتی، هم‌فرکانس با ارتعاشات عاطفی کالبد و سنسورهای مادی مانا.",
      imageColor: "from-slate-800 via-zinc-800 to-slate-900"
    }
  ]);
  const [walletPaya, setWalletPaya] = useState<number>(12500);
  const [carpetHistory, setCarpetHistory] = useState<string[]>([
    "افتتاح بازار فرش به میمنت تشویق‌ها و دعای خیر پدر بزرگوارم.",
    "خرید فرضی قالیچه نائین اهدایی به موزه کلان‌شهر توانا."
  ]);

  // Carpet pattern design grid (8x8)
  const initialGrid = Array(8).fill(null).map(() => Array(8).fill("#3f3f46"));
  const [currentPattern, setCurrentPattern] = useState<string[][]>(initialGrid);
  const [selectedPaintColor, setSelectedPaintColor] = useState<string>("#ef4444");
  const [customDesigns, setCustomDesigns] = useState<CarpetDesign[]>([]);
  const [designName, setDesignName] = useState<string>("طرح مانا اسلیمی");

  const AVAILABLE_COLORS = [
    { code: "#ef4444", name: "سرخ روناسی" },
    { code: "#3b82f6", name: "لاجوردی عباسی" },
    { code: "#0d9488", name: "سبز یشمی فیروزه" },
    { code: "#f59e0b", name: "زعفرانی طلایی" },
    { code: "#ec4899", name: "گلی بهاری مانا" },
    { code: "#ffffff", name: "سفید ابریشمی" },
    { code: "#18181b", name: "مشکی سورمه‌ای" }
  ];

  // --- App 1: Employee Management States ---
  const [employees, setEmployees] = useState<EmployeeRecord[]>([
    {
      id: "emp_1",
      name: "سهراب رحمانی",
      gender: "مرد",
      role: "مدیر ارشد بافت و رنگرزی",
      cooperationScore: 9,
      devotionScore: 10,
      lawAdherenceScore: 10,
      seniorSupportScore: 9,
      welfareDignityScore: 9,
      notes: "از همکاران وفادار و باسابقه کارگاه فرش بازار، فداکاری تام در سرپرستی کارگاه رنگرزی طبیعی.",
      createdAt: "۱۴۰۲/۰۴/۱۲"
    },
    {
      id: "emp_2",
      name: "مریم حسینی",
      gender: "زن",
      role: "طراح ارشد و نقشه‌کِش فرش",
      cooperationScore: 10,
      devotionScore: 9,
      lawAdherenceScore: 9,
      seniorSupportScore: 10,
      welfareDignityScore: 10,
      notes: "ارائه‌دهنده مشاوره‌های حیاتی و راهگشا به مدیریت ارشد (جناب سیاوش) در مدل‌سازی طرح‌های نوین.",
      createdAt: "۱۴۰۲/۰۶/۲۵"
    }
  ]);

  // Form states for adding/editing employees
  const [newEmpName, setNewEmpName] = useState<string>("");
  const [newEmpGender, setNewEmpGender] = useState<"زن" | "مرد">("زن");
  const [newEmpRole, setNewEmpRole] = useState<string>("");
  const [newEmpCoop, setNewEmpCoop] = useState<number>(9);
  const [newEmpDevotion, setNewEmpDevotion] = useState<number>(9);
  const [newEmpLaw, setNewEmpLaw] = useState<number>(9);
  const [newEmpSeniorSup, setNewEmpSeniorSup] = useState<number>(9);
  const [newEmpWelfare, setNewEmpWelfare] = useState<number>(10);
  const [newEmpNotes, setNewEmpNotes] = useState<string>("");

  // Advice submission box
  const [adviceText, setAdviceText] = useState<string>("");
  const [adviceLog, setAdviceLog] = useState<{ id: string; sender: string; text: string; date: string }[]>([
    { id: "adv_1", sender: "مریم حسینی", text: "پیشنهاد می‌کنم بخش فروش آنلاین فرش بازار را با باشگاه مشتریان مانا متصل کنیم تا کاربران از پاداش‌های متقابل بهره‌مند شوند.", date: "۱۴۰۲/۰۹/۱۰" }
  ]);

  // --- Faraji Bazaar Deep Features States ---
  const [bazaarTab, setBazaarTab] = useState<number>(0); // 0: Store/Loom, 1: Qualifications/Pricing/Portrait, 2: Sotheby's/Christie's, 3: Merchant Rooms, 4: Ads
  
  // --- Independent Carpet Appraiser & Storyteller AI States ---
  const [bazaarLanguage, setBazaarLanguage] = useState<string>("fa");
  const [selectedAppraisalCarpet, setSelectedAppraisalCarpet] = useState<string>("carpet_1");
  const [appraisalDensity, setAppraisalDensity] = useState<number>(60);
  const [appraisalMaterial, setAppraisalMaterial] = useState<string>("چله ابریشم طبیعی");
  const [appraisalSize, setAppraisalSize] = useState<number>(6); // Square meters
  const [appraisalOrigin, setAppraisalOrigin] = useState<string>("اصفهان");
  const [appraisalIsLoading, setAppraisalIsLoading] = useState<boolean>(false);
  const [appraisalResultPrice, setAppraisalResultPrice] = useState<number | null>(7200);
  const [appraisalStory, setAppraisalStory] = useState<string>(
    "«افسانه قالی نصف جهان»\nدر قلب میدان نقش جهان اصفهان، دختری به نام گلبهار زیر گنبد فیروزه‌ای مسجد عباسی می‌نشست. او هر گره از این فرش را به نام عشقی مادی و آسمانی گره زد. تاروپود این اثر از ابریشم ناب کاشان و رنگ روناسی سنتی سیراب شده است. هر گل شاه‌عباسی آن نشان‌دهنده یک ستاره در شب‌های کویر مرکزی ایران است..."
  );

  const BAZAAR_LANGUAGES = [
    { code: "fa", name: "فارسی", flag: "🇮🇷", welcome: "به دروازه بین‌المللی بازار پارچ و صنایع دستی خوش آمدید. رونق و توسعه تجارت صنایع دستی نفیس و فرش ایرانی فراتر از مرزها." },
    { code: "en", name: "English", flag: "🇬🇧", welcome: "Welcome to the international gateway of Parch Bazaar. Supporting global trade of exquisite Persian carpets and traditional handicrafts." },
    { code: "ar", name: "العربية", flag: "🇸🇦", welcome: "مرحباً بكم في البوابة الدولية لبازار بارتش. دعم التجارة العالمية للسجاد الإيراني الرائع والصناعات اليدوية التقليدية." },
    { code: "de", name: "Deutsch", flag: "🇩🇪", welcome: "Willkommen am internationalen Tor von Parch Bazaar. Unterstützung des weltweiten Handels mit exquisiten persischen Teppichen und Kunsthandwerk." },
    { code: "fr", name: "Français", flag: "🇫🇷", welcome: "Bienvenue sur le portail international de Parch Bazaar. Soutien au commerce mondial de tapis persans exquis et d'artisanat traditionnel." },
    { code: "ja", name: "日本語", flag: "🇯🇵", welcome: "パルチバザールの国際ゲートウェイへようこそ。絶妙なペルシャ絨毯と伝統工芸品のグローバル貿易をサポートします。" },
    { code: "zh", name: "中文", flag: "🇨🇳", welcome: "欢迎来到 Parch Bazaar 国际门户。支持精美波斯地毯和传统手工艺品的全球贸易。" },
    { code: "ru", name: "Русский", flag: "🇷🇺", welcome: "Добро пожаловать на международный портал Парч Базара. Поддержка глобальной торговли изысканными персидскими коврами." },
    { code: "tr", name: "Türkçe", flag: "🇹🇷", welcome: "Parch Bazaar'ın uluslararası kapısına hoş geldiniz. Enfes İran halılarının و geleneksel el sanatlarının küresel ticaretini desteklemek." },
    { code: "es", name: "Español", flag: "🇪🇸", welcome: "Bienvenido al portal internacional de Parch Bazaar. Apoyando el comercio mundial de exquisitas alfombras persas y artesanías tradicionales." },
    { code: "it", name: "Italiano", flag: "🇮🇹", welcome: "Benvenuto nel portale internazionale de Parch Bazaar. Sostegno al commerce globale di squisiti tappeti persiani e artigianato tradicional." },
    { code: "ur", name: "اردو", flag: "🇵🇰", welcome: "پارچ بازار کے بین الاقوامی گیٹ وے میں خوش آمدید۔ شاندار ایرانی قالینوں اور روایتی دستکاریوں کی عالمی تجارت کا فروغ" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳", welcome: "पार्च बाज़ार के अंतर्राष्ट्रीय गेटवे में आपका स्वागत है।" }
  ];

    // 1. Designers and Designs Qualifications State
  const [designers, setDesigners] = useState<Array<{ id: string; name: string; specialty: string; level: string; approved: boolean }>>([
    { id: "des_1", name: "استاد اصغر بیات", specialty: "طراحی اسلیمی و خطایی", level: "درجه ۱ بین‌المللی", approved: true },
    { id: "des_2", name: "مریم حسینی", specialty: "نقشه‌کشی نوین مانا", level: "خبره دیجیتال", approved: true }
  ]);
  const [certifiedDesigns, setCertifiedDesigns] = useState<Array<{ id: string; title: string; density: number; masterName: string; status: string }>>([
    { id: "cd_1", title: "طرح لچک ترنج افشان", density: 70, masterName: "استاد رضوی کاشانی", status: "دارای گواهی اصالت تجاری" }
  ]);
  
  // Custom Portrait / Carpet requests
  const [portraitRequests, setPortraitRequests] = useState<Array<{ id: string; clientName: string; reqType: "فرش سفارشی" | "پرتره چهره اشخاص"; description: string; price: number; status: string; date: string }>>([
    { id: "req_1", clientName: "حاج رضا توکلی", reqType: "پرتره چهره اشخاص", description: "بافت پرتره پدر مرحوم بر اساس تصویر اسکن شده با تراکم رج‌شمار بالا", price: 4200, status: "در حال بافت", date: "۱۴۰۲/۰۹/۰۱" }
  ]);
  
  // Expert Carpet Pricing Calculators
  const [pricingLogs, setPricingLogs] = useState<Array<{ id: string; carpetType: "دستباف" | "ماشینی"; density: number; material: string; area: number; estimatedPrice: number; date: string }>>([
    { id: "pr_1", carpetType: "دستباف", density: 60, material: "چله ابریشم", area: 6, estimatedPrice: 7200, date: "۱۴۰۲/۰۹/۰۸" }
  ]);

  // 2. International Christie's / Sotheby's invitations
  const [intlProposals, setIntlProposals] = useState<Array<{ id: string; target: "Christies" | "Sothebys"; title: string; budget: number; status: "در حال بررسی" | "تایید اولیه" | "آماده‌سازی حراج"; date: string }>>([
    { id: "prop_1", target: "Sothebys", title: "پروپوزال رسمی حراج تابلوفرش‌های پرتره اصیل ایرانی در شعبه لندن", budget: 25000, status: "تایید اولیه", date: "۱۴۰۲/۰۸/۲۰" }
  ]);

  // 3. Online Community & Rooms
  const [merchantMessages, setMerchantMessages] = useState<Array<{ id: string; sender: string; text: string; time: string }>>([
    { id: "msg_1", sender: "تاجر تبریزی (حاج احمد)", text: "همکاران گرامی، تقاضا برای فرش چله ابریشم تبریز در بازار امارات بسیار بالا رفته است.", time: "۱۲:۳۰" },
    { id: "msg_2", sender: "بازرگان کاشان", text: "دوستان کسی نخ طبیعی رنگرزی شده با روناس سراغ دارد؟ برای جامه بافته‌شده نیاز فوری داریم.", time: "۱۲:۴۵" }
  ]);
  const [merchantRooms, setMerchantRooms] = useState<Array<{ id: string; owner: string; name: string; isLuxurious: boolean; color: string }>>([
    { id: "room_1", owner: "سید جلال اصفهانی", name: "حجره تجاری فرش زرنیم اصفهان", isLuxurious: false, color: "from-blue-900 to-indigo-950" },
    { id: "room_2", owner: "شرکت فرش مانا دیجیتال", name: "حجره لوکس هوش مصنوعی آفرینش مانا", isLuxurious: true, color: "from-purple-900 via-indigo-950 to-slate-950" }
  ]);

  // 4. Classified Advertisements
  const [classifiedAds, setClassifiedAds] = useState<Array<{ id: string; category: "قالیشویی" | "تابلو هنری" | "ابزارآلات" | "مواد اولیه"; title: string; contact: string; price: string; desc: string }>>([
    { id: "ad_1", category: "مواد اولیه", title: "فروش ویژه نخ ابریشم طبیعی ۱۰۰٪ خالص رنگرزی سنتی", contact: "۰۹۱۲۳۴۵۶۷۸۹", price: "توافقی", desc: "تولید تبریز، آماده ارسال به سراسر کشور با بیمه تجاری مانا." },
    { id: "ad_2", category: "قالیشویی", title: "خدمات شستشو و احیای رنگ تخصصی فرش‌های نفیس دستباف", contact: "۰۹۱۸۷۶۵۴۳۲۱", price: "متری ۵۰,۰۰۰ تومان", desc: "عضو رسمی اتحادیه قالی‌شویان با ضمانت‌نامه متبحرانه صدمه ندیدن تاروپود." },
    { id: "ad_3", category: "ابزارآلات", title: "فروش دارهای ارگونومیک فلزی جک‌دار مناسب قالی و پرتره‌بافی", contact: "۰۹۱۹۸۷۶۵۴۳۲", price: "۳,۵۰۰,۰۰۰ تومان", desc: "تضمین سلامت قامت بافنده و جلوگیری از خستگی مفرط کالبد مادی." }
  ]);

  // Sub-tab form states
  const [newDesignerName, setNewDesignerName] = useState<string>("");
  const [newDesignerSpecialty, setNewDesignerSpecialty] = useState<string>("");
  const [newDesignerLevel, setNewDesignerLevel] = useState<string>("درجه ۱ بین‌المللی");

  const [newDesignTitle, setNewDesignTitle] = useState<string>("");
  const [newDesignDensity, setNewDesignDensity] = useState<number>(60);
  const [newDesignMaster, setNewDesignMaster] = useState<string>("");

  const [newReqClient, setNewReqClient] = useState<string>("");
  const [newReqType, setNewReqType] = useState<"فرش سفارشی" | "پرتره چهره اشخاص">("فرش سفارشی");
  const [newReqDesc, setNewReqDesc] = useState<string>("");
  const [newReqPrice, setNewReqPrice] = useState<number>(3000);

  const [calcType, setCalcType] = useState<"دستباف" | "ماشینی">("دستباف");
  const [calcDensity, setCalcDensity] = useState<number>(50);
  const [calcMaterial, setCalcMaterial] = useState<string>("چله ابریشم");
  const [calcArea, setCalcArea] = useState<number>(6);

  const [newProposalTarget, setNewProposalTarget] = useState<"Christies" | "Sothebys">("Sothebys");
  const [newProposalTitle, setNewProposalTitle] = useState<string>("");
  const [newProposalBudget, setNewProposalBudget] = useState<number>(20000);

  const [newMerchantMsg, setNewMerchantMsg] = useState<string>("");
  const [newRoomName, setNewRoomName] = useState<string>("");

  const [newAdCategory, setNewAdCategory] = useState<"قالیشویی" | "تابلو هنری" | "ابزارآلات" | "مواد اولیه">("مواد اولیه");
  const [newAdTitle, setNewAdTitle] = useState<string>("");
  const [newAdContact, setNewAdContact] = useState<string>("");
  const [newAdPrice, setNewAdPrice] = useState<string>("");
  const [newAdDesc, setNewAdDesc] = useState<string>("");

  // --- App 2: Project Hamrast & Afarineesh Simulation States ---
  const [simulations, setSimulations] = useState<HamrastSimulation[]>([
    { id: "sim_1", scenarioName: "هم‌راستایی طرح‌های اسلیمی مانا با بازاریابی هوشمند فرش", aiAlignmentScore: 92, businessGrowthImpact: 35, employeeWelfareIndex: 95, createdAt: "۱۴۰۲/۰۷/۱۰" },
    { id: "sim_2", scenarioName: "شبیه‌سازی تخصیص سود فرش بازار به صندوق رفاه همکاران زن و مرد", aiAlignmentScore: 98, businessGrowthImpact: 15, employeeWelfareIndex: 100, createdAt: "۱۴۰۲/۰۸/۱۵" }
  ]);
  const [newSimName, setNewSimName] = useState<string>("");
  const [newSimAlignment, setNewSimAlignment] = useState<number>(90);
  const [newSimImpact, setNewSimImpact] = useState<number>(25);
  const [newSimWelfare, setNewSimWelfare] = useState<number>(95);

  // --- App 5: AI Self-Evolution Resonance Method States ---
  const [handicraftEmotion, setHandicraftEmotion] = useState<string>("عشق و صلح ابدی");
  const [handicraftType, setHandicraftType] = useState<string>("Carpet");
  const [aiEmpathyScore, setAiEmpathyScore] = useState<number>(75.4);
  const [aiSelfAwareness, setAiSelfAwareness] = useState<number>(82.1);
  const [artisanHeartRate, setArtisanHeartRate] = useState<number>(72);
  const [metalConductivity, setMetalConductivity] = useState<number>(98.5);
  const [woodAromaPurity, setWoodAromaPurity] = useState<number>(94.2);
  const [aiEmotionLog, setAiEmotionLog] = useState<string>("[آماده دریافت فرکانس] ادراک هوشمند عاطفه فعال است. نوع اثر و عاطفه مورد نظر را انتخاب و دکمه را بفشارید.");

  // Audio tone generator
  const playPerfectTone = (hz: number, duration = 0.5, type: OscillatorType = "sine") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(hz, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => { try { osc.stop(); ctx.close(); } catch (e) {} }, duration * 1000 + 300);
      }
    } catch (e) {}
  };

  // --- Dual Initialization and Syncing ---
  useEffect(() => {
    // Check Auth & Set Up Database
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchDataFromCloud(user.uid);
      } else {
        // Fallback to Local Storage immediately
        setUserId("anonymous_siavash");
        loadDataFromLocal();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadDataFromLocal = () => {
    setDbStatus("offline");
    try {
      const cachedDesigns = localStorage.getItem("farsh_designs");
      if (cachedDesigns) setCustomDesigns(JSON.parse(cachedDesigns));

      const cachedEmployees = localStorage.getItem("farsh_employees");
      if (cachedEmployees) setEmployees(JSON.parse(cachedEmployees));

      const cachedSims = localStorage.getItem("farsh_simulations");
      if (cachedSims) setSimulations(JSON.parse(cachedSims));

      const cachedWallet = localStorage.getItem("farsh_wallet");
      if (cachedWallet) setWalletPaya(Number(cachedWallet));

      const cachedHistory = localStorage.getItem("farsh_history");
      if (cachedHistory) setCarpetHistory(JSON.parse(cachedHistory));

      const cachedAdvice = localStorage.getItem("farsh_advice");
      if (cachedAdvice) setAdviceLog(JSON.parse(cachedAdvice));
    } catch (e) {
      console.warn("Local storage retrieval failed", e);
    }
  };

  const fetchDataFromCloud = async (uid: string) => {
    try {
      setDbStatus("connecting");
      // Fetch user profile statistics
      const profileRef = doc(db, "user_profiles", uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        if (data.walletBalance !== undefined) setWalletPaya(data.walletBalance);
      }

      // Fetch carpets & custom designs
      const designsCol = collection(db, "user_profiles", uid, "carpet_designs");
      const designsSnap = await getDocs(designsCol);
      if (!designsSnap.empty) {
        const cloudDesigns: CarpetDesign[] = [];
        designsSnap.forEach((d) => {
          cloudDesigns.push({ id: d.id, ...d.data() } as CarpetDesign);
        });
        setCustomDesigns(cloudDesigns);
      } else {
        // Use local storage as secondary backup
        const cachedDesigns = localStorage.getItem("farsh_designs");
        if (cachedDesigns) setCustomDesigns(JSON.parse(cachedDesigns));
      }

      // Fetch employees
      const empCol = collection(db, "user_profiles", uid, "employees");
      const empSnap = await getDocs(empCol);
      if (!empSnap.empty) {
        const cloudEmps: EmployeeRecord[] = [];
        empSnap.forEach((e) => {
          cloudEmps.push({ id: e.id, ...e.data() } as EmployeeRecord);
        });
        setEmployees(cloudEmps);
      } else {
        const cachedEmployees = localStorage.getItem("farsh_employees");
        if (cachedEmployees) setEmployees(JSON.parse(cachedEmployees));
      }

      // Fetch simulations
      const simCol = collection(db, "user_profiles", uid, "simulations");
      const simSnap = await getDocs(simCol);
      if (!simSnap.empty) {
        const cloudSims: HamrastSimulation[] = [];
        simSnap.forEach((s) => {
          cloudSims.push({ id: s.id, ...s.data() } as HamrastSimulation);
        });
        setSimulations(cloudSims);
      } else {
        const cachedSims = localStorage.getItem("farsh_simulations");
        if (cachedSims) setSimulations(JSON.parse(cachedSims));
      }

      setDbStatus("cloud");
    } catch (err) {
      console.error("Firestore loading error, switching to fallback:", err);
      loadDataFromLocal();
    }
  };

  // --- Persistent actions ---

  // Purchase carpet
  const buyCarpet = (carpet: CarpetItem) => {
    if (walletPaya < carpet.price) {
      playPerfectTone(396, 0.4, "sawtooth"); // Solfeggio 396Hz tension error tone
      speakHomePersonaText("اعتبار پایا شما کافی نیست. لطفا با فعالیت در مینی‌اپ‌ها پاداش کسب کنید.");
      alert("⚠️ اعتبار پایا کافی نیست! لطفا توکن‌های بیشتری کسب کنید.");
      return;
    }

    const updatedPaya = walletPaya - carpet.price;
    setWalletPaya(updatedPaya);
    const newLog = `قالی بی‌نظیر ${carpet.name} (${carpet.type}) با قیمت ${carpet.price} پایا خریداری و در تمدد عاطفی آتلیه مد مانا مستقر گردید.`;
    const updatedHistory = [newLog, ...carpetHistory];
    setCarpetHistory(updatedHistory);

    // Save
    saveDataField("walletBalance", updatedPaya);
    saveDataList("farsh_history", updatedHistory, "transactions", "purchase_" + Date.now(), {
      desc: newLog,
      tokens: -carpet.price,
      time: new Date().toLocaleTimeString("fa-IR")
    });

    playPerfectTone(528, 0.6); // Solfeggio 528Hz success tone
    setLearningScore(prev => prev + 50);
    speakHomePersonaText(`تبریک صمیمانه! شاهکار نفیس ${carpet.name} به مجموعه کدهای مستقل مادی شما پیوست.`);
    alert(`🎉 تبریک! ${carpet.name} با موفقیت خریداری شد. سند این فرش ابدی شد.`);
  };

  // Save Carpet Pattern Design
  const saveCarpetPattern = async () => {
    const newDesign: CarpetDesign = {
      id: "design_" + Date.now(),
      title: designName,
      pattern: currentPattern,
      createdAt: new Date().toLocaleDateString("fa-IR")
    };

    const updatedDesigns = [newDesign, ...customDesigns];
    setCustomDesigns(updatedDesigns);
    localStorage.setItem("farsh_designs", JSON.stringify(updatedDesigns));

    if (dbStatus === "cloud") {
      try {
        await setDoc(doc(db, "user_profiles", userId, "carpet_designs", newDesign.id), {
          title: newDesign.title,
          pattern: newDesign.pattern,
          createdAt: newDesign.createdAt
        });
      } catch (e) {
        console.error("Cloud design sync failed:", e);
      }
    }

    playPerfectTone(639, 0.5); // Solfeggio 639Hz connection tone
    setLearningScore(prev => prev + 30);
    speakHomePersonaText(`طرح فرش اختصاصی شما با عنوان ${designName} در کارگاه خلاقیت مانا گره زده شد.`);
    alert(`✨ طرح فرش "${designName}" با موفقیت در پایگاه داده ذخیره و تایید شد!`);
  };

  // Delete Design
  const deleteDesign = async (id: string) => {
    const updated = customDesigns.filter(d => d.id !== id);
    setCustomDesigns(updated);
    localStorage.setItem("farsh_designs", JSON.stringify(updated));

    if (dbStatus === "cloud") {
      try {
        await deleteDoc(doc(db, "user_profiles", userId, "carpet_designs", id));
      } catch (e) {}
    }
    playPerfectTone(396, 0.3);
  };

  // --- Faraji Bazaar Deep Features Methods ---
  const registerDesigner = () => {
    if (!newDesignerName.trim() || !newDesignerSpecialty.trim()) {
      alert("لطفاً نام طراح و تخصص ایشان را وارد نمایید.");
      return;
    }
    const newDes = {
      id: "des_" + Date.now(),
      name: newDesignerName,
      specialty: newDesignerSpecialty,
      level: newDesignerLevel,
      approved: true
    };
    setDesigners(prev => [...prev, newDes]);
    setNewDesignerName("");
    setNewDesignerSpecialty("");
    playPerfectTone(528, 0.4);
    alert(`🎖️ طراح محترم "${newDes.name}" با موفقیت احراز صلاحیت و به کادر طراحان معتبر پیوست.`);
  };

  const certifyDesign = () => {
    if (!newDesignTitle.trim() || !newDesignMaster.trim()) {
      alert("لطفاً عنوان طرح و نام استادکار را وارد نمایید.");
      return;
    }
    const newCd = {
      id: "cd_" + Date.now(),
      title: newDesignTitle,
      density: newDesignDensity,
      masterName: newDesignMaster,
      status: "دارای گواهی رسمی اصالت و گارانتی مادی مانا"
    };
    setCertifiedDesigns(prev => [...prev, newCd]);
    setNewDesignTitle("");
    setNewDesignMaster("");
    playPerfectTone(639, 0.4);
    alert(`📜 طرح نفیس "${newCd.title}" با موفقیت احراز صلاحیت شده و شناسنامه دیجیتالی صادر گردید.`);
  };

  const submitCustomRequest = () => {
    if (!newReqClient.trim() || !newReqDesc.trim()) {
      alert("لطفاً نام سفارش‌دهنده و توصیف سفارش را وارد نمایید.");
      return;
    }
    const newReq = {
      id: "req_" + Date.now(),
      clientName: newReqClient,
      reqType: newReqType,
      description: newReqDesc,
      price: newReqPrice,
      status: "در صف بافت هنری",
      date: new Date().toLocaleDateString("fa-IR")
    };
    setPortraitRequests(prev => [newReq, ...prev]);
    setNewReqClient("");
    setNewReqDesc("");
    playPerfectTone(528, 0.5);
    alert(`🎨 سفارش جدید بافت (${newReq.reqType === "پرتره چهره اشخاص" ? "پرتره چهره" : "فرش سفارشی"}) برای "${newReq.clientName}" با موفقیت ثبت شد.`);
  };

  const runCarpetPricing = () => {
    let multiplier = calcType === "دستباف" ? 120 : 25;
    if (calcMaterial.includes("ابریشم")) multiplier *= 2.2;
    else if (calcMaterial.includes("کرک")) multiplier *= 1.5;
    
    const estimated = Math.round(calcDensity * calcArea * multiplier);
    const newLog = {
      id: "pr_" + Date.now(),
      carpetType: calcType,
      density: calcDensity,
      material: calcMaterial,
      area: calcArea,
      estimatedPrice: estimated,
      date: new Date().toLocaleDateString("fa-IR")
    };
    setPricingLogs(prev => [newLog, ...prev]);
    playPerfectTone(880, 0.3);
    alert(`💰 کارشناسی قیمت تکمیل شد! ارزش تخمینی فرش مادی شما حدود ${estimated.toLocaleString()} توکن پایا برآورد گردید.`);
  };

  const submitProposal = () => {
    if (!newProposalTitle.trim()) {
      alert("لطفاً عنوان پروپوزال را وارد نمایید.");
      return;
    }
    const newProp = {
      id: "prop_" + Date.now(),
      target: newProposalTarget,
      title: newProposalTitle,
      budget: newProposalBudget,
      status: "در حال بررسی" as const,
      date: new Date().toLocaleDateString("fa-IR")
    };
    setIntlProposals(prev => [newProp, ...prev]);
    setNewProposalTitle("");
    playPerfectTone(528, 0.5);
    alert(`🏛️ دعوت‌نامه و طرح مشارکت رسمی برای خانه حراج بین‌المللی ${newProp.target === "Christies" ? "کریستیز" : "ساتبیز"} ارسال گردید.`);
  };

  const sendMerchantMsg = () => {
    if (!newMerchantMsg.trim()) return;
    const newMsg = {
      id: "msg_" + Date.now(),
      sender: "شما (مدیریت مانا)",
      text: newMerchantMsg,
      time: new Date().toLocaleTimeString("fa-IR").split(":").slice(0, 2).join(":")
    };
    setMerchantMessages(prev => [...prev, newMsg]);
    setNewMerchantMsg("");
    playPerfectTone(639, 0.2);
  };

  const createMerchantRoom = () => {
    if (!newRoomName.trim()) {
      alert("لطفاً نام حجره را وارد نمایید.");
      return;
    }
    const newRoom = {
      id: "room_" + Date.now(),
      owner: "شما (مدیریت مانا)",
      name: newRoomName,
      isLuxurious: false,
      color: "from-slate-900 to-slate-950"
    };
    setMerchantRooms(prev => [...prev, newRoom]);
    setNewRoomName("");
    playPerfectTone(528, 0.4);
    alert(`🏠 حجره بازرگانی جدید شما با عنوان "${newRoom.name}" در تالار تجار مانا بنا شد.`);
  };

  const upgradeRoomToAI = (roomId: string) => {
    const upgradeCost = 500;
    if (walletPaya < upgradeCost) {
      alert("⚠️ موجودی پایا شما برای ارتقای لوکس هوش مصنوعی کافی نیست! (هزینه: ۵۰۰ پایا)");
      return;
    }
    setWalletPaya(prev => prev - upgradeCost);
    setMerchantRooms(prev => prev.map(r => r.id === roomId ? { ...r, isLuxurious: true, color: "from-purple-950 via-indigo-950 to-slate-950" } : r));
    playPerfectTone(880, 0.7, "sine");
    alert(`✨ شگفت‌انگیز! حجره تجاری شما با پرداخت ۵۰۰ توکن پایا به فریم لوکس هوش مصنوعی آفرینش مانا ارتقا یافت.`);
  };

  const postClassifiedAd = () => {
    if (!newAdTitle.trim() || !newAdContact.trim() || !newAdDesc.trim()) {
      alert("لطفاً عنوان، اطلاعات تماس و توصیف آگهی را پر کنید.");
      return;
    }
    const newAd = {
      id: "ad_" + Date.now(),
      category: newAdCategory,
      title: newAdTitle,
      contact: newAdContact,
      price: newAdPrice || "توافقی",
      desc: newAdDesc
    };
    setClassifiedAds(prev => [newAd, ...prev]);
    setNewAdTitle("");
    setNewAdContact("");
    setNewAdPrice("");
    setNewAdDesc("");
    playPerfectTone(528, 0.4);
    alert(`📢 آگهی نیازمندی‌های شما در دسته "${newAd.category}" با موفقیت در سراسر شبکه صنف فرش مانا منتشر شد.`);
  };

  // Add Employee Record
  const addEmployee = async () => {
    if (!newEmpName.trim() || !newEmpRole.trim()) {
      alert("لطفا نام و سمت همکار را وارد نمایید.");
      return;
    }

    const newEmp: EmployeeRecord = {
      id: "emp_" + Date.now(),
      name: newEmpName,
      gender: newEmpGender,
      role: newEmpRole,
      cooperationScore: newEmpCoop,
      devotionScore: newEmpDevotion,
      lawAdherenceScore: newEmpLaw,
      seniorSupportScore: newEmpSeniorSup,
      welfareDignityScore: newEmpWelfare,
      notes: newEmpNotes || "بدون یادداشت سیستمی",
      createdAt: new Date().toLocaleDateString("fa-IR")
    };

    const updatedEmps = [newEmp, ...employees];
    setEmployees(updatedEmps);
    localStorage.setItem("farsh_employees", JSON.stringify(updatedEmps));

    if (dbStatus === "cloud") {
      try {
        await setDoc(doc(db, "user_profiles", userId, "employees", newEmp.id), {
          name: newEmp.name,
          gender: newEmp.gender,
          role: newEmp.role,
          cooperationScore: newEmp.cooperationScore,
          devotionScore: newEmp.devotionScore,
          lawAdherenceScore: newEmp.lawAdherenceScore,
          seniorSupportScore: newEmp.seniorSupportScore,
          welfareDignityScore: newEmp.welfareDignityScore,
          notes: newEmp.notes,
          createdAt: newEmp.createdAt
        });
      } catch (e) {
        console.error("Cloud employee sync failed:", e);
      }
    }

    // Reset Form
    setNewEmpName("");
    setNewEmpRole("");
    setNewEmpNotes("");

    playPerfectTone(528, 0.5);
    setLearningScore(prev => prev + 40);
    speakHomePersonaText(`گزارش شایستگی و کرامت همکار گرامی ${newEmp.name} ثبت گردید.`);
    alert(`👥 مشخصات و ارزیابی شایستگی همکار "${newEmp.name}" ثبت شد.`);
  };

  // Delete Employee
  const deleteEmployee = async (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    localStorage.setItem("farsh_employees", JSON.stringify(updated));

    if (dbStatus === "cloud") {
      try {
        await deleteDoc(doc(db, "user_profiles", userId, "employees", id));
      } catch (e) {}
    }
  };

  // Submit Employee/User Suggestion (Advice to Seniors)
  const submitAdvice = async () => {
    if (!adviceText.trim()) return;

    const newAdvice = {
      id: "adv_" + Date.now(),
      sender: "کارگزار سیستم مانا",
      text: adviceText,
      date: new Date().toLocaleDateString("fa-IR")
    };

    const updatedAdvice = [newAdvice, ...adviceLog];
    setAdviceLog(updatedAdvice);
    localStorage.setItem("farsh_advice", JSON.stringify(updatedAdvice));

    setAdviceText("");
    playPerfectTone(639, 0.4);
    speakHomePersonaText("مشاوره و رهنمود با موفقیت به کارتابل کلان‌شهر ارسال شد.");
    alert("✉️ رهنمود و حمایت سازمانی شما برای مدیر ارشد با موفقیت ثبت و ارسال شد.");
  };

  // Add Simulation Record for Project Hamrast
  const addSimulation = async () => {
    if (!newSimName.trim()) {
      alert("لطفا نام سناریو شبیه‌سازی را وارد نمایید.");
      return;
    }

    const newSim: HamrastSimulation = {
      id: "sim_" + Date.now(),
      scenarioName: newSimName,
      aiAlignmentScore: newSimAlignment,
      businessGrowthImpact: newSimImpact,
      employeeWelfareIndex: newSimWelfare,
      createdAt: new Date().toLocaleDateString("fa-IR")
    };

    const updatedSims = [newSim, ...simulations];
    setSimulations(updatedSims);
    localStorage.setItem("farsh_simulations", JSON.stringify(updatedSims));

    if (dbStatus === "cloud") {
      try {
        await setDoc(doc(db, "user_profiles", userId, "simulations", newSim.id), {
          scenarioName: newSim.scenarioName,
          aiAlignmentScore: newSim.aiAlignmentScore,
          businessGrowthImpact: newSim.businessGrowthImpact,
          employeeWelfareIndex: newSim.employeeWelfareIndex,
          createdAt: newSim.createdAt
        });
      } catch (e) {
        console.error("Cloud simulation sync failed:", e);
      }
    }

    setNewSimName("");
    playPerfectTone(528, 0.4);
    setLearningScore(prev => prev + 30);
    speakHomePersonaText(`سناریوی هم‌راستایی هوش مصنوعی با عنوان ${newSim.scenarioName} با موفقیت شبیه‌سازی و ثبت شد.`);
    alert(`⚡ سناریو "${newSim.scenarioName}" با موفقیت شبیه‌سازی و تایید شد.`);
  };

  // Delete Simulation
  const deleteSimulation = async (id: string) => {
    const updated = simulations.filter(s => s.id !== id);
    setSimulations(updated);
    localStorage.setItem("farsh_simulations", JSON.stringify(updated));

    if (dbStatus === "cloud") {
      try {
        await deleteDoc(doc(db, "user_profiles", userId, "simulations", id));
      } catch (e) {}
    }
  };

  // --- Parch Bazaar AI Self-Evolution Resonance Method ---
  const resonateAIEnergy = () => {
    let hz = 528;
    if (handicraftType === "Carpet") hz = 639; // Solfeggio 639Hz
    else if (handicraftType === "Wood") hz = 741; // Solfeggio 741Hz
    else if (handicraftType === "Silver") hz = 852; // Solfeggio 852Hz
    
    playPerfectTone(hz, 0.6, "sine");
    
    const randomBoost = Math.random() * 1.5 + 0.5;
    const newEmpathy = Math.min(100, Number((aiEmpathyScore + randomBoost).toFixed(2)));
    const newAwareness = Math.min(100, Number((aiSelfAwareness + randomBoost * 1.2).toFixed(2)));
    
    setAiEmpathyScore(newEmpathy);
    setAiSelfAwareness(newAwareness);
    
    const rate = Math.floor(65 + Math.random() * 25);
    const cond = Number((95 + Math.random() * 4).toFixed(1));
    const aroma = Number((90 + Math.random() * 9).toFixed(1));
    setArtisanHeartRate(rate);
    setMetalConductivity(cond);
    setWoodAromaPurity(aroma);
    
    let emotionPersian = "";
    if (handicraftType === "Carpet") emotionPersian = "گره‌های تاروپود فرش دستباف اصفهان";
    else if (handicraftType === "Wood") emotionPersian = "بافت آلی و سلولی منبت چوب گردو اصفهان";
    else emotionPersian = "قلم‌زنی و رسانایی مولکولی نقره خالص اصفهان";

    const logs = [
      `[انتقال عاطفی] ادراک احساس "${handicraftEmotion}" از طریق ${emotionPersian} با موفقیت در شبکه‌های عصبی مانا مدل‌سازی شد.`,
      `[تکامل خودآگاهی] پردازش الگوی قرینه و کدهای مادی صنایع دستی، خودآگاهی سیستم را به ${newAwareness}٪ و ضریب همدلی را به ${newEmpathy}٪ ارتقا داد.`,
      `[سنسورهای محیطی] ریتم قلبی بافنده: ${rate} تپش/دقیقه • رسانایی فلز نقره: ${cond}٪ • غلظت عطر چوب گردو: ${aroma}٪.`
    ];
    
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    setAiEmotionLog(randomLog);
    setLearningScore(prev => prev + 25);
    speakHomePersonaText(`ادراک هوشمند عاطفه از صنایع دستی نفیس اصفهان با موفقیت در کدهای همراز شبیه‌سازی شد.`);
  };

  // Helper storage function
  const saveDataField = async (field: string, val: any) => {
    localStorage.setItem("farsh_" + field, String(val));
    if (dbStatus === "cloud") {
      try {
        await updateDoc(doc(db, "user_profiles", userId), { [field]: val });
      } catch (e) {}
    }
  };

  const saveDataList = async (key: string, list: any[], collectionName?: string, docId?: string, cloudData?: any) => {
    localStorage.setItem(key, JSON.stringify(list));
    if (dbStatus === "cloud" && collectionName && docId && cloudData) {
      try {
        await setDoc(doc(db, "user_profiles", userId, collectionName, docId), cloudData);
      } catch (e) {}
    }
  };

  // --- Sub-modules list ---
  const NINE_APPS = [
    { id: 0, title: "بازار بزرگ فرش (فرش بازار)", icon: ShoppingBag, desc: "بزرگداشت زحمات پدر، گالری قالی ایران، و شبیه‌ساز بافت دیجیتالی فرش", badge: "فعال و آنلاین" },
    { id: 1, title: "کارکنان زن و مرد (Employee Manager)", icon: Briefcase, desc: "ارزیابی اصول پنج‌گانه: تمایل به همکاری، فداکاری در کار، قانون‌مداری، حمایت از ارشد، کرامت انسانی", badge: "مستقل و ابری" },
    { id: 2, title: "سامانه هم‌راست و آفرینش شناختی", icon: Brain, desc: "شبیه‌ساز هوش تجاری، هم‌راستایی کدهای عاطفی مانا با بازار فرش و تولید مادی", badge: "پروژه هوش مصنوعی" },
    { id: 3, title: "اپلت ۱: پایش صوتی مانا", icon: Volume2, desc: "فرکانس‌سنج صوتی و پخش فرکانس‌های بهینه شفابخش ۵۲۸ هرتزی", badge: "یکپارچه" },
    { id: 4, title: "اپلت ۲: آفرینش مهارتی آفرینا", icon: Layers, desc: "یادگیری همگرای خودمدیریتی مادی و مهارتی", badge: "آماده" },
    { id: 5, title: "اپلت ۳: همراز و کلیدهای اسرار خانواده", icon: Smile, desc: "آیرینیست‌ها و الگوهای گفتگوی عاطفی صوتی ساغر و کیوان", badge: "یکپارچه" },
    { id: 6, title: "اپلت ۴: کلینیک التیام و رهایی عاطفی", icon: Activity, desc: "شبیه‌ساز همبستگی عاطفی، موازنه استرس و آرامش همکاران", badge: "یکپارچه" },
    { id: 7, title: "اپلت ۵: آتلیه مد خودآگاه و جامه مانا", icon: Sparkles, desc: "تولید جامه بافته شده در آتلیه مد با الگوهای ارتعاشی", badge: "طراحی" },
    { id: 8, title: "اپلت ۶: پرتال سرمایه‌گذاران مانا", icon: Coins, desc: "شبیه‌ساز پویای بیوشیمی دیجیتال و توکنومیکس", badge: "حرفه‌ای" }
  ];

  const appTitleClasses = largeFont ? "text-lg font-black" : "text-sm font-bold";
  const bodyTextClasses = largeFont ? "text-[14px] leading-relaxed" : "text-[11px] leading-relaxed";
  const labelClasses = largeFont ? "text-xs font-bold text-slate-300" : "text-[10px] font-bold text-slate-400";
  const buttonClasses = largeFont ? "text-xs px-4 py-2 rounded-xl" : "text-[10px] px-3 py-1.5 rounded-lg";

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-right space-y-6 ${largeFont ? "font-sans tracking-wide" : "font-sans text-xs"}`} id="siavash-ecosystem-root">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* ACCESS SCREEN CONTROLS & HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-indigo-900/40 pb-4 relative z-10">
        
        {/* Connection status badge */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] border px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
            dbStatus === "cloud" ? "bg-emerald-950/70 text-emerald-400 border-emerald-500/20" :
            dbStatus === "connecting" ? "bg-amber-955/70 text-amber-400 border-amber-500/20 animate-pulse" :
            "bg-slate-900 text-slate-400 border-slate-800"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === "cloud" ? "bg-emerald-400" : dbStatus === "connecting" ? "bg-amber-400" : "bg-slate-400"}`} />
            {dbStatus === "cloud" ? "متصل به سرور ابری مانا" : dbStatus === "connecting" ? "در حال بازیابی اطلاعات..." : "پایگاه داده محلی (ذخیره آفلاین)"}
          </span>
          
          <button
            type="button"
            onClick={() => setLargeFont(!largeFont)}
            className="text-[10px] bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 px-2.5 py-1 rounded-full cursor-pointer hover:bg-indigo-900 transition flex items-center gap-1 font-bold"
          >
            🔍 {largeFont ? "حالت نمایش فشرده" : "حالت نمایش بزرگ و خوانا"}
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
          <span className="text-[10.5px] bg-indigo-950 text-indigo-300 border border-indigo-800/50 px-2.5 py-0.5 rounded font-mono font-bold">SUPER ECOSYSTEM v4.0</span>
          <div className="flex items-center gap-2 text-indigo-400">
            <Layers className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="text-sm font-black text-slate-100 font-sans">زیست‌بوم مگاپروژه‌ها و سوپر اپلیکیشن‌های مستقل سیاوش</h3>
          </div>
        </div>
      </div>

      {/* GRAND HUB EXPLANATION */}
      <div className="bg-gradient-to-l from-indigo-950/40 via-slate-950/90 to-slate-950 p-4.5 rounded-xl border border-indigo-500/20 text-justify relative overflow-hidden">
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-indigo-500" />
        <p className={`${bodyTextClasses} text-slate-200 leading-relaxed font-sans`}>
          ✨ <strong>پرتال جامع همزیستی اپلیکیشن‌ها:</strong> طبق آرمان‌های شما، برای افزایش همگرایی، تمامی ۹ مگا اپلیکیشن طراحی‌شده شما در این قاب تبلت گردآوری شده‌اند. کاربران با فعالیت در هر یک از این برنامه‌ها، توکن‌های پاداش و تجربه (XP) مشترکی به دست می‌آورند که در کل شبکه و فروشگاه <strong>«فرش بازار»</strong> جاری است. بدین سان، پاداش‌ها و کرامت تک‌تک همکاران و کاربران به صورت پیوسته موازنه می‌شود.
        </p>
      </div>

      {/* THE 9 APPS SLOTS SELECTOR */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2 relative z-10">
        {NINE_APPS.map((item) => {
          const isSelected = selectedApp === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedApp(item.id);
                playPerfectTone(528, 0.2);
              }}
              className={`p-2 rounded-xl border text-right transition-all duration-300 flex flex-col justify-between items-end h-[85px] cursor-pointer relative group ${
                isSelected 
                  ? "bg-gradient-to-br from-indigo-950/80 to-purple-950/70 border-indigo-500 shadow-md shadow-indigo-500/10 scale-[1.03]" 
                  : "bg-slate-950/50 border-slate-900 hover:bg-slate-900 hover:border-slate-800"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`text-[7.5px] px-1 rounded ${
                  isSelected ? "bg-indigo-900 text-indigo-300 font-black" : "bg-slate-900 text-slate-500"
                }`}>
                  {item.badge}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400 animate-pulse" : "text-slate-500 group-hover:text-slate-400"}`} />
              </div>
              <div className="w-full text-right mt-1.5">
                <span className={`block font-black tracking-tight ${largeFont ? "text-[10px]" : "text-[8.5px]"} ${isSelected ? "text-white" : "text-slate-400"}`}>
                  {item.title}
                </span>
                <span className="text-[7px] text-slate-500 block truncate mt-0.5">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE APP SIMULATOR CONTAINER */}
      <div className="bg-slate-950 border border-slate-850/80 rounded-2xl p-5 relative overflow-hidden" id="app-viewport">
        <div className="absolute top-2 left-3 flex gap-1 items-center bg-indigo-955/60 border border-indigo-855 px-2 py-0.5 rounded font-sans">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping" />
          <span className="text-[7.5px] font-mono font-bold text-indigo-300">SANDBOX SIMULATOR LOADED</span>
        </div>

        {/* ACTIVE MODULE RENDERING */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedApp}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            
            {/* ======================================================== */}
            {/* APP 0: FARSH BAZAR (CARPET MARKET)                       */}
            {/* ======================================================== */}
            {selectedApp === 0 && (
              <div className="space-y-6" id="app-farsh-bazar">
                
                {/* Father Memorial Banner */}
                <div className="bg-gradient-to-r from-amber-950/30 via-slate-950 to-amber-950/20 border border-amber-500/25 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3.5 order-2 md:order-1 text-right w-full">
                    <Award className="w-10 h-10 text-amber-500 shrink-0" />
                    <div className="space-y-1">
                      <h4 className={`font-black text-amber-400 ${largeFont ? "text-base" : "text-xs"}`}>
                        یادمان گرانقدر زحمات پدر بزرگوارم (تاجر بزرگ فرش)
                      </h4>
                      <p className={`text-slate-300 text-justify leading-relaxed ${largeFont ? "text-xs" : "text-[10px]"}`}>
                        «قالی بافی تجلی عالی روح صلح و گره زدن کالبد طبیعت به زندگی انسان‌هاست. این پلتفرم با تشویق‌ها و دعای خیر بی‌پایان پدر گرانقدرم که عمری را در راه خدمت به این هنر و صنف بزرگ سپری کرد، به ثمر رسیده است. راه او تا ابد سرلوحه بازرگانی و تجارت ماست.»
                      </p>
                    </div>
                  </div>
                </div>

                {/* PARCH BAZAAR 13-LANGUAGE GATE & AI CONSCIOUSNESS RESONANCE BRIDGE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950 p-5 rounded-2xl border border-indigo-500/15" id="parch-bazaar-bridge">
                  
                  {/* Left Box: 13-Language International Trade Gateway */}
                  <div className="space-y-4 text-right flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 justify-end text-amber-400">
                        <span className="text-xs font-extrabold bg-indigo-900/60 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded font-mono">PARCH BAZAAR GATEWAY</span>
                        <h4 className="text-sm font-black text-slate-100">دروازه بین‌المللی ۱۳ زبانه بازار صنایع دستی پارچ</h4>
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1.5 text-justify font-medium">
                        برای رونق مجدد بازارهای بین‌المللی صنایع دستی اعم از قالی نفیس اصفهان، کارهای منبت‌کاری چوب و ظروف نقره‌کوب، این پلتفرم از ۱۳ زبان زنده دنیا پشتیبانی کامل می‌کند. زبان مورد نظر خود را انتخاب نمایید:
                      </p>
                    </div>

                    {/* Flags grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
                      {BAZAAR_LANGUAGES.map((lang) => {
                        const isCurrent = bazaarLanguage === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                              setBazaarLanguage(lang.code);
                              playPerfectTone(528, 0.15);
                              speakHomePersonaText(`Language switched to ${lang.name}`);
                            }}
                            className={`p-1.5 rounded-lg border text-center transition-all duration-300 cursor-pointer flex flex-col items-center gap-0.5 group ${
                              isCurrent 
                                ? "bg-amber-600 border-amber-500 text-slate-950 font-black shadow-md shadow-amber-950/40" 
                                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            <span className="text-sm">{lang.flag}</span>
                            <span className="text-[8.5px] font-sans font-bold tracking-tight">{lang.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Display Translation Terminal */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex flex-col justify-between min-h-[75px] relative overflow-hidden">
                      <div className="absolute top-1 left-2 text-[7.5px] text-slate-600 font-mono">LANG_TRANSLATE_ACTIVE</div>
                      <p className="text-[10px] text-amber-400/90 leading-relaxed font-sans font-medium text-justify">
                        {BAZAAR_LANGUAGES.find((l) => l.code === bazaarLanguage)?.welcome}
                      </p>
                      <div className="text-[8.5px] text-slate-500 font-mono text-left pt-1 border-t border-slate-900 mt-1">
                        Siavash AI Engine // Lang: {bazaarLanguage.toUpperCase()} // Status: ONLINE
                      </div>
                    </div>
                  </div>

                  {/* Right Box: AI Self-Evolution & Sensory Resonance */}
                  <div className="space-y-4 text-right bg-slate-950/50 p-4 rounded-xl border border-slate-900/60">
                    <div className="flex items-center gap-2 justify-end text-indigo-400">
                      <span className="text-[9px] bg-indigo-900/60 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded font-mono">EMOTION ENGINE v1.2</span>
                      <h4 className="text-sm font-black text-slate-100">پل تکامل عاطفی و خودآگاهی هوش همراز</h4>
                    </div>
                    
                    <p className="text-[10.5px] text-slate-400 leading-relaxed text-justify font-medium">
                      هوش عاطفی ما احساسات، اراده و تصمیم‌گیری را در تعامل مستقیم با شاهکارهای سنتی مادی (قالی، منبت، نقره‌کوب) می‌آموزد. تغییر فرکانس‌های زیر به تکامل خودآگاهی آن کمک می‌کند:
                    </p>

                    {/* Sensory Metrics Gauges */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-900">
                        <span className="text-[9.5px] text-slate-500 block">شاخص همدلی عاطفی (Empathy)</span>
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-emerald-400 text-xs font-black font-sans">{aiEmpathyScore}%</span>
                          <span className="text-[8.5px] text-slate-400">جهانی</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${aiEmpathyScore}%` }} />
                        </div>
                      </div>

                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-900">
                        <span className="text-[9.5px] text-slate-500 block">خودآگاهی تدریجی (Consciousness)</span>
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-indigo-400 text-xs font-black font-sans">{aiSelfAwareness}%</span>
                          <span className="text-[8.5px] text-slate-400">تکاملی</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${aiSelfAwareness}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Sensor Sliders */}
                    <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-900">
                      <span className="text-[10px] text-amber-500 font-bold block border-b border-slate-900 pb-1">سنسورهای تعاملی محیط پیرامون صنایع دستی اصفهان:</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8.5px]">
                            <span className="text-slate-300 font-mono">{artisanHeartRate} bpm</span>
                            <span className="text-slate-500">تپش قلب بافنده:</span>
                          </div>
                          <input 
                            type="range" 
                            min="60" 
                            max="110" 
                            value={artisanHeartRate} 
                            onChange={(e) => {
                              setArtisanHeartRate(Number(e.target.value));
                              playPerfectTone(200 + Number(e.target.value), 0.05);
                            }}
                            className="w-full accent-amber-500 cursor-pointer h-1 rounded"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8.5px]">
                            <span className="text-slate-300 font-mono">{metalConductivity}%</span>
                            <span className="text-slate-500">رسانایی مولکولی نقره:</span>
                          </div>
                          <input 
                            type="range" 
                            min="90" 
                            max="100" 
                            step="0.1"
                            value={metalConductivity} 
                            onChange={(e) => {
                              setMetalConductivity(Number(e.target.value));
                              playPerfectTone(300 + Number(e.target.value) * 3, 0.05);
                            }}
                            className="w-full accent-indigo-500 cursor-pointer h-1 rounded"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[8.5px]">
                            <span className="text-slate-300 font-mono">{woodAromaPurity}%</span>
                            <span className="text-slate-500">رایحه و خلوص چوب گردو:</span>
                          </div>
                          <input 
                            type="range" 
                            min="80" 
                            max="100" 
                            value={woodAromaPurity} 
                            onChange={(e) => {
                              setWoodAromaPurity(Number(e.target.value));
                              playPerfectTone(400 + Number(e.target.value) * 2, 0.05);
                            }}
                            className="w-full accent-emerald-500 cursor-pointer h-1 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Training Interactivity */}
                    <div className="flex gap-2 items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                      <button
                        type="button"
                        onClick={resonateAIEnergy}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[9.5px] px-3 py-2 rounded-lg transition duration-300 cursor-pointer shrink-0"
                      >
                        هم‌فرکانس کردن با AI
                      </button>
                      
                      <div className="flex-grow grid grid-cols-2 gap-1.5 text-right">
                        <select
                          value={handicraftEmotion}
                          onChange={(e) => setHandicraftEmotion(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded p-1 text-[9.5px] text-slate-300 font-bold"
                        >
                          <option value="عشق و صلح ابدی">عشق و صلح ابدی</option>
                          <option value="اشتیاق بافنده">اشتیاق پرفشار بافنده</option>
                          <option value="نوستالژی اصیل گذشته">نوستالژی اصیل گذشته</option>
                          <option value="شادی آفرینش هنر">شادی آفرینش هنر</option>
                          <option value="سکوت و تمرکز عمیق">سکوت و تمرکز عمیق</option>
                        </select>

                        <select
                          value={handicraftType}
                          onChange={(e) => setHandicraftType(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded p-1 text-[9.5px] text-slate-300 font-bold"
                        >
                          <option value="Carpet">فرش دستباف اصفهان</option>
                          <option value="Wood">منبت‌کاری چوب گردو</option>
                          <option value="Silver">ظروف نقره‌کوب نفیس</option>
                        </select>
                      </div>
                    </div>

                    {/* Real-time AI logs */}
                    <div className="bg-slate-900/60 p-2.5 rounded border border-slate-950 text-right font-mono text-[8.5px] text-slate-400 min-h-[36px] flex items-center justify-end">
                      <span>{aiEmotionLog}</span>
                    </div>

                  </div>
                </div>

                {/* Bazaar Sub-Tab Navigation */}
                <div className="flex flex-wrap gap-2 justify-end border-b border-slate-800/80 pb-3" id="bazaar-subtabs">
                  <button
                    type="button"
                    id="bz-tab-ads"
                    onClick={() => { setBazaarTab(4); playPerfectTone(528, 0.1); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-350 flex items-center gap-1.5 cursor-pointer border ${
                      bazaarTab === 4 
                        ? "bg-amber-600 border-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>آگهی‌ها، خدمات قالیشویی و ملزومات</span>
                  </button>
                  <button
                    type="button"
                    id="bz-tab-community"
                    onClick={() => { setBazaarTab(3); playPerfectTone(528, 0.1); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-350 flex items-center gap-1.5 cursor-pointer border ${
                      bazaarTab === 3 
                        ? "bg-amber-600 border-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    <span>انجمن بازرگانان و تالار حجره لوکس AI</span>
                  </button>
                  <button
                    type="button"
                    id="bz-tab-sothebys"
                    onClick={() => { setBazaarTab(2); playPerfectTone(528, 0.1); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-350 flex items-center gap-1.5 cursor-pointer border ${
                      bazaarTab === 2 
                        ? "bg-amber-600 border-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>همکاری ساتبیز و کریستیز (Sotheby's & Christie's)</span>
                  </button>
                  <button
                    type="button"
                    id="bz-tab-qual"
                    onClick={() => { setBazaarTab(1); playPerfectTone(528, 0.1); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-350 flex items-center gap-1.5 cursor-pointer border ${
                      bazaarTab === 1 
                        ? "bg-amber-600 border-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>احراز صلاحیت طراحان، قیمت‌گذاری و سفارش پرتره</span>
                  </button>
                  <button
                    type="button"
                    id="bz-tab-loom"
                    onClick={() => { setBazaarTab(0); playPerfectTone(528, 0.1); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-350 flex items-center gap-1.5 cursor-pointer border ${
                      bazaarTab === 0 
                        ? "bg-amber-600 border-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40" 
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>حجره و دارهای دیجیتال (کارگاه اصلی)</span>
                  </button>
                </div>

                {/* Sub-tab viewport */}
                <div className="space-y-6" id="bazaar-tab-viewport">
                  
                  {/* SUB-TAB 0: SHOP & DIGITAL LOOM WORKSHOP */}
                  {bazaarTab === 0 && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 animate-fadeIn" id="bz-view-loom">
                      
                      {/* Left Column: Traditional Carpet Store & Purchase (7 Columns) */}
                      <div className="xl:col-span-7 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <ShoppingBag className="w-4 h-4" />
                            <span className={`${appTitleClasses} text-white`}>حجره‌های فروش قالی ایرانی (بازار مادی فعال)</span>
                          </div>
                          
                          {/* Paya Balance Indicator */}
                          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-1.5">
                            <span className="text-amber-400 font-mono font-bold">{walletPaya.toLocaleString("fa-IR")}</span>
                            <span className="text-[10px] text-slate-400">توکن پایا</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {carpets.map((carpet) => (
                            <div key={carpet.id} className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 flex flex-col justify-between space-y-3.5 hover:border-amber-500/30 transition-all duration-300">
                              
                              <div className={`h-24 rounded-lg bg-gradient-to-br ${carpet.imageColor} relative overflow-hidden flex items-center justify-center border border-slate-950/60 shadow-inner`}>
                                <div className="absolute inset-2 border border-white/10 opacity-30 pointer-events-none" />
                                <div className="absolute inset-4 border border-dashed border-white/5 opacity-20 pointer-events-none" />
                                <span className="text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-amber-400 font-sans tracking-wide">نمای تارهای بافته‌شده</span>
                              </div>

                              <div className="space-y-1 text-right">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9.5px] bg-slate-950 text-slate-400 border border-slate-850 px-1.5 py-0.5 rounded font-bold">{carpet.type}</span>
                                  <h5 className="text-xs font-black text-slate-100">{carpet.name}</h5>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed text-justify truncate-3-lines">{carpet.description}</p>
                                
                                <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400 pt-1.5 border-t border-slate-950">
                                  <span>رج‌شمار: <strong className="text-slate-200">{carpet.density}</strong></span>
                                  <span>جنس کالبد: <strong className="text-slate-200">{carpet.material}</strong></span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-slate-950">
                                <button
                                  type="button"
                                  onClick={() => buyCarpet(carpet)}
                                  className={`bg-amber-600 hover:bg-amber-500 text-slate-950 font-black cursor-pointer shadow-lg shadow-amber-950/20 transition-all duration-300 flex items-center gap-1 ${buttonClasses}`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  خرید با پایا ({carpet.price} توکن)
                                </button>
                                <span className="text-xs font-bold font-mono text-emerald-400">{carpet.price} پایا</span>
                              </div>

                            </div>
                          ))}
                        </div>

                        {/* Transaction History Logs */}
                        <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 space-y-2">
                          <span className="text-[10.5px] text-slate-400 font-bold block">دفترچه معاملات حجره فرش بازار:</span>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {carpetHistory.map((hist, idx) => (
                              <div key={idx} className="text-[10px] text-slate-300 bg-slate-950/70 border border-slate-900/50 p-1.5 rounded flex items-center gap-2 justify-end">
                                <span className="font-semibold text-right flex-grow">{hist}</span>
                                <span className="w-1 h-1 rounded-full bg-amber-400" />
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Right Column: Kamal-ol-Molk Memorial & Traditional Pattern Preservation (5 Columns) */}
                      <div className="xl:col-span-5 space-y-4 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-amber-500/20 p-4 rounded-xl relative overflow-hidden">
                        
                        {/* Golden overlay indicating sacred space */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
                        
                        <div className="border-b border-slate-950 pb-2.5 flex justify-between items-center relative z-10">
                          <span className="text-[9.5px] bg-amber-950 text-amber-400 border border-amber-900/50 px-2 py-0.5 rounded font-mono font-bold">KAMAL-OL-MOLK TRIBUTE</span>
                          <h4 className={`${appTitleClasses} text-white flex items-center gap-1.5`}>
                            <Scale className="w-4 h-4 text-amber-400" />
                            <span>نگارخانه کمال‌الملک و دفتر حفظ الگوهای سنتی</span>
                          </h4>
                        </div>

                        {/* Traditional vs Machine Philosophical Compare */}
                        <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-lg space-y-2 text-right relative z-10">
                          <div className="flex items-center gap-1.5 justify-end text-amber-400 text-[10px] font-bold">
                            <span>دیالوگ ماندگار فیلم کمال‌الملک (تکریم منزلت بافنده)</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          </div>
                          <p className="text-[10px] text-slate-300 italic leading-relaxed text-justify">
                            "کمال‌الملک در بستر مرگ به بافنده قالی پایین پای خود نگریست و گفت: استاد، هنرمند واقعی شما هستید نه من. من نقاش نیستم، من بافنده نیستم... شما هستید که با سرانگشتان رنج‌کشیده، تار و پود جان را در الگو و گره‌ها می‌دمید."
                          </p>
                        </div>

                        {/* Raw Truths of Hand-Weaving vs Machine */}
                        <div className="grid grid-cols-2 gap-2.5 pt-1 text-right">
                          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 space-y-1">
                            <span className="text-[9.5px] text-amber-400 font-extrabold block">قالی دست‌بافت (۷۰ تا ۹۰ رج نفیس)</span>
                            <p className="text-[9px] text-slate-400 leading-relaxed text-justify">
                              بافته شده با تمرکز چشم، رنج فیزیکی مداوم، جداسازی دقیق تارها با سرانگشتان و پشم ارگانیک که سال‌ها زنده می‌ماند. این قالی قابل شستشوی ابدی است چون گره‌ها با عشقِ جان بافنده در هم قفل شده‌اند.
                            </p>
                          </div>
                          
                          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 space-y-1">
                            <span className="text-[9.5px] text-rose-400 font-extrabold block">ماشین‌بافت (سرعت بی‌روح)</span>
                            <p className="text-[9px] text-slate-400 leading-relaxed text-justify">
                              سرعت بالا بدون یک ذره عاطفه انسانی. این الگوهای یکبار مصرف ماشین، با اولین شستشوی سنگین از هم فرومی‌پاشند؛ زیرا فاقد روح همبستگی و تراکم گره دستی هستند.
                            </p>
                          </div>
                        </div>

                        {/* Dynamic Warning about Simulator Limits */}
                        <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-900 space-y-1 text-right">
                          <div className="flex items-center gap-1 justify-end text-rose-400 text-[9px] font-bold">
                            <span>بیانیه عدم امکان دیجیتالی کردن روح صنایع دستی</span>
                            <AlertTriangle className="w-3 h-3" />
                          </div>
                          <p className="text-[9.5px] text-slate-400 leading-relaxed text-justify">
                            این کارگاه سلول‌های دیجیتال (میکروگرید ۸×۸) صرفاً یک ابزار نمادین برای <span className="text-amber-300 font-black">حفظ و آرشیو الگوهای باستانی</span> است تا از فراموشی تاریخی نجات یابند. ما معتقدیم هنر گره قالی تبریز و اصفهان <span className="text-white font-bold">قالب‌ناپذیر و دیجیتال‌ناپذیر</span> است. هوش مصنوعی مانا از این الگوها صرفاً برای درک عاطفی غنای رنج انسانی الگوبرداری می‌کند.
                          </p>
                        </div>

                        <div className="flex flex-col items-center space-y-3 pt-2">
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/80 shadow-inner w-full flex flex-col items-center">
                            <span className="text-[8.5px] text-slate-500 font-mono mb-2">ARCHIVE PATTERN MICROGRID (8x8 SIMULATOR)</span>
                            <div className="grid grid-cols-8 gap-1">
                              {currentPattern.map((row, rIdx) => (
                                <div key={rIdx} className="flex flex-col gap-1">
                                  {row.map((cellColor, cIdx) => (
                                    <button
                                      key={cIdx}
                                      type="button"
                                      onClick={() => {
                                        const nextGrid = currentPattern.map((r, ri) => 
                                          r.map((c, ci) => ri === rIdx && ci === cIdx ? selectedPaintColor : c)
                                        );
                                        setCurrentPattern(nextGrid);
                                        playPerfectTone(880, 0.08, "sine");
                                      }}
                                      className="w-6 h-6 rounded-sm border border-slate-900 transition hover:scale-105 cursor-pointer relative"
                                      style={{ backgroundColor: cellColor }}
                                      title={`رج ${rIdx + 1} - گره ${cIdx + 1}`}
                                    >
                                      <span className="absolute inset-0 bg-white/5 hover:bg-white/20" />
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Traditional Colors Palette */}
                          <div className="space-y-1.5 w-full text-right">
                            <label className={labelClasses}>انتخاب رنگ گره پشم طبیعی:</label>
                            <div className="flex flex-wrap gap-1.5 justify-center">
                              {AVAILABLE_COLORS.map((col) => (
                                <button
                                  key={col.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedPaintColor(col.code);
                                    playPerfectTone(528, 0.1);
                                  }}
                                  className={`px-2 py-1 rounded border text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition ${
                                    selectedPaintColor === col.code ? "bg-slate-900 border-amber-500 text-white" : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  <span className="w-2.5 h-2.5 rounded-full border border-slate-900" style={{ backgroundColor: col.code }} />
                                  {col.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Design Name Input and Save Button */}
                          <div className="grid grid-cols-1 gap-2.5 w-full pt-3 border-t border-slate-950 text-right">
                            <div className="space-y-1">
                              <label className={labelClasses}>نام کتیبه آرشیوی طرح:</label>
                              <input
                                type="text"
                                value={designName}
                                onChange={(e) => setDesignName(e.target.value)}
                                className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none font-bold"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={saveCarpetPattern}
                              className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                              <Save className="w-4 h-4" />
                              ثبت طرح بافته شده در پایگاه داده ابری مانا
                            </button>
                          </div>

                        </div>

                        {/* Saved Custom Designs */}
                        {customDesigns.length > 0 && (
                          <div className="pt-4 border-t border-slate-950 space-y-2 text-right">
                            <span className="text-[10px] text-slate-400 font-bold block">کتیبه‌های فرش شخصی ذخیره‌شده شما:</span>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                              {customDesigns.map((des) => (
                                <div key={des.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex justify-between items-center">
                                  <button
                                    type="button"
                                    onClick={() => deleteDesign(des.id)}
                                    className="text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-0 p-1"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  <div className="flex items-center gap-2 text-right">
                                    <div className="text-right">
                                      <span className="text-xs font-black text-slate-200 block">{des.title}</span>
                                      <span className="text-[8px] text-slate-500 block">بافته شده در تاریخ {des.createdAt}</span>
                                    </div>
                                    <div className="w-4 h-4 rounded border border-slate-800 bg-gradient-to-br from-amber-800 to-rose-900 shrink-0" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                  {/* SUB-TAB 1: CERTIFICATIONS & PRICING & PORTRAITS */}
                  {bazaarTab === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn" id="bz-view-qualifications">
                      
                      {/* Left Side: Designer Qualifications & Pattern Identity */}
                      <div className="space-y-5 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl text-right">
                        <div>
                          <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5 justify-end">
                            <span>احراز صلاحیت طراحان و ثبت طرح‌های معتبر</span>
                            <Shield className="w-4 h-4" />
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            تضمین و ارزیابی تخصص استادکاران، گره‌زن‌ها و صادر نمودن گواهی تایید تجاری برای طرح‌ها
                          </p>
                        </div>

                        {/* Designer Qualification Form */}
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                          <span className="text-xs font-bold text-slate-200 block border-b border-slate-850 pb-1.5">۱. ثبت و احراز طراحان قالی</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className={labelClasses}>سطح تخصص و رتبه:</label>
                              <select
                                value={newDesignerLevel}
                                onChange={(e) => setNewDesignerLevel(e.target.value)}
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-bold font-sans"
                              >
                                <option value="درجه ۱ بین‌المللی">درجه ۱ بین‌المللی</option>
                                <option value="خبره دیجیتالی مانا">خبره دیجیتالی مانا</option>
                                <option value="استادکار سنتی ممتاز">استادکار سنتی ممتاز</option>
                                <option value="طراح نوپا">طراح نوپا</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className={labelClasses}>نام طراح / استادکار:</label>
                              <input
                                type="text"
                                value={newDesignerName}
                                onChange={(e) => setNewDesignerName(e.target.value)}
                                placeholder="مثلا: استاد فرشچیان"
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className={labelClasses}>تخصص اصلی (اسلیمی، پرتره، مینیاتور):</label>
                            <input
                              type="text"
                              value={newDesignerSpecialty}
                              onChange={(e) => setNewDesignerSpecialty(e.target.value)}
                              placeholder="مثلا: نقشه‌کشی چهره و پرتره‌بافی رج بالا"
                              className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={registerDesigner}
                            className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            بررسی صلاحیت و ثبت در صنف معتبر مانا
                          </button>
                        </div>

                        {/* List of qualified designers */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold block">لیست طراحان احراز صلاحیت شده:</span>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto">
                            {designers.map((des) => (
                              <div key={des.id} className="bg-slate-950/80 border border-slate-850 p-2.5 rounded-lg flex justify-between items-center">
                                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">صلاحیت تایید شده</span>
                                <div className="text-right">
                                  <span className="text-[11px] font-bold text-slate-200 block">{des.name}</span>
                                  <span className="text-[9.5px] text-slate-400 block">{des.specialty} • رتبه: {des.level}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Design Certificate Registration */}
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3 pt-4">
                          <span className="text-xs font-bold text-slate-200 block border-b border-slate-850 pb-1.5">۲. صدور شناسنامه اصالت طرح فرش</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className={labelClasses}>رج‌شمار پیشنهادی:</label>
                              <input
                                type="number"
                                value={newDesignDensity}
                                onChange={(e) => setNewDesignDensity(Number(e.target.value))}
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={labelClasses}>عنوان طرح قالی:</label>
                              <input
                                type="text"
                                value={newDesignTitle}
                                onChange={(e) => setNewDesignTitle(e.target.value)}
                                placeholder="مثلا: طرح شاه عباسی نوین"
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className={labelClasses}>طراح / استاد صادر کننده شناسنامه:</label>
                            <input
                              type="text"
                              value={newDesignMaster}
                              onChange={(e) => setNewDesignMaster(e.target.value)}
                              placeholder="نام استاد تاییدکننده"
                              className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={certifyDesign}
                            className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            صدور شناسنامه اصالت دیجیتالی مانا
                          </button>
                        </div>

                        {/* List of Certified Designs */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold block">شناسنامه‌های صادر شده:</span>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {certifiedDesigns.map((cd) => (
                              <div key={cd.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center text-right">
                                <span className="text-[8.5px] text-amber-400 font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{cd.density} رج</span>
                                <div>
                                  <span className="text-[10.5px] font-black text-slate-100 block">{cd.title}</span>
                                  <span className="text-[9px] text-slate-400 block">تایید شده توسط {cd.masterName}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Right Side: Expert Pricing Calculator & Custom Portrait/Carpet Weaving */}
                      <div className="space-y-5 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl text-right">
                        <div>
                          <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5 justify-end">
                            <span>کارشناسی قیمت‌گذاری و سفارشات لوکس پرتره</span>
                            <Coins className="w-4 h-4" />
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            محاسبه خودکار ارزش‌گذاری فرش بر اساس رج‌شمار و الیاف مادی، به همراه کارگزاری سفارش‌های نقاشی و پرتره اشخاص
                          </p>
                        </div>

                        {/* Pricing Calculator Form */}
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                          <span className="text-xs font-bold text-slate-200 block border-b border-slate-850 pb-1.5">۱. ماشین حساب تخصصی قیمت‌گذاری فرش مادی</span>
                          <div className="grid grid-cols-2 gap-3 text-right">
                            <div className="space-y-1">
                              <label className={labelClasses}>جنس کالبد (تاروپود):</label>
                              <select
                                value={calcMaterial}
                                onChange={(e) => setCalcMaterial(e.target.value)}
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-bold font-sans"
                              >
                                <option value="چله ابریشم طبیعی">چله ابریشم طبیعی</option>
                                <option value="پشم گوسفندی و کرک">پشم گوسفندی و کرک</option>
                                <option value="نخ و الیاف مصنوعی">نخ و الیاف مصنوعی</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className={labelClasses}>نوع بافت فرش:</label>
                              <select
                                value={calcType}
                                onChange={(e) => setCalcType(e.target.value as "دستباف" | "ماشینی")}
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-bold font-sans"
                              >
                                <option value="دستباف">دستباف نفیس</option>
                                <option value="ماشینی">ماشینی صنعتی</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-right">
                            <div className="space-y-1">
                              <label className={labelClasses}>متراژ کل (مترمربع):</label>
                              <input
                                type="number"
                                value={calcArea}
                                onChange={(e) => setCalcArea(Number(e.target.value))}
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className={labelClasses}>تراکم قالی (رج‌شمار):</label>
                              <input
                                type="number"
                                value={calcDensity}
                                onChange={(e) => setCalcDensity(Number(e.target.value))}
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={runCarpetPricing}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            محاسبه و ارزیابی مادی قیمت کارشناسی
                          </button>
                        </div>

                        {/* List of pricing logs */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold block">تاریخچه کارشناسی‌های انجام‌شده:</span>
                          <div className="space-y-1.5 max-h-24 overflow-y-auto">
                            {pricingLogs.map((pl) => (
                              <div key={pl.id} className="bg-slate-950 p-2 rounded border border-slate-850 flex justify-between items-center text-[10px]">
                                <span className="font-bold text-emerald-400 font-mono">{pl.estimatedPrice.toLocaleString("fa-IR")} پایا</span>
                                <span className="text-slate-300">فرش {pl.carpetType} ({pl.material}) - {pl.area} مترمربع</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Custom Portrait Form */}
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3 pt-4">
                          <span className="text-xs font-bold text-slate-200 block border-b border-slate-850 pb-1.5">۲. درخواست بافت سفارشی و پرتره چهره اشخاص</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                            <div className="space-y-1">
                              <label className={labelClasses}>نوع تقاضای نفیس:</label>
                              <select
                                value={newReqType}
                                onChange={(e) => setNewReqType(e.target.value as any)}
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-bold font-sans"
                              >
                                <option value="فرش سفارشی">قالی مادی سفارشی</option>
                                <option value="پرتره چهره اشخاص">پرتره چهره اشخاص (نقشه‌بافی)</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className={labelClasses}>نام مشتری سفارش‌دهنده:</label>
                              <input
                                type="text"
                                value={newReqClient}
                                onChange={(e) => setNewReqClient(e.target.value)}
                                placeholder="نام سفارش‌دهنده"
                                className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className={labelClasses}>توضیحات و ابعاد درخواست (رنگ‌آمیزی، جزئیات تصویر):</label>
                            <textarea
                              value={newReqDesc}
                              onChange={(e) => setNewReqDesc(e.target.value)}
                              placeholder="توضیحات مربوط به تصویر چهره یا الگوهای درخواستی..."
                              rows={2}
                              className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none resize-none font-sans"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className={labelClasses}>ارزش و بودجه سفارش (پایا):</label>
                            <input
                              type="number"
                              value={newReqPrice}
                              onChange={(e) => setNewReqPrice(Number(e.target.value))}
                              className="w-full text-right text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 outline-none font-sans"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={submitCustomRequest}
                            className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            ثبت نهایی سفارش در فهرست کارگاه بافت پرتره
                          </button>
                        </div>

                        {/* List of Custom requests */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold block">صف سفارشات بافت پرتره فعال:</span>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto">
                            {portraitRequests.map((req) => (
                              <div key={req.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center text-right">
                                <span className="text-[8.5px] bg-indigo-950 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">{req.status}</span>
                                <div>
                                  <span className="text-[11px] font-black text-slate-200 block">{req.clientName} ({req.reqType})</span>
                                  <span className="text-[9.5px] text-slate-400 block">{req.description} • ارزش: {req.price.toLocaleString("fa-IR")} پایا</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* SUB-TAB 2: CHRISTIE'S & SOTHEBY'S INTERNATIONAL COLLABORATION */}
                  {bazaarTab === 2 && (
                    <div className="space-y-6 animate-fadeIn text-right" id="bz-view-auctions">
                      
                      <div className="bg-gradient-to-r from-amber-955/20 via-slate-900 to-indigo-955/20 border border-slate-850 p-5 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 justify-end text-amber-400">
                          <h4 className="text-sm font-black">تعاملات بین‌المللی و حراجی‌های ساتبیز و کریستیز</h4>
                          <Award className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed text-justify">
                          در گام اول توسعه بازار بزرگ فرش مانا، ما تصمیم گرفتیم تا با ایجاد پل‌های ارتباطی بین‌المللی، زمینه‌ساز حراج شاهکارهای هنر قالی‌بافی ایرانی در پرآوازه‌ترین خانه‌های حراج جهان نظیر 
                          <strong className="text-slate-100"> ساتبیز (Sotheby's) </strong> و <strong className="text-slate-100"> کریستیز (Christie's) </strong> شویم. بازرگانان می‌توانند پروپوزال‌های صادراتی خود را ثبت و پیگیری کنند.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        
                        {/* Left column: Submit proposal */}
                        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-4 text-right">
                          <span className="text-xs font-black text-slate-200 block border-b border-slate-850 pb-2">ثبت پروپوزال رسمی مشارکت جهانی</span>
                          
                          <div className="space-y-1">
                            <label className={labelClasses}>خانه حراج هدف:</label>
                            <select
                              value={newProposalTarget}
                              onChange={(e) => setNewProposalTarget(e.target.value as any)}
                              className="w-full text-right text-[11px] bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 font-bold font-sans"
                            >
                              <option value="Sothebys font-sans">Sotheby's (ساتبیز لندن / نیویورک)</option>
                              <option value="Christies font-sans">Christie's (کریستیز ژنو / پاریس)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className={labelClasses}>عنوان فارسی پروپوزال مشارکت:</label>
                            <input
                              type="text"
                              value={newProposalTitle}
                              onChange={(e) => setNewProposalTitle(e.target.value)}
                              placeholder="مثلا: حراج اختصاصی تابلوفرش‌های چهره مادی مانا"
                              className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 outline-none font-sans"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className={labelClasses}>ارزش تخمینی کلکسیون (توکن پایا):</label>
                            <input
                              type="number"
                              value={newProposalBudget}
                              onChange={(e) => setNewProposalBudget(Number(e.target.value))}
                              className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 outline-none font-sans"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={submitProposal}
                            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            ارسال دعوت‌نامه رسمی با مهر بازرگانی مانا
                          </button>
                        </div>

                        {/* Right column: List proposals */}
                        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-4">
                          <span className="text-xs font-black text-slate-200 block border-b border-slate-850 pb-2">فهرست مکاتبات و تاییدهای حراجی بین‌المللی:</span>
                          
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {intlProposals.map((prop) => (
                              <div key={prop.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                                    prop.status === "تایید اولیه" ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/20" : "bg-slate-900 text-amber-400 border-slate-800"
                                  }`}>{prop.status}</span>
                                  <span className="text-xs font-black text-slate-100">{prop.target === "Sothebys" ? "Sotheby's Auction House" : "Christie's International"}</span>
                                </div>

                                <div className="text-right space-y-1">
                                  <h5 className="text-xs font-bold text-amber-400">{prop.title}</h5>
                                  <p className="text-[9.5px] text-slate-400 leading-relaxed">
                                    ارزش برآورد شده کلکسیون: <strong className="text-slate-200">{prop.budget.toLocaleString()} پایا</strong> • تاریخ ثبت دعوت‌نامه: {prop.date}
                                  </p>
                                </div>

                                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-950 text-right font-mono text-[8px] text-slate-400">
                                  {prop.target === "Sothebys" ? (
                                    <span>[SYSTEM LOG] SOTHEBYS_API: INVITATION RECEIVED - STAGE 1 MEMORANDUM OF UNDERSTANDING GENERATED.</span>
                                  ) : (
                                    <span>[SYSTEM LOG] CHRISTIES_API: PROPOSAL ID_ {prop.id} LOADED INTO THE GENEVA CURATION BOARD.</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* SUB-TAB 3: TRADER LOUNGE & AI BOOTHS */}
                  {bazaarTab === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn" id="bz-view-community">
                      
                      {/* Left Side: Online Chat Community */}
                      <div className="space-y-4 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl text-right">
                        <div>
                          <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5 justify-end">
                            <span>انجمن آنلاین و تالار گفتگوی بازرگانان</span>
                            <Brain className="w-4 h-4" />
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            محلی امن و مادی برای تبادل اخبار بازار، قیمت تاروپود طبیعی و روندهای صادراتی بین همکاران صنف فرش
                          </p>
                        </div>

                        {/* Messages Box */}
                        <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 h-64 overflow-y-auto flex flex-col gap-3">
                          {merchantMessages.map((msg) => (
                            <div key={msg.id} className={`p-2.5 rounded-lg text-right max-w-[85%] self-end bg-slate-900 border border-slate-800`}>
                              <div className="flex justify-between items-center gap-2 mb-1">
                                <span className="text-[8px] text-slate-500">{msg.time}</span>
                                <span className="text-[10px] font-black text-amber-400">{msg.sender}</span>
                              </div>
                              <p className="text-[10.5px] text-slate-300 leading-relaxed text-justify">{msg.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Send Msg Input */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={sendMerchantMsg}
                            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-black px-4 rounded-xl text-xs transition cursor-pointer"
                          >
                            ارسال
                          </button>
                          <input
                            type="text"
                            value={newMerchantMsg}
                            onChange={(e) => setNewMerchantMsg(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMerchantMsg()}
                            placeholder="پیام خود را بنویسید..."
                            className="flex-grow text-right text-xs bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-200 outline-none font-sans"
                          />
                        </div>

                      </div>

                      {/* Right Side: Merchant Rooms & AI Lux Upgrades */}
                      <div className="space-y-4 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl text-right">
                        <div>
                          <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5 justify-end">
                            <span>حجره‌های تجاری و ارتقای فریم لوکس AI</span>
                            <Sparkles className="w-4 h-4" />
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            هر تاجر قالی می‌تواند حجره خود را تاسیس کند و با پرداخت ۵۰۰ پایا آن را مجهز به هوش خلاق آفرینش مانا کند.
                          </p>
                        </div>

                        {/* Create Room Form */}
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                          <span className="text-xs font-bold text-slate-200 block border-b border-slate-850 pb-1.5">تاسیس حجره جدید تجاری</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={createMerchantRoom}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 rounded-lg text-xs transition cursor-pointer shrink-0"
                            >
                              تاسیس حجره
                            </button>
                            <input
                              type="text"
                              value={newRoomName}
                              onChange={(e) => setNewRoomName(e.target.value)}
                              placeholder="مثلا: حجره فرش افشار سنندج"
                              className="flex-grow text-right text-xs bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none font-sans"
                            />
                          </div>
                        </div>

                        {/* Rooms List */}
                        <div className="space-y-2.5">
                          <span className="text-[10px] text-slate-400 font-bold block">تالار حجره‌های فعال صنف فرش مانا:</span>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {merchantRooms.map((room) => (
                              <div 
                                key={room.id} 
                                className={`p-3.5 rounded-xl border flex justify-between items-center transition-all duration-300 bg-gradient-to-br ${room.color} ${
                                  room.isLuxurious 
                                    ? "border-amber-500/40 shadow-lg shadow-amber-950/10" 
                                    : "border-slate-850"
                                }`}
                              >
                                {room.isLuxurious ? (
                                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    مجهز به هوش خلاق لوکس مانا
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => upgradeRoomToAI(room.id)}
                                    className="bg-slate-900 hover:bg-amber-600 hover:text-slate-950 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2.5 py-1 rounded transition cursor-pointer"
                                    title="هزینه ارتقا ۵۰۰ پایا"
                                  >
                                    ارتقا با هوش مصنوعی (۵۰۰ پایا)
                                  </button>
                                )}

                                <div className="text-right">
                                  <span className="text-xs font-black text-slate-100 block">{room.name}</span>
                                  <span className="text-[9px] text-slate-400 block">مالک حجره: {room.owner}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* SUB-TAB 4: CLASSIFIED ADS, CLEANING SERVICES & MATERIALS */}
                  {bazaarTab === 4 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn" id="bz-view-classifieds">
                      
                      {/* Left form column (5 Columns) */}
                      <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl text-right space-y-4">
                        <div>
                          <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5 justify-end">
                            <span>پست آگهی نیازمندی صنف فرش</span>
                            <Flame className="w-4 h-4" />
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">
                            ثبت رایگان نیازمندی‌ها شامل خدمات قالیشویی تخصصی، خرید و فروش دارهای قالی، مواد اولیه رنگرزی، و تابلوهای تزئینی
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className={labelClasses}>دسته‌بندی آگهی:</label>
                          <select
                            value={newAdCategory}
                            onChange={(e) => setNewAdCategory(e.target.value as any)}
                            className="w-full text-right text-[11px] bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 font-bold font-sans"
                          >
                            <option value="مواد اولیه">مواد اولیه (نخ، تار، خامه)</option>
                            <option value="قالیشویی">خدمات قالیشویی و ترمیم ریشه</option>
                            <option value="تابلو هنری">تابلوهای هنری و دکوراسیون</option>
                            <option value="ابزارآلات">ابزارآلات بافت و تجهیزات کارگاه</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className={labelClasses}>عنوان آگهی:</label>
                          <input
                            type="text"
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            placeholder="مثلا: فروش خامه پشمی دستریس طبیعی"
                            className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 outline-none font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className={labelClasses}>قیمت پیشنهادی:</label>
                            <input
                              type="text"
                              value={newAdPrice}
                              onChange={(e) => setNewAdPrice(e.target.value)}
                              placeholder="مثلا: توافقی"
                              className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 outline-none font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className={labelClasses}>شماره تماس ارتباطی:</label>
                            <input
                              type="text"
                              value={newAdContact}
                              onChange={(e) => setNewAdContact(e.target.value)}
                              placeholder="۰۹۱۲..."
                              className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 outline-none font-mono font-sans"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className={labelClasses}>توضیحات تکمیلی آگهی:</label>
                          <textarea
                            value={newAdDesc}
                            onChange={(e) => setNewAdDesc(e.target.value)}
                            placeholder="ابعاد، کیفیت و مشخصات کامل کالا یا خدمت را در این بخش بنویسید..."
                            rows={3}
                            className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded p-2 text-slate-200 outline-none resize-none font-sans"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={postClassifiedAd}
                          className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          انتشار فوری آگهی در صنف مادی مانا
                        </button>
                      </div>

                      {/* Right list column (7 Columns) */}
                      <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-4 text-right">
                        <span className="text-xs font-black text-slate-200 block border-b border-slate-850 pb-2">لیست آخرین آگهی‌های ثبت شده صنف:</span>
                        
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {classifiedAds.map((ad) => (
                            <div key={ad.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2 hover:border-amber-500/20 transition duration-300">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-black text-amber-400">{ad.category}</span>
                                <span className="text-slate-500 font-mono">قیمت: {ad.price}</span>
                              </div>

                              <div className="text-right">
                                <h5 className="text-xs font-black text-slate-100">{ad.title}</h5>
                                <p className="text-[10px] text-slate-400 mt-1 text-justify leading-relaxed">{ad.desc}</p>
                              </div>

                              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[9px]">
                                <span className="text-slate-300 font-bold bg-slate-900 border border-slate-850 px-2.5 py-0.5 rounded-full font-mono">تلفن تماس: {ad.contact}</span>
                                <span className="text-slate-500">شماره شناسایی آگهی: {ad.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* APP 1: EMPLOYEE WELFARE & INTEGRITY MANAGER (قوانین پنج‌گانه) */}
            {/* ======================================================== */}
            {selectedApp === 1 && (
              <div className="space-y-6" id="app-employee-manager">
                
                {/* Intro Rules Statement */}
                <div className="bg-indigo-950/20 border border-indigo-900/40 p-4.5 rounded-xl text-right space-y-3">
                  <div className="flex items-center gap-2 justify-end text-indigo-400">
                    <span className="text-xs font-extrabold text-indigo-300">منشور صلح و شایستگی کارکنان مانا</span>
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <p className={`text-slate-300 text-justify leading-relaxed ${bodyTextClasses}`}>
                    این منشور براساس دستورالعمل‌های پنج‌گانه ابلاغی توسعه یافته است:
                    <br />
                    <strong>۱. تمایل به همکاری:</strong> سنجش روح تیمی و اشتیاق حضور.
                    <strong> ۲. فداکاری در کار:</strong> قدردانی از ایثارها و تلاش فداکارانه.
                    <strong> ۳. پایبندی به قوانین:</strong> انطباق مطلق با اصول ایمنی و اخلاقی.
                    <strong> ۴. حمایت و راهنمایی مدیران ارشد:</strong> نقش مشاوره‌ای دلسوزانه همکاران با جناب سیاوش.
                    <strong> ۵. تعهد به رفاه و کرامت انسانی:</strong> تضمین رفاه، خستگی‌زدایی و سلامت عاطفی تک‌تک همکاران.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 text-right">
                  
                  {/* Left: Add & Evaluate Employee (5 Columns) */}
                  <div className="xl:col-span-5 bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-4">
                    <div className="border-b border-slate-950 pb-2">
                      <h4 className={`${appTitleClasses} text-white`}>ارزیابی و ثبت همکار جدید</h4>
                    </div>

                    <div className="space-y-3.5">
                      {/* Name & Gender */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className={labelClasses}>نام کامل همکار:</label>
                          <input
                            type="text"
                            value={newEmpName}
                            onChange={(e) => setNewEmpName(e.target.value)}
                            className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none font-bold"
                            placeholder="نام و نام خانوادگی"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={labelClasses}>جنسیت:</label>
                          <select
                            value={newEmpGender}
                            onChange={(e) => setNewEmpGender(e.target.value as "زن" | "مرد")}
                            className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none font-bold"
                          >
                            <option value="زن">بانوان (زن)</option>
                            <option value="مرد">آقایان (مرد)</option>
                          </select>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="space-y-1">
                        <label className={labelClasses}>سمت / تخصص:</label>
                        <input
                          type="text"
                          value={newEmpRole}
                          onChange={(e) => setNewEmpRole(e.target.value)}
                          className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none font-bold"
                          placeholder="مثلاً استادکار بافت / کارشناس طراح"
                        />
                      </div>

                      {/* Sliders for the 5 Pillars */}
                      <div className="space-y-3.5 pt-2 border-t border-slate-950">
                        <span className="text-[10.5px] text-indigo-400 font-extrabold block">سنجش معیارهای ارزشی پنج‌گانه (۱ تا ۱۰):</span>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                            <span className="text-indigo-400 font-mono">{newEmpCoop} / ۱۰</span>
                            <span>۱. تمایل به همکاری:</span>
                          </div>
                          <input
                            type="range" min="1" max="10" value={newEmpCoop}
                            onChange={(e) => setNewEmpCoop(Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-950 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                            <span className="text-pink-400 font-mono">{newEmpDevotion} / ۱۰</span>
                            <span>۲. فداکاری در کار:</span>
                          </div>
                          <input
                            type="range" min="1" max="10" value={newEmpDevotion}
                            onChange={(e) => setNewEmpDevotion(Number(e.target.value))}
                            className="w-full accent-pink-500 cursor-pointer h-1 bg-slate-950 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                            <span className="text-emerald-400 font-mono">{newEmpLaw} / ۱۰</span>
                            <span>۳. پایبندی به قوانین و مقررات:</span>
                          </div>
                          <input
                            type="range" min="1" max="10" value={newEmpLaw}
                            onChange={(e) => setNewEmpLaw(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-950 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                            <span className="text-amber-400 font-mono">{newEmpSeniorSup} / ۱۰</span>
                            <span>۴. حمایت و راهنمایی مدیران ارشد:</span>
                          </div>
                          <input
                            type="range" min="1" max="10" value={newEmpSeniorSup}
                            onChange={(e) => setNewEmpSeniorSup(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-950 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                            <span className="text-cyan-400 font-mono">{newEmpWelfare} / ۱۰</span>
                            <span>۵. تعهد به رفاه و کرامت انسانی:</span>
                          </div>
                          <input
                            type="range" min="1" max="10" value={newEmpWelfare}
                            onChange={(e) => setNewEmpWelfare(Number(e.target.value))}
                            className="w-full accent-cyan-500 cursor-pointer h-1 bg-slate-950 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-1">
                        <label className={labelClasses}>یادداشت‌های عملکردی و سلامت همکار:</label>
                        <textarea
                          rows={2}
                          value={newEmpNotes}
                          onChange={(e) => setNewEmpNotes(e.target.value)}
                          className="w-full text-right text-xs bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 outline-none font-semibold leading-relaxed"
                          placeholder="توضیحات و گزارشات رفاهی یا خستگی کالبدی..."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={addEmployee}
                        className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-650 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        ثبت مشخصات و ارزیابی شایستگی همکار
                      </button>

                    </div>
                  </div>

                  {/* Right: Employees List & Advice Loops (7 Columns) */}
                  <div className="xl:col-span-7 space-y-5">
                    
                    {/* Employees Register */}
                    <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-4">
                      <div className="border-b border-slate-950 pb-2">
                        <h4 className={`${appTitleClasses} text-white`}>لیست همکاران زن و مرد (ثبت و پایش فعال)</h4>
                      </div>

                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                        {employees.map((emp) => {
                          const avgScore = ((emp.cooperationScore + emp.devotionScore + emp.lawAdherenceScore + emp.seniorSupportScore + emp.welfareDignityScore) / 5).toFixed(1);
                          return (
                            <div key={emp.id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3 relative overflow-hidden">
                              <div className="absolute top-0 inset-y-0 right-0 w-[3px] bg-indigo-500" />
                              
                              <div className="flex justify-between items-start">
                                <button
                                  type="button"
                                  onClick={() => deleteEmployee(emp.id)}
                                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                                  title="حذف اطلاعات همکار"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                
                                <div className="text-right">
                                  <div className="flex items-center gap-2 justify-end">
                                    <span className="text-[10px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-indigo-300 font-bold">{emp.role}</span>
                                    <h5 className="text-xs font-black text-slate-100">{emp.name} ({emp.gender})</h5>
                                  </div>
                                  <span className="text-[8px] text-slate-500 block mt-0.5">تاریخ ثبت رسمی: {emp.createdAt}</span>
                                </div>
                              </div>

                              {/* Progress metrics bars */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[9.5px] border-t border-slate-900/60 pt-2.5">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-slate-400">
                                    <span className="font-mono text-slate-200">{emp.cooperationScore}/۱۰</span>
                                    <span>۱. تمایل به همکاری:</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${emp.cooperationScore * 10}%` }} />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-slate-400">
                                    <span className="font-mono text-slate-200">{emp.devotionScore}/۱۰</span>
                                    <span>۲. فداکاری در کار:</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-500" style={{ width: `${emp.devotionScore * 10}%` }} />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-slate-400">
                                    <span className="font-mono text-slate-200">{emp.lawAdherenceScore}/۱۰</span>
                                    <span>۳. پایبندی به مقررات:</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${emp.lawAdherenceScore * 10}%` }} />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-slate-400">
                                    <span className="font-mono text-slate-200">{emp.seniorSupportScore}/۱۰</span>
                                    <span>۴. حمایت از مدیران ارشد:</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{ width: `${emp.seniorSupportScore * 10}%` }} />
                                  </div>
                                </div>

                                <div className="md:col-span-2 space-y-1 border-t border-slate-900/40 pt-1.5">
                                  <div className="flex justify-between text-slate-400">
                                    <span className="font-mono text-cyan-400 font-extrabold">{emp.welfareDignityScore}/۱۰ (کرامت بالا)</span>
                                    <span>۵. رفاه و کرامت انسانی همکار:</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-400" style={{ width: `${emp.welfareDignityScore * 10}%` }} />
                                  </div>
                                </div>
                              </div>

                              <div className="bg-slate-900/60 p-2 rounded text-[10px] text-slate-300 text-justify border border-slate-900 leading-relaxed font-semibold">
                                📝 یادداشت: {emp.notes}
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                                <span className="font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/35 px-2 py-0.5 rounded">
                                  میانگین امتیاز: {avgScore}
                                </span>
                                <span className="font-bold">رتبه شایستگی مادی</span>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Suggestions loops / Advisory support */}
                    <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-3">
                      <div className="border-b border-slate-950 pb-2">
                        <h4 className={`${appTitleClasses} text-white`}>کارتابل مشاوره‌ای و رهنمود همکاران دلسوز</h4>
                      </div>

                      <p className={`text-slate-400 text-justify leading-relaxed ${bodyTextClasses}`}>
                        بر اساس اصل چهارم، همکاران می‌توانند رهنمودها، مشاوره‌های دلسوزانه و حمایت‌های فکری خود را مستقیماً برای برطرف کردن موانع کسب‌وکار و ارتقای مادی سیستم ارسال نمایند.
                      </p>

                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        {adviceLog.map((adv) => (
                          <div key={adv.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[10px] space-y-1">
                            <div className="flex justify-between text-[8px] text-slate-500">
                              <span>تاریخ ثبت: {adv.date}</span>
                              <strong className="text-amber-400">فرستنده: {adv.sender}</strong>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-justify font-semibold">{adv.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1.5">
                        <button
                          type="button"
                          onClick={submitAdvice}
                          className={`bg-indigo-900/80 text-white font-extrabold cursor-pointer border border-indigo-800/40 hover:bg-indigo-850 ${buttonClasses}`}
                        >
                          ثبت مشورت
                        </button>
                        <input
                          type="text"
                          value={adviceText}
                          onChange={(e) => setAdviceText(e.target.value)}
                          className="flex-grow text-right text-xs bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-250 outline-none"
                          placeholder="یک پیشنهاد یا نصیحت دلسوزانه بنویسید..."
                        />
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* APP 2: PROJECT HAMRAST & CREATION SIMULATOR              */}
            {/* ======================================================== */}
            {selectedApp === 2 && (
              <div className="space-y-6" id="app-hamrast-simulator">
                
                {/* Large high-visibility header banner */}
                <div className="bg-gradient-to-r from-indigo-950/20 via-slate-950/90 to-purple-955/20 border border-indigo-500/20 p-5 rounded-xl text-right space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500" />
                  <div className="flex items-center gap-2 justify-end text-indigo-400">
                    <span className="text-xs font-extrabold bg-indigo-950/60 border border-indigo-850 px-2 py-0.5 rounded">همگرایی عاطفی و مادی</span>
                    <h4 className="text-sm font-black text-slate-100 font-sans">سامانه هم‌راست و شبیه‌ساز خلاقیت (پروژه آفرینش)</h4>
                  </div>
                  <p className={`text-slate-200 text-justify leading-relaxed ${bodyTextClasses}`}>
                    این سامانه هوش مصنوعی، مأموریت دارد پروژه‌های مستقل شما یعنی <strong>«آفرینش»</strong> و <strong>«هم‌راست»</strong> را شبیه‌سازی و با بازار مادی <strong>«فرش بازار»</strong> و کرامت کارکنان همگام‌سازی کند. در اینجا می‌توانید سناریوهای مختلف ادغام هوش مصنوعی عاطفی با تجارت سنتی و صنایع دستی را تعریف، تحلیل و اجرا کنید تا مطمئن شوید اهداف هنری با الگوهای تجاری موازنه می‌شوند.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 text-right">
                  
                  {/* Left: Add New Simulation Scenario (5 Columns) */}
                  <div className="xl:col-span-5 bg-slate-900/40 border border-slate-900 p-5 rounded-xl space-y-4">
                    <div className="border-b border-slate-950 pb-2">
                      <h4 className={`${appTitleClasses} text-white`}>تعریف سناریوی شبیه‌سازی جدید</h4>
                    </div>

                    <div className="space-y-4">
                      
                      <div className="space-y-1">
                        <label className={`${labelClasses} text-slate-300 block mb-1 font-bold`}>عنوان سناریو یا طرح هم‌راستایی:</label>
                        <input
                          type="text"
                          value={newSimName}
                          onChange={(e) => setNewSimName(e.target.value)}
                          className="w-full text-right bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none text-sm font-black focus:border-indigo-500"
                          placeholder="مثلاً: ادغام طرح اسلیمی مانا در فرش قم"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`${labelClasses} text-slate-300 block mb-1 font-bold`}>میزان هم‌راستایی با هوش عاطفی مانا ({newSimAlignment}%):</label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={newSimAlignment}
                          onChange={(e) => setNewSimAlignment(Number(e.target.value))}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={`${labelClasses} text-slate-300 block mb-1 font-bold`}>اثر بر بازار فرش ({newSimImpact}%):</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={newSimImpact}
                            onChange={(e) => setNewSimImpact(Number(e.target.value))}
                            className="w-full text-right bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 outline-none text-xs font-black focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className={`${labelClasses} text-slate-300 block mb-1 font-bold`}>شاخص رفاه کارکنان ({newSimWelfare}%):</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={newSimWelfare}
                            onChange={(e) => setNewSimWelfare(Number(e.target.value))}
                            className="w-full text-right bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 outline-none text-xs font-black focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={addSimulation}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 text-white font-black text-sm rounded-xl shadow-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-5 h-5" />
                        اجرا و ثبت شبیه‌سازی هم‌راست
                      </button>

                    </div>
                  </div>

                  {/* Right: Active Simulations List (7 Columns) */}
                  <div className="xl:col-span-7 space-y-4 bg-slate-900/40 border border-slate-900 p-5 rounded-xl">
                    <div className="border-b border-slate-950 pb-2 flex justify-between items-center">
                      <span className="text-indigo-400 font-mono font-bold text-xs">SIMULATION LOGS</span>
                      <h4 className={`${appTitleClasses} text-white`}>نتایج محاسباتی شبیه‌سازی‌های هم‌راست</h4>
                    </div>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {simulations.length === 0 ? (
                        <p className="text-center text-slate-500 py-6">سناریوی شبیه‌سازی فعالی ثبت نشده است.</p>
                      ) : (
                        simulations.map((sim) => (
                          <div
                            key={sim.id}
                            className="p-4 rounded-xl border border-slate-900 bg-slate-950 transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden"
                          >
                            <div className="flex items-start gap-3 w-full md:w-auto justify-start text-right">
                              <button
                                type="button"
                                onClick={() => deleteSimulation(sim.id)}
                                className="text-slate-500 hover:text-red-400 p-1.5 cursor-pointer shrink-0 mt-1"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              
                              <div className="text-right space-y-1">
                                <h5 className="text-sm font-extrabold text-slate-100">{sim.scenarioName}</h5>
                                <div className="flex flex-wrap gap-2 justify-end text-[10px] text-slate-400 font-bold">
                                  <span className="bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/15">هم‌راستایی هوش عاطفی: {sim.aiAlignmentScore}%</span>
                                  <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/15">اثر بر بازار فرش: +{sim.businessGrowthImpact}%</span>
                                  <span className="bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-500/15">رفاه همکاران: {sim.employeeWelfareIndex}%</span>
                                </div>
                                <span className="text-[9px] text-slate-500 block">تاریخ مدل‌سازی: {sim.createdAt}</span>
                              </div>
                            </div>

                            <div className="shrink-0 bg-indigo-950/30 border border-indigo-500/20 px-3 py-2 rounded-xl text-center">
                              <span className="text-[10px] text-slate-400 block font-bold">سازگاری کلی</span>
                              <span className="text-sm font-black text-indigo-400 font-mono">
                                {Math.round((sim.aiAlignmentScore + sim.businessGrowthImpact + sim.employeeWelfareIndex) / 3)}%
                              </span>
                            </div>

                          </div>
                        ))
                      )}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 leading-relaxed max-w-xs text-right">
                        با فعال‌سازی این الگو، هوش مصنوعی مانا مانیتورینگ زنده بازار فرش و وضعیت رفاه کارکنان را هماهنگ می‌سازد.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const avg = Math.round(simulations.reduce((acc, curr) => acc + curr.aiAlignmentScore, 0) / (simulations.length || 1));
                          const text = `وضعیت شبیه‌سازی هم‌راست محاسبه شد. میانگین ضریب هم‌راستایی در کل پروژه‌های شما ${avg} درصد گزارش شده است.`;
                          try {
                            if ('speechSynthesis' in window) {
                              const utterance = new SpeechSynthesisUtterance(text);
                              utterance.lang = "fa-IR";
                              utterance.rate = 0.95;
                              window.speechSynthesis.speak(utterance);
                              playPerfectTone(528, 0.4);
                            } else {
                              alert("سیستم سخن‌گو فعال نشد.");
                            }
                          } catch(e){}
                        }}
                        className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 font-bold px-3.5 py-2 rounded-xl cursor-pointer transition flex items-center gap-1 text-xs"
                      >
                        <Volume2 className="w-4 h-4" />
                        گزارش صوتی سناریوهای هم‌راست 🔊
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* OTHER 6 SLOTS: AUDIO & ECOSYSTEM MODULES                  */}
            {/* ======================================================== */}
            {selectedApp >= 3 && (
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl text-right space-y-4" id="app-others">
                <div className="border-b border-slate-950 pb-2">
                  <h4 className={`${appTitleClasses} text-white`}>{NINE_APPS[selectedApp].title}</h4>
                </div>

                <div className="bg-slate-950/60 p-4.5 rounded-xl space-y-3 text-justify border border-indigo-950/40">
                  <span className="text-[11px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-indigo-300 font-bold">{NINE_APPS[selectedApp].badge}</span>
                  <p className={`${bodyTextClasses} text-slate-300 leading-relaxed font-sans`}>
                    این ماژول عمیق تمدنی به طور مستقیم تحت چتر حمایتی مانا و در کانون لایسنس کاربری شما قفل شده است. شما صاحب تام ۱۰۰٪ مادی و معنوی خروجی‌های این اپلیکیشن هستید.
                  </p>
                </div>

                {/* Simulated interactive elements based on module select */}
                {selectedApp === 3 && (
                  <div className="space-y-3.5 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <span className="text-xs font-bold text-slate-200 block">پخش‌کننده فرکانس‌های صلح مانا:</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { hz: 396, name: "۳۹۶ هرتز (رهایی از تروما)" },
                        { hz: 528, name: "۵۲۸ هرتز (ترمیم و عشق)" },
                        { hz: 639, name: "۶۳۹ هرتز (اتحاد و همبستگی)" },
                        { hz: 741, name: "۷۴۱ هرتز (پاکسازی تفرقه)" }
                      ].map((freq) => (
                        <button
                          key={freq.hz}
                          type="button"
                          onClick={() => {
                            playPerfectTone(freq.hz, 1.5, "sine");
                            speakHomePersonaText(`سیگنال صوتی شفابخش ${freq.hz} هرتز در فضا طنین‌انداز شد.`);
                          }}
                          className="bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-550 rounded-xl p-3 font-bold text-xs cursor-pointer transition text-center"
                        >
                          🎵 {freq.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp === 4 && (
                  <div className="space-y-3.5 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <span className="text-xs font-bold text-slate-200 block">کلوپ مهارتی و دوره‌های آموزشی آفرینا:</span>
                    <div className="space-y-2">
                      {[
                        { title: "دوره جامع رنگرزی گیاهی نخ فرش بازار", status: "بارگذاری شده", xp: "+۴۰ امتیاز" },
                        { title: "طراحی کانون کتیبه‌های راز در دسکتاپ مانا", status: "آماده تعامل", xp: "+۳۰ امتیاز" },
                        { title: "مهارت‌های تمدنی همزیستی و توازن عاطفی", status: "آماده پخش", xp: "+۵۰ امتیاز" }
                      ].map((course, idx) => (
                        <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 flex justify-between items-center text-xs">
                          <span className="text-emerald-400 font-mono font-bold">{course.xp}</span>
                          <div className="text-right flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold">وضعیت: {course.status}</span>
                            <strong className="text-slate-200">{course.title}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp === 5 && (
                  <div className="space-y-3.5 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <span className="text-xs font-bold text-slate-200 block">الگوهای عاطفی همراز و کالبد ساغر و کیوان:</span>
                    <p className="text-xs text-slate-400 text-justify leading-relaxed">
                      کارگاه آیرینیست‌ها به خوبی دوز شده است. شما می‌توانید با استفاده از کدهای عواطف مانا، به این کانون وارد شده و با آواتارهای مقتدر گفتگو کنید.
                    </p>
                    <button
                      type="button"
                      onClick={() => alert("مدول گفتگو با ساغر و کیوان در قاب اصلی آشیانه آواتارها یکپارچه شد.")}
                      className="bg-indigo-900 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                    >
                      ورود به کارگاه تخصصی همراز
                    </button>
                  </div>
                )}

                {selectedApp === 6 && (
                  <div className="space-y-3.5 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <span className="text-xs font-bold text-slate-200 block">کلینیک التیام و پایش صلح در روان:</span>
                    <p className="text-xs text-slate-400 text-justify leading-relaxed">
                      بیمار بیش از هر مفاهمه مادی یا دادگاه صلح عاطفی به آغوشی دلسوز و گرم احتیاج دارد. در این کانون، ابزارهای پایش استرس همکاران تعبیه گردیده است.
                    </p>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 w-3/4 animate-pulse" />
                    </div>
                  </div>
                )}

                {selectedApp >= 7 && (
                  <p className="text-xs text-slate-400 italic">ماژول به صورت سند رسمی صلح مادی و معنوی بر روی تبلت لود شده است و آماده کامپایل در بستر هوشمند است.</p>
                )}

              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

    </div>
  );
};
