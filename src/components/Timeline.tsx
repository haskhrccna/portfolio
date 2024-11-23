import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface TimelineItem {
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

export const Timeline = () => {
  const { t } = useTranslation();

  const experiences: TimelineItem[] = [
    {
      title: "Principal Resident Engineer - Electrical",
      company: "Major Infrastructure Project",
      period: "2020 - Present",
      description: "Led electrical engineering teams in large-scale infrastructure projects, supervising power transmission installations and managing project deliverables.",
      skills: ["Project Management", "High Voltage Systems", "Team Leadership"]
    },
    {
      title: "Senior Electrical Engineer",
      company: "Power Distribution Company",
      period: "2017 - 2020",
      description: "Managed power distribution networks and supervised maintenance operations for critical infrastructure.",
      skills: ["Power Distribution", "Network Planning", "Technical Documentation"]
    },
    {
      title: "Electrical Systems Engineer",
      company: "Engineering Consultancy",
      period: "2014 - 2017",
      description: "Designed and implemented electrical systems for commercial and industrial projects.",
      skills: ["System Design", "AutoCAD", "Technical Analysis"]
    }
  ];

  return (
    <section className="pt-0 pb-2">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-4"
        >
          {t('experience.title', 'Professional Experience')}
        </motion.h2>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500" />
          
          {experiences.map((experience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-8`}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />
              
              {/* Content card */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                <div className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                  <p className="text-muted-foreground mb-2">{experience.company}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {experience.period}
                  </div>
                  <p className="mb-4">{experience.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};