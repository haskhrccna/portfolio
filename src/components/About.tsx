import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-lg leading-relaxed"
        >
          {t('bio')}
        </motion.p>
      </div>
    </section>
  );
};
