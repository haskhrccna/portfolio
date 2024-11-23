import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetInTouch = () => {
    navigate('/contact');
  };

  const handleAdminLogin = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        toast.error('Authentication error');
        return;
      }

      if (session) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          toast.error('Error checking admin status');
          return;
        }

        if (adminData?.is_admin) {
          toast.success('Already logged in as admin');
          return;
        }
      }

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (signInError) {
        console.error('Error signing in:', signInError);
        toast.error('Error signing in');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-up">
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
      <div className="fixed top-4 right-32 z-50 flex gap-6">
        <Button 
          onClick={handleAdminLogin}
          variant="outline"
          className="glass hover:bg-white/20 transition-all"
        >
          Admin Login
        </Button>
        <Button 
          onClick={handleGetInTouch}
          variant="outline"
          className="glass hover:bg-white/20 transition-all"
        >
          {t('getInTouch')}
        </Button>
      </div>
    </section>
  );
};

export default Hero;
