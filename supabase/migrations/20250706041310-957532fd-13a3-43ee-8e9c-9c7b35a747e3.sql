
-- Add admin policies for order_schedules table
CREATE POLICY "Admins can manage order schedules" 
  ON public.order_schedules 
  FOR ALL 
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Add admin policies for daily_menus table  
CREATE POLICY "Admins can manage daily menus" 
  ON public.daily_menus 
  FOR ALL 
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Add admin policies for food_items table (if not exists)
DROP POLICY IF EXISTS "Admins can manage food items" ON public.food_items;
CREATE POLICY "Admins can manage food items" 
  ON public.food_items 
  FOR ALL 
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
