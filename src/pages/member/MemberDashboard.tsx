
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { getOrderSessionsForUser } from "@/services/orderService";
import { OrderSession } from "@/types";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const MemberDashboard = () => {
  const { user } = useAuth();
  
  // Using React Query to fetch order sessions
  const { data: orderSessions, isLoading, refetch } = useQuery({
    queryKey: ['orderSessions'],
    queryFn: () => user ? getOrderSessionsForUser(user.id) : Promise.resolve([]),
    enabled: Boolean(user),
    select: (sessions) => {
      // Show active sessions first
      return [...sessions].sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Set up Supabase realtime subscription
  useEffect(() => {
    // Subscribe to changes on order_sessions table
    const channel = supabase
      .channel('member-dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_sessions' },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_orders' },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Helper function to check if the user has placed an order
  const hasUserPlacedOrder = (session: OrderSession) => {
    return user && session.orders && session.orders.some(order => order.userId === user.id);
  };

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-crowdplate-primary">CrowdPlate</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your group orders</h1>
        <p className="text-muted-foreground mt-2">
          Add your items to an open session before its cutoff.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !orderSessions || orderSessions.length === 0 ? (
        <Card className="rounded-2xl border-dashed shadow-none">
          <CardContent className="text-center py-12 text-muted-foreground">
            <p>No group-order sessions are open right now.</p>
            <p>When an organizer starts one, it will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orderSessions.map((session) => (
            <Card
              key={session.id}
              className={`rounded-2xl border-neutral-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                !session.isActive ? "opacity-70" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{session.title}</CardTitle>
                  <CardDescription>
                    <div className="mt-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Created: {formatDate(session.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Cutoff: {formatDate(session.deadline)}</span>
                    </div>
                  </CardDescription>
                </div>
                <div>
                  {session.isActive ? (
                    <Badge className="bg-green-500 mb-2">Collecting</Badge>
                  ) : (
                    <Badge variant="outline">Closed</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  {hasUserPlacedOrder(session) && (
                    <Badge variant="secondary" className="mr-2">
                      Your items are in
                    </Badge>
                  )}
                </div>
                <Button 
                  asChild 
                  variant={session.isActive ? "default" : "outline"} 
                >
                  <Link to={`/member/order/${session.id}`}>
                    {session.isActive ? 
                      (hasUserPlacedOrder(session) ? "Update items" : "Add items")
                      : "View items"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
