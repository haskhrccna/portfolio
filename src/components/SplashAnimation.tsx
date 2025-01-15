import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initial animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Animation duration

    // Set up interval for repeated animations
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }, 120000); // Repeat every 120 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
            >
              Welcome
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};