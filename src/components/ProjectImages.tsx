import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";

const IMAGES = [
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

const ProjectImages = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(IMAGES.length);

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
              {IMAGES.map((src, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="relative h-60 overflow-hidden rounded-lg group">
                    <img
                      src={src}
                      alt={`Construction project phase ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 right-2 bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {index + 1} / {IMAGES.length}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20" />
            <CarouselNext className="hidden md:flex bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ProjectImages;