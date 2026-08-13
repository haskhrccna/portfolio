import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";

export const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-padding relative z-10">
      <div className="container-width">
        <Reveal>
          <p className="eyebrow mb-4 text-center">{t("about")}</p>
          <h2 className="display-title text-center">{t("jobTitle")}</h2>
          <div className="gold-rule mx-auto my-8" />
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-stone sm:text-xl">
            {t("bio")}
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mx-auto mt-12 max-w-3xl">
          <div className="glass grid gap-6 p-8 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-2">{t("name.firstName")}</p>
              <p className="font-display text-2xl text-ivory">{t("name.fullName")}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">{t("experience.title")}</p>
              <p className="text-ivory">{t("experience.job1.title")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
