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
    <main className="bg-[#1F5199]">
      <div className="fixed top-4 right-24 z-50">
        <Button 
          onClick={handleHomeClick}
          variant="outline"
          className="bg-[#163C73] text-white border-gray-700 hover:bg-[#0D2B59] transition-all"
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