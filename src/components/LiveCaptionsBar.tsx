// src/components/LiveCaptionsBar.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, Activity, ShieldCheck, Heart } from "lucide-react";
import { AppLanguage, t } from "../translations";

interface LiveCaptionsBarProps {
  currentCaption: string;
  soundType?: "voice" | "solfeggio" | "pulse" | "ambient";
  soundFrequency?: number;
  appLanguage: AppLanguage;
  visualSoundFlasher?: boolean;
}

export const LiveCaptionsBar: React.FC<LiveCaptionsBarProps> = ({
  currentCaption,
  soundType = "voice",
  soundFrequency,
  appLanguage,
  visualSoundFlasher = true
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentCaption) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [currentCaption]);

  if (!visible || !currentCaption) return null;

  return (
    <>
      {/* Optional subtle screen flasher for deaf users */}
      {visualSoundFlasher && (
        <div className="fixed inset-0 pointer-events-none z-40 border-4 border-cyan-400/40 animate-pulse transition-opacity duration-300" />
      )}

      {/* Floating high-contrast caption bar */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-1/2 md:translate-x-1/2 md:max-w-2xl z-50 pointer-events-none"
        >
          <div className="bg-black/95 text-yellow-300 border-2 border-yellow-400/80 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 font-sans text-xs sm:text-sm font-extrabold tracking-wide">
            <div className="p-2 bg-yellow-400 text-black rounded-xl shrink-0 animate-bounce">
              <Volume2 className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-yellow-400/80 font-mono">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>زیرنویس زنده صوتی ناشنوایان (Live CC)</span>
                </span>
                {soundFrequency && <span>فرکانس: {soundFrequency}Hz</span>}
              </div>
              <p className="text-white leading-relaxed text-right dir-rtl">
                {currentCaption}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
