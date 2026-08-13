import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Timeline } from "@/components/Timeline";
import { Certifications } from "@/components/Certifications";
import ProjectImages from "@/components/ProjectImages";
import Footer from "@/components/Footer";
import { SplashAnimation } from "@/components/SplashAnimation";
import { SiteNav } from "@/components/SiteNav";
import { useEffect } from "react";
import "@/utils/keepAlive";

const Index = () => {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative overflow-hidden">
      <SplashAnimation />
      <SiteNav />
      <Hero />
      <About />
      <Timeline />
      <Skills />
      <Certifications />
      <ProjectImages />
      <Footer />
    </main>
  );
};

export default Index;
