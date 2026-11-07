
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Calendar, Clock } from "lucide-react";
import { getOrderSessions } from "@/services/orderService";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  // Using React Query to fetch order sessions
  const { data: orderSessions, isLoading, refetch } = useQuery({
    queryKey: ['orderSessions'],
    queryFn: getOrderSessions,
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
      .channel('admin-dashboard-changes')
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-crowdplate-primary">Organizer workspace</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Group orders</h1>
          <p className="mt-2 text-muted-foreground">Start a session, collect everyone’s items, and place one order.</p>
        </div>
        <Button asChild className="rounded-lg shadow-sm">
          <Link to="/admin/create-order">
            <PlusCircle className="mr-2 h-4 w-4" />
            Start a session
          </Link>
        </Button>
      </div>
      
      <Card className="mb-8 overflow-hidden rounded-2xl border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle>Sessions you organize</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !orderSessions || orderSessions.length === 0 ? (
            <div className="rounded-xl border border-dashed py-14 text-center text-muted-foreground">
              No sessions yet. Start one for any outlet your group uses.
            </div>
          ) : (
            <Table>
              <TableCaption>Your active and past group-order sessions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Outlet and order</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderSessions.map((session) => (
                  <TableRow key={session.id} className="hover:bg-orange-50/40">
                    <TableCell className="font-medium">
                      {session.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {formatDate(session.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {formatDate(session.deadline)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.isActive ? (
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Closed</Badge>
                      )}
                    </TableCell>
                    <TableCell>{session.orderCount || 0} orders</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/admin/order/${session.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
