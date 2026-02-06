import { TimelineItem } from "@/types/timeline";

export const getExperienceData = (t: (key: string) => string): TimelineItem[] => [
  {
    title: t('experience.job1.title'),
    company: "AtkinsRealis Consultant",
    period: t('experience.job1.period'),
    description: t('experience.job1.description'),
    location: "Abu Dhabi, UAE",
    skills: [t('experience.skills.projectManagement'), t('experience.skills.highVoltage'), t('experience.skills.teamLeadership')]
  },
  {
    title: t('experience.job2.title'),
    company: "AECOM Middle East Consultant",
    period: t('experience.job2.period'),
    description: t('experience.job2.description'),
    location: "Al Ain, UAE",
    skills: [t('experience.skills.infrastructure'), t('experience.skills.substationInstallation'), t('experience.skills.projectManagement')]
  },
  {
    title: t('experience.job3.title'),
    company: "Mott MacDonald Consultant",
    period: "2022",
    description: t('experience.job3.description'),
    location: "Dubai, UAE",
    skills: [t('experience.skills.projectManagement'), t('experience.skills.highVoltage'), t('experience.skills.contractorCoordination'), t('experience.skills.complianceManagement')]
  },
  {
    title: t('experience.job4.title'),
    company: "AL BARRAK Electrical Cont.",
    period: "2020-2021",
    description: t('experience.job4.description'),
    location: "Abu Dhabi, UAE",
    skills: [t('experience.skills.stakeholderManagement'), t('experience.skills.infrastructureProjects'), t('experience.skills.compliance'), t('experience.skills.safetyManagement')]
  },
  {
    title: t('experience.job5.title'),
    company: "Furukawa Electrical Co.",
    period: "2016-2019",
    description: t('experience.job5.description'),
    location: "Doha, Qatar",
    skills: [t('experience.skills.electricalEngineering'), t('experience.skills.ehvPowerCables'), t('experience.skills.projectSupervision'), t('experience.skills.testingCommissioning')]
  },
  {
    title: t('experience.job6.title'),
    company: "KEO International Consultants",
    period: "2012-2016",
    description: t('experience.job6.description'),
    location: "Doha, Qatar",
    skills: [t('experience.skills.electricalDesign'), t('experience.skills.infrastructureProjects'), t('experience.skills.projectSupervision'), t('experience.skills.testingCommissioning')]
  },
  {
    title: t('experience.job7.title'),
    company: "EXSYM Corporation",
    period: "2008-2012",
    description: t('experience.job7.description'),
    location: "Doha, Qatar",
    skills: [t('experience.skills.constructionSupervision'), t('experience.skills.technicalEvaluation'), t('experience.skills.designReview'), t('experience.skills.ehvCableProjects')]
  },
  {
    title: t('experience.job8.title'),
    company: "EXSYM Corporation",
    period: t('experience.job8.period'),
    description: t('experience.job8.description'),
    location: "Doha, Qatar",
    skills: [t('experience.skills.siteManagement'), t('experience.skills.technicalCoordination'), t('experience.skills.installationSupervision'), t('experience.skills.teamLeadership')]
  },
  {
    title: t('experience.job9.title'),
    company: "Ministry of Electricity and Water (MEW)",
    period: t('experience.job9.period'),
    description: t('experience.job9.description'),
    location: "Kuwait, Kuwait",
    skills: [t('experience.skills.cableMaintenance'), t('experience.skills.safetyManagement'), t('experience.skills.highVoltageTesting'), t('experience.skills.subcontractorManagement')]
  },
  {
    title: t('experience.job10.title'),
    company: "High Voltage Equipment – Egyptian Army",
    period: "1998-2000",
    description: t('experience.job10.description'),
    skills: [t('experience.skills.equipmentMaintenance'), t('experience.skills.staffTraining'), t('experience.skills.voltageSystems'), t('experience.skills.complianceManagement')]
  },
  {
    title: t('experience.job11.title'),
    company: "Mansoura University, Egypt",
    period: t('experience.job11.period'),
    description: t('experience.job11.description'),
    skills: [t('experience.skills.electronicsEngineering'), t('experience.skills.technicalAnalysis'), t('experience.skills.problemSolving')]
  }
];
