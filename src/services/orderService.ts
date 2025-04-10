import { OrderItem, OrderSession, UserOrder } from '../types';
import { MENU_ITEMS } from './mockData';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Helper function for error handling
const handleError = (error: any, errorMessage: string) => {
  console.error(errorMessage, error);
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive"
  });
  return undefined;
};

// Get all order sessions
export const getOrderSessions = async (): Promise<OrderSession[]> => {
  try {
    const { data, error } = await supabase
      .from('order_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform from database format to application format
    return data.map(session => ({
      id: session.id,
      title: session.title,
      createdAt: session.created_at,
      deadline: session.deadline,
      isActive: session.is_active,
      orders: [] // Will be populated when needed for specific session
    }));
  } catch (error) {
    return handleError(error, "Failed to fetch order sessions") || [];
  }
};

// Get a specific order session with orders
export const getOrderSession = async (sessionId: string): Promise<OrderSession | undefined> => {
  try {
    // Get the session details
    const { data: sessionData, error: sessionError } = await supabase
      .from('order_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    // Get all orders for this session
    const { data: ordersData, error: ordersError } = await supabase
      .from('user_orders')
      .select('id, user_id, user_name, created_at, updated_at')
      .eq('session_id', sessionId);

    if (ordersError) throw ordersError;

    // Get all order items for all orders in this session
    const orderIds = ordersData.map(order => order.id);
    
    let orderItems: any[] = [];
    if (orderIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;
      orderItems = itemsData || [];
    }

    // Transform and combine the data
    const userOrders: UserOrder[] = ordersData.map(order => {
      const items = orderItems
        .filter(item => item.order_id === order.id)
        .map(item => ({
          menuItemId: item.menu_item_id,
          quantity: item.quantity,
          price: item.price
        }));

      return {
        userId: order.user_id,
        userName: order.user_name,
        items
      };
    });

    // Create the final OrderSession object
    if (!sessionData) {
      throw new Error("Session not found");
    }
    
    const orderSession: OrderSession = {
      id: sessionData.id,
      title: sessionData.title,
      createdAt: sessionData.created_at,
      deadline: sessionData.deadline,
      isActive: sessionData.is_active,
      orders: userOrders
    };

    return orderSession;
  } catch (error) {
    return handleError(error, "Failed to fetch order session");
  }
};

// Create new order session
export const createOrderSession = async (
  title: string, 
  deadline: string
): Promise<OrderSession> => {
  try {
    // Validate deadline is a valid date
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      throw new Error("Invalid deadline date format");
    }
    
    // Ensure deadline is in the future
    const now = new Date();
    if (deadlineDate <= now) {
      throw new Error("Deadline must be in the future");
    }
    
    const { data, error } = await supabase
      .from('order_sessions')
      .insert([
        { 
          title,
          deadline 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insertion error:", error);
      throw new Error(error.message || "Failed to create order session in database");
    }
    
    if (!data) {
      throw new Error("No data returned from database after creating order session");
    }

    return {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      deadline: data.deadline,
      isActive: data.is_active,
      orders: []
    };
  } catch (error) {
    console.error("Create session error details:", error);
    throw error; // Rethrow to let component handle it
  }
};

// Update order session status
export const toggleOrderSessionStatus = async (
  sessionId: string
): Promise<OrderSession | undefined> => {
  try {
    // First get the current status
    const { data: current, error: fetchError } = await supabase
      .from('order_sessions')
      .select('is_active')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;
    
    if (!current) {
      throw new Error("Session not found");
    }

    // Toggle the status
    const { data, error } = await supabase
      .from('order_sessions')
      .update({ is_active: !current.is_active })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    // Get all orders for this session
    const { data: ordersData, error: ordersError } = await supabase
      .from('user_orders')
      .select('id, user_id, user_name')
      .eq('session_id', sessionId);

    if (ordersError) throw ordersError;

    // Get all order items
    const orderIds = ordersData.map(order => order.id);
    
    let orderItems: any[] = [];
    if (orderIds.length > 0) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;
      orderItems = itemsData || [];
    }

    // Transform orders and items
    const userOrders: UserOrder[] = ordersData.map(order => {
      const items = orderItems
        .filter(item => item.order_id === order.id)
        .map(item => ({
          menuItemId: item.menu_item_id,
          quantity: item.quantity,
          price: item.price
        }));

      return {
        userId: order.user_id,
        userName: order.user_name,
        items
      };
    });
    
    if (!data) {
      throw new Error("Failed to update session status");
    }

    return {
      id: data.id,
      title: data.title,
      createdAt: data.created_at,
      deadline: data.deadline,
      isActive: data.is_active,
      orders: userOrders
    };
  } catch (error) {
    return handleError(error, "Failed to update order session");
  }
};

// Add or update user order in a session
export const saveUserOrder = async (
  sessionId: string, 
  userId: string,
  userName: string,
  items: OrderItem[]
): Promise<OrderSession | undefined> => {
  try {
    // Check if this session is active
    const { data: sessionData, error: sessionError } = await supabase
      .from('order_sessions')
      .select('is_active')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;
    
    if (!sessionData) {
      throw new Error("Session not found");
    }

    if (!sessionData.is_active) {
      toast({
        title: "Cannot modify order",
        description: "This order session has been finalized",
        variant: "destructive"
      });
      return undefined;
    }

    // Filter out items with zero quantity
    const validItems = items.filter(item => item.quantity > 0);

    // Check if user already has an order
    const { data: existingOrder, error: fetchError } = await supabase
      .from('user_orders')
      .select('id')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let orderId: string;

    if (existingOrder) {
      // Update existing order
      orderId = existingOrder.id;
      
      // First delete existing items
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);
        
      if (deleteError) throw deleteError;
      
      // Update the timestamp
      const { error: updateError } = await supabase
        .from('user_orders')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', orderId);
        
      if (updateError) throw updateError;
    } else if (validItems.length > 0) {
      // Create new order if we have items to add
      const { data: newOrder, error: insertError } = await supabase
        .from('user_orders')
        .insert([
          { 
            session_id: sessionId,
            user_id: userId,
            user_name: userName
          }
        ])
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      if (!newOrder) {
        throw new Error("Failed to create order");
      }
      
      orderId = newOrder.id;
    } else {
      // No items and no existing order, nothing to do
      return getOrderSession(sessionId);
    }

    // Only insert items if we have valid ones
    if (validItems.length > 0) {
      // Insert new items
      const itemsToInsert = validItems.map(item => ({
        order_id: orderId,
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: insertItemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);
        
      if (insertItemsError) throw insertItemsError;
    }

    // Return updated session
    return getOrderSession(sessionId);
  } catch (error) {
    return handleError(error, "Failed to save order");
  }
};

// Get user order from a session
export const getUserOrder = async (
  sessionId: string,
  userId: string
): Promise<UserOrder | undefined> => {
  try {
    // Find user's order
    const { data: orderData, error: orderError } = await supabase
      .from('user_orders')
      .select('id, user_id, user_name')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!orderData) return undefined;

    // Get order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderData.id);

    if (itemsError) throw itemsError;

    // Transform to application format
    const items = (itemsData || []).map(item => ({
      menuItemId: item.menu_item_id,
      quantity: item.quantity,
      price: item.price
    }));

    return {
      userId: orderData.user_id,
      userName: orderData.user_name,
      items
    };
  } catch (error) {
    return handleError(error, "Failed to fetch user order");
  }
};

// Calculate compiled order with total quantities
export const getCompiledOrder = async (
  sessionId: string
): Promise<Array<{item: string; quantity: number; price: number}>> => {
  try {
    // Get all orders for this session
    const { data: ordersData, error: ordersError } = await supabase
      .from('user_orders')
      .select('id')
      .eq('session_id', sessionId);

    if (ordersError) throw ordersError;
    
    if (!ordersData || ordersData.length === 0) {
      return [];
    }

    // Get all order items
    const orderIds = ordersData.map(order => order.id);
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('menu_item_id, quantity, price')
      .in('order_id', orderIds);

    if (itemsError) throw itemsError;

    // Compile the order
    const compiledItems: Record<string, { quantity: number; price: number }> = {};
    
    (itemsData || []).forEach(item => {
      const itemId = item.menu_item_id;
      if (!compiledItems[itemId]) {
        compiledItems[itemId] = { quantity: 0, price: item.price };
      }
      compiledItems[itemId].quantity += item.quantity;
    });

    // Convert to array with item details
    return Object.entries(compiledItems).map(([itemId, data]) => {
      const menuItem = MENU_ITEMS.find(item => item.id === itemId);
      return {
        item: menuItem?.name || 'Unknown Item',
        quantity: data.quantity,
        price: data.price
      };
    });
  } catch (error) {
    return handleError(error, "Failed to compile order") || [];
  }
};
