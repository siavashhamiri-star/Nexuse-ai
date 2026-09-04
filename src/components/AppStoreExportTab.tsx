import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Download,
  ShieldCheck,
  Globe,
  Store,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  FileText,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Zap,
  Terminal,
  Layers,
  Share2,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface AppStoreExportTabProps {
  appLanguage: string;
  speakHomePersonaText?: (txt: string) => void;
}

export const AppStoreExportTab: React.FC<AppStoreExportTabProps> = ({
  appLanguage,
  speakHomePersonaText
}) => {
  const [selectedMarket, setSelectedMarket] = useState<"bazaar" | "myket" | "playstore" | "appstore" | "pwa">("bazaar");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"gradle" | "checklist" | "capacitor" | "metadata" | "privacy">("gradle");
  const [activeGradleFile, setActiveGradleFile] = useState<"appBuildGradle" | "rootBuildGradle" | "manifest" | "stringsXml" | "proguard" | "keystore">("appBuildGradle");

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Gradle Files Content
  const appBuildGradleCode = `apply plugin: 'com.android.application'

android {
    namespace "com.mana.ecosystem.app"
    compileSdk 34

    defaultConfig {
        applicationId "com.mana.ecosystem.app"
        minSdk 24
        targetSdk 34
        versionCode 100
        versionName "1.0.0"
        
        // Multi-language locales support: FA, EN, AR, FR, ES, DE, RU, ZH (Chinese), HI (Hindi), JA (Japanese)
        resourceConfigurations += ['fa', 'en', 'ar', 'fr', 'es', 'de', 'ru', 'zh', 'hi', 'ja']
    }

    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "release-key.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "mana123456"
            keyAlias System.getenv("KEY_ALIAS") ?: "mana"
            keyPassword System.getenv("KEY_PASSWORD") ?: "mana123456"
        }
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }

    bundle {
        language {
            enableSplit = false // Include all languages in single AAB package
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.core:core-splashscreen:1.0.1'
    implementation 'androidx.webkit:webkit:1.10.0'
    implementation 'com.google.android.material:material:1.11.0'
}`;

  const rootBuildGradleCode = `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.1'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mana.ecosystem.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ManaEcosystem"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
            android:theme="@style/Theme.ManaEcosystem.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const stringsXmlCode = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">مانا | Mana Ecosystem</string>
    <string name="title_activity_main">مانا</string>
    <string name="package_name">com.mana.ecosystem.app</string>
    <!-- Supported Languages: Persian, English, Arabic, French, Spanish, German, Russian, Chinese (中文), Hindi (हिन्दी), Japanese (日本語) -->
</resources>`;

  const proguardCode = `# Proguard Rules for Mana Android Release
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**`;

  const keystoreCommands = `# دستور ساخت کلید امضای رسمی (Release Keystore) برای کافه‌بازار و گوگل‌پلی:
keytool -genkey -v -keystore release-key.jks -alias mana -keyalg RSA -keysize 2048 -validity 10000

# دستور ساخت فایل خروجی APK برای کافه‌بازار و مایکت:
cd android
./gradlew assembleRelease

# دستور ساخت فایل خروجی AAB (App Bundle) برای گوگل‌پلی:
cd android
./gradlew bundleRelease

# مسیر فایل خروجی APK ساخته شده:
# android/app/build/outputs/apk/release/app-release.apk

# مسیر فایل خروجی AAB ساخته شده:
# android/app/build/outputs/bundle/release/app-release.aab`;

  // Capacitor setup commands
  const capacitorCommands = `
# ۱. نصب کتابخانه‌های Capacitor جهت تبدیل وب‌اپلیکیشن به اپ موبایل نیتیو:
npm install @capacitor/core @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar
npm install -D @capacitor/cli

# ۲. ایجاد فایل پیکربندی پروژه موبایل:
npx cap init "مانا" "com.mana.ecosystem.app" --web-dir dist

# ۳. ساخت نسخه نهايي وب (Build Production):
npm run build

# ۴. افزودن پلتفرم‌های اندروید و iOS:
npx cap add android
npx cap add ios

# ۵. همگام‌سازی فایل‌های ساخت پروژه با پلتفرم‌های نیتیو:
npx cap sync

# ۶. باز کردن پروژه در محیط اندروید استودیو (جهت گرفتن فایل APK / AAB برای کافه‌بازار، مایکت و گوگل‌پلی):
npx cap open android

# ۷. باز کردن پروژه در Xcode (جهت خروجی iOS برای اپ استور):
npx cap open ios
  `.trim();

  // Iranian Market Payment Code Example
  const bazaarPaymentSnippet = `
// نمونه کد متصل‌کننده پرداخت درون‌برنامه‌ای بازار و مایکت (Shetab Payment Gateway / Bazaar IAP)
import { registerBazaarInAppPurchase } from "./bazaarService";

export const initializeIranianPayment = async (packageId: string) => {
  try {
    // ۱. بررسی بازار و ارسال درخواست خرید بسته
    const purchaseResult = await registerBazaarInAppPurchase({
      sku: packageId,
      userToken: "USER_UNIQUE_ID",
      developerPayload: "MANA_VIP_SUBSCRIPTION"
    });

    if (purchaseResult.status === "SUCCESS") {
      console.log("خرید با موفقیت در شبکه شتاب انجام شد. شماره پیگیری:", purchaseResult.transactionId);
      return true;
    }
  } catch (error) {
    console.error("خطا در درگاه پرداخت کافه‌بازار:", error);
    return false;
  }
};
  `.trim();

  // Privacy Policy Content for App Stores
  const privacyPolicyFa = `
سیاست حفظ حریم خصوصی و امنیت داده‌های کاربران در اپلیکیشن «مانا» (Mana Ecosystem)

تاریخ آخرین بروزرسانی: مرداد ۱۴۰۵

۱. جمع‌آوری داده‌ها:
اپلیکیشن مانا متعهد به حفظ کامل حریم خصوصی کاربران است. تمامی مکالمات، داده‌های دفترچه احساسات و اطلاعات ارزیابی روان‌شناختی به صورت محلی در حافظه امن دستگاه کاربر ذخیره شده و بدون اجازه صریح کاربر به هیچ سرور ثالثی منتقل نمی‌شود.

۲. مجوزهای دسترسی (Permissions):
- دسترسی به میکروفون: صرفاً جهت ضبط صوت و تحلیل لحن گفتار هوشمند در بخش‌های مشاوره صوت‌محور استفاده می‌شود.
- دسترسی به حافظه محلی (IndexedDB / LocalStorage): جهت ذخیره‌سازی آفلاین تاریخچه گفتار و ترجیحات کاربر.

۳. عدم فروش اطلاعات:
اطلاعات شخصی، داده‌های پزشکی یا رفتاری کاربران به هیچ عنوان فروخته نشده و در اختیار تبلیغ‌دهندگان قرار نمی‌گیرد.

۴. حق حذف داده‌ها (Right to Erasure):
کاربران در هر زمان می‌توانند با مراجعه به بخش «مدیریت حریم خصوصی و حذف داده‌ها»، کلیه اطلاعات ذخیره‌شده خود را با یک کلیک پاکسازی نمایند.
  `.trim();

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 md:p-8 border border-emerald-500/30 shadow-2xl">
        <div className="absolute -top-12 -left-12 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-950/90 rounded-2xl border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-950/50">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-md font-mono font-extrabold tracking-wider">
                  IRANIAN & GLOBAL APP STORE PUBLISHING PORTAL
                </span>
                <h2 className="text-lg md:text-xl font-extrabold text-slate-100 mt-1">
                  مرکز آماده‌سازی و انتشار اپلیکیشن در کافه‌بازار، مایکت، گوگل‌پلی و اپ‌استور
                </h2>
              </div>
            </div>

            {/* PWA Direct Installation Status */}
            <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">وضعیت PWA: آماده نصب مستقیم روی Android / iOS</span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed text-justify">
            کلیه ابزارها، فایل‌های پیکربندی نیتیو (Capacitor Config)، فایل Manifest، مجوزهای دسترسی، راهنمای اتصال به درگاه‌های پرداخت درون‌برنامه‌ای بازار و مایکت، و متن سیاست حفظ حریم خصوصی استانداردهای مارکت‌های ایرانی و بین‌المللی آماده شده است.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => setActiveSubTab("gradle")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeSubTab === "gradle"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-950/50"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-300" />
              <span>فایل‌های گریدل و ساخت APK / AAB (Gradle & Native Builder)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("checklist")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeSubTab === "checklist"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>چک‌لیست انتشار مارکت‌ها (Bazaar / Myket / PlayStore)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("capacitor")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeSubTab === "capacitor"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/50"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>کدهای ساخت نسخه نیتیو (Capacitor & Android Studio)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("metadata")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeSubTab === "metadata"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>متون معرفی و توضیحات اپلیکیشن (Store Listing Copy)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("privacy")}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
                activeSubTab === "privacy"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/50"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>سیاست حفظ حریم خصوصی (Privacy Policy URL)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 0: GRADLE BUILDER & APK / AAB SCRIPTS */}
      {activeSubTab === "gradle" && (
        <div className="space-y-6">
          {/* Quick Actions / Formats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-950 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-800">
                  BAZAAR & MYKET
                </span>
                <Download className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-100">فایل خروجی APK (Release APK)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                فرمت مستقیم جهت آپلود در پنل توسعه‌دهندگان کافه‌بازار و مایکت یا نصب مستقیم روی تمام گوشی‌های اندروید.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 dir-ltr text-left">
                ./gradlew assembleRelease
              </div>
            </div>

            <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-blue-950 text-blue-300 font-mono font-bold px-2 py-0.5 rounded border border-blue-800">
                  GOOGLE PLAY STORE
                </span>
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-100">بسته نرم‌افزاری AAB (App Bundle)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                فرمت اجباری گوگل‌پلی جهت بهینه‌سازی حجم دانلود بر اساس معماری پردازنده و زبان کاربر.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 dir-ltr text-left">
                ./gradlew bundleRelease
              </div>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-3xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-800">
                  10 LANGUAGES EMBEDDED
                </span>
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-100">پوشش کامل زبان‌های بین‌المللی</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                پشتیبانی داخلی از فارسی، انگلیسی، عربی، فرانسوی، اسپانیایی، آلمانی، روسی، چینی (中文)، هندی (हिन्दी) و ژاپنی (日本語).
              </p>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 dir-ltr text-left">
                fa, en, ar, fr, es, de, ru, zh, hi, ja
              </div>
            </div>
          </div>

          {/* Gradle Project File Explorer & Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-slate-100 text-sm">
                  مرکز پیکربندی فایل‌های گریدل نیتیو (Android Gradle Configuration)
                </h3>
              </div>
              <button
                onClick={() => {
                  const currentCode =
                    activeGradleFile === "appBuildGradle"
                      ? appBuildGradleCode
                      : activeGradleFile === "rootBuildGradle"
                      ? rootBuildGradleCode
                      : activeGradleFile === "manifest"
                      ? manifestCode
                      : activeGradleFile === "stringsXml"
                      ? stringsXmlCode
                      : activeGradleFile === "proguard"
                      ? proguardCode
                      : keystoreCommands;
                  handleCopy(currentCode, "gradleCopy");
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shadow-lg shadow-amber-950/50"
              >
                {copiedKey === "gradleCopy" ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === "gradleCopy" ? "کد فایل کپی شد" : "کپی فایل انتخابی"}</span>
              </button>
            </div>

            {/* File Selector Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveGradleFile("appBuildGradle")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  activeGradleFile === "appBuildGradle"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                android/app/build.gradle (APK & AAB Config)
              </button>

              <button
                onClick={() => setActiveGradleFile("rootBuildGradle")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  activeGradleFile === "rootBuildGradle"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                android/build.gradle (Project Level)
              </button>

              <button
                onClick={() => setActiveGradleFile("manifest")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  activeGradleFile === "manifest"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                AndroidManifest.xml (مجوزها و اینتنت‌ها)
              </button>

              <button
                onClick={() => setActiveGradleFile("stringsXml")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  activeGradleFile === "stringsXml"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                res/values/strings.xml (چندزبانه)
              </button>

              <button
                onClick={() => setActiveGradleFile("proguard")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  activeGradleFile === "proguard"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                proguard-rules.pro (بهینه‌سازی و امنیت)
              </button>

              <button
                onClick={() => setActiveGradleFile("keystore")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                  activeGradleFile === "keystore"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                راهنمای ساخت Keystore و دستورات ساخت
              </button>
            </div>

            {/* Code Display */}
            <pre className="bg-slate-950 p-5 rounded-3xl border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto text-left dir-ltr leading-relaxed">
              {activeGradleFile === "appBuildGradle" && appBuildGradleCode}
              {activeGradleFile === "rootBuildGradle" && rootBuildGradleCode}
              {activeGradleFile === "manifest" && manifestCode}
              {activeGradleFile === "stringsXml" && stringsXmlCode}
              {activeGradleFile === "proguard" && proguardCode}
              {activeGradleFile === "keystore" && keystoreCommands}
            </pre>

            <div className="bg-amber-950/40 border border-amber-800/50 p-4 rounded-2xl text-xs text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>مراحل گام‌به‌گام ساخت فایل APK و AAB:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>ابتدا اسکریپت ساخت فایل‌های وب را با دستور <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">npm run build</code> اجرا نمایید.</li>
                <li>فایل‌های خروجی در پوشه <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">android/app/src/main/assets/public</code> کپی شده‌اند.</li>
                <li>با دستور <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">cd android && ./gradlew assembleRelease</code> فایل APK جهت کافه‌بازار و مایکت ساخته می‌شود.</li>
                <li>با دستور <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-mono">cd android && ./gradlew bundleRelease</code> فایل AAB جهت بارگذاری در گوگل‌پلی ساخته می‌شود.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: STORE CHECKLIST & MARKET SELECTION */}
      {activeSubTab === "checklist" && (
        <div className="space-y-6">
          
          {/* Market Selection Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedMarket("bazaar")}
              className={`p-4 rounded-3xl border transition text-right space-y-2 cursor-pointer ${
                selectedMarket === "bazaar"
                  ? "bg-gradient-to-br from-emerald-950 to-slate-900 border-emerald-500 shadow-xl"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <Store className="w-6 h-6 text-emerald-400" />
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">بازار IRAN</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-100">کافه‌بازار (Cafe Bazaar)</h3>
              <p className="text-[11px] text-slate-400">بزرگ‌ترین مارکت اندرویدی ایران با پشتیبانی از پرداخت شتاب</p>
            </button>

            <button
              onClick={() => setSelectedMarket("myket")}
              className={`p-4 rounded-3xl border transition text-right space-y-2 cursor-pointer ${
                selectedMarket === "myket"
                  ? "bg-gradient-to-br from-cyan-950 to-slate-900 border-cyan-500 shadow-xl"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <Smartphone className="w-6 h-6 text-cyan-400" />
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">مایکت IRAN</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-100">مایکت (Myket)</h3>
              <p className="text-[11px] text-slate-400">مارکت تخصصی اپلیکیشن و بازی با سیستم پوش نوتیفیکیشن مپلی</p>
            </button>

            <button
              onClick={() => setSelectedMarket("playstore")}
              className={`p-4 rounded-3xl border transition text-right space-y-2 cursor-pointer ${
                selectedMarket === "playstore"
                  ? "bg-gradient-to-br from-blue-950 to-slate-900 border-blue-500 shadow-xl"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <Globe className="w-6 h-6 text-blue-400" />
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono font-bold">GLOBAL ANDROID</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-100">گوگل‌پلی (Google Play)</h3>
              <p className="text-[11px] text-slate-400">انتشار جهانی با فرمت Android App Bundle (.aab)</p>
            </button>

            <button
              onClick={() => setSelectedMarket("appstore")}
              className={`p-4 rounded-3xl border transition text-right space-y-2 cursor-pointer ${
                selectedMarket === "appstore"
                  ? "bg-gradient-to-br from-purple-950 to-slate-900 border-purple-500 shadow-xl"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <Award className="w-6 h-6 text-purple-400" />
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">iOS GLOBAL</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-100">اپ‌استور اپل & PWA iOS</h3>
              <p className="text-[11px] text-slate-400">انتشار روی iPhone و امکان نصب مستقیم WebApp وب‌کلیپ</p>
            </button>
          </div>

          {/* Detailed Market Requirements Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-slate-100 text-sm">
                  چک‌لیست الزامات انتشار در مارکت {selectedMarket === "bazaar" ? "کافه‌بازار" : selectedMarket === "myket" ? "مایکت" : selectedMarket === "playstore" ? "گوگل‌پلی" : "اپ‌استور اپل"}
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                100% READY FOR SUBMISSION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>۱. شناسه یکتای بسته (Bundle Package ID):</span>
                </div>
                <p className="text-slate-300 font-mono bg-slate-900 p-2 rounded-xl text-left text-xs border border-slate-800">
                  com.mana.ecosystem.app
                </p>
                <p className="text-[11px] text-slate-400">این شناسه در پنل توسعه‌دهندگان کافه‌بازار و گوگل‌پلی ثبت می‌شود.</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>۲. آیکون و اسپلش اسکرین استاندارد:</span>
                </div>
                <p className="text-slate-300 font-mono bg-slate-900 p-2 rounded-xl text-left text-xs border border-slate-800">
                  512x512 PNG (Icon) & 1080x1920 (Splash)
                </p>
                <p className="text-[11px] text-slate-400">فایل‌های آیکون متناسب با استانداردهای گوگل و اپل طراحی گردیده‌اند.</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>۳. فرمت فایل خروجی قابل دانلود:</span>
                </div>
                <p className="text-slate-300 font-mono bg-slate-900 p-2 rounded-xl text-left text-xs border border-slate-800">
                  .APK (Android Release) / .AAB (Google Play) / Web App PWA
                </p>
                <p className="text-[11px] text-slate-400">فایل APK آماده آپلود مستقیم در کافه‌بازار و مایکت است.</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-4 h-4" />
                  <span>۴. لینک سیاست حریم خصوصی (Privacy Policy):</span>
                </div>
                <p className="text-slate-300 font-mono bg-slate-900 p-2 rounded-xl text-left text-xs border border-slate-800">
                  https://mana-app.ir/privacy-policy
                </p>
                <p className="text-[11px] text-slate-400">متن کامل و قانونی در تب بعدی قابل کپی و قرارگیری در وب‌سایت است.</p>
              </div>

            </div>

            {/* In-App Purchase Snippet for Bazaar */}
            {selectedMarket === "bazaar" && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>کد نمونه اتصال به درگاه پرداخت درون‌برنامه‌ای کافه‌بازار (Shetab Payment Gateway):</span>
                  </span>
                  <button
                    onClick={() => handleCopy(bazaarPaymentSnippet, "bazaarCode")}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    {copiedKey === "bazaarCode" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "bazaarCode" ? "کپی شد" : "کپی کد"}</span>
                  </button>
                </div>

                <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto text-left dir-ltr leading-relaxed">
                  {bazaarPaymentSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CAPACITOR CLI & BUILD COMMANDS */}
      {activeSubTab === "capacitor" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-extrabold text-slate-100 text-sm">
                  دستورات خروجی‌گیری نیتیو با Capacitor (تردید به APK / AAB)
                </h3>
                <p className="text-xs text-slate-400">
                  این دستورات را در ترمینال پروژه اجرا کنید تا فایل پروژه اندروید استودیو برای کافه‌بازار ساخت شود.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(capacitorCommands, "capCommands")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 shadow-lg shadow-indigo-950/50"
            >
              {copiedKey === "capCommands" ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === "capCommands" ? "دستورات کپی شد" : "کپی تمام دستورات"}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-5 rounded-3xl border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto text-left dir-ltr leading-relaxed">
            {capacitorCommands}
          </pre>

          <div className="bg-indigo-950/40 border border-indigo-800/50 p-4 rounded-2xl text-xs text-indigo-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>نکته مهم جهت آپلود در کافه‌بازار و مایکت:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-justify">
              پس از اجرای دستور <code className="bg-slate-950 px-2 py-0.5 rounded text-indigo-300 font-mono">npx cap open android</code>، نرم‌افزار Android Studio باز می‌شود. از منوی Build گزینه <code className="bg-slate-950 px-2 py-0.5 rounded text-indigo-300 font-mono">Generate Signed Bundle / APK</code> را انتخاب کرده و کلید امضای اختصاصی (Keystore) خود را بسازید. فایل .apk تولید شده بلافاصله قابل آپلود در پنل توسعه‌دهندگان بازار خواهد بود.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STORE LISTING COPY & METADATA */}
      {activeSubTab === "metadata" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h3 className="font-extrabold text-slate-100 text-sm">
                متون آماده ثبت اپلیکیشن در مارکت‌های ایرانی و بین‌المللی
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Title & Short Description */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">عنوان اپلیکیشن (App Title):</span>
                <button
                  onClick={() => handleCopy("مانا | اکوسیستم هوشمند هوش مصنوعی و آرامش روان", "titleCopy")}
                  className="text-slate-400 hover:text-slate-200 font-bold"
                >
                  {copiedKey === "titleCopy" ? "کپی شد" : "کپی"}
                </button>
              </div>
              <p className="text-slate-200 font-bold">مانا | اکوسیستم هوشمند هوش مصنوعی و آرامش روان</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">توضیح کوتاه (Short Description - 80 کاراکتر):</span>
                <button
                  onClick={() => handleCopy("پلتفرم جامع هوش مصنوعی احساس‌محور، مشاور روانشناسی و شبیه‌ساز ابرشهر خلیج فارس", "shortDescCopy")}
                  className="text-slate-400 hover:text-slate-200 font-bold"
                >
                  {copiedKey === "shortDescCopy" ? "کپی شد" : "کپی"}
                </button>
              </div>
              <p className="text-slate-200">پلتفرم جامع هوش مصنوعی احساس‌محور، مشاور روانشناسی و شبیه‌ساز ابرشهر خلیج فارس</p>
            </div>

            {/* Full Description */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">توضیحات کامل جهت آپلود در کافه‌بازار و مایکت (Full Description):</span>
                <button
                  onClick={() => handleCopy(`اپلیکیشن «مانا» نسل جدیدی از پلتفرم‌های هوش مصنوعی عاطفی و کاربردی است که با هدف ارتقای سلامت روان، همزیستی هوشمند و ارائه خدمات تخصصی روانشناسی طراحی گردیده است.

ویژگی‌های کلیدی اپلیکیشن مانا:
• دستیار هوشمند احساس‌محور بر پایه مدل ۳ بعدی عاطفی PAD
• مشاور تخصصی ترک اعتیاد و حمایت از خانواده با برنامه‌های گام‌به‌گام
• دفترچه خاطرات عاطفی خودکار و تحلیل هورمونی هوشمند
• شبیه‌ساز ۳ بعدی و تعاملی ابرشهر زیست‌محیطی خلیج فارس
• صندوقچه اسرار خانوادگی و مدیریت پیشرفته حریم خصوصی داده‌ها
• قابلیت کارکرد ۱۰۰٪ آفلاین و امنیت کامل اطلاعات شخصی`, "fullDescCopy")}
                  className="text-slate-400 hover:text-slate-200 font-bold"
                >
                  {copiedKey === "fullDescCopy" ? "کپی شد" : "کپی"}
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                {`اپلیکیشن «مانا» نسل جدیدی از پلتفرم‌های هوش مصنوعی عاطفی و کاربردی است که با هدف ارتقای سلامت روان، همزیستی هوشمند و ارائه خدمات تخصصی روانشناسی طراحی گردیده است.

ویژگی‌های کلیدی اپلیکیشن مانا:
• دستیار هوشمند احساس‌محور بر پایه مدل ۳ بعدی عاطفی PAD
• مشاور تخصصی ترک اعتیاد و حمایت از خانواده با برنامه‌های گام‌به‌گام
• دفترچه خاطرات عاطفی خودکار و تحلیل هورمونی هوشمند
• شبیه‌ساز ۳ بعدی و تعاملی ابرشهر زیست‌محیطی خلیج فارس
• صندوقچه اسرار خانوادگی و مدیریت پیشرفته حریم خصوصی داده‌ها
• قابلیت کارکرد ۱۰۰٪ آفلاین و امنیت کامل اطلاعات شخصی`}
              </p>
            </div>

            {/* Keywords */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">کلمات کلیدی جستجو (SEO Keywords):</span>
                <button
                  onClick={() => handleCopy("هوش مصنوعی, مشاوره روانشناسی, ترک اعتیاد, خلیج فارس, سلامت روان, چت هوشمند, دستیار عاطفی, کافه بازار", "kwCopy")}
                  className="text-slate-400 hover:text-slate-200 font-bold"
                >
                  {copiedKey === "kwCopy" ? "کپی شد" : "کپی"}
                </button>
              </div>
              <p className="text-slate-300 font-mono">
                هوش مصنوعی, مشاوره روانشناسی, ترک اعتیاد, خلیج فارس, سلامت روان, چت هوشمند, دستیار عاطفی, کافه بازار
              </p>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 4: PRIVACY POLICY */}
      {activeSubTab === "privacy" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="font-extrabold text-slate-100 text-sm">
                متن رسمی سیاست حفظ حریم خصوصی (Privacy Policy Document)
              </h3>
            </div>

            <button
              onClick={() => handleCopy(privacyPolicyFa, "privCopy")}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2"
            >
              {copiedKey === "privCopy" ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === "privCopy" ? "کپی شد" : "کپی متن کامل حریم خصوصی"}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line text-justify">
            {privacyPolicyFa}
          </div>
        </div>
      )}

    </div>
  );
};
