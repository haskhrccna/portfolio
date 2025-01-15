import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from "@/lib/utils";

export const Skills = () => {
  const [animated, setAnimated] = useState(false);
  const { t } = useLanguage();

  const skills = [
    { name: t('skills.items.projectManagement'), value: 95, color: "#8B5CF6" },
    { name: t('skills.items.constructionSupervision'), value: 90, color: "#6366F1" },
    { name: t('skills.items.powerTransmission'), value: 95, color: "#4F46E5" },
    { name: t('skills.items.infrastructureDesign'), value: 85, color: "#4338CA" },
    { name: t('skills.items.tenderManagement'), value: 90, color: "#3730A3" }
  ];

  const itSkills = [
    { name: t('skills.itSkills.microsoftOffice'), value: 99, color: "#10B981" },
    { name: t('skills.itSkills.pythonProgramming'), value: 95, color: "#059669" },
    { name: t('skills.itSkills.networking'), value: 97, color: "#047857" },
    { name: t('skills.itSkills.linux'), value: 90, color: "#065F46" }
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm border border-border/50 p-2 rounded-lg shadow-lg">
          <p className="font-mono text-sm">{payload[0].name}</p>
          <p className="font-mono text-primary text-sm font-bold">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-mono"
      >
        {`${value}%`}
      </text>
    );
  };

  const ChartSection = ({ data, title }: { data: typeof skills; title?: string }) => (
    <div className={cn(
      "glass p-8 transition-all duration-700 h-full",
      animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    )}>
      {title && (
        <h3 className="font-display text-2xl font-bold text-center mb-8 tracking-tight">
          {title}
        </h3>
      )}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={150}
              innerRadius={100}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={2000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm font-mono">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <section id="skills" className="section-padding">
      <div id="skills-section" className="container-width">
        <h2 className="font-display text-4xl font-bold text-center mb-16 tracking-tight">
          {t('skills.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartSection data={skills} title={t('skills.technical')} />
          <ChartSection data={itSkills} title={t('skills.itSkills.title')} />
        </div>
      </div>
    </section>
  );
};