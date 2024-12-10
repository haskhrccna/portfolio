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
      company: "AtkinsRéalis",
      period: "Nov 2024 - Present",
      description: "400kV OHTL transmission line upgrade including but not limited to Engineering, procurement and construction including design, manufacturing, FAT, insurance, packing, shipping, delivery to site, installation, testing, commissioning and handing over in satisfactory condition of works. Abu Dhabi, UAE",
      skills: ["Project Management", "High Voltage Systems", "Team Leadership"]
    },
    {
      title: "Principal Resident Engineer-Electrical",
      company: "AECOM Middle East",
      period: "May 2024 - Oct 2024",
      description: "Infrastructure and Landscaping Works Al Noud, including installation of 33kV primary substations, switching station and 11kV cables and related substations. Installation of street light network with all related works, testing and commissioning of 33/11 kV Cables, transformers and switch gear. Al Ain, UAE",
      skills: ["Infrastructure Works", "Substation Installation", "Project Management"]
    },
    {
      title: "Project Manager",
      company: "Mott MacDonald Consultant",
      period: "2022",
      description: "132kV cable /OHTL supply and installation works. Coordination with EtihadWE (previously EWEA) and main contractors in all aspects for smooth project execution as per client standard/specification, finalizing the required NOC from local authorities, executing power infrastructure projects, ensuring correct design, compliance, electrical safety and ensuring a more trouble-free work environment, project based in North, Central West and East area in UAE.",
      skills: ["Project Management", "High Voltage Systems", "Contractor Coordination", "Compliance Management"]
    },
    {
      title: "Project Manager",
      company: "AL BARRAK Electrical Cont.",
      period: "2020-2021",
      description: "Coordination with the stakeholders, finalizing the required NOC from local authorities, executing power infrastructure projects, ensuring correct design, compliance, electrical safety and ensuring a more trouble-free work environment, project based in Abu Dhabi UAE.",
      skills: ["Stakeholder Management", "Infrastructure Projects", "Compliance", "Safety Management"]
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
    <section className="pt-0 pb-2 -mt-[120px]">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
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
              className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-16`}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary" />
              
              {/* Content card */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                <div className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                  <h3 className="text-2xl font-semibold mb-4">{experience.title}</h3>
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