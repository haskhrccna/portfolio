import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TimelineEntry } from "./timeline/TimelineEntry";
import { getExperienceData } from "@/data/experienceData";

export const Timeline = () => {
  const { t } = useTranslation();
  const experiences = getExperienceData(t);

  return (
    <section className="pt-0 pb-2 -mt-[120px]">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12"
        >
          {t('experience.title')}
        </motion.h2>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 hidden sm:block" />
          
          {experiences.map((experience, index) => (
            <TimelineEntry 
              key={index}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
