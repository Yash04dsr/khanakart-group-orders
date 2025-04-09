
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const AppHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-khanakart-primary" />
          <Link to="/" className="font-bold text-xl text-khanakart-primary">
            OCS Khanakart
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-muted-foreground">
                {user.name} {user.role === 'admin' && <span className="text-khanakart-primary">(Admin)</span>}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout} 
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
