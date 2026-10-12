-- =========================================================================
-- NEXUS NEPAL - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- =========================================================================

-- 1. Create PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'admin')),
  phone TEXT,
  city TEXT,
  address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'admin@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Automatically create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    CASE WHEN LOWER(NEW.email) = 'admin@gmail.com' THEN 'admin' ELSE 'buyer' END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Create ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'Processing',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies: Customers can only read and create their own orders
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
CREATE POLICY "Customers can view their own orders"
  ON public.orders
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (auth.uid() IS NULL AND customer_email = current_setting('request.jwt.claim.email', true))
  );

DROP POLICY IF EXISTS "Customers can create their own orders" ON public.orders;
CREATE POLICY "Customers can create their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Admins have full access to all orders" ON public.orders;
CREATE POLICY "Admins have full access to all orders"
  ON public.orders
  FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'admin@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
