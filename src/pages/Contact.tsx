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
    <main className="min-h-screen">
      <div className="fixed top-4 right-24 z-50">
        <Button 
          onClick={handleHomeClick}
          variant="outline"
          className="glass hover:bg-white/20 transition-all"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      <div className="container mx-auto">
        <Contact />
      </div>
    </main>
  );
};

export default ContactPage;