
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'paid': return 'bg-green-100 text-green-800';
    case 'preparing': return 'bg-blue-100 text-blue-800';
    case 'ready': return 'bg-purple-100 text-purple-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Menunggu';
    case 'paid': return 'Dibayar';
    case 'preparing': return 'Disiapkan';
    case 'ready': return 'Siap';
    case 'completed': return 'Selesai';
    case 'cancelled': return 'Dibatalkan';
    default: return status;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const RecentOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
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
            daily_menus (
              food_items (
                name,
                image_url
              )
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesanan Terbaru</CardTitle>
        <CardDescription>5 pesanan terakhir yang masuk</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{order.children?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{order.children?.class || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge className={getStatusColor(order.status || 'pending')}>
                  {getStatusText(order.status || 'pending')}
                </Badge>
                <p className="font-medium">{formatPrice(order.total_amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
