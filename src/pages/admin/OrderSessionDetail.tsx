
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  getOrderSession, 
  getCompiledOrder, 
  toggleOrderSessionStatus 
} from "@/services/orderService";
import { ArrowLeft, UserCircle, ClipboardList, AlertTriangle, CheckCircle, Ban } from "lucide-react";
import { format } from "date-fns";
import { MENU_ITEMS } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const OrderSessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch order session details
  const { 
    data: orderSession, 
    isLoading: isSessionLoading 
  } = useQuery({
    queryKey: ['orderSession', sessionId],
    queryFn: () => sessionId ? getOrderSession(sessionId) : Promise.resolve(undefined),
    enabled: !!sessionId,
  });

  // Fetch compiled order
  const { 
    data: compiledOrder = [],
    isLoading: isCompiledLoading
  } = useQuery({
    queryKey: ['compiledOrder', sessionId],
    queryFn: () => sessionId ? getCompiledOrder(sessionId) : Promise.resolve([]),
    enabled: !!sessionId,
  });

  // Toggle session status mutation
  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: () => {
      if (!sessionId) throw new Error('Session ID is required');
      return toggleOrderSessionStatus(sessionId);
    },
    onSuccess: (updatedSession) => {
      if (updatedSession) {
        toast({
          title: `Order ${updatedSession.isActive ? 'Reopened' : 'Finalized'}`,
          description: updatedSession.isActive 
            ? "Team members can now place orders again" 
            : "The order has been finalized",
        });
        
        // Invalidate queries to refetch latest data
        queryClient.invalidateQueries({ queryKey: ['orderSession', sessionId] });
        queryClient.invalidateQueries({ queryKey: ['compiledOrder', sessionId] });
        queryClient.invalidateQueries({ queryKey: ['orderSessions'] });
      }
    },
    onError: (error) => {
      console.error("Error updating session status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  // Set up Supabase realtime subscription
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`order-session-${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_sessions', filter: `id=eq.${sessionId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orderSession', sessionId] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orderSession', sessionId] });
          queryClient.invalidateQueries({ queryKey: ['compiledOrder', sessionId] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orderSession', sessionId] });
          queryClient.invalidateQueries({ queryKey: ['compiledOrder', sessionId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, queryClient]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy - h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Get item details by ID
  const getItemById = (itemId: string) => {
    return MENU_ITEMS.find(item => item.id === itemId);
  };

  // Calculate total price for an order
  const calculateOrderTotal = (items: {menuItemId: string; quantity: number; price: number}[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  // Calculate grand total for compiled order
  const calculateGrandTotal = () => {
    return compiledOrder.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const isLoading = isSessionLoading || isCompiledLoading;

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderSession) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order session not found</h2>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

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
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{orderSession.title}</h1>
          <p className="text-muted-foreground mt-1">Created: {formatDate(orderSession.createdAt)}</p>
          <p className="text-muted-foreground">Deadline: {formatDate(orderSession.deadline)}</p>
          <div className="mt-2">
            {orderSession.isActive ? (
              <Badge className="bg-green-500">Active</Badge>
            ) : (
              <Badge variant="outline">Finalized</Badge>
            )}
          </div>
        </div>
        
        <Button 
          variant={orderSession.isActive ? "destructive" : "default"}
          onClick={() => toggleStatus()}
          disabled={isToggling}
        >
          {isToggling ? (
            <span className="flex items-center">
              <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Processing...
            </span>
          ) : orderSession.isActive ? (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Finalize Order
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Reopen Order
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="compiled" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="compiled">
            <ClipboardList className="h-4 w-4 mr-2" />
            Compiled Order
          </TabsTrigger>
          <TabsTrigger value="individual">
            <UserCircle className="h-4 w-4 mr-2" />
            Individual Orders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compiled">
          <Card>
            <CardHeader>
              <CardTitle>
                Compiled Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {compiledOrder.length === 0 ? (
                <div className="text-center py-8 flex flex-col items-center text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mb-4 text-khanakart-primary" />
                  <p>No items have been ordered yet.</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableCaption>Total order for {orderSession.title}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compiledOrder.map((item, index) => {
                        const menuItem = MENU_ITEMS.find(mi => mi.name === item.item);
                        const itemPrice = parseFloat(item.price.toString());
                        const itemQuantity = parseFloat(item.quantity.toString());
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.item}</TableCell>
                            <TableCell>
                              {menuItem?.category.replace('_', ' ')}
                            </TableCell>
                            <TableCell className="text-right">₹{itemPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{itemQuantity}</TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{(itemQuantity * itemPrice).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-medium">
                          Grand Total
                        </TableCell>
                        <TableCell className="text-right font-bold text-khanakart-primary">
                          ₹{calculateGrandTotal().toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" className="mr-4">
                      Export as CSV
                    </Button>
                    <Button>
                      Print Order
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="individual">
          <div className="grid gap-6">
            {!orderSession.orders || orderSession.orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 flex flex-col items-center text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mb-4 text-khanakart-primary" />
                  <p>No orders have been placed yet.</p>
                </CardContent>
              </Card>
            ) : (
              orderSession.orders.map((order) => (
                <Card key={order.userId}>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {order.userName}'s Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item, index) => {
                          const menuItem = getItemById(item.menuItemId);
                          const itemQuantity = parseFloat(item.quantity.toString());
                          const itemPrice = parseFloat(item.price.toString());
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                {menuItem?.name || "Unknown Item"}
                              </TableCell>
                              <TableCell className="text-right">
                                {itemQuantity}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{itemPrice.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ₹{(itemQuantity * itemPrice).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ₹{calculateOrderTotal(order.items).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderSessionDetail;
