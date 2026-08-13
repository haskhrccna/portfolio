import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export const Skills = () => {
  const [animated, setAnimated] = useState(false);
  const { t } = useLanguage();

  const skills = [
    { name: t("skills.items.projectManagement"), value: 95, color: "#C6A46A" },
    { name: t("skills.items.constructionSupervision"), value: 90, color: "#A8884E" },
    { name: t("skills.items.powerTransmission"), value: 95, color: "#8B7344" },
    { name: t("skills.items.infrastructureDesign"), value: 85, color: "#6E5C3A" },
    { name: t("skills.items.tenderManagement"), value: 90, color: "#4A4030" },
  ];

  const itSkills = [
    { name: t("skills.itSkills.microsoftOffice"), value: 99, color: "#C9D4E3" },
    { name: t("skills.itSkills.pythonProgramming"), value: 95, color: "#8A9BB0" },
    { name: t("skills.itSkills.networking"), value: 97, color: "#6B7C94" },
    { name: t("skills.itSkills.linux"), value: 90, color: "#4D5F78" },
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

    const element = document.getElementById("skills-section");
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
        <div className="rounded-lg border border-gold/20 bg-navy/90 p-2 shadow-lg backdrop-blur-sm">
          <p className="font-mono text-sm text-ivory">{payload[0].name}</p>
          <p className="font-mono text-sm font-medium text-gold">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-mono"
      >
        {`${value}%`}
      </text>
    );
  };

  const ChartSection = ({ data, title }: { data: typeof skills; title?: string }) => (
    <div
      className={cn(
        "glass h-full p-8 transition-all duration-700",
        animated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      {title && (
        <h3 className="mb-8 text-center font-display text-2xl tracking-tight text-ivory">
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
                  className="stroke-ink hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="font-mono text-sm text-stone">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <section id="skills" className="section-padding relative z-10">
      <div id="skills-section" className="container-width">
        <Reveal>
          <p className="eyebrow mb-4 text-center">{t("navigation.skills")}</p>
          <h2 className="display-title text-center">{t("skills.title")}</h2>
          <div className="gold-rule mx-auto my-8" />
        </Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ChartSection data={skills} title={t("skills.title")} />
          <ChartSection data={itSkills} title={t("skills.itSkills.title")} />
        </div>
      </div>
    </section>
  );
};
