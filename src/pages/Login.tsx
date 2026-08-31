
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
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-[#F7F4EE]">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-khanakart-dark text-white">
        <div>
          <p className="text-sm uppercase tracking-wider text-khanakart-accent">OCS · IIT Delhi</p>
          <h1 className="mt-6 font-display text-5xl leading-tight">
            Collect the whole table in one session.
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-md">
            Admins open an order. Members add Rajdhani dishes before the deadline. Nobody hunts through chat for who wanted extra naan.
          </p>
        </div>
        <ul className="space-y-3 text-white/80">
          <li>Live group sessions with a cutoff time</li>
          <li>Individual plates, one combined kitchen order</li>
          <li>Built for campus teams, not food delivery apps</li>
        </ul>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden">
          <h1 className="font-display text-3xl text-khanakart-dark">Welcome to KhanaKart</h1>
          <p className="text-muted-foreground mt-2">Group food ordering for IIT Delhi</p>
        </div>
        
        <Card className="border-khanakart-dark/10 shadow-sm">
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
                className="w-full bg-khanakart-primary hover:bg-khanakart-primary/90"
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
                      className="text-khanakart-primary hover:underline" 
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
                      className="text-khanakart-primary hover:underline" 
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
