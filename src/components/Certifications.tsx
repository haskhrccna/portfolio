import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from "@/components/ui/card";
import { pmpCertification, otherCertifications } from '@/data/certificateData';

export const Certifications = () => {
  const { t } = useLanguage();

  const CertificationCard = ({ cert }: { cert: typeof pmpCertification }) => (
    <Card 
      className="glass hover:bg-white/20 transition-all duration-300 p-6"
    >
      <div className="flex items-start space-x-4">
        <div className={`${cert.id === 2 ? 'w-48' : 'w-24'} h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/5`}>
          <img 
            src={cert.imageUrl} 
            alt={cert.title}
            className="w-full h-full object-contain p-2"
          />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-3 tracking-tight">
            {cert.title}
          </h3>
          <p className="font-mono text-sm text-gray-300">
            {cert.date}
          </p>
        </div>
      </div>
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