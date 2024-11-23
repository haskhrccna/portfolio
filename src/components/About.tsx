import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-12"
        >
          {t('about')}
        </motion.h2>
        <div className="glass p-8">
          <p className="text-lg leading-relaxed">
            {t('bio')}
          </p>
        </div>
      </div>
    </section>
  );
};