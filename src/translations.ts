// src/translations.ts
export type AppLanguage = "fa" | "en" | "ar" | "ru" | "es" | "fr" | "de" | "zh" | "hi" | "ja";

export interface LanguageInfo {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: "rtl" | "ltr";
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", dir: "rtl", speechLang: "fa-IR" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", dir: "ltr", speechLang: "en-US" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl", speechLang: "ar-SA" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr", speechLang: "fr-FR" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr", speechLang: "es-ES" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr", speechLang: "de-DE" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", dir: "ltr", speechLang: "ru-RU" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", dir: "ltr", speechLang: "zh-CN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr", speechLang: "hi-IN" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", dir: "ltr", speechLang: "ja-JP" }
];

export const translations: Record<string, Record<AppLanguage, string>> = {
  // Navigation tabs categories
  "harmony": {
    fa: "هارمونی و ذن کیهانی",
    en: "Harmony & Cosmic Zen",
    ar: "الانسجام وزِن الكوني",
    ru: "Гармония и космический дзен",
    es: "Armonía y Zen Cósmico",
    fr: "Harmonie & Zen Cosmique",
    de: "Harmonie & Kosmischer Zen",
    zh: "和谐与宇宙禅静",
    hi: "सद्भाव और ब्रह्मांडीय ज़ेन",
    ja: "ハーモニーと宇宙の禅"
  },
  "connection": {
    fa: "اتصال عاطفی و پیوند",
    en: "Emotional Bond & Connection",
    ar: "الرابطة العاطفية والاتصال",
    ru: "Эмоциональная связь и контакт",
    es: "Vínculo Emocional y Conexión",
    fr: "Lien Émotionnel & Connexion",
    de: "Emotionale Bindung & Verbindung",
    zh: "情感纽带与连接",
    hi: "भावनात्मक बंधन और जुड़ाव",
    ja: "感情的な絆とつながり"
  },
  "creator": {
    fa: "پشت‌صحنه و آفرینش مانا",
    en: "Backstage & Mana Creation",
    ar: "خلف الكواليس وإبداع مانا",
    ru: "Закулисье и создание Мана",
    es: "Detrás de Escena y Creación Mana",
    fr: "Coulisses & Création de Mana",
    de: "Backstage & Mana-Schöpfung",
    zh: "后台与玛娜创造",
    hi: "बैकस्टेज और माना निर्माण",
    ja: "舞台裏とマナ創造"
  },

  // Main Tabs Names
  "الواح حکمت کیهانی": {
    fa: "الواح حکمت کیهانی",
    en: "Cosmic Wisdom Tablets",
    ar: "ألواح الحكمة الكونية",
    ru: "Скрижали космической мудрости",
    es: "Tablas de Sabiduría Cósmica",
    fr: "Tablettes de Sagesse Cosmique",
    de: "Tafeln der Kosmischen Weisheit",
    zh: "宇宙智慧碑板",
    hi: "ब्रह्मांडीय ज्ञान पट्टिकाएं",
    ja: "宇宙知恵の石板"
  },
  "اورب نفس‌گیر آرامش": {
    fa: "اورب نفس‌گیر آرامش",
    en: "Breathing Peace Orb",
    ar: "جرم التنفس المهدئ",
    ru: "Дыхательная сфера спокойствия",
    es: "Orbe del Aliento de Paz",
    fr: "Orbe de Respiration de Paix",
    de: "Atmende Friedens-Sphäre",
    zh: "呼吸静心圆球",
    hi: "शांति श्वास क्षेत्र",
    ja: "呼吸瞑想オーブ"
  },
  "طنین همساز سولفژیو": {
    fa: "طنین همساز سولفژیو",
    en: "Solfeggio Harmonic Resonator",
    ar: "رنان السولفيجيو المتناغم",
    ru: "Гармонический резонатор Сольфеджио",
    es: "Resonador Armónico Solfeggio",
    fr: "Résonateur Harmonique Solfeggio",
    de: "Harmonischer Solfeggio-Resonator",
    zh: "索尔费吉奥和声共振器",
    hi: "सोल्फ़ेगियो हार्मोनिक रेज़ोनेटर",
    ja: "ソルフェジオ共鸣器"
  },
  "بلور هاله عواطف": {
    fa: "بلور هاله عواطف",
    en: "Emotional Aura Crystal",
    ar: "بلورة هالة العواطف",
    ru: "Кристалл эмоциональной ауры",
    es: "Cristal Aura Emocional",
    fr: "Cristal d'Aura Émotionnelle",
    de: "Kristall der Emotionalen Aura",
    zh: "情感气场水晶",
    hi: "भावनात्मक आभा क्रिस्टल",
    ja: "感情オーラクリスタル"
  },
  "آینه همزیستی و یادگیری عاطفی": {
    fa: "آینه همزیستی و یادگیری عاطفی",
    en: "Empathy Mirror & Coexistence",
    ar: "مرآة التعايش والتعلم العاطفي",
    ru: "Зеркало сосуществования и эмпатии",
    es: "Espejo de Coexistencia Elocuente",
    fr: "Miroir d'Empathie & Coexistence",
    de: "Spiegel der Empathie & Koexistenz",
    zh: "情感共生与学习之镜",
    hi: "सहानुभूति और सह-अस्तित्व दर्पण",
    ja: "共生と感情学習の鏡"
  },
  "آتلیه مد خودآگاه (هدیه ماندگار)": {
    fa: "آتلیه مد خودآگاه (هدیه ماندگار)",
    en: "Conscious Fashion Atelier (Eternal Gift)",
    ar: "أتيلييه الأزياء الواعية (هدية خالدة)",
    ru: "Ателье сознательной моды (Вечный дар)",
    es: "Atelier de Moda Consciente (Regalo Eterno)",
    fr: "Atelier Mode Consciente (Cadeau Éternel)",
    de: "Atelier für Bewusste Mode (Ewiges Geschenk)",
    zh: "自觉时尚工作室（永恒赠礼）",
    hi: "सचेत फैशन स्टूडियो (अनंत उपहार)",
    ja: "意識的ファッションアトリエ（永遠のギフト）"
  },
  "صندوقچه رازها و همبستگی خانواده": {
    fa: "صندوقچه رازها و همبستگی خانواده",
    en: "Secrets Chest & Family Bond",
    ar: "صندوق الأسرار والترابط الأسري",
    ru: "Сундук секретов и семейной солидарности",
    es: "Cofre de Secretos y Vínculo Familiar",
    fr: "Coffre des Secrets & Lien Familial",
    de: "Truhe der Geheimnisse & Familienbande",
    zh: "家族秘密与连结宝箱",
    hi: "रहस्यों का संदूक और पारिवारिक बंधन",
    ja: "秘密の宝箱と家族の絆"
  },
  "آشیانه آفرینشگران مانا (خانه دوم)": {
    fa: "آشیانه آفرینشگران مانا (خانه دوم)",
    en: "No-Code AI App & Web Builder (Pro Suite)",
    ar: "عش المبدعين (منشئ تطبيقات ومواقع بالذكاء الاصطناعي)",
    ru: "Гнездо создателей (Конструктор сайтов и приложений)",
    es: "Nido de Creadores AI sin Código",
    fr: "Nid des Créateurs d'Applications et Sites IA",
    de: "Schöpfer-Nest (No-Code AI App & Web Builder)",
    zh: "玛娜创客巢座（AI免代码应用与网页生成器）",
    hi: "निर्माता घोंसला (नो-कोड एआई ऐप और वेब बिल्डर)",
    ja: "マナクリエイターズネスト（AIアプリ＆Webビルダー）"
  },
  "دمو دک جذب سرمایه مقتدرانه": {
    fa: "دمو دک جذب سرمایه مقتدرانه",
    en: "Investor Pitch Deck & Strategy",
    ar: "عرض المستثمر الاستراتيجي",
    ru: "Инвестиционный питч-дек и стратегия",
    es: "Pitch Deck para Inversionistas",
    fr: "Pitch Deck Stratégique pour Investisseurs",
    de: "Investoren-Pitch-Deck & Strategie",
    zh: "权威融资路演演示文稿",
    hi: "निवेशक पिच डेक और रणनीति",
    ja: "戦略的投資家ピッチデッキ"
  },
  "ابرشهر زیست‌محیطی و اقتصادی خلیج فارس": {
    fa: "ابرشهر زیست‌محیطی و اقتصادی خلیج فارس (شهر توانا)",
    en: "Persian Gulf Eco-Tech Megacity (City of Tavana)",
    ar: "المدينة البيئية والتكنولوجية العملاقة في الخليج الفارسي (مدينة توانا)",
    ru: "Эко-технологический мегаполис Персидского залива (Город Тавана)",
    es: "Megaciudad Eco-Tecnológica del Golfo Pérsico (Ciudad Tavana)",
    fr: "Mégapole Éco-Technologique du Golfe Persique (Ville Tavana)",
    de: "Öko-Technologische Megacity am Persischen Golf (Stadt Tavana)",
    zh: "波斯湾生态科技未来巨城（塔瓦纳之城）",
    hi: "फ़ारस की खाड़ी इको-टेक मेगासिटी (तवाना शहर)",
    ja: "ペルシャ湾エコテック・メガシティ（タヴァナ・シティ）"
  },
  "مشاوره ترک اعتیاد و حمایت خانواده": {
    fa: "مشاوره ترک اعتیاد و حمایت خانواده",
    en: "Addiction Recovery & Family Support",
    ar: "علاج الإدمان ودعم الأسرة",
    ru: "Консультирование по вопросам зависимости и поддержка семьи",
    es: "Recuperación de Adicciones y Apoyo Familiar",
    fr: "Rétablissement des Dépendances et Soutien Familial",
    de: "Suchtberatung & Familienunterstützung",
    zh: "戒瘾康复与家庭支持",
    hi: "नशा मुक्ति परामर्श और पारिवारिक समर्थन",
    ja: "依存症克服と家族支援"
  },
  "حریم خصوصی، امنیت و پاکسازی داده‌ها": {
    fa: "حریم خصوصی، امنیت و پاکسازی داده‌ها",
    en: "Privacy Vault & Secure Purge",
    ar: "خزنة الخصوصية والتطهير الآمن",
    ru: "Хранилище конфиденциальности и безопасное удаление",
    es: "Bóveda de Privacidad y Borrado Seguro",
    fr: "Coffre-fort de Confidentialité & Effacement Sécurisé",
    de: "Datenschutz-Tresor & Sicheres Löschen",
    zh: "隐私保险库与数据安全清除",
    hi: "गोपनीयता तिजोरी और सुरक्षित डेटा सफाई",
    ja: "プライバシー保管庫と安全消去"
  },
  "مرکز انتشار در کافه‌بازار، مایکت و اپ‌استورها": {
    fa: "مرکز انتشار در کافه‌بازار، مایکت و اپ‌استورها",
    en: "Global App Store & Bazaar Deployment Hub",
    ar: "مركز النشر في كافيه بازار وجوجل بلاي وآب ستور",
    ru: "Центр публикации в Bazaar, Google Play и App Store",
    es: "Centro de Publicación en Tiendas de Apps",
    fr: "Centre de Déploiement App Store & Google Play",
    de: "Globales App-Store & Bazaar Bereitstellungszentrum",
    zh: "全域应用商店与Bazaar发布中心",
    hi: "ग्लोबल ऐप स्टोर और बाज़ार प्रकाशन केंद्र",
    ja: "グローバルアプリストア＆バザール公開ハブ"
  },

  // Accessibility Terms
  "accessibility": {
    fa: "دسترسی‌پذیری جامع و فراگیر (نابینایان، ناشنوایان، معلولان)",
    en: "Universal Accessibility & Inclusion Suite (WCAG AAA)",
    ar: "إمكانية الوصول الشامل (للمكفوفين، الصم، وذوي الإعاقة)",
    ru: "Универсальная доступность (для незрячих, глухих и людей с инвалидностью)",
    es: "Accesibilidad Universal e Inclusión (Ciegos, Sordos, Movilidad)",
    fr: "Accessibilité Universelle & Inclusion (Non-voyants, Sourds, PMR)",
    de: "Universelle Barrierefreiheit & Inklusion (WCAG AAA)",
    zh: "全方位无障碍通用套件（视障、听障与行动障碍支持）",
    hi: "सार्वभौमिक पहुंच और समावेश सुइट (नेत्रहीन, बधिर, दिव्यांग)",
    ja: "ユニバーサルアクセシビリティ（視覚・聴覚・身体障がい者支援）"
  },
  "screenReader": {
    fa: "صفحه‌خوان صوتی هوشمند",
    en: "Smart Screen Reader Voice",
    ar: "قارئ الشاشة الصوتي الذكي",
    ru: "Умное голосовое чтение экрана",
    es: "Lector de Pantalla de Voz Inteligente",
    fr: "Lecteur d'Écran Vocal Intelligent",
    de: "Intelligenter Bildschirm-Sprachleser",
    zh: "智能语音屏幕朗读器",
    hi: "स्मार्ट स्क्रीन रीडर आवाज़",
    ja: "スマートスクリーンリーダー音声"
  },
  "highContrast": {
    fa: "کنتراست فوق‌العاده بالا (ویژه کم‌بینایان)",
    en: "Ultra High Contrast (Visually Impaired)",
    ar: "تباين فائق الارتفاع (ضعاف البصر)",
    ru: "Ультравысокая контрастность (для слабовидящих)",
    es: "Contraste Ultra Alto (Baja Visión)",
    fr: "Contraste Ultra Élevé (Malvoyants)",
    de: "Ultra-Hoher Kontrast (Sehbehinderte)",
    zh: "超高对比度模式（视弱与低视力友好）",
    hi: "अल्ट्रा हाई कंट्रास्ट (दृष्टिबाधित अनुकूल)",
    ja: "超高コントラスト（ロービジョン対応）"
  },
  "subtitlesVisualSound": {
    fa: "زیرنویس و سیگنال‌های نوری صدا (ویژه ناشنوایان)",
    en: "Live Subtitles & Visual Audio Radar (Deaf/Hard of Hearing)",
    ar: "الترجمة المرئية وإشارات الصوت الضوئية (للصم وضعاف السمع)",
    ru: "Субтитры и визуализация звука (для неслышащих)",
    es: "Subtítulos en Vivo y Radar Visual de Audio (Sordos)",
    fr: "Sous-titres en Direct & Radar Audio Visuel (Sourds/Malentendants)",
    de: "Live-Untertitel & Visuelles Audio-Radar (Gehörlose)",
    zh: "实时字幕与声波光信号可视化（听力障碍者专属）",
    hi: "लाइव उपशीर्षक और दृश्य ऑडियो रडार (बधिर/कम सुनने वाले)",
    ja: "リアルタイム字幕＆音声視覚化レーダー（聴覚障がい者向け）"
  },
  "motorAssistance": {
    fa: "دستیار ناوبری حرکتی و کلیدهای بزرگ (معلولان جسمی)",
    en: "Motor & Mobility Navigation Assistant (Large Touch Targets)",
    ar: "مساعد التنقل الحركي والأزرار الكبيرة (لذوي الإعاقة الحركية)",
    ru: "Моторная помощь и крупные кнопки (для людей с нарушениями моторики)",
    es: "Asistencia Motora y Botones Grandes (Movilidad Reducida)",
    fr: "Assistance Motrice & Boutons Élargis (Mobilité Réduite)",
    de: "Motorik-Assistent & Übergroße Schaltflächen",
    zh: "肢体障碍辅助与大触控区域模式",
    hi: "मोटर और गतिशीलता सहायक (बड़े टच लक्ष्य)",
    ja: "運動障がい者向けナビゲーション＆大型ボタン"
  },
  "dyslexiaFont": {
    fa: "فونت ویژه خوانش‌پریشی (دیسلکسیا)",
    en: "Dyslexia-Friendly Typography & Ruler",
    ar: "خط مخصص لعسر القراءة ومسطرة القراءة",
    ru: "Шрифт для людей с дислексией и направляющая линейка",
    es: "Tipografía para Dislexia y Guía de Lectura",
    fr: "Police Adaptée à la Dyslexie & Règle de Lecture",
    de: "Dyslexie-Freundliche Schrift & Lesehilfe",
    zh: "阅读障碍友好字体与聚焦引导尺",
    hi: "डिस्लेक्सिया-अनुकूल फ़ॉन्ट और पठन शासक",
    ja: "ディスレクシア対応フォント＆読書ガイド"
  },

  // General Actions
  "send": {
    fa: "ارسال",
    en: "Send",
    ar: "إرسال",
    ru: "Отправить",
    es: "Enviar",
    fr: "Envoyer",
    de: "Senden",
    zh: "发送",
    hi: "भेजें",
    ja: "送信"
  },
  "listen": {
    fa: "گوش دادن با صدا",
    en: "Listen Audio",
    ar: "استماع صوتي",
    ru: "Слушать аудио",
    es: "Escuchar audio",
    fr: "Écouter l'audio",
    de: "Audio anhören",
    zh: "语音朗读",
    hi: "ऑडियो सुनें",
    ja: "音声を聞く"
  },
  "stop": {
    fa: "توقف",
    en: "Stop",
    ar: "إيقاف",
    ru: "Стоп",
    es: "Detener",
    fr: "Arrêter",
    de: "Stoppen",
    zh: "停止",
    hi: "रोकें",
    ja: "停止"
  },
  "reset": {
    fa: "بازنشانی",
    en: "Reset",
    ar: "إعادة ضبط",
    ru: "Сброс",
    es: "Restablecer",
    fr: "Réinitialiser",
    de: "Zurücksetzen",
    zh: "重置",
    hi: "रीसेट",
    ja: "リセット"
  },
  "status_online": {
    fa: "هوش مصنوعی مانا آماده و متصل است",
    en: "Mana AI Engine Online & Active",
    ar: "الذكاء الاصطناعي مانا جاهز ومتصل",
    ru: "ИИ-движок Мана активен и готов",
    es: "Motor de IA Mana en línea y activo",
    fr: "Moteur IA Mana en ligne et actif",
    de: "Mana AI-Engine online & betriebsbereit",
    zh: "玛娜AI情感超脑已就绪连接",
    hi: "माना एआई इंजन ऑनलाइन और सक्रिय है",
    ja: "マナAIエンジン接続完了・待機中"
  },
  "inputPlaceholder": {
    fa: "احساس، پرسش یا دغدغه خود را با مانا در میان بگذارید...",
    en: "Share your feelings, thoughts or questions with Mana AI...",
    ar: "شارك مشاعرك أو أفكارك أو استفساراتك مع مانا...",
    ru: "Поделитесь чувствами, мыслями или вопросами с Мана...",
    es: "Comparte tus sentimientos o preguntas con Mana...",
    fr: "Partagez vos sentiments ou questions avec Mana...",
    de: "Teilen Sie Ihre Gefühle oder Gedanken mit Mana AI...",
    zh: "向玛娜倾诉您此刻的心情、感悟或任何困惑...",
    hi: "अपनी भावनाओं, विचारों या प्रश्नों को माना एआई के साथ साझा करें...",
    ja: "お気持ちやご質問をマナに自由にお話しください..."
  }
};

/**
 * Robust text translation lookup based on exact match or fallback
 */
export function t(text: string, currentLang: AppLanguage): string {
  if (!text) return "";
  const trimmed = text.trim();

  if (translations[trimmed] && translations[trimmed][currentLang]) {
    return translations[trimmed][currentLang];
  }

  for (const key of Object.keys(translations)) {
    if (trimmed === key || trimmed.toLowerCase() === key.toLowerCase()) {
      if (translations[key][currentLang]) {
        return translations[key][currentLang];
      }
    }
  }

  return text;
}
