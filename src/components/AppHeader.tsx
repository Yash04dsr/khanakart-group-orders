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
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl ${
        marketingChrome ? "bg-white/85 border-neutral-200/80" : "bg-white/90 border-neutral-200/80"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-lg">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 shadow-sm">
            <span className="absolute top-2 h-1.5 w-1.5 rounded-full bg-crowdplate-accent" />
            <span className="absolute bottom-2 h-2.5 w-4 rounded-b-full bg-crowdplate-primary" />
          </span>
          <span>CrowdPlate</span>
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
                  {user.role === "admin" && <span className="text-neutral-500">(Organizer)</span>}
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
              {!onLogin && (
                <Button asChild className="bg-neutral-900 hover:bg-neutral-800 rounded-md">
                  <Link to="/login?signup=1">Get started</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
