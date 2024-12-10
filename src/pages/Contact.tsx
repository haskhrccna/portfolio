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
    <main className="bg-[#0B1221]">
      <div className="fixed top-4 right-24 z-50">
        <Button 
          onClick={handleHomeClick}
          variant="outline"
          className="bg-[#131B2E] text-white border-gray-700 hover:bg-[#1C2537] transition-all"
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