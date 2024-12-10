import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const ContactHeader = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl font-bold mb-4 text-white">{t('contact.getInTouch')}</h1>
      <p className="text-gray-200">
        {t('contact.description')}
      </p>
    </motion.div>
  );
};