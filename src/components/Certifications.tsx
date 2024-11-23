import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from "@/components/ui/card";
import { pmpCertification, otherCertifications } from '@/data/certificateData';

export const Certifications = () => {
  const { t } = useLanguage();

  const CertificationCard = ({ cert }: { cert: typeof pmpCertification }) => (
    <Card 
      className="glass p-6 relative group cursor-pointer overflow-hidden
        hover:bg-white/20 transition-all duration-300
        hover:border-white/40"
    >
      <div className="flex items-start space-x-4">
        <div className={`${cert.id === 2 ? 'w-48' : 'w-24'} h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 
          group-hover:animate-pulse transition-all duration-300`}>
          <img 
            src={cert.imageUrl} 
            alt={cert.title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-3 tracking-tight 
            group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r 
            group-hover:from-purple-400 group-hover:to-pink-600 transition-all duration-300">
            {cert.title}
          </h3>
          <p className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
            {cert.date}
          </p>
        </div>
      </div>
      {/* Sparkle effect overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent 
        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 
        group-hover:animate-spark-repeat"></div>
    </Card>
  );

  return (
    <section id="certifications" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center mb-16 tracking-tight">
          {t('certifications.title')}
        </h2>
        
        <div className="mb-12 animate-fade-up">
          <CertificationCard cert={pmpCertification} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherCertifications.map((cert, index) => (
            <div 
              key={cert.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CertificationCard cert={cert} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};