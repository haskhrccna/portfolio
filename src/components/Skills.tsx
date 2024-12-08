import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Skills = () => {
  const [animated, setAnimated] = useState(false);
  const { t } = useLanguage();

  const skills = [
    { name: t('skills.items.projectManagement'), level: 95, color: "from-purple-500 to-pink-500" },
    { name: t('skills.items.constructionSupervision'), level: 90, color: "from-blue-500 to-purple-500" },
    { name: t('skills.items.powerTransmission'), level: 95, color: "from-indigo-500 to-blue-500" },
    { name: t('skills.items.infrastructureDesign'), level: 85, color: "from-violet-500 to-indigo-500" },
    { name: t('skills.items.tenderManagement'), level: 90, color: "from-fuchsia-500 to-violet-500" }
  ];

  const itSkills = [
    { name: t('skills.itSkills.microsoftOffice'), level: 99, color: "from-emerald-500 to-teal-500" },
    { name: t('skills.itSkills.pythonProgramming'), level: 95, color: "from-teal-500 to-cyan-500" },
    { name: t('skills.itSkills.networking'), level: 97, color: "from-cyan-500 to-sky-500" },
    { name: t('skills.itSkills.linux'), level: 90, color: "from-sky-500 to-blue-500" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('skills-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const SkillBar = ({ skill, delay }: { skill: { name: string; level: number; color: string }; delay: number }) => (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex justify-between mb-2">
        <span className="font-mono text-sm tracking-tight">{skill.name}</span>
        <span className="font-mono text-primary text-sm">{skill.level}%</span>
      </div>
      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out rounded-full`}
          style={{
            width: animated ? `${skill.level}%` : '0%',
            transition: `width 1s ease-out ${delay}s`
          }}
        />
      </div>
    </div>
  );

  return (
    <section id="skills" className="section-padding">
      <div id="skills-section" className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center mb-16 tracking-tight">
          {t('skills.title')}
        </h2>
        
        <div className="space-y-16">
          <div className="glass p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <SkillBar 
                  key={skill.name} 
                  skill={skill} 
                  delay={index * 0.1} 
                />
              ))}
            </div>
          </div>

          <div className="glass p-8">
            <h3 className="font-display text-2xl font-bold text-center mb-8 tracking-tight">
              {t('skills.itSkills.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {itSkills.map((skill, index) => (
                <SkillBar 
                  key={skill.name} 
                  skill={skill} 
                  delay={(index + skills.length) * 0.1} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};