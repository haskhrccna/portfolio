# ⚡ Quick Wins Implementation Guide
## Immediate High-Impact Improvements (1-2 Weeks)

This guide focuses on the **TOP 5 CRITICAL FEATURES** that will have the most immediate impact on your portfolio's effectiveness.

---

## 🎯 Quick Win #1: Professional Statistics Counter
**Time to Implement:** 2 hours | **Impact:** Very High

### Visual Example:
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│    [Icon]  27+         [Icon]  150+       [Icon]  $500M+ │
│    Years of          Projects           Total Project    │
│    Experience        Completed           Value           │
│                                                          │
│    [Icon]  5+          [Icon]  3         [Icon]  500+    │
│    Certifications    Countries          Team Members     │
│                      Worked            Managed           │
└─────────────────────────────────────────────────────────┘
```

### Database Setup:
```sql
-- Add to Supabase
CREATE TABLE career_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label_en TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_fr TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial data
INSERT INTO career_stats (key, value, label_en, label_ar, label_fr, icon, display_order) VALUES
('experience_years', '27+', 'Years of Experience', 'سنوات الخبرة', 'Années d''expérience', 'Calendar', 1),
('projects_completed', '150+', 'Projects Completed', 'مشاريع منجزة', 'Projets réalisés', 'CheckCircle2', 2),
('project_value', '$500M+', 'Total Project Value', 'قيمة المشاريع الإجمالية', 'Valeur totale des projets', 'DollarSign', 3),
('certifications', '5+', 'Professional Certifications', 'شهادات مهنية', 'Certifications professionnelles', 'Award', 4),
('countries', '4', 'Countries Worked', 'دول العمل', 'Pays travaillés', 'Globe', 5),
('team_members', '500+', 'Team Members Managed', 'أعضاء الفريق المدارون', 'Membres d''équipe gérés', 'Users', 6);

-- RLS Policies
ALTER TABLE career_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON career_stats
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin full access" ON career_stats
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true));
```

### Component: `src/components/CareerStats.tsx`
```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Calendar, CheckCircle2, DollarSign, Award,
  Globe, Users, Zap, Trophy
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface CareerStat {
  id: string;
  key: string;
  value: string;
  label_en: string;
  label_ar: string;
  label_fr: string;
  icon: string;
  display_order: number;
}

const iconMap: Record<string, any> = {
  Calendar,
  CheckCircle2,
  DollarSign,
  Award,
  Globe,
  Users,
  Zap,
  Trophy
};

