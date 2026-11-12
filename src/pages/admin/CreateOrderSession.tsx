
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrderSession } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/lib/brand";

const CreateOrderSession = () => {
  const [outlet, setOutlet] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!outlet.trim() || !deadline) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate that deadline is in the future
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    if (deadlineDate <= now) {
      toast({
        title: "Invalid deadline",
        description: "Deadline must be in the future",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("You must be logged in to create an order session");
      }
      
      // Verify organizer privileges
      if (user.role !== "admin") {
        throw new Error("Only organizers can start order sessions");
      }

      // Format the deadline date as ISO string
      const deadlineISO = deadlineDate.toISOString();
      
      // Create the session
      const sessionTitle = title.trim()
        ? `${outlet.trim()} · ${title.trim()}`
        : outlet.trim();
      const newSession = await createOrderSession(sessionTitle, deadlineISO);
      
      toast({
        title: "Session is live",
        description: "People can now add their items before the cutoff.",
      });
      
      // Update Supabase realtime for other users
      const channel = supabase.channel('admin-dashboard');
      channel.send({
        type: 'broadcast',
        event: 'session-created',
        payload: { session: newSession },
      });
      
      navigate(`/admin/order/${newSession.id}`);
    } catch (error) {
      console.error("Create session error:", error);
      
      // Check for specific database permission error
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      let description = errorMessage;
      
      if (errorMessage.includes("permission denied") || errorMessage.toLowerCase().includes("permission")) {
        description = "Database permission error. Please make sure you're signed in with organizer access.";
      }
      
      toast({
        title: "Failed to create order session",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <Button 
        variant="outline" 
        className="mb-8 rounded-lg"
        onClick={() => navigate('/admin')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="mb-8 max-w-xl">
        <p className="text-sm font-medium text-crowdplate-primary">New session</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Where is the group ordering from?</h1>
        <p className="mt-2 text-muted-foreground">Set the outlet and cutoff. Everyone will add their own items.</p>
      </div>

      <Card className="max-w-xl rounded-2xl border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Session details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="outlet" className="text-sm font-medium">Outlet</label>
              <Input
                id="outlet"
                placeholder="e.g. Hostel night canteen"
                value={outlet}
                onChange={(e) => setOutlet(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {BRAND.name} works with any campus canteen, cafe, stall, or shop.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Order name <span className="text-muted-foreground">(optional)</span></label>
              <Input
                id="title"
                placeholder="e.g. Friday dinner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Cutoff time
              </label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                People can add or update items until this time.
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Starting…
                </span>
              ) : (
                "Start session"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateOrderSession;
