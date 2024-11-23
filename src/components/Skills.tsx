import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Skills = () => {
  const [animated, setAnimated] = useState(false);
  const { t } = useLanguage();

  const skills = [
    { name: t('skills.items.projectManagement'), level: 95 },
    { name: t('skills.items.constructionSupervision'), level: 90 },
    { name: t('skills.items.powerTransmission'), level: 95 },
    { name: t('skills.items.infrastructureDesign'), level: 85 },
    { name: t('skills.items.tenderManagement'), level: 90 }
  ];

  const itSkills = [
    { name: t('skills.itSkills.microsoftOffice'), level: 99 },
    { name: t('skills.itSkills.pythonProgramming'), level: 95 },
    { name: t('skills.itSkills.networking'), level: 97 },
    { name: t('skills.itSkills.linux'), level: 90 }
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
                <div
                  key={skill.name}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-sm tracking-tight">{skill.name}</span>
                    <span className="font-mono text-primary text-sm">{skill.level}%</span>
                  </div>
                  <Progress
                    value={animated ? skill.level : 0}
                    className="transition-all duration-1000 ease-out h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8">
            <h3 className="font-display text-2xl font-bold text-center mb-8 tracking-tight">
              {t('skills.itSkills.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {itSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(index + skills.length) * 0.1}s` }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-sm tracking-tight">{skill.name}</span>
                    <span className="font-mono text-primary text-sm">{skill.level}%</span>
                  </div>
                  <Progress
                    value={animated ? skill.level : 0}
                    className="transition-all duration-1000 ease-out h-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};