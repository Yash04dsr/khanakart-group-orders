
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

const CreateOrderSession = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !deadline) {
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
      
      // Verify admin privileges
      if (user.role !== "admin") {
        throw new Error("Only admins can create order sessions");
      }

      // Format the deadline date as ISO string
      const deadlineISO = deadlineDate.toISOString();
      
      // Create the session
      const newSession = await createOrderSession(title, deadlineISO);
      
      toast({
        title: "Order session created",
        description: "New order session has been created successfully",
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
        description = "Database permission error. Please make sure you're properly authenticated as an admin and have the necessary permissions.";
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
    <div className="container py-8">
      <Button 
        variant="outline" 
        className="mb-8" 
        onClick={() => navigate('/admin')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Order Session</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Session Title</label>
              <Input
                id="title"
                placeholder="e.g., Lunch Order - April 10th"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Order Deadline
              </label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Orders can be placed until this time
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Creating...
                </span>
              ) : (
                "Create Order Session"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateOrderSession;
