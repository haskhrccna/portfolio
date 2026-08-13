import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "ha-splash-seen";

export const SplashAnimation = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    setIsVisible(true);
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink"
        >
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow mb-4"
            >
              {t("welcome", { defaultValue: "Welcome" })}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-display text-5xl text-ivory md:text-7xl"
            >
              HA
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="gold-rule mx-auto mt-6"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
