import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TimelineEntry } from "./timeline/TimelineEntry";
import { TimelineItem } from "@/types/timeline";

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
      title: "Project Manager",
      company: "Furukawa Electrical Co.",
      period: "2016-2019",
      description: "Design & supervision and practice of electrical engineering on installation, testing and commissioning of 400kV / 132kV EHV power Cables, and FO cable works for power transmission & distribution system as per standards and regulations in Doha, Qatar.",
      skills: ["Electrical Engineering", "EHV Power Cables", "Project Supervision", "Testing & Commissioning"]
    },
    {
      title: "Project Manager Electrical Works",
      company: "KEO International Consultants",
      period: "2012-2016",
      description: "Design & supervision on 132kV / 11kV and street light network installation works for infrastructure and Highway roads projects and, testing and commissioning, project based in Doha, Qatar.",
      skills: ["Electrical Design", "Infrastructure Projects", "Project Supervision", "Testing & Commissioning"]
    },
    {
      title: "Project Manager",
      company: "EXSYM Corporation",
      period: "2008-2012",
      description: "Construction supervision, technical/commercial evaluations for bidders' offers, design review and tendering of 132kV/220kV/400kV EHV cable projects based in Doha, Qatar.",
      skills: ["Construction Supervision", "Technical Evaluation", "Design Review", "EHV Cable Projects"]
    },
    {
      title: "Project Engineer",
      company: "EXSYM Corporation",
      period: "Dec 2005 - Dec 2007",
      description: "Managing all site activities, site team, and subcontractors' works for 132kV cable installation projects, including supervision of installation processes and coordination of technical requirements.",
      skills: ["Site Management", "Technical Coordination", "Installation Supervision", "Team Leadership"]
    },
    {
      title: "Cable Maintenance Engineer",
      company: "Ministry of Electricity and Water (MEW)",
      period: "Nov 2002 - Nov 2005",
      description: "Supervised cable activities including excavation, laying, and jointing. Managed subcontractors, prepared safety permits, monitored progress, and supervised high voltage testing for 33kV-300kV cables. Responsible for fault location, repair activities, and switching operations across substations.",
      skills: ["Cable Maintenance", "Safety Management", "High Voltage Testing", "Subcontractor Management"]
    },
    {
      title: "Electrical Maintenance Engineer",
      company: "High Voltage Equipment – Egyptian Army",
      period: "1998-2000",
      description: "Controlled equipment operation and supervised regular maintenance. Provided training for new staff members. Supervised electrical works for low, medium, and high voltage equipment, ensuring compliance with Egyptian standards.",
      skills: ["Equipment Maintenance", "Staff Training", "Voltage Systems", "Compliance Management"]
    },
    {
      title: "B.Sc. Electronics Engineering",
      company: "Mansoura University, Egypt",
      period: "May 1997",
      description: "Bachelor of Science degree in Electronics Engineering",
      skills: ["Electronics Engineering", "Technical Analysis", "Problem Solving"]
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
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500" />
          
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
