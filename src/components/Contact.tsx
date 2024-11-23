import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-12"
        >
          {t('contact')}
        </motion.h2>
        <div className="glass p-8">
          <div className="flex justify-center gap-8">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               className="hover:text-primary transition-colors">
              <Github size={32} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
               className="hover:text-primary transition-colors">
              <Linkedin size={32} />
            </a>
            <a href="mailto:your@email.com"
               className="hover:text-primary transition-colors">
              <Mail size={32} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};