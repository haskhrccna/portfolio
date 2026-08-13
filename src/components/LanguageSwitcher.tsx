import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
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

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-24"
      }`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="min-w-[3rem] rounded-full border-gold/25 bg-navy/70 font-mono text-xs text-ivory hover:bg-white/10"
          >
            En/ع
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-gold/20 bg-navy text-ivory">
          <DropdownMenuItem onClick={() => changeLanguage("en")}>
            English (EN)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("ar")}>
            العربية (AR)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage("fr")}>
            Français (FR)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
