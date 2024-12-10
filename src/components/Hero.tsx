import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
    <section className="min-h-[40vh] flex items-center justify-center relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-xy overflow-hidden p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),rgba(0,0,0,0))]" />
      <div className="absolute w-full h-full opacity-20" />
      <div className="max-w-7xl w-full mx-auto relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-48 w-48 flex-shrink-0 border-4 border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300">
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
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-up">
              {t('name')}
            </h1>
            <p className="text-lg text-gray-300 animate-fade-up opacity-90" style={{ animationDelay: '0.2s' }}>
              {t('jobTitle')}
            </p>
            <p className="text-lg text-gray-300 animate-fade-up opacity-90 mt-4" style={{ animationDelay: '0.3s' }}>
              {t('bio')}
            </p>
          </div>
        </div>
      </div>
      <div className={`fixed top-4 right-24 z-50 flex gap-4 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-20'}`}>
        <Button 
          onClick={handleAdminLogin}
          variant="outline"
          className="glass hover:bg-white/20 transition-all"
        >
          {t('contact.adminLogin')}
        </Button>
        <Button 
          onClick={handleGetInTouch}
          variant="outline"
          className="glass hover:bg-white/20 transition-all"
        >
          Get in Touch
        </Button>
      </div>
    </section>
  );
};

export default Hero;