import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in, checking admin status...");
        checkAdminStatus(session?.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string | undefined) => {
    if (!userId) return;

    const { data: isAdmin, error } = await supabase.rpc('is_admin', {
      user_id: userId
    });

    if (error) {
      console.error("Error checking admin status:", error);
      toast.error("Error checking admin status");
      return;
    }

    if (isAdmin) {
      console.log("User is admin, redirecting to admin dashboard");
      toast.success("Successfully signed in!");
      navigate("/admin");
    } else {
      console.log("User is not admin");
      toast.error("Unauthorized access");
      await supabase.auth.signOut();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
        />
      </div>
    </div>
  );
};

export default Login;