import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const onLanding = location.pathname === "/";
  const onLogin = location.pathname === "/login";
  const marketingChrome = onLanding || onLogin;

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
        marketingChrome ? "bg-white/90 border-neutral-200" : "bg-background/95"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight text-lg">
          KhanaKart
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {onLanding && (
                <Button asChild className="bg-neutral-900 hover:bg-neutral-800 rounded-md">
                  <Link to={user.role === "admin" ? "/admin" : "/member"}>Dashboard</Link>
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-neutral-900 text-white">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="text-sm hidden sm:inline">
                  {user.name}{" "}
                  {user.role === "admin" && <span className="text-neutral-500">(Admin)</span>}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              {onLanding && (
                <nav className="hidden sm:flex items-center gap-6 text-sm text-neutral-600 mr-2">
                  <a href="#product" className="hover:text-neutral-900">
                    Product
                  </a>
                </nav>
              )}
              {!onLogin && (
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link to="/login">Log in</Link>
                </Button>
              )}
              <Button asChild className="bg-neutral-900 hover:bg-neutral-800 rounded-md">
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