export const CareerStats = () => {
  const { i18n } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ["career-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as CareerStat[];
    }
  });

  const getLabel = (stat: CareerStat) => {
    const lang = i18n.language;
    if (lang === 'ar') return stat.label_ar;
    if (lang === 'fr') return stat.label_fr;
    return stat.label_en;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {stats?.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Zap;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass p-6 text-center hover:bg-white/10 transition-all duration-300 group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="h-8 w-8 mx-auto mb-3 text-purple-400 group-hover:text-pink-400 transition-colors" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className="text-3xl font-bold text-white mb-2 font-mono"
                  >
                    <CountUp end={stat.value} />
                  </motion.div>

                  <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                    {getLabel(stat)}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

// Simple CountUp component
const CountUp = ({ end }: { end: string }) => {
  // Extract number from string like "27+" or "$500M+"
  const numMatch = end.match(/\d+/);
  if (!numMatch) return <span>{end}</span>;

  const [count, setCount] = React.useState(0);
  const target = parseInt(numMatch[0]);

  React.useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{end.replace(/\d+/, count.toString())}</span>;
};
```

### Add to Index.tsx:
```typescript
import { CareerStats } from "@/components/CareerStats";

// Add after Hero section:
<Hero />
<CareerStats /> {/* NEW */}
<About />
```

---

## 🎯 Quick Win #2: Downloadable CV System
**Time to Implement:** 1 hour | **Impact:** Critical

### File Structure:
```
/public/
  /cv/
    - Hassan_Adam_CV_EN.pdf
    - Hassan_Adam_CV_AR.pdf
    - Hassan_Adam_CV_FR.pdf
    - Hassan_Adam_Resume_Short_EN.pdf
```

### Component: `src/components/CVDownload.tsx`
```typescript
import { Button } from "@/components/ui/button";
import { Download, FileText, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CVDownload = ({ variant = "default", size = "default" }) => {
  const { t, i18n } = useTranslation();

  const trackDownload = async (language: string, type: string) => {
    try {
      await supabase.from('cv_downloads').insert([{
        language,
        cv_type: type,
        downloaded_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };

  const handleDownload = (language: string, filename: string, type: string) => {
    const link = document.createElement('a');
    link.href = `/cv/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    trackDownload(language, type);
    toast.success(t('cv.downloadStarted'));
  };

  const cvOptions = [
    {
      lang: 'en',
      label: 'English (Full CV)',
      filename: 'Hassan_Adam_CV_EN.pdf',
      type: 'full'
    },
    {
      lang: 'en',
      label: 'English (Resume)',
      filename: 'Hassan_Adam_Resume_Short_EN.pdf',
      type: 'short'
    },
    {
      lang: 'ar',
      label: 'العربية',
      filename: 'Hassan_Adam_CV_AR.pdf',
      type: 'full'
    },
    {
      lang: 'fr',
      label: 'Français',
      filename: 'Hassan_Adam_CV_FR.pdf',
      type: 'full'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="h-4 w-4" />
          {t('cv.download')}
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass border-white/20">
        {cvOptions.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleDownload(option.lang, option.filename, option.type)}
            className="cursor-pointer hover:bg-white/10"
          >
            <FileText className="h-4 w-4 mr-2" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

### Track Downloads (Database):
```sql
CREATE TABLE cv_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL,
  cv_type TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_cv_downloads_date ON cv_downloads(downloaded_at DESC);
```

### Add to Hero Section:
```typescript
// In Hero.tsx, add below the intro text:
<div className="flex gap-4 justify-center">
  <CVDownload size="lg" />
  <Button variant="outline" size="lg">
    {t('hero.contact')}
  </Button>
</div>
```

---

## 🎯 Quick Win #3: Testimonials Section
**Time to Implement:** 3 hours | **Impact:** Very High

### Database Setup:
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  photo_url TEXT,
  testimonial_en TEXT NOT NULL,
  testimonial_ar TEXT,
  testimonial_fr TEXT,
  linkedin_url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample data
INSERT INTO testimonials (name, title, company, testimonial_en, is_featured, display_order) VALUES
('John Smith', 'Project Director', 'AECOM Middle East', 'Hassan demonstrated exceptional leadership on our $50M infrastructure project. His technical expertise in high-voltage systems and ability to coordinate multiple stakeholders was invaluable. He delivered the project on time and within budget.', true, 1),
('Ahmed Al-Mansoori', 'Senior Manager', 'EtihadWE', 'Working with Hassan on the 132kV transmission line project was a pleasure. His attention to detail and commitment to safety standards set him apart. He successfully managed complex technical challenges and maintained excellent client relationships.', true, 2),
('Dr. Sarah Williams', 'Lead Consultant', 'Mott MacDonald', 'Hassan is one of the most competent electrical engineers I have worked with. His knowledge of 400kV systems and project management skills are outstanding. He consistently delivers high-quality results under pressure.', true, 3);

-- RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active testimonials" ON testimonials
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin manage testimonials" ON testimonials
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true));
```

### Component: `src/components/Testimonials.tsx`
```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, Linkedin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  photo_url: string | null;
  testimonial_en: string;
  testimonial_ar: string | null;
  testimonial_fr: string | null;
  linkedin_url: string | null;
  rating: number;
  date: string;
}

export const Testimonials = () => {
  const { t, i18n } = useTranslation();

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Testimonial[];
    }
  });

  const getTestimonialText = (testimonial: Testimonial) => {
    const lang = i18n.language;
    if (lang === 'ar' && testimonial.testimonial_ar) return testimonial.testimonial_ar;
    if (lang === 'fr' && testimonial.testimonial_fr) return testimonial.testimonial_fr;
    return testimonial.testimonial_en;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-black/20 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('testimonials.title', 'What Others Say')}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t('testimonials.subtitle', 'Recommendations from colleagues and clients I have worked with')}
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass p-6 h-full hover:bg-white/10 transition-all duration-300 relative">
                    <Quote className="absolute top-4 right-4 h-12 w-12 text-purple-400/20" />

                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-purple-400">
                        <AvatarImage src={testimonial.photo_url || undefined} />
                        <AvatarFallback className="bg-purple-600 text-white font-bold">
                          {getInitials(testimonial.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-white/70 mb-1">
                          {testimonial.title}
                        </p>
                        <p className="text-sm text-purple-400">
                          {testimonial.company}
                        </p>
                      </div>

                      {testimonial.linkedin_url && (
                        <a
                          href={testimonial.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/50 hover:text-blue-400 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                    </div>

                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-white/80 text-sm leading-relaxed italic">
                      "{getTestimonialText(testimonial)}"
                    </p>

                    <p className="text-white/50 text-xs mt-4">
                      {new Date(testimonial.date).toLocaleDateString(i18n.language)}
                    </p>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};
```

### Add to Index.tsx:
```typescript
import { Testimonials } from "@/components/Testimonials";

// Add after Skills or Certifications:
<Certifications />
<Testimonials /> {/* NEW */}
<ProjectImages />
```

---

## 🎯 Quick Win #4: Enhanced Project Case Studies
**Time to Implement:** 4-6 hours | **Impact:** Critical

### Database Setup:
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ar TEXT,
  title_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  client TEXT,
  location TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  project_value TEXT,
  team_size INTEGER,
  role TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_ar TEXT,
  summary_fr TEXT,
  challenge_en TEXT,
  challenge_ar TEXT,
  challenge_fr TEXT,
  solution_en TEXT,
  solution_ar TEXT,
  solution_fr TEXT,
  results_en TEXT,
  results_ar TEXT,
  results_fr TEXT,
  technologies TEXT[], -- Array of technologies used
  featured_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project metrics
CREATE TABLE project_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  metric_label_en TEXT NOT NULL,
  metric_label_ar TEXT,
  metric_label_fr TEXT,
  display_order INTEGER DEFAULT 0
);

-- Sample project data
INSERT INTO projects (
  title_en,
  slug,
  client,
  location,
  start_date,
  end_date,
  project_value,
  team_size,
  role,
  summary_en,
  challenge_en,
  solution_en,
  results_en,
  technologies,
  is_featured
) VALUES (
  '400kV OHL Transmission Line Upgrade',
  '400kv-transmission-upgrade',
  'Abu Dhabi Transmission & Dispatch Company (TRANSCO)',
  'Abu Dhabi, UAE',
  '2024-11-01',
  NULL, -- Ongoing
  '$120M+',
  50,
  'Principal Resident Engineer',
  'Complete upgrade of 400kV overhead transmission line infrastructure including engineering, procurement, construction, testing, and commissioning of high-voltage systems.',
  'The project involved upgrading aging 400kV infrastructure while maintaining continuous power supply to critical areas. Coordination between multiple stakeholders and strict safety requirements added complexity.',
  'Implemented phased approach with detailed risk assessment. Coordinated closely with operations team for planned outages. Used advanced testing equipment for commissioning. Established robust safety protocols and training programs.',
  'Successfully commissioned first phase on schedule. Zero safety incidents recorded. Reduced transmission losses by 15%. Improved system reliability by 30%. Team received client commendation for safety excellence.',
  ARRAY['400kV Systems', 'OHL Design', 'FAT Testing', 'Project Management', 'Safety Management'],
  true
);

INSERT INTO project_metrics (project_id, metric_key, metric_value, metric_label_en, display_order) VALUES
((SELECT id FROM projects WHERE slug = '400kv-transmission-upgrade'), 'budget', 'On Budget', 'Budget Status', 1),
((SELECT id FROM projects WHERE slug = '400kv-transmission-upgrade'), 'timeline', 'On Schedule', 'Timeline', 2),
((SELECT id FROM projects WHERE slug = '400kv-transmission-upgrade'), 'safety', 'Zero Incidents', 'Safety Record', 3),
((SELECT id FROM projects WHERE slug = '400kv-transmission-upgrade'), 'efficiency', '15% Improvement', 'Efficiency Gain', 4);
```

### Component: `src/components/ProjectCard.tsx`
```typescript
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, DollarSign, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: {
    id: string;
    slug: string;
    title_en: string;
    location: string;
    summary_en: string;
    project_value: string;
    start_date: string;
    end_date: string | null;
    technologies: string[];
    featured_image: string | null;
  };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
    >
      <Card className="glass overflow-hidden hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
        {/* Featured Image */}
        <div className="relative h-48 overflow-hidden bg-black/20">
          {project.featured_image ? (
            <img
              src={project.featured_image}
              alt={project.title_en}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">
              <span className="text-6xl">⚡</span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge className="bg-purple-600/90 text-white">
              {project.end_date ? 'Completed' : 'Ongoing'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
            {project.title_en}
          </h3>

          <div className="space-y-2 mb-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{project.project_value}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(project.start_date).getFullYear()}
                {project.end_date ? ` - ${new Date(project.end_date).getFullYear()}` : ' - Present'}
              </span>
            </div>
          </div>

          <p className="text-white/80 text-sm mb-4 line-clamp-3 flex-1">
            {project.summary_en}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-white/5">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs bg-white/5">
                +{project.technologies.length - 3} more
              </Badge>
            )}
          </div>

          <Button
            onClick={() => navigate(`/projects/${project.slug}`)}
            className="w-full group"
            variant="outline"
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
```

---

## 🎯 Quick Win #5: SEO Optimization
**Time to Implement:** 2 hours | **Impact:** High (Long-term)

### Update `index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <!-- Primary Meta Tags -->
    <title>Hassan Adam - Senior Electrical Engineer | 400kV Transmission Expert | UAE</title>
    <meta name="title" content="Hassan Adam - Senior Electrical Engineer | 400kV Transmission Expert | UAE" />
    <meta name="description" content="Principal Resident Engineer with 27+ years experience in 400kV/132kV transmission lines, high voltage systems, and infrastructure projects across UAE, Qatar, and Kuwait. PMP certified project manager." />
    <meta name="keywords" content="electrical engineer UAE, senior electrical engineer, 400kV transmission, high voltage systems, project manager Dubai, principal resident engineer, PMP engineer, Hassan Adam, infrastructure projects" />
    <meta name="author" content="Hassan Adam" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yourdomain.com/" />
    <meta property="og:title" content="Hassan Adam - Senior Electrical Engineer | 400kV Transmission Expert" />
    <meta property="og:description" content="Principal Resident Engineer with 27+ years experience in high voltage systems and infrastructure projects across the Middle East." />
    <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://yourdomain.com/" />
    <meta property="twitter:title" content="Hassan Adam - Senior Electrical Engineer | 400kV Transmission Expert" />
    <meta property="twitter:description" content="Principal Resident Engineer with 27+ years experience in high voltage systems and infrastructure projects." />
    <meta property="twitter:image" content="https://yourdomain.com/og-image.jpg" />

    <!-- Schema.org markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Hassan Adam",
      "url": "https://yourdomain.com",
      "image": "https://yourdomain.com/profile-photo.jpg",
      "jobTitle": "Principal Resident Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "AtkinsRealis Consultant"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Mansoura University"
      },
      "knowsAbout": [
        "High Voltage Engineering",
        "400kV Transmission Lines",
        "Project Management",
        "Electrical Infrastructure",
        "Power Systems"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Abu Dhabi",
        "addressCountry": "UAE"
      }
    }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-02-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/projects</loc>
    <lastmod>2026-02-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/contact</loc>
    <lastmod>2026-02-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

### Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml

# Disallow admin area
Disallow: /admin
Disallow: /login
```

---

## 📋 Implementation Checklist

### Week 1
- [ ] Set up career statistics database table
- [ ] Create CareerStats component
- [ ] Add to Index page
- [ ] Prepare CV files (EN, AR, FR)
- [ ] Create CVDownload component
- [ ] Add download tracking
- [ ] Update Hero with CV download button
- [ ] SEO: Update meta tags in index.html
- [ ] SEO: Create sitemap.xml
- [ ] SEO: Create robots.txt

### Week 2
- [ ] Set up testimonials database table
- [ ] Insert sample testimonials (or request real ones)
- [ ] Create Testimonials component
- [ ] Add to Index page
- [ ] Set up projects database tables
- [ ] Create detailed project entries (at least 3)
- [ ] Create ProjectCard component
- [ ] Create project detail page route
- [ ] Test all new components
- [ ] Update admin panel to manage new data

---

## 🚀 Next Steps After Quick Wins

Once these are complete, move to:
1. Blog/Articles system
2. Awards & Achievements
3. Video introduction
4. Interactive skills matrix
5. Newsletter signup

---

## 📊 Success Metrics

Track after 2 weeks:
- CV download count by language
- Most viewed testimonials
- Project detail page views
- Average time on site (should increase)
- Bounce rate (should decrease)

---

**Note:** All SQL scripts assume you're using Supabase. Adjust as needed for your database setup.
