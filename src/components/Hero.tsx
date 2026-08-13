import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";

export const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handleGetInTouch = () => {
    navigate("/contact");
  };

  const handleAdminLogin = () => {
    navigate("/login");
  };

  const fade = (delay: number) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-[92vh] items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <div className="container-width relative">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
          <motion.div
            className="flex flex-col items-center lg:w-[38%]"
            {...fade(0.05)}
          >
            <div className="portrait-frame img-reveal">
              <Avatar className="relative z-10 h-40 w-40 border border-gold/30 shadow-2xl sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                <AvatarImage
                  src="/lovable-uploads/072d3a59-e643-48d6-bb4c-7f55c36fd5a0.png"
                  alt="Hassan Adam"
                  className="object-cover object-center"
                />
                <AvatarFallback>HA</AvatarFallback>
              </Avatar>
            </div>
            <div className="relative mt-6 overflow-hidden rounded-full border border-gold/25 bg-gold/10 px-4 py-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold-soft">
                {t("hero.status")}
              </span>
            </div>
          </motion.div>

          <div className="text-center lg:w-[62%] lg:text-left">
            <motion.p className="eyebrow mb-5" {...fade(0.12)}>
              {t("jobTitle")}
            </motion.p>
            <motion.h1
              className="font-display text-5xl leading-[0.95] text-ivory sm:text-6xl lg:text-7xl"
              {...fade(0.2)}
            >
              {t("name.fullName")}
            </motion.h1>
            <motion.div
              className="gold-rule mx-auto my-7 lg:mx-0"
              initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p
              className="max-w-2xl text-lg leading-relaxed text-stone sm:text-xl"
              {...fade(0.38)}
            >
              {t("bio")}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
              {...fade(0.48)}
            >
              <Button
                onClick={handleGetInTouch}
                className="rounded-full border border-gold/40 bg-gold px-7 text-ink hover:bg-gold-soft"
              >
                {t("getInTouch")}
              </Button>
              <Button
                onClick={handleAdminLogin}
                variant="outline"
                className="rounded-full border-white/15 bg-transparent text-ivory hover:border-gold/40 hover:bg-white/5"
              >
                {t("contact.adminLogin")}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
