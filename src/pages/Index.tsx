import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Certifications } from "@/components/Certifications";
import ProjectImages from "@/components/ProjectImages";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="overflow-hidden">
      <Hero />
      <About />
      <Skills />
      <Certifications />
      <div className="flex justify-center py-12">
        <Button 
          onClick={() => navigate('/contact')}
          className="glass hover:bg-white/20 text-xl py-6 px-8"
        >
          {t('contact')}
        </Button>
      </div>
      <ProjectImages />
    </main>
  );
};

export default Index;