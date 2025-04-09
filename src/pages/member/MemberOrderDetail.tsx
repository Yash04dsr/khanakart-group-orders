import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ItemCard from "@/components/ItemCard";
import { ArrowLeft, Clock, Save, ShoppingCart, AlertTriangle } from "lucide-react";
import { 
  getOrderSession,
  getUserOrder,
  saveUserOrder
} from "@/services/orderService";
import { MENU_ITEMS } from "@/services/mockData";
import { OrderItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Helper function to group menu items by category
const groupItemsByCategory = () => {
  return MENU_ITEMS.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof MENU_ITEMS>);
};

// Mapping for category display names
const categoryDisplayNames: Record<string, string> = {
  appetizers: "Appetizers",
  main_course: "Main Course",
  bread: "Bread",
  beverages: "Beverages & Desserts"
};

const MemberOrderDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Group menu items by category
  const itemsByCategory = groupItemsByCategory();
  
  // Fetch order session with React Query
  const { 
    data: orderSession,
    isLoading: isSessionLoading
  } = useQuery({
    queryKey: ['orderSession', sessionId],
    queryFn: () => sessionId ? getOrderSession(sessionId) : Promise.resolve(undefined),
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: !!sessionId && !!user,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch order session",
          variant: "destructive"
        });
        navigate('/member');
      }
    }
  });
  
  // Fetch user's existing order
  const {
    data: userOrder,
    isLoading: isOrderLoading
  } = useQuery({
    queryKey: ['userOrder', sessionId, user?.id],
    queryFn: () => {
      if (!sessionId || !user) return Promise.resolve(undefined);
      return getUserOrder(sessionId, user.id);
    },
    enabled: !!sessionId && !!user,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          // Initialize quantities state from user order
          const initialQuantities: Record<string, number> = {};
          data.items.forEach((item: OrderItem) => {
            initialQuantities[item.menuItemId] = item.quantity;
          });
          setQuantities(initialQuantities);
        }
      }
    }
  });
  
  // Save order mutation
  const { mutate: saveOrder, isPending: isSaving } = useMutation({
    mutationFn: (items: OrderItem[]) => {
      if (!sessionId || !user || !orderSession || !orderSession.isActive) {
        return Promise.reject("Cannot save order");
      }
      return saveUserOrder(sessionId, user.id, user.name, items);
    },
    onSuccess: () => {
      toast({
        title: "Order saved",
        description: "Your order has been saved successfully",
      });
      
      // Invalidate queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: ['userOrder', sessionId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['orderSession', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['orderSessions'] });
    },
    onError: () => {
      toast({
        title: "Failed to save order",
        description: "An error occurred while saving your order",
        variant: "destructive",
      });
    }
  });

  const updateQuantity = (itemId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const handleSaveOrder = () => {
    // Convert quantities to order items
    const orderItems: OrderItem[] = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const menuItem = MENU_ITEMS.find(item => item.id === itemId);
        return {
          menuItemId: itemId,
          quantity,
          price: menuItem?.price || 0
        };
      });
    
    // Save the order
    saveOrder(orderItems);
  };

  // Calculate total order amount
  const calculateTotal = () => {
    return Object.entries(quantities).reduce((total, [itemId, quantity]) => {
      if (quantity <= 0) return total;
      const menuItem = MENU_ITEMS.find(item => item.id === itemId);
      return total + (menuItem?.price || 0) * quantity;
    }, 0);
  };

  // Count items in cart
  const itemCount = Object.values(quantities).filter(q => q > 0).length;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy - h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const isLoading = isSessionLoading || isOrderLoading;

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
          <Button onClick={() => navigate('/member')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button 
        variant="outline" 
        className="mb-8" 
        onClick={() => navigate('/member')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{orderSession.title}</h1>
        <div className="flex items-center mt-2">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            Deadline: {formatDate(orderSession.deadline)}
          </p>
        </div>
        <div className="mt-2">
          {orderSession.isActive ? (
            <Badge className="bg-green-500">Active</Badge>
          ) : (
            <Badge variant="outline">Closed</Badge>
          )}
        </div>
      </div>
      
      {!orderSession.isActive && (
        <Card className="mb-8 border-amber-500">
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p>This order session has been finalized and cannot be modified.</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="appetizers" className="w-full">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              {Object.keys(itemsByCategory).map(category => (
                <TabsTrigger key={category} value={category}>
                  {categoryDisplayNames[category]}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {items.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      quantity={quantities[item.id] || 0}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Your Order
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {itemCount === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Your cart is empty</p>
                  <p className="text-sm mt-2">Add items to place your order</p>
                </div>
              ) : (
                <div>
                  {Object.entries(quantities)
                    .filter(([_, quantity]) => quantity > 0)
                    .map(([itemId, quantity]) => {
                      const item = MENU_ITEMS.find(i => i.id === itemId);
                      if (!item) return null;
                      
                      return (
                        <div key={itemId} className="flex justify-between py-2">
                          <div>
                            <p>{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {quantity} × ₹{item.price}
                            </p>
                          </div>
                          <p className="font-medium">
                            ₹{(quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between py-2">
                    <p className="font-semibold">Total</p>
                    <p className="font-bold text-lg text-khanakart-primary">
                      ₹{calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full"
                disabled={!orderSession.isActive || isSaving}
                onClick={handleSaveOrder}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Order
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberOrderDetail;
