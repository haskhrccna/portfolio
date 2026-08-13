import { motion, useReducedMotion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimelineItem } from "@/types/timeline";
import { YearCircle } from "./YearCircle";

interface TimelineEntryProps {
  experience: TimelineItem;
  index: number;
}

export const TimelineEntry = ({ experience, index }: TimelineEntryProps) => {
  const reduceMotion = useReducedMotion();
  const extractYear = (period: string): string => {
    const match = period.match(/\b\d{4}\b/);
    return match ? match[0] : "";
  };

  const year = extractYear(experience.period);
  const isGraduationYear = year === "1997";
  const isCurrentYear = experience.company.includes("Atkins");

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative mb-8 flex flex-col sm:mb-14 sm:flex-row ${
        index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
      }`}
    >
      <div className="mx-auto mb-4 sm:hidden">
        <YearCircle
          year={year}
          isGraduationYear={isGraduationYear}
          isCurrentYear={isCurrentYear}
        />
      </div>
      <div className="absolute left-1/2 hidden -translate-x-1/2 sm:block">
        <YearCircle
          year={year}
          isGraduationYear={isGraduationYear}
          isCurrentYear={isCurrentYear}
        />
      </div>

      <div className={`w-full sm:w-5/12 ${index % 2 === 0 ? "sm:pr-8" : "sm:pl-8"}`}>
        <div className="glass p-6 transition-transform duration-500 group-hover:-translate-y-1">
          <h3 className="mb-3 font-display text-2xl text-ivory transition-colors duration-300 group-hover:text-gold-soft">
            {experience.title}
          </h3>
          <p className="mb-2 text-gold/90">{experience.company}</p>
          <div className="mb-2 flex items-center text-sm text-stone">
            <Calendar className="mr-2 h-4 w-4" />
            {experience.period}
          </div>
          {experience.location && (
            <div className="mb-4 flex items-center text-sm text-stone">
              <MapPin className="mr-2 h-4 w-4" />
              {experience.location}
            </div>
          )}
          <p className="mb-4 text-sm leading-relaxed text-ivory/80 sm:text-base">
            {experience.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill, skillIndex) => (
              <Badge
                key={skillIndex}
                variant="secondary"
                className="border border-gold/15 bg-white/5 text-xs text-ivory/80 hover:border-gold/40 hover:text-gold-soft sm:text-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
