import { useTranslation } from "react-i18next";
import { TimelineEntry } from "./timeline/TimelineEntry";
import { getExperienceData } from "@/data/experienceData";
import { Reveal } from "./Reveal";

export const Timeline = () => {
  const { t } = useTranslation();
  const experiences = getExperienceData(t);

  return (
    <section id="experience" className="section-padding relative z-10 pt-8">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow mb-4 text-center">{t("navigation.experience")}</p>
          <h2 className="display-title text-center">{t("experience.title")}</h2>
          <div className="gold-rule mx-auto my-8" />
        </Reveal>

        <div className="relative mt-8">
          <div className="absolute left-1/2 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/50 to-transparent sm:block" />

          {experiences.map((experience, index) => (
            <TimelineEntry
              key={`${experience.company}-${experience.period}-${index}`}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
