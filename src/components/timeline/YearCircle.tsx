import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface YearCircleProps {
  year: string;
  isGraduationYear: boolean;
  isCurrentYear: boolean;
}

export const YearCircle = ({ year, isGraduationYear, isCurrentYear }: YearCircleProps) => {
  const baseVariants = {
    initial: { scale: 0.8 },
    hover: {
      scale: 1.2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const celebrationVariants = {
    initial: { scale: 0.8 },
    hover: {
      scale: 1.3,
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  const currentYearVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.2,
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      variants={isGraduationYear ? celebrationVariants : isCurrentYear ? currentYearVariants : baseVariants}
      className={`absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full 
        ${isGraduationYear 
          ? 'bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 animate-gradient-xy' 
          : isCurrentYear
          ? 'bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse'
          : 'bg-gradient-to-br from-purple-500 to-pink-500'
        } 
        flex items-center justify-center text-white font-bold text-sm z-10 
        shadow-lg hover:shadow-xl transition-shadow duration-200`}
    >
      {year}
      {isGraduationYear && (
        <>
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-1"
            animate={{
              rotate: [0, -15, 15, 0],
              scale: [1, 1.2, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5,
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};