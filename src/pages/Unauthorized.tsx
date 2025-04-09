
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-khanakart-primary mb-4">Access Denied</h1>
        <p className="text-xl text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link to="/">Go Home</Link>
          </Button>
          <Button onClick={logout}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
