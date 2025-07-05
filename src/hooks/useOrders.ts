
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Order } from '@/types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          children (
            name,
            class
          ),
          order_items (
            id,
            quantity,
            unit_price,
            subtotal,
            daily_menu_id,
            daily_menus (
              food_items (
                name,
                image_url
              )
            )
          )
        `)
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pesanan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const retryPayment = async (order: Order) => {
    // Implementation for retry payment if needed
    toast({
      title: "Info",
      description: "Fitur retry payment belum diimplementasikan",
    });
  };

  return {
    orders,
    loading,
    retryPayment,
    fetchOrders
  };
};
