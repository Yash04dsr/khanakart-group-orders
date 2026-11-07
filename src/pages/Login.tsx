
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("signup") === "1") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate name field
      if (!name.trim()) {
        throw new Error("Name is required");
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim()
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
      
      // Switch to login mode after successful signup
      setIsSignUp(false);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password";
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] bg-[#fffaf6] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-crowdplate-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-crowdplate-primary/25 blur-3xl" />
        <div>
          <p className="text-sm text-white/50">CrowdPlate</p>
          <h1 className="mt-6 max-w-lg text-5xl font-semibold leading-[1.05] tracking-tight">
            Everyone adds their plate. You place one order.
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-md leading-relaxed">
            Open a session, let everyone add their items, and place one order at the outlet.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <h1 className="font-display text-3xl text-crowdplate-dark">Welcome to CrowdPlate</h1>
          <p className="text-muted-foreground mt-2">Group ordering for campus outlets</p>
        </div>
        
        <Card className="rounded-2xl border-crowdplate-dark/10 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)]">
          <CardHeader>
            <CardTitle>{isSignUp ? "Create Account" : "Login"}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Enter your details to create a new account" 
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <CardContent className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@iitd.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-crowdplate-primary hover:bg-crowdplate-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    {isSignUp ? "Creating account..." : "Logging in..."}
                  </span>
                ) : (
                  isSignUp ? "Create Account" : "Log in"
                )}
              </Button>
              
              <p className="text-center text-sm">
                {isSignUp ? (
                  <span>
                    Already have an account?{" "}
                    <button 
                      type="button"
                      className="text-crowdplate-primary hover:underline"
                      onClick={() => setIsSignUp(false)}
                    >
                      Log in
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      className="text-crowdplate-primary hover:underline"
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign up
                    </button>
                  </span>
                )}
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Login;
