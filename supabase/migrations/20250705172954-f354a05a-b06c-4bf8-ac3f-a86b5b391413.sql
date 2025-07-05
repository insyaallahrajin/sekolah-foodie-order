
-- Create enum types first
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE food_category AS ENUM ('makanan', 'minuman');

-- Create profiles table for user information (parents)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'parent' CHECK (role IN ('parent', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create children table for storing child information
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  school_year TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_items table
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category food_category NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE SET NULL,
  order_date DATE NOT NULL,
  delivery_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_method TEXT,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_menus table
CREATE TABLE public.daily_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_date DATE NOT NULL,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  available_quantity INTEGER,
  remaining_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(menu_date, food_item_id)
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  daily_menu_id UUID REFERENCES public.daily_menus(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_schedules table
CREATE TABLE public.order_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_weekend_enabled BOOLEAN DEFAULT false,
  max_orders_per_day INTEGER,
  order_start_time TIME,
  order_end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'parent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for children
CREATE POLICY "Parents can view own children" ON public.children
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create children" ON public.children
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update own children" ON public.children
  FOR UPDATE USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete own children" ON public.children
  FOR DELETE USING (auth.uid() = parent_id);

-- RLS Policies for food_items (public read)
CREATE POLICY "Anyone can view food items" ON public.food_items
  FOR SELECT USING (true);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = parent_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.parent_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.parent_id = auth.uid()
    )
  );

-- RLS Policies for daily_menus (public read)
CREATE POLICY "Anyone can view daily menus" ON public.daily_menus
  FOR SELECT USING (true);

-- RLS Policies for order_schedules (public read)
CREATE POLICY "Anyone can view order schedules" ON public.order_schedules
  FOR SELECT USING (true);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, address, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'phone', ''),
    COALESCE(new.raw_user_meta_data ->> 'address', ''),
    COALESCE(new.raw_user_meta_data ->> 'role', 'parent')
  );
  
  -- Also insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'role', 'parent')
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample food items
INSERT INTO public.food_items (name, description, base_price, category, image_url) VALUES
('Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, dan sayuran segar', 25000, 'makanan', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'),
('Mie Ayam Bakso', 'Mie ayam dengan bakso dan pangsit goreng', 20000, 'makanan', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'),
('Gado-Gado', 'Sayuran segar dengan bumbu kacang', 18000, 'makanan', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'),
('Rendang Daging', 'Daging sapi rendang dengan nasi putih', 35000, 'makanan', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'),
('Soto Ayam', 'Soto ayam kuah bening dengan nasi', 22000, 'makanan', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400'),
('Es Teh Manis', 'Teh manis dingin segar', 8000, 'minuman', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'),
('Es Jeruk', 'Jus jeruk segar dengan es', 12000, 'minuman', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'),
('Kopi Hitam', 'Kopi hitam panas original', 10000, 'minuman', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'),
('Jus Alpukat', 'Jus alpukat creamy dengan susu', 15000, 'minuman', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400'),
('Es Campur', 'Es campur dengan berbagai topping', 16000, 'minuman', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400');

-- Insert default order schedule settings
INSERT INTO public.order_schedules (is_weekend_enabled, max_orders_per_day, order_start_time, order_end_time) 
VALUES (false, 100, '08:00:00', '15:00:00');
