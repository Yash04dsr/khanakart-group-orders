
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only navigate when auth state is determined (not during loading)
    if (!isLoading) {
      if (user) {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/member');
        }
      } else {
        navigate('/login');
      }
    }
  }, [user, navigate, isLoading]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khanakart-primary"></div>
    </div>
  );
};

export default Index;
