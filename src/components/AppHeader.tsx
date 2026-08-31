import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const onLanding = location.pathname === "/";
  const onLogin = location.pathname === "/login";

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur ${
        onLanding || !user
          ? "bg-[#F7F4EE]/90 border-khanakart-dark/10"
          : "bg-background/95"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-khanakart-primary" />
          <Link to="/" className="font-display font-semibold text-xl text-khanakart-primary">
            KhanaKart
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {onLanding && (
                <Button asChild className="bg-khanakart-primary hover:bg-khanakart-primary/90 rounded-full">
                  <Link to={user.role === "admin" ? "/admin" : "/member"}>Dashboard</Link>
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-khanakart-primary text-white">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="text-sm hidden sm:inline">
                  {user.name}{" "}
                  {user.role === "admin" && (
                    <span className="text-khanakart-primary">(Admin)</span>
                  )}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              {onLanding && (
                <nav className="hidden sm:flex items-center gap-6 text-sm text-khanakart-dark/70 mr-2">
                  <a href="#how-it-works" className="hover:text-khanakart-dark">
                    How it works
                  </a>
                  <a href="#features" className="hover:text-khanakart-dark">
                    Why KhanaKart
                  </a>
                </nav>
              )}
              {!onLogin && (
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link to="/login">Log in</Link>
                </Button>
              )}
              <Button asChild className="bg-khanakart-primary hover:bg-khanakart-primary/90 rounded-full">
                <Link to="/login?signup=1">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
