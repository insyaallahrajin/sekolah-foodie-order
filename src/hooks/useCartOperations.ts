
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { CartItem } from '@/types/cart';
import { Child } from '@/types/child';

export const useCartOperations = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, class')
        .eq('parent_id', user?.id);

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const handleCheckout = async (items: CartItem[], onSuccess: () => void) => {
    if (!selectedChildId) {
      toast({
        title: "Error",
        description: "Pilih anak untuk pesanan ini",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Keranjang kosong",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const orderDate = new Date().toISOString().split('T')[0];
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 1);

      // Create order using parent_id instead of user_id
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          parent_id: user?.id,
          child_id: selectedChildId,
          order_date: orderDate,
          delivery_date: deliveryDate.toISOString().split('T')[0],
          total_amount: totalAmount,
          special_notes: notes || null,
          status: 'pending',
          payment_method: 'online'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items with proper structure
      const orderItems = items.map(item => ({
        order_id: order.id,
        daily_menu_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Berhasil!",
        description: "Pesanan berhasil dibuat",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal membuat pesanan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    children,
    selectedChildId,
    setSelectedChildId,
    notes,
    setNotes,
    loading,
    fetchChildren,
    handleCheckout
  };
};
