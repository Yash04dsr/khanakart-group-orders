
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("regular");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
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

  const fillAdminCredentials = () => {
    setEmail("admin@ocskhanakart.com");
    setPassword("password123");
  };

  const fillMemberCredentials = (memberNum: number) => {
    setEmail(`member${memberNum}@iitd.ac.in`);
    setPassword("password123");
  };

  // Added a quick login function for the button in Quick Login tab
  const handleQuickLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please select credentials first",
        variant: "destructive",
      });
      return;
    }
    
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
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-khanakart-primary">OCS Khanakart</h1>
          <p className="text-muted-foreground mt-2">Group Food Ordering for IIT Delhi</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="regular">Login / Sign Up</TabsTrigger>
            <TabsTrigger value="quickLogin">Quick Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular">
            <Card>
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
          </TabsContent>
          
          <TabsContent value="quickLogin">
            <Card>
              <CardHeader>
                <CardTitle>Quick Login</CardTitle>
                <CardDescription>Select an account type to log in quickly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-khanakart-primary flex items-center">
                    <span className="bg-khanakart-primary text-white text-xs rounded px-2 py-1 mr-2">Admin</span>
                    Admin Account
                  </h3>
                  <div className="text-sm space-y-1 mb-3">
                    <p><strong>Email:</strong> admin@ocskhanakart.com</p>
                    <p><strong>Password:</strong> password123</p>
                  </div>
                  <Button 
                    onClick={fillAdminCredentials}
                    className="w-full"
                    size="sm"
                  >
                    Use Admin Credentials
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="bg-gray-500 text-white text-xs rounded px-2 py-1 mr-2">Member</span>
                      Member 1
                    </h3>
                    <div className="text-xs space-y-1 mb-3">
                      <p><strong>Email:</strong> member1@iitd.ac.in</p>
                      <p><strong>Password:</strong> password123</p>
                    </div>
                    <Button 
                      onClick={() => fillMemberCredentials(1)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Use Member 1
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="bg-gray-500 text-white text-xs rounded px-2 py-1 mr-2">Member</span>
                      Member 2
                    </h3>
                    <div className="text-xs space-y-1 mb-3">
                      <p><strong>Email:</strong> member2@iitd.ac.in</p>
                      <p><strong>Password:</strong> password123</p>
                    </div>
                    <Button 
                      onClick={() => fillMemberCredentials(2)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      Use Member 2
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleQuickLogin}
                  className="w-full bg-khanakart-primary hover:bg-khanakart-primary/90"
                  disabled={isSubmitting || !email || !password}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Logging in...
                    </span>
                  ) : (
                    "Log in with selected account"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
