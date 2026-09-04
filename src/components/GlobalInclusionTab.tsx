// src/components/GlobalInclusionTab.tsx
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Award,
  Eye,
  Ear,
  Hand,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Share2,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Users,
  Compass,
  FileCode2,
  BookOpen,
  Volume2
} from "lucide-react";
import { AppLanguage, SUPPORTED_LANGUAGES, t } from "../translations";

interface GlobalInclusionTabProps {
  appLanguage: AppLanguage;
  onOpenAccessibilitySuite: () => void;
}

export const GlobalInclusionTab: React.FC<GlobalInclusionTabProps> = ({
  appLanguage,
  onOpenAccessibilitySuite
}) => {
  const [activeSection, setActiveSection] = useState<"overview" | "languages" | "a11y" | "architecture">("overview");

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 p-6 sm:p-8 border border-indigo-500/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>GLOBAL EXPANSION & WCAG 2.2 AAA ACCESSIBILITY SUITE</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 leading-tight">
            سامانه بین‌المللی مانا؛ پشتیبانی مادری از ۹ زبان زنده جهان و بالاترین استاندارد دسترسی‌پذیری جهانی
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
            پلتفرم «مانا» و منظومه «ابرشهر توانا و خلیج فارس» اکنون به صورت بومی و با ساختار هوشمند دوجهته (RTL/LTR) برای جمعیتی بالغ بر ۴.۸ میلیارد نفر در سراسر قاره‌های آسیا، اروپا، خاورمیانه و آمریکا مهیا شده است. همچنین با انطباق با بالاترین سطح دسترسی‌پذیری (WCAG 2.2 AAA)، تجربه کاربری برابری برای نابینایان، ناشنوایان و معلولان جسمی به ارمغان آورده است.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenAccessibilitySuite}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>باز کردن مرکز دسترسی‌پذیری و تنظیمات ویژه</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Section 508 & EN 301 549 Certified Architecture</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 rounded-2xl gap-2 overflow-x-auto">
        {[
          { id: "overview", label: "نمای کلی و شاخص‌های آماری", icon: BarChart3 },
          { id: "languages", label: "۹ زبان مادری و بازار هدف", icon: Globe },
          { id: "a11y", label: "استانداردهای ۳ گانه توان‌یابان", icon: Award },
          { id: "architecture", label: "گزارش معماری کدها و API", icon: FileCode2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeSection === tab.id
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Overview & Market Projections */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">جمعیت در دسترس زبان‌های هدف:</span>
              <p className="text-xl font-black text-emerald-400 font-mono">۴,۸۵۰,۰۰۰,۰۰۰+</p>
              <p className="text-[10px] text-slate-500">بیش از ۶۰٪ جمعیت کره زمین</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">تعداد زبان‌های مادری:</span>
              <p className="text-xl font-black text-indigo-400 font-mono">۹ زبان رسمی</p>
              <p className="text-[10px] text-slate-500">FA, EN, AR, FR, ES, DE, RU, ZH, HI</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">سطح دسترسی‌پذیری بین‌المللی:</span>
              <p className="text-xl font-black text-cyan-400 font-mono">WCAG 2.2 AAA</p>
              <p className="text-[10px] text-slate-500">سازگار با تمامی صفحه‌خوان‌ها</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400">اتوماسیون API هوش مصنوعی:</span>
              <p className="text-xl font-black text-purple-400 font-mono">۱۰۰٪ خودکار</p>
              <p className="text-[10px] text-slate-500">Gemini 3.7 Flash + Fallback ایمن</p>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>چشم‌انداز آماری و استراتژی ورود به بازارهای جهانی</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <span>🇮🇷 🇦🇪 خاورمیانه و کشورهای عربی (MENA)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
                  بازار ۴۵۰ میلیون نفری فارسی و عربی زبان؛ تمرکز بر مشاوره عاطفی بومی، فناوری‌های سبز خلیج فارس، انتشار در کافه‌بازار و مایکت با زیرساخت پرداخت امن.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <span>🇪🇺 🇺🇸 اروپا و آمریکای شمالی و لاتین</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
                  پوشش زبان‌های انگلیسی، فرانسوی، اسپانیایی، آلمانی و روسی؛ تمرکز بر جذب سرمایه‌گذاران استراتژیک، پلتفرم‌های مراقبت روانی و استانداردهای سخت‌گیرانه دسترسی‌پذیری اتحادیه اروپا (EAA 2025).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <span>🇨🇳 🇮🇳 غول‌های جمعیتی آسیا (چین و هند)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed text-justify">
                  بازار ۲.۸ میلیارد نفری زبان‌های چینی ماندارین و هندی؛ ارائه ابزارهای آرامش ذهنی و آشیانه آفرینشگران مانا با سرعت بسیار بالا.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Detailed Languages Table */}
      {activeSection === "languages" && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span>فهرست ۹ زبان مادری با جزئیات فنی و جهت چینش (RTL / LTR)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <div
                  key={lang.code}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <h4 className="font-extrabold text-slate-100 text-sm">{lang.nativeName}</h4>
                        <span className="text-[10px] text-slate-400">{lang.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                      {lang.dir.toUpperCase()}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                    <span>کد صوتی TTS:</span>
                    <span className="font-mono text-indigo-300">{lang.speechLang}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Universal Accessibility Suite Details */}
      {activeSection === "a11y" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Blind */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-emerald-500/40 space-y-3">
              <div className="p-3 bg-emerald-950 text-emerald-300 rounded-2xl w-fit">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-100">ویژه نابینایان و کم‌بینایان</h4>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>صفحه‌خوان هوشمند صوتی (TTS) به زبان مادری</li>
                <li>۶ تم با کنتراست بی‌نهایت (High-Contrast AAA)</li>
                <li>بزرگ‌نمایی فونت‌ها تا ۲۵۰٪ بدون شکستگی المان‌ها</li>
                <li>فونت اختصاصی ضد خستگی و نارساخوانی (Dyslexia)</li>
                <li>برچسب‌های کامل ARIA و پشتیبانی از NVDA/JAWS</li>
              </ul>
            </div>

            {/* Deaf */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-cyan-500/40 space-y-3">
              <div className="p-3 bg-cyan-950 text-cyan-300 rounded-2xl w-fit">
                <Ear className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-100">ویژه ناشنوایان و کم‌شنوایان</h4>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>زیرنویس همزمان برای ۱۰۰٪ مکالمات و پاسخ‌های هوش مصنوعی</li>
                <li>فلشر نوری حاشیه صفحه هنگام تولید صدا یا پالس</li>
                <li>بازخورد لمسی و لرزشی (Haptic) روی گوشی‌ها</li>
                <li>طیف‌نگار بصری رنگی احساسات PAD بدون اتکا به صوت</li>
                <li>توصیف نوشتاری فرکانس‌های آرامش‌بخش سولفژیو</li>
              </ul>
            </div>

            {/* Motor */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-purple-500/40 space-y-3">
              <div className="p-3 bg-purple-950 text-purple-300 rounded-2xl w-fit">
                <Hand className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-100">ویژه معلولان جسمی و حرکتی</h4>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>کلیدهای غول‌پیکر (Jumbo Buttons) بالای ۵۶ پیکسل</li>
                <li>کلیک خودکار با توقف ماوس (Dwell Click بدون فشردن دکمه)</li>
                <li>فرمان صوتی بدون نیاز به دست (Voice Navigation)</li>
                <li>ناوبری کامل با کیبورد و کلیدهای میانبر (Alt+1 تا Alt+9)</li>
                <li>حالت توقف چرخش‌ها و انیمیشن‌ها (Reduced Motion)</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Section 4: Architecture & API Automation Report */}
      {activeSection === "architecture" && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-emerald-400" />
              <span>گزارش جامع معماری نرم‌افزار، امنیت و یکپارچگی کدها</span>
            </h3>

            <div className="space-y-3 text-slate-300 leading-relaxed text-justify">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400">۱. اتوماسیون کامل کلیدهای API و هوش مصنوعی سرور:</span>
                <p>
                  در فایل <code className="bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded font-mono">server.ts</code>، تمامی مسیرهای تحلیلی عاطفی (<code className="font-mono text-cyan-300">/api/analyze-sentiment</code>, <code className="font-mono text-cyan-300">/api/generate-content</code>, <code className="font-mono text-cyan-300">/api/enhance-speech</code>) به مدل پرچمدار <code className="text-yellow-300 font-mono">Gemini 3.7 Flash</code> مجهز شده‌اند. سیستم به طور خودکار به متغیرهای محیطی متصل بوده و نیازی به وارد کردن دستی هیچ کلیدی توسط کاربر ندارد.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400">۲. موتور ترجمه و انطباق فرهنگی (Localization Engine):</span>
                <p>
                  فایل <code className="bg-slate-900 text-indigo-300 px-1.5 py-0.5 rounded font-mono">src/translations.ts</code> با پوشش ۹ زبان مادری (فارسی، انگلیسی، عربی، فرانسوی، اسپانیایی، آلمانی، روسی، چینی و هندی) طراحی شده و وضعیت راست‌به‌چپ (RTL) و چپ‌به‌راست (LTR) به همراه کدهای صوتی Web Speech API را مدیریت می‌کند.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-400">۳. پایگاه داده امن ابری Firebase Firestore:</span>
                <p>
                  پایگاه داده برای ذخیره امن پیام‌ها، الواح حکمت، صندوقچه رازها و رکوردهای شهر توانا متصل بوده و قوانین دسترسی‌پذیری امنیتی روی آن اعمال شده است.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
