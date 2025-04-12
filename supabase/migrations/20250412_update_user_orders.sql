
-- Update the user_orders table to ensure user_name is populated properly
CREATE OR REPLACE FUNCTION public.update_user_orders_with_display_name()
RETURNS TRIGGER AS $$
BEGIN
    -- Use the user's name from the auth.users.raw_user_meta_data if available
    NEW.user_name := COALESCE(
        (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = NEW.user_id),
        (SELECT email FROM auth.users WHERE id = NEW.user_id),
        NEW.user_name
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically update the user_name field
DROP TRIGGER IF EXISTS set_user_name_on_user_orders ON public.user_orders;
CREATE TRIGGER set_user_name_on_user_orders
BEFORE INSERT OR UPDATE OF user_name ON public.user_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_user_orders_with_display_name();

-- Update existing records with proper names
UPDATE public.user_orders
SET user_name = COALESCE(
    (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = user_orders.user_id),
    (SELECT email FROM auth.users WHERE id = user_orders.user_id),
    user_name
)
WHERE TRUE;
