import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export const Skills = () => {
  const [animated, setAnimated] = useState(false);
  const { t } = useLanguage();

  const skills = [
    { name: t('skills.items.projectManagement'), value: 95, fill: "#8b5cf6" },
    { name: t('skills.items.constructionSupervision'), value: 90, fill: "#6366f1" },
    { name: t('skills.items.powerTransmission'), value: 95, fill: "#3b82f6" },
    { name: t('skills.items.infrastructureDesign'), value: 85, fill: "#7c3aed" },
    { name: t('skills.items.tenderManagement'), value: 90, fill: "#a21caf" }
  ];

  const itSkills = [
    { name: t('skills.itSkills.microsoftOffice'), value: 99, fill: "#10b981" },
    { name: t('skills.itSkills.pythonProgramming'), value: 95, fill: "#14b8a6" },
    { name: t('skills.itSkills.networking'), value: 97, fill: "#06b6d4" },
    { name: t('skills.itSkills.linux'), value: 90, fill: "#0ea5e9" }
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

  const SkillChart = ({ data, title }: { data: typeof skills | typeof itSkills, title?: string }) => (
    <div className="h-[400px] w-full">
      {title && (
        <h3 className="font-display text-2xl font-bold text-center mb-8 tracking-tight">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            minAngle={15}
            background={{ fill: 'rgba(0,0,0,0.1)' }}
            dataKey="value"
            cornerRadius={10}
            label={{ 
              position: 'insideStart',
              fill: '#fff',
              fontWeight: 'bold'
            }}
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px'
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 rounded-lg border shadow-lg">
                    <p className="font-mono text-sm">{`${payload[0].payload.name}: ${payload[0].value}%`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
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
            <SkillChart data={skills} />
          </div>

          <div className="glass p-8">
            <SkillChart 
              data={itSkills} 
              title={t('skills.itSkills.title')} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};