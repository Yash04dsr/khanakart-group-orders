
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangle, ArrowLeft, Clock, Plus, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createCustomItemId, getItemDisplayName } from "@/lib/orderItems";
import { getOrderSession, getUserOrder, saveUserOrder } from "@/services/orderService";
import { OrderItem } from "@/types";

type DraftItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

const emptyItem = (): DraftItem => ({
  id: crypto.randomUUID(),
  name: "",
  quantity: 1,
  price: 0,
});

const MemberOrderDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<DraftItem[]>([emptyItem()]);
  const [initialized, setInitialized] = useState(false);

  const { data: orderSession, isLoading: isSessionLoading } = useQuery({
    queryKey: ["orderSession", sessionId],
    queryFn: () => (sessionId ? getOrderSession(sessionId) : Promise.resolve(undefined)),
    enabled: Boolean(sessionId && user),
  });

  const { data: userOrder, isLoading: isOrderLoading } = useQuery({
    queryKey: ["userOrder", sessionId, user?.id],
    queryFn: () =>
      sessionId && user ? getUserOrder(sessionId, user.id) : Promise.resolve(undefined),
    enabled: Boolean(sessionId && user),
  });

  useEffect(() => {
    if (initialized || !userOrder) return;
    setItems(
      userOrder.items.length
        ? userOrder.items.map((item) => ({
            id: crypto.randomUUID(),
            name: getItemDisplayName(item.menuItemId),
            quantity: item.quantity,
            price: item.price,
          }))
        : [emptyItem()],
    );
    setInitialized(true);
  }, [initialized, userOrder]);

  const { mutate: saveOrder, isPending: isSaving } = useMutation({
    mutationFn: (orderItems: OrderItem[]) => {
      if (!sessionId || !user) throw new Error("Sign in to save an order");
      return saveUserOrder(sessionId, user.id, user.name, orderItems);
    },
    onSuccess: () => {
      toast({ title: "Order saved", description: "Your items are now part of the group order." });
      queryClient.invalidateQueries({ queryKey: ["userOrder", sessionId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["orderSession", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["orderSessions"] });
    },
    onError: () => {
      toast({
        title: "Could not save order",
        description: "Check the session deadline and try again.",
        variant: "destructive",
      });
    },
  });

  const updateItem = (id: string, patch: Partial<DraftItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id);
      return next.length ? next : [emptyItem()];
    });
  };

  const handleSave = () => {
    const validItems = items.filter((item) => item.name.trim() && item.quantity > 0);
    if (!validItems.length) {
      toast({
        title: "Add at least one item",
        description: "Enter the item you want from this outlet.",
        variant: "destructive",
      });
      return;
    }

    saveOrder(
      validItems.map((item) => ({
        menuItemId: createCustomItemId(item.name),
        quantity: item.quantity,
        price: item.price,
      })),
    );
  };

  if (isSessionLoading || isOrderLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!orderSession) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-semibold">Order session not found</h2>
        <Button className="mt-4" onClick={() => navigate("/member")}>Back to dashboard</Button>
      </div>
    );
  }

  const isOpen = orderSession.isActive && new Date(orderSession.deadline) > new Date();
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="container max-w-5xl py-10">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/member")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Button>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-crowdplate-primary">Add your items</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{orderSession.title}</h1>
          <p className="mt-2 flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            Add items by {format(new Date(orderSession.deadline), "MMM d, h:mm a")}
          </p>
        </div>
        <Badge variant={isOpen ? "default" : "outline"}>{isOpen ? "Collecting orders" : "Closed"}</Badge>
      </div>

      {!isOpen && (
        <div className="mb-6 flex items-center rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mr-2 h-4 w-4" />
          The cutoff has passed. This order can no longer be changed.
        </div>
      )}

      <Card className="max-w-3xl rounded-2xl border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle>Your plate</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add exactly what you want from the outlet. Price is optional if you do not know it yet.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 sm:grid-cols-[1fr_100px_130px_40px]">
              <div>
                <label className="text-xs font-medium text-muted-foreground" htmlFor={`name-${item.id}`}>Item</label>
                <Input
                  id={`name-${item.id}`}
                  className="mt-1"
                  placeholder={index === 0 ? "e.g. Veg burger" : "Another item"}
                  value={item.name}
                  disabled={!isOpen}
                  onChange={(event) => updateItem(item.id, { name: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground" htmlFor={`quantity-${item.id}`}>Qty</label>
                <Input
                  id={`quantity-${item.id}`}
                  className="mt-1"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={item.quantity}
                  disabled={!isOpen}
                  onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground" htmlFor={`price-${item.id}`}>Price each</label>
                <Input
                  id={`price-${item.id}`}
                  className="mt-1"
                  type="number"
                  min="0"
                  step="1"
                  value={item.price}
                  disabled={!isOpen}
                  onChange={(event) => updateItem(item.id, { price: Number(event.target.value) })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-end"
                disabled={!isOpen}
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" disabled={!isOpen} onClick={() => setItems((current) => [...current, emptyItem()])}>
            <Plus className="mr-2 h-4 w-4" />
            Add another item
          </Button>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-6">
          <div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
            <p className="text-xl font-semibold">₹{total.toFixed(2)}</p>
          </div>
          <Button className="rounded-lg" disabled={!isOpen || isSaving} onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving…" : "Save my order"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MemberOrderDetail;
