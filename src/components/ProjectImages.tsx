import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";

// Fallback images if database is empty
const FALLBACK_IMAGES = [
  "/images/projects/cable-installation.jpg",
  "/images/projects/equipment-setup.jpg",
  "/images/projects/concrete-blocks.jpg",
  "/images/projects/control-panel.jpg",
  "/images/projects/11swg.jpg",
  "/images/projects/11tr.jpg",
  "/images/projects/33cable.jpg",
  "/images/projects/33swg.jpg",
  "/images/projects/33tr.jpg",
  "/images/projects/civil1.JPG",
  "/images/projects/jointing1.JPG",
  "/images/projects/jointing2.JPG",
  "/images/projects/pulling1.jpg",
  "/images/projects/pulling2.JPG",
  "/images/projects/termination1.JPG",
  "/images/projects/termination2.JPG",
  "/images/projects/testing1.JPG"
];

interface ProjectPhoto {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  display_order: number;
}

const ProjectImages = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);

  // Fetch photos from database
  const { data: dbPhotos } = useQuery({
    queryKey: ["public-project-photos"],
    queryFn: async () => {
      const { data, error} = await supabase
        .from('project_photos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error("Error fetching photos:", error);
        return null;
      }

      return data as ProjectPhoto[];
    }
  });

  // Use database photos if available, otherwise use fallback
  const images = dbPhotos && dbPhotos.length > 0
    ? dbPhotos.map(photo => ({
        url: photo.image_url,
        title: photo.title || `Project ${photo.display_order}`,
        description: photo.description
      }))
    : FALLBACK_IMAGES.map((url, index) => ({
        url,
        title: `Construction project phase ${index + 1}`,
        description: null
      }));

  const handleSlideChange = (api: any) => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap() + 1);
    setTotalSlides(api.scrollSnapList().length);
  };

  return (
    <section className="glass section-padding mb-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-8 animate-on-scroll">
          {t('projects.title')}
        </h2>
        <div className="animate-on-scroll">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full relative"
            onSelect={handleSlideChange}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {images.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="relative h-60 overflow-hidden rounded-lg group">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback for broken images
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {image.description && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm">{image.description}</p>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {index + 1} / {images.length}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="md:hidden flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20" />
            <CarouselNext className="md:hidden flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20" />
            <CarouselPrevious className="hidden md:flex bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20" />
            <CarouselNext className="hidden md:flex bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ProjectImages;