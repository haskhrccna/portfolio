import { motion, useReducedMotion } from "framer-motion";

interface YearCircleProps {
  year: string;
  isGraduationYear: boolean;
  isCurrentYear: boolean;
}

export const YearCircle = ({ year, isGraduationYear, isCurrentYear }: YearCircleProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { scale: 0.86, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      className={`z-10 flex h-11 w-11 items-center justify-center rounded-full border text-[11px] font-medium sm:h-12 sm:w-12 sm:text-xs ${
        isCurrentYear
          ? "border-gold bg-gold text-ink"
          : isGraduationYear
          ? "border-gold/70 bg-navy text-gold-soft"
          : "border-gold/30 bg-ink text-ivory"
      }`}
    >
      {year}
    </motion.div>
  );
};
