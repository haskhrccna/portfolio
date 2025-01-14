import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in, checking admin status...");
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    console.log("Checking admin status for user:", userId);
    
    const { data: isAdmin, error } = await supabase.rpc('is_admin', {
      user_id: userId
    });

    console.log("Admin check result:", { isAdmin, error });

    if (error) {
      console.error("Error checking admin status:", error);
      toast.error("Error checking admin status");
      await supabase.auth.signOut();
      return;
    }

    if (isAdmin) {
      console.log("User is admin, redirecting to admin dashboard");
      toast.success("Welcome back, admin!");
      navigate("/admin");
    } else {
      console.log("User is not admin");
      toast.error("Unauthorized access");
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 text-white hover:bg-white/10"
        onClick={handleHomeClick}
      >
        <Home className="h-6 w-6" />
      </Button>
      <div className="w-full max-w-md p-8 glass rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Admin Login</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#7c3aed',
                  brandAccent: '#6d28d9',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/admin`}
          view="sign_in"
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                password_label: "Password",
                email_label: "Email",
                button_label: "Sign In",
                loading_button_label: "Signing in ...",
                password_input_placeholder: "Your password",
                email_input_placeholder: "Your email"
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;