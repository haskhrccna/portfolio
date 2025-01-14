import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const handleGetInTouch = () => {
    navigate('/contact');
  };

  const handleAdminLogin = () => {
    navigate('/login');
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(0,0,0,0))]" />
      <div className="container-width relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex flex-col items-center lg:items-start order-1 lg:order-2 lg:flex-1">
            <div className="flex flex-col items-center mb-8">
              <Avatar className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex-shrink-0 border-4 border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300">
                <AvatarImage
                  src="/lovable-uploads/072d3a59-e643-48d6-bb4c-7f55c36fd5a0.png"
                  alt="Profile photo"
                  className="object-cover object-center"
                />
                <AvatarFallback>HA</AvatarFallback>
              </Avatar>
              <div className="mt-4 relative">
                <div className="bg-emerald-500/90 px-4 py-1 rounded-full text-white font-semibold relative overflow-hidden">
                  {t('hero.status')}
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 animate-spark-repeat" />
                </div>
              </div>
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gradient animate-fade-up">
                {t('name')}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 animate-fade-up opacity-90 mb-4" style={{ animationDelay: '0.2s' }}>
                {t('jobTitle')}
              </p>
              <p className="text-lg sm:text-xl text-gray-300 animate-fade-up opacity-90 mb-8" style={{ animationDelay: '0.3s' }}>
                {t('bio')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={handleGetInTouch}
                  className="glass hover:bg-white/20 transition-all text-lg"
                >
                  Get in Touch
                </Button>
                <Button 
                  onClick={handleAdminLogin}
                  variant="outline"
                  className="glass hover:bg-white/20 transition-all text-lg"
                >
                  {t('contact.adminLogin')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;