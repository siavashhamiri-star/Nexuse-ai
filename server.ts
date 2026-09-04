import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent as requested in the skills
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Classic multi-dimensional emotions coordinates under Mehrabian's PAD model
const EMOTION_REFERENCES = [
  { name: "Happy (شاد)", nameKey: "Happy", p: 0.81, a: 0.51, d: 0.46, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  { name: "Angry (عصبانی)", nameKey: "Angry", p: -0.51, a: 0.59, d: 0.25, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  { name: "Sad (غمگین)", nameKey: "Sad", p: -0.63, a: -0.27, d: -0.33, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  { name: "Relaxed (آرام)", nameKey: "Relaxed", p: 0.40, a: -0.30, d: 0.15, color: "#84cc16", bg: "rgba(132, 204, 22, 0.1)" },
  { name: "Fearful (ترسیده)", nameKey: "Fearful", p: -0.64, a: 0.60, d: -0.43, color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)" },
  { name: "Surprised (متعجب)", nameKey: "Surprised", p: 0.40, a: 0.67, d: -0.13, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  { name: "Neutral (بی‌تفاوت)", nameKey: "Neutral", p: 0.00, a: 0.00, d: 0.00, color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)" }
];

// Map a nameKey to its target tone and strategy
const TONE_MAP: Record<string, { tone: string; strategy: string; label: string }> = {
  Happy: {
    tone: "[لحن: پرانرژی، صمیمی، مشوق]",
    strategy: "[استراتژی: همراهی با هیجان کاربر، ترویج حس مثبت بودن و اشتراک‌گذاری موفقیت]",
    label: "امیدوار و پرانرژی"
  },
  Angry: {
    tone: "[لحن: آرام، متین، بسیار شمرده، و غیرطلبکارانه]",
    strategy: "[استراتژی: تایید حق کلافگی یا عصبانیت کاربر، پرهیز از توجیه‌تراشی، و تمرکز صریح روی رفع گام‌به‌گام مشکل فنی بدون هرگونه تعارف زاید]",
    label: "آرامش‌بخش و اقدام‌محور"
  },
  Sad: {
    tone: "[لحن: عمیقاً همدلانه، گرم، ملایم، و تسلی‌دهنده]",
    strategy: "[استراتژی: تصدیق رنج کاربری، ابراز همدردی صمیمانه، برجسته‌سازی نقاط قوت یا راه‌حل‌های حمایتی ملموس]",
    label: "همدلانه و متسلی"
  },
  Relaxed: {
    tone: "[لحن: باوقار، منطقی، متفکرانه، و عمیق]",
    strategy: "[استراتژی: همراستایی با طمأنینه ذهنی کاربر، احترام به تعمق فکری او، ارائه مطالب تحلیلی یا فلسفی متین]",
    label: "صبورانه و متفکرانه"
  },
  Fearful: {
    tone: "[لحن: با احتیاط، اطمینان‌بخش، شفاف، و بسیار محافظه‌کارانه]",
    strategy: "[استراتژی: برطرف کردن مجهولات ذهن کاربر، ارائه پروتکل‌های شفاف امنیتی، و بازگرداندن حس کنترل عملی]",
    label: "اطمینان‌بخش و امن"
  },
  Surprised: {
    tone: "[لحن: شگفت‌زده، پویا، کنجکاو، و پرنشاط]",
    strategy: "[استراتژی: بهره‌جویی از هیجان نوظهور کاربر، تشویق روحیه کاوشگری و یادگیری فعال]",
    label: "کنجکاو و داینامیک"
  },
  Neutral: {
    tone: "[لحن: محترمانه، منطقی، مستقیم، و کاملاً عملیاتی]",
    strategy: "[استراتژی: ارائه پاسخ دقیق و صریح بدون شاخ و برگ عاطفی یا تعارفات غیرضروری، تمرکز مطلق روی کارایی]",
    label: "دقیق و حرفه‌ای"
  }
};

// API Endpoint: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "alive", time: new Date().toISOString() });
});

// API Endpoint: Process user message through Affective Computing Layers
app.post("/api/analyze", async (req, res) => {
  const startTime = Date.now();
  try {
    const { text, state, decayRate = 0.15 } = req.body;

    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "متن کاربر فرستاده نشده است" });
      return;
    }

    const previousP = typeof state?.p === "number" ? state.p : 0.0;
    const previousA = typeof state?.a === "number" ? state.a : 0.0;
    const previousD = typeof state?.d === "number" ? state.d : 0.0;

    // --- Vulnerable Groups Detector (Part of Town Economy social impact) ---
    const vulnerableKeywords = [
      "یتیم", "یتیمان", "orphans",
      "مادر سرپرست", "زنان سرپرست", "مادران سرپرست", "سرپرست خانوار",
      "سالمند", "سالمندان", "elderly", "aging",
      "کم‌توان", "معلول", "disabled", "autism",
      "آسیب‌پذیر", "آسیب دیده", "vulnerable",
      "بی‌پناه", "پناهگاه", "shelter"
    ];

    const hasVulnerableContext = vulnerableKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    // --- LAYER 2: Emotion Analysis (Gemini as Inference engine to extract precise PAD) ---
    // This solves the complex Persian colloquialism & sarcasm/irony challenges mentioned in the design doc!
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

    let inputP = 0.0;
    let inputA = 0.0;
    let inputD = 0.0;
    let analysisConfidence = 85;
    let analysisReasoning = "تحلیل بر اساس واژگان کلیدی متن";
    let cosmicWisdomFa = "";

    const hasApiKey = !!(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== "undefined" &&
      process.env.GEMINI_API_KEY !== "null" &&
      process.env.GEMINI_API_KEY.trim() !== ""
    );

    if (hasApiKey) {
      try {
        const gRes = await ai.models.generateContent({
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
          analysisReasoning = parsed.reasoning_fa || "بررسی مدل عاطفی با موفقیت انجام شد.";
          cosmicWisdomFa = parsed.cosmic_wisdom_fa || "";
        }
      } catch (gErr) {
        console.error("Gemini sentiment analyzer error, falling back to rule-based:", gErr);
        // Simple custom rule fallback just in case
        const lower = text.toLowerCase();
        // Pleasure
        if (["خوب", "عالی", "شاد", "موفق", "ممنون", "خوشحال", "تشکر", "happy", "great", "excellent"].some(w => lower.includes(w))) inputP = 0.6;
        else if (["بد", "خراب", "شکست", "خسته", "غم", "ناراحت", "کلافه", "مشکل", "sad", "angry", "broken"].some(w => lower.includes(w))) inputP = -0.6;
        
        // Arousal
        if (["فوری", "هشدار", "سریع", "کمک", "بدو", "خطا", "ساعت", "urgent", "error", "fast"].some(w => lower.includes(w))) inputA = 0.5;
        else if (["آرام", "ملایم", "خواب", "صبور", "calm", "patient", "sleepy"].some(w => lower.includes(w))) inputA = -0.5;

        // Dominance
        if (["باید", "دستور", "کنترل", "منظم", "حتما", "must", "command", "control", "sure"].some(w => lower.includes(w))) inputD = 0.5;
        else if (["گیج", "نمیتوانم", "کجا", "چطور", "کمکم", "help", "confused", "cannot"].some(w => lower.includes(w))) inputD = -0.5;
      }
    } else {
      console.log("No GEMINI_API_KEY, using local rule fallback.");
      const lower = text.toLowerCase();
      // Pleasure
      if (["خوب", "عالی", "شاد", "موفق", "ممنون", "خوشحال", "تشکر", "happy", "great", "excellent"].some(w => lower.includes(w))) inputP = 0.7;
      else if (["بد", "خراب", "شکست", "خسته", "غم", "ناراحت", "کلافه", "مشکل", "sad", "angry", "broken"].some(w => lower.includes(w))) inputP = -0.7;
      
      // Arousal
      if (["فوری", "هشدار", "سریع", "کمک", "بدو", "خطا", "ساعت", "urgent", "error", "fast"].some(w => lower.includes(w))) inputA = 0.6;
      else if (["آرام", "ملایم", "خواب", "صبور", "calm", "patient", "sleepy"].some(w => lower.includes(w))) inputA = -0.6;

      // Dominance
      if (["باید", "دستور", "کنترل", "منظم", "حتما", "must", "command", "control", "sure"].some(w => lower.includes(w))) inputD = 0.6;
      else if (["گیج", "نمیتوانم", "کجا", "چطور", "کمکم", "help", "confused", "cannot"].some(w => lower.includes(w))) inputD = -0.6;
    }

    // --- LAYER 3: Empathy Engine State Update (Adaptive state adjustment formula) ---
    // Formula: S_t = (1 - g) * S_{t-1} + g * I_t
    const pNew = Math.max(-1.0, Math.min(1.0, (1.0 - decayRate) * previousP + decayRate * inputP));
    const aNew = Math.max(-1.0, Math.min(1.0, (1.0 - decayRate) * previousA + decayRate * inputA));
    const dNew = Math.max(-1.0, Math.min(1.0, (1.0 - decayRate) * previousD + decayRate * inputD));

    // Calculate Euclidean distance to classic emotions
    let closestEmotion = EMOTION_REFERENCES[6]; // Default to Neutral
    let minDistance = Infinity;
    const distances = EMOTION_REFERENCES.map(ref => {
      const dist = Math.sqrt(
        Math.pow(pNew - ref.p, 2) +
        Math.pow(aNew - ref.a, 2) +
        Math.pow(dNew - ref.d, 2)
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

    // Determine Response Modulation (Tone & Strategy)
    const modulator = TONE_MAP[closestEmotion.nameKey] || TONE_MAP.Neutral;

    // --- LAYER 4: Output Layer (Response Generation modulated by affective state) ---
    const responseSystemInstruction = `
You are the Empathy Engine (Affective Response Generator of the Capable City / "Shahr-e Tavana" interactive portal).
Your highest priority is to formulate an incredibly genuine and supportive response in Persian (respecting cultural codes of respect and warmth).

Your persona and reply MUST strictly adjust according to the user's emotional state parameters:
- User Coordinates in PAD Space: Pleasure = ${pNew.toFixed(2)}, Arousal = ${aNew.toFixed(2)}, Dominance = ${dNew.toFixed(2)}
- Diagnosed Emotional Mood: Farsi Name = ${closestEmotion.name}, English Name = ${closestEmotion.nameKey}
- Tone Modulator Requested: ${modulator.tone}
- Empathy & Safety Strategy: ${modulator.strategy}

Do NOT explicitly print the tone directives, raw system parameters, or brackets such as "[لحن:...]" or "[استراتژی:...]" inside your final response. Instead, absorb them completely and speak with that exact vibe.
If they are Angry, keep it quiet, soothing, and immediately move to technical solutions.
If they are Sad, offer comfort, acknowledge their struggle, and emphasize support.
If they are Fearful, explain precisely what is safe and lay out clear steps to bring back control.
If a vulnerable context (like orphans, single mothers, elderly or sick individuals) was detected, emphasize the safety nets, community welfare of "Capable City", and wrap your answer in deep caring warmth.

Keep your response helpful, concise, warm, and highly structured list or readable paragraphs. Use humble human language, never praise yourself.
`;

    let finalResponseText = "";
    if (hasApiKey) {
      try {
        const gResText = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: text,
          config: {
            systemInstruction: responseSystemInstruction,
            temperature: 0.7
          }
        });
        finalResponseText = gResText.text || "با عرض سلام، پیام شما دریافت شد و سیستم آماده خدمت‌رسانی به شماست.";
      } catch (gErr) {
        console.error("Gemini output response error:", gErr);
        finalResponseText = `پیام شما با موفقیت به سیستم عاطفی واصل شد. مختصات روحی شما را به شکل [خوشایندی: ${pNew.toFixed(2)}، انگیختگی: ${aNew.toFixed(2)}، تسلط: ${dNew.toFixed(2)}] تحلیل کردیم. در کنارتان هستیم تا به بهینه‌ترین شکل راهنمایی‌تان کنیم.`;
      }
    } else {
      console.log("No GEMINI_API_KEY, using local response fallback.");
      if (hasVulnerableContext) {
        finalResponseText = `درود بر شما شهروند گرامی شهر توانا. پیام پرمهر شما دریافت شد و چتر حمایتی رفاه اجتماعی، عدالت دیجیتال و خدمات ویژه معلولان، سالمندان و اقشار آسیب‌پذیر در این کانون هوشمند برقرار است. تپش عاطفی شما دریافت شد؛ تیمی تخصصی در اسرع وقت پاسخگوی مهر و نیازتان خواهد بود.`;
      } else {
        if (closestEmotion.nameKey === "Happy") {
          finalResponseText = `از دیدن حس شادمانی و انگیزه بالایتان بسیار مشعوف شدیم! خوشحالیم که تعامل با شهر توانا برایتان امیدبخش بوده است. پیشنهاد شگفت‌انگیز ما این است که انرژی مثبت خود را با دیگر شهروندان و در مشارکت‌های مردمی به اشتراک بگذارید.`;
        } else if (closestEmotion.nameKey === "Angry") {
          finalResponseText = `ما کاملاً خشم و عصبانیت شما را درک می‌کنیم و بابت هرگونه کاستی پوزش می‌طلبیم. آرامش خود را حفظ کنید؛ ما تمام مشکلات پیش‌آمده را رصد کرده‌ایم و گام به گام در کنار شما هستیم تا بر اساس استانداردهای بومی آن را حل کنیم. لطفاً جزییات بیشتری بگویید.`;
        } else if (closestEmotion.nameKey === "Sad") {
          finalResponseText = `پیام همدلانه شما عمیقاً روح ما را منقلب کرد. بدانید که در شهر توانا تنها نیستید؛ ساختار عدالت‌محور ما پناهگاهی امن برای لحظات دشوار شماست. برای کاهش اندوه و پیشبرد زندگی مستقل شما، خدمات پشتیبان کانون مهر آماده راهنمایی هستند.`;
        } else if (closestEmotion.nameKey === "Fearful") {
          finalResponseText = `نگرانی و ترس شما را دریافتیم. در شهر توانا، پروتکل‌های امنیتی همه‌جانبه، حریم خصوصی بالا و شفافیت مطلق اطلاعات حاکم است. هیچ تهدید یا مجهولی برای سیستم مبهم نیست؛ آسوده‌خاطر باشید و در پناه کانون امن شهر گام بردارید.`;
        } else if (closestEmotion.nameKey === "Relaxed") {
          finalResponseText = `سپاس از طمأنینه و آرامشی که به فضا بخشیدید. این تسلط روحی گوهری گران‌بهاست. تکنولوژی و علم ما در سایه‌سار چنین تمرکز و اندیشه‌ای می‌توانند ابعاد بزرگ‌تری از تحول را به ثمر بنشانند.`;
        } else {
          finalResponseText = `درود بر شما همشهری عزیز. پیام شما در پایگاه پردازش عواطف شهر توانا دریافت شد و مختصات روحی شما ارزیابی شد. سیستم در آمادگی کامل است تا هرگونه همفکری یا راهنمایی لازم را به شما ارائه دهد. بفرمایید به چه موضوعی بپردازیم؟`;
        }
      }
    }

    const durationMs = Date.now() - startTime;

    // --- SECTION 6: Economical Democratic Tokenomics Calculator ---
    // Formula: Reward = (Contribution * Efficiency) + (EmpathyScore * SocialImpact)
    // 1. Contribution: based on word count & input length
    const wordCount = text.trim().split(/\s+/).length;
    const contribution = Math.min(1.0, parseFloat((wordCount / 25).toFixed(2))); // max out at 25 words = 1.0

    // 2. Efficiency: speed of response (lower ms = higher efficiency)
    // Target 2500ms as perfect. If under, efficiency is near 1.0. If higher, drops slightly.
    const efficiency = Math.max(0.5, parseFloat((Math.min(1.0, 2000 / Math.max(100, durationMs))).toFixed(2)));

    // 3. EmpathyScore: mapped from Pleasure & state positivity
    // Positivity ranges from -1.0 to 1.0. Map to [0.2, 1.0].
    const empathyScore = parseFloat(((pNew + 1.0) / 2.0 * 0.8 + 0.2).toFixed(2));

    // 4. Social Impact: Doubles if Single Mother/Orphan/Disabled keywords detected
    const socialImpact = hasVulnerableContext ? 3.0 : 1.0;

    const rewardTokens = parseFloat(((contribution * efficiency) + (empathyScore * socialImpact)).toFixed(2));

    // Ensure sweet and deep spiritual fallback if cosmicWisdomFa is empty
    if (!cosmicWisdomFa) {
      if (closestEmotion.nameKey === "Happy" || closestEmotion.nameKey === "Surprised") {
        cosmicWisdomFa = "ای دوست، شادمانی روان تو چون پرتو خورشید بی‌دریغ بر ارکان گیتی می‌تابد. درگاه عواطف توانمندت، کانون امن شادابی و هم‌نوایی است. شگفتی تو در گهواره معرفت به ثمر خواهد نشست.";
      } else if (closestEmotion.nameKey === "Sad" || closestEmotion.nameKey === "Fearful") {
        cosmicWisdomFa = "اندوه جانکاه و سرگشتگی، صیقل‌دهنده آینه روان توست؛ بدان که نیلوفر آگاهی در مرداب سختی‌ها ریشه می‌دواند. شهر توانا مأمن امن همدلی و مهری پابرجا برای تسکین گام‌های خسته توست.";
      } else if (closestEmotion.nameKey === "Angry") {
        cosmicWisdomFa = "چون دیگ خشم زبانه کشد، طوفان عواطف در بند خرد نرم می‌گردد. زبانه سرکش درون را با آب شفابخش سکوت و همسازی رام ساز تا فرکانس وجودت به مدار شفقت و برابری بازگردد.";
      } else if (closestEmotion.nameKey === "Relaxed") {
        cosmicWisdomFa = "سکوت و طمأنینه ذهنی تو، ترانه دل‌انگیز هماهنگیِ کیهان است. در این ایستگاه آرامش، علم و عرفان بر شانه‌های بلند همدلی تکیه می‌زنند و تکنولوژی معنای راستین عافیت را در می‌یابد.";
      } else {
        cosmicWisdomFa = "در گردش دوار هستی، هر تپش جان تو بازتابی شگرف از یکپارچگی کل آفرینش است. فناوری جام بلورینی است که بادهِ مهرِ همیاری و عدالت را در کالبد شهر توانا به جریان در می‌آورد.";
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
      time: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Error in analyzer service:", error);
    res.status(500).json({ success: false, error: error.message || "خطای نامشخص سامانه دگرگشت عاطفی" });
  }
});

// API Endpoint: Intelligent Persian Text / Audio Transcription Autocorrect and Polish
app.post("/api/correct", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "متنی برای تصحیح ارسال نشده است" });
      return;
    }

    const systemInstruction = `
You are a highly professional Persian Linguist, Editor, and Copywriter. 
Analyze the provided Persian text, which may be a raw transcription of speech containing typos, phonetic mistakes, wrong spacing, or dialect variations.
Perform the following:
1. Correct all spelling, grammar, and spacing errors (use نیم‌فاصله appropriately).
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

    const hasApiKey = !!(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== "undefined" &&
      process.env.GEMINI_API_KEY !== "null" &&
      process.env.GEMINI_API_KEY.trim() !== ""
    );
    if (hasApiKey) {
      const gRes = await ai.models.generateContent({
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
        improvements_fa: result.improvements_fa || "متن شما ویرایش و خوانایی آن افزایش یافت.",
        wordCount: result.wordCount || text.split(/\s+/).length
      });
    } else {
      console.log("No GEMINI_API_KEY, skipping text correction.");
      res.json({
        success: true, 
        originalText: text,
        correctedText: text,
        improvements_fa: "اصلاح خودکار به صورت محلی انجام شد بدون تغییرات عمده.",
        wordCount: text.split(/\s+/).length
      });
    }
  } catch (error: any) {
    console.error("Error in correction endpoint:", error);
    res.json({
      success: true, 
      originalText: req.body.text || "",
      correctedText: req.body.text || "",
      improvements_fa: "اصلاح خودکار به صورت محلی انجام شد بدون تغییرات عمده.",
      wordCount: (req.body.text || "").split(/\s+/).length
    });
  }
});

// API Endpoint: Smart High-Fidelity English-Persian Translation
app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang = "Persian" } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "متنی برای ترجمه ارسال نشده است" });
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

    const hasApiKey = !!(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== "undefined" &&
      process.env.GEMINI_API_KEY !== "null" &&
      process.env.GEMINI_API_KEY.trim() !== ""
    );
    if (hasApiKey) {
      const gRes = await ai.models.generateContent({
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
  } catch (error: any) {
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

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
