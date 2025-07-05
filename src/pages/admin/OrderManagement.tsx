
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';
import { Search, Filter } from 'lucide-react';

type OrderStatus = "pending" | "paid" | "preparing" | "ready" | "completed" | "cancelled";

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

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

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
            daily_menus (
              food_items (
                name,
                image_url
              )
            )
          )
        `)
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

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.children?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.children?.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Status pesanan berhasil diperbarui",
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status pesanan",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Manajemen Pesanan
        </h1>
        <p className="text-gray-600">Kelola dan update status pesanan</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama/kelas/ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status Pesanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="paid">Dibayar</SelectItem>
                <SelectItem value="preparing">Disiapkan</SelectItem>
                <SelectItem value="ready">Siap</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }} variant="outline">
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">{order.children?.name || 'Unknown'}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Kelas: {order.children?.class || 'Unknown'}</p>
                    <p>ID: {order.id.slice(0, 8)}...</p>
                    <p>Tanggal: {formatDate(order.created_at)}</p>
                    <p>Total: {formatPrice(order.total_amount)}</p>
                  </div>
                  {order.special_notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Catatan:</strong> {order.special_notes}
                    </p>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="text-sm">
                        {item.quantity}x {item.daily_menus?.food_items?.name || 'Unknown'} - {formatPrice(item.subtotal)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">Status Pesanan:</label>
                      <Badge className={`ml-2 ${getStatusColor(order.status || 'pending')}`}>
                        {getStatusText(order.status || 'pending')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Status:</label>
                    <Select
                      value={order.status || 'pending'}
                      onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Menunggu</SelectItem>
                        <SelectItem value="paid">Dibayar</SelectItem>
                        <SelectItem value="preparing">Disiapkan</SelectItem>
                        <SelectItem value="ready">Siap</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Tidak Ada Pesanan</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tidak ada pesanan yang sesuai dengan filter'
                : 'Belum ada pesanan masuk'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderManagement;
