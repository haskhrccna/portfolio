import { Contact } from "@/components/Contact";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const ContactPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <main className="relative min-h-screen">
      <div className="fixed top-4 right-24 z-50">
        <Button 
          onClick={handleHomeClick}
          variant="outline"
          className="rounded-full border-gold/25 bg-navy/70 text-ivory hover:bg-white/10"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      <Contact />
    </main>
  );
};

export default ContactPage;
