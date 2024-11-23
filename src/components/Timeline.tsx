import { Briefcase, Calendar } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const Timeline = () => {
  const { t } = useLanguage();

  const experiences = [
    {
      id: 0,
      title: t('experience.positions.position0.title'),
      company: t('experience.positions.position0.company'),
      date: t('experience.positions.position0.date'),
      description: t('experience.positions.position0.description'),
    },
    {
      id: 1,
      title: t('experience.positions.position1.title'),
      company: t('experience.positions.position1.company'),
      date: t('experience.positions.position1.date'),
      description: t('experience.positions.position1.description'),
    },
    {
      id: 2,
      title: t('experience.positions.position2.title'),
      company: t('experience.positions.position2.company'),
      date: t('experience.positions.position2.date'),
      description: t('experience.positions.position2.description'),
    },
    {
      id: 3,
      title: t('experience.positions.position3.title'),
      company: t('experience.positions.position3.company'),
      date: t('experience.positions.position3.date'),
      description: t('experience.positions.position3.description'),
    },
    {
      id: 4,
      title: t('experience.positions.position4.title'),
      company: t('experience.positions.position4.company'),
      date: t('experience.positions.position4.date'),
      description: t('experience.positions.position4.description'),
    },
    {
      id: 5,
      title: t('experience.positions.position5.title'),
      company: t('experience.positions.position5.company'),
      date: t('experience.positions.position5.date'),
      description: t('experience.positions.position5.description'),
    },
    {
      id: 6,
      title: t('experience.positions.position6.title'),
      company: t('experience.positions.position6.company'),
      date: t('experience.positions.position6.date'),
      description: t('experience.positions.position6.description'),
    },
    {
      id: 7,
      title: t('experience.positions.position7.title'),
      company: t('experience.positions.position7.company'),
      date: t('experience.positions.position7.date'),
      description: t('experience.positions.position7.description'),
    },
    {
      id: 8,
      title: t('experience.positions.position8.title'),
      company: t('experience.positions.position8.company'),
      date: t('experience.positions.position8.date'),
      description: t('experience.positions.position8.description'),
    },
    {
      id: 9,
      title: t('experience.positions.position9.title'),
      company: t('experience.positions.position9.company'),
      date: t('experience.positions.position9.date'),
      description: t('experience.positions.position9.description'),
    },
    {
      id: 10,
      title: t('experience.positions.position10.title'),
      company: t('experience.positions.position10.company'),
      date: t('experience.positions.position10.date'),
      description: t('experience.positions.position10.description'),
    },
    {
      id: 11,
      title: t('experience.positions.position11.title'),
      company: t('experience.positions.position11.company'),
      date: t('experience.positions.position11.date'),
      description: t('experience.positions.position11.description'),
    }
  ];

  return (
    <section id="experience" className="relative py-20 overflow-hidden">
      <div className="sticky top-0 z-50 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm px-6 py-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          {t('experience.title')}
        </h2>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="relative">
          {/* Timeline center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-purple-400 to-pink-500" />
          
          <div className="space-y-24">
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                } group`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50 border-4 border-background group-hover:scale-125 transition-transform duration-300" />
                </div>

                {/* Card */}
                <Card 
                  className={`
                    w-full md:w-5/12 
                    ${index % 2 === 0 ? 'mr-auto md:mr-12' : 'ml-auto md:ml-12'}
                    glass
                    bg-gradient-to-br from-background/40 to-background/20
                    backdrop-blur-lg
                    border border-purple-500/20
                    hover:border-purple-500/40
                    shadow-xl
                    hover:shadow-purple-500/10
                    transition-all
                    duration-300
                    transform
                    hover:-translate-y-1
                    hover:scale-[1.02]
                    animate-fade-up
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center mb-3 text-sm text-purple-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">{experience.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                      {experience.title}
                    </h3>

                    {/* Company */}
                    <div className="flex items-center text-purple-400 mb-4">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span className="font-medium">{experience.company}</span>
                    </div>

                    {/* Description */}
                    {experience.description && (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {experience.description}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;