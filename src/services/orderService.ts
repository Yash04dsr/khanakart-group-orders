import { OrderItem, OrderSession, UserOrder } from '../types';
import { MENU_ITEMS, MOCK_ORDER_SESSIONS } from './mockData';
import { toast } from '../hooks/use-toast';

// Initialize order sessions from localStorage if available, otherwise use mock data
const getInitialOrderSessions = (): OrderSession[] => {
  const storedSessions = localStorage.getItem('orderSessions');
  return storedSessions ? JSON.parse(storedSessions) : [...MOCK_ORDER_SESSIONS];
};

// Mock database - in reality, this would be API calls to your backend
let orderSessions: OrderSession[] = getInitialOrderSessions();

// Helper function to save sessions to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('orderSessions', JSON.stringify(orderSessions));
};

// Get all order sessions
export const getOrderSessions = (): Promise<OrderSession[]> => {
  // Refresh from localStorage in case other tabs/windows have updated it
  const storedSessions = localStorage.getItem('orderSessions');
  if (storedSessions) {
    orderSessions = JSON.parse(storedSessions);
  }
  return Promise.resolve([...orderSessions]);
};

// Get a specific order session
export const getOrderSession = (sessionId: string): Promise<OrderSession | undefined> => {
  // Refresh from localStorage in case other tabs/windows have updated it
  const storedSessions = localStorage.getItem('orderSessions');
  if (storedSessions) {
    orderSessions = JSON.parse(storedSessions);
  }
  const session = orderSessions.find(s => s.id === sessionId);
  return Promise.resolve(session ? { ...session } : undefined);
};

// Create new order session
export const createOrderSession = (
  title: string, 
  deadline: string
): Promise<OrderSession> => {
  const newSession: OrderSession = {
    id: `session-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    deadline,
    isActive: true,
    orders: []
  };
  
  orderSessions = [newSession, ...orderSessions];
  saveToLocalStorage(); // Save to localStorage
  return Promise.resolve({ ...newSession });
};

// Update order session status
export const toggleOrderSessionStatus = (
  sessionId: string
): Promise<OrderSession | undefined> => {
  const sessionIndex = orderSessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) {
    return Promise.resolve(undefined);
  }
  
  orderSessions[sessionIndex] = {
    ...orderSessions[sessionIndex],
    isActive: !orderSessions[sessionIndex].isActive
  };
  
  saveToLocalStorage(); // Save to localStorage
  return Promise.resolve({ ...orderSessions[sessionIndex] });
};

// Add or update user order in a session
export const saveUserOrder = (
  sessionId: string, 
  userId: string,
  userName: string,
  items: OrderItem[]
): Promise<OrderSession | undefined> => {
  const sessionIndex = orderSessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) {
    toast({
      title: "Error",
      description: "Order session not found",
      variant: "destructive"
    });
    return Promise.resolve(undefined);
  }
  
  const session = orderSessions[sessionIndex];
  
  if (!session.isActive) {
    toast({
      title: "Cannot modify order",
      description: "This order session has been finalized",
      variant: "destructive"
    });
    return Promise.resolve(undefined);
  }
  
  // Filter out items with zero quantity
  const validItems = items.filter(item => item.quantity > 0);
  
  const userOrderIndex = session.orders.findIndex(o => o.userId === userId);
  
  if (userOrderIndex >= 0) {
    // Update existing order
    session.orders[userOrderIndex] = {
      userId,
      userName,
      items: validItems
    };
  } else if (validItems.length > 0) {
    // Add new order
    session.orders.push({
      userId,
      userName,
      items: validItems
    });
  }
  
  orderSessions[sessionIndex] = session;
  saveToLocalStorage(); // Save to localStorage
  
  return Promise.resolve({ ...session });
};

// Get user order from a session
export const getUserOrder = (
  sessionId: string,
  userId: string
): Promise<UserOrder | undefined> => {
  const session = orderSessions.find(s => s.id === sessionId);
  if (!session) return Promise.resolve(undefined);
  
  const userOrder = session.orders.find(o => o.userId === userId);
  return Promise.resolve(userOrder ? { ...userOrder } : undefined);
};

// Calculate compiled order with total quantities
export const getCompiledOrder = (
  sessionId: string
): Promise<Array<{item: string; quantity: number; price: number}>> => {
  const session = orderSessions.find(s => s.id === sessionId);
  if (!session) return Promise.resolve([]);
  
  const compiledItems: Record<string, number> = {};
  
  // Sum up quantities for each menu item
  session.orders.forEach(order => {
    order.items.forEach(item => {
      const itemId = item.menuItemId;
      compiledItems[itemId] = (compiledItems[itemId] || 0) + item.quantity;
    });
  });
  
  // Convert to array with item details
  return Promise.resolve(
    Object.entries(compiledItems).map(([itemId, quantity]) => {
      const menuItem = MENU_ITEMS.find(item => item.id === itemId);
      return {
        item: menuItem?.name || 'Unknown Item',
        quantity,
        price: menuItem?.price || 0
      };
    })
  );
};
