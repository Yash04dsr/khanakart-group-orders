
import { useState, useEffect } from "react";
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
import { OrderSession } from "@/types";
import { ArrowLeft, UserCircle, ClipboardList, AlertTriangle, CheckCircle, Ban } from "lucide-react";
import { format } from "date-fns";
import { MENU_ITEMS } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";

const OrderSessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orderSession, setOrderSession] = useState<OrderSession | null>(null);
  const [compiledOrder, setCompiledOrder] = useState<Array<{item: string; quantity: number; price: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) return;
      
      try {
        const session = await getOrderSession(sessionId);
        if (!session) {
          navigate('/admin');
          return;
        }
        
        setOrderSession(session);
        
        const compiled = await getCompiledOrder(sessionId);
        setCompiledOrder(compiled);
      } catch (error) {
        console.error("Failed to fetch order session details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [sessionId, navigate]);

  const handleToggleStatus = async () => {
    if (!orderSession || isToggling) return;
    
    setIsToggling(true);
    
    try {
      const updated = await toggleOrderSessionStatus(orderSession.id);
      if (updated) {
        setOrderSession(updated);
        
        toast({
          title: `Order ${updated.isActive ? 'Reopened' : 'Finalized'}`,
          description: updated.isActive 
            ? "Team members can now place orders again" 
            : "The order has been finalized",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

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
          onClick={handleToggleStatus}
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
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.item}</TableCell>
                            <TableCell>
                              {menuItem?.category.replace('_', ' ')}
                            </TableCell>
                            <TableCell className="text-right">₹{item.price}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{(item.quantity * item.price).toFixed(2)}
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
            {orderSession.orders.length === 0 ? (
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
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                {menuItem?.name || "Unknown Item"}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{item.price}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ₹{(item.quantity * item.price).toFixed(2)}
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
