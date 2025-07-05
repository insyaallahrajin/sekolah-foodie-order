
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can manage daily menus" ON public.daily_menus;
DROP POLICY IF EXISTS "Admins can manage order schedules" ON public.order_schedules;
DROP POLICY IF EXISTS "Admins can view all children" ON public.children;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Create simpler policies that don't cause infinite recursion
-- Allow admins to manage user_roles without recursive check
CREATE POLICY "Service role can manage user_roles" 
  ON public.user_roles 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create a function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN _user_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id AND role = 'admin'
    )
  END
$$;

-- Recreate admin policies using the new function
CREATE POLICY "Admins can view all orders" 
  ON public.orders 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all orders" 
  ON public.orders 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Only create policies for tables that exist
DO $$
BEGIN
  -- Food items policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'food_items') THEN
    EXECUTE 'CREATE POLICY "Admins can manage food items" ON public.food_items FOR ALL USING (public.is_admin(auth.uid()))';
  END IF;

  -- Daily menus policies  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'daily_menus') THEN
    EXECUTE 'CREATE POLICY "Admins can manage daily menus" ON public.daily_menus FOR ALL USING (public.is_admin(auth.uid()))';
  END IF;

  -- Order schedules policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_schedules') THEN
    EXECUTE 'CREATE POLICY "Admins can manage order schedules" ON public.order_schedules FOR ALL USING (public.is_admin(auth.uid()))';
  END IF;

  -- Children policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'children') THEN
    EXECUTE 'CREATE POLICY "Admins can view all children" ON public.children FOR SELECT USING (public.is_admin(auth.uid()))';
  END IF;

  -- Order items policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
    EXECUTE 'CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (public.is_admin(auth.uid()))';
  END IF;
END
$$;

-- Make sure admin user exists in user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT 'e503846a-94a4-41ae-a9f4-c6df1814c58c', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = 'e503846a-94a4-41ae-a9f4-c6df1814c58c'
);
