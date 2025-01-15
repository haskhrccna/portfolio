import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimelineItem } from "@/types/timeline";
import { YearCircle } from "./YearCircle";

interface TimelineEntryProps {
  experience: TimelineItem;
  index: number;
}

export const TimelineEntry = ({ experience, index }: TimelineEntryProps) => {
  const extractYear = (period: string): string => {
    const match = period.match(/\b\d{4}\b/);
    return match ? match[0] : "";
  };

  const year = extractYear(experience.period);
  const isGraduationYear = year === "1997";
  const isCurrentYear = year === "2024" && experience.company === "AtkinsRéalis";

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 50 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.2
      }}
      className={`relative flex flex-col sm:flex-row group mb-8 sm:mb-16 ${
        index % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'
      }`}
    >
      <div className="sm:hidden mx-auto mb-4">
        <YearCircle 
          year={year}
          isGraduationYear={isGraduationYear}
          isCurrentYear={isCurrentYear}
        />
      </div>
      <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
        <YearCircle 
          year={year}
          isGraduationYear={isGraduationYear}
          isCurrentYear={isCurrentYear}
        />
      </div>
      
      <div className={`w-full sm:w-5/12 ${
        index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'
      }`}>
        <div className={`glass p-6 rounded-xl hover:shadow-lg transition-all duration-300 group ${
          isGraduationYear ? 'bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] bg-opacity-20' : ''
        }`}>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-600">
            {experience.title}
          </h3>
          <p className="text-muted-foreground mb-2 group-hover:text-white/90">{experience.company}</p>
          <div className="flex items-center text-sm text-muted-foreground mb-2 group-hover:text-white/90">
            <Calendar className="w-4 h-4 mr-2" />
            {experience.period}
          </div>
          {experience.location && (
            <div className="flex items-center text-sm text-muted-foreground mb-4 group-hover:text-white/90">
              <MapPin className="w-4 h-4 mr-2" />
              {experience.location}
            </div>
          )}
          <p className="mb-4 text-sm sm:text-base group-hover:text-white/90">{experience.description}</p>
          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill, skillIndex) => (
              <Badge 
                key={skillIndex} 
                variant="secondary"
                className="text-xs sm:text-sm hover:bg-white/20 hover:text-purple-400 transition-colors duration-300 group-hover:border-white/40"
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