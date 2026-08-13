import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const ContactHeader = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center"
    >
      <p className="eyebrow mb-4">{t("navigation.contact")}</p>
      <h1 className="display-title mb-5">{t("contact.getInTouch")}</h1>
      <div className="gold-rule mx-auto mb-6" />
      <p className="text-stone">{t("contact.description")}</p>
    </motion.div>
  );
};
