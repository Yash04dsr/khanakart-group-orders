
-- Create test users
-- Note: In production, you should never store passwords in migrations
-- These are only for development purposes

-- First, let's ensure we have the right RLS policies for our tables
ALTER TABLE public.order_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to order_sessions
CREATE POLICY "Admin access to all order sessions" 
ON public.order_sessions 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT auth.uid() 
    FROM auth.users
    WHERE email LIKE 'admin%'
  )
);

-- Create policy for members to view order_sessions
CREATE POLICY "Members can view order sessions" 
ON public.order_sessions 
FOR SELECT 
USING (true);

-- Create policy for admin access to user_orders
CREATE POLICY "Admin access to all user orders" 
ON public.user_orders 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT auth.uid() 
    FROM auth.users
    WHERE email LIKE 'admin%'
  )
);

-- Create policy for members to manage their own orders
CREATE POLICY "Members can manage their own orders" 
ON public.user_orders 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policy for admin access to order_items
CREATE POLICY "Admin access to all order items" 
ON public.order_items 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT auth.uid() 
    FROM auth.users
    WHERE email LIKE 'admin%'
  )
);

-- Create policy for members to manage their own order items
CREATE POLICY "Members can manage their own order items" 
ON public.order_items 
FOR ALL 
USING (
  order_id IN (
    SELECT id 
    FROM public.user_orders 
    WHERE user_id = auth.uid()
  )
);
