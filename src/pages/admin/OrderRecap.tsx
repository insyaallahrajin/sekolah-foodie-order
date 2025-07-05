import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const OrderRecap = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrdersForDate = async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
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
        .eq('delivery_date', dateStr)
        .order('created_at', { ascending: true });

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

  useEffect(() => {
    fetchOrdersForDate(selectedDate);
  }, [selectedDate]);

  const groupedOrders = orders.reduce((acc, order) => {
    const childName = order.children?.name || 'Unknown';
    const childClass = order.children?.class || 'Unknown';
    const key = `${childName} - ${childClass}`;
    
    if (!acc[key]) {
      acc[key] = {
        childName,
        childClass,
        orders: []
      };
    }
    
    acc[key].orders.push(order);
    return acc;
  }, {} as any);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rekap Pesanan</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP", {locale: enUS})
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                date > new Date() || date < new Date('2024-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedOrders).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Tidak ada pesanan untuk tanggal ini</p>
              </CardContent>
            </Card>
          ) : (
            Object.values(groupedOrders).map((group: any, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {group.childName} - Kelas {group.childClass}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-none space-y-2">
                    {group.orders.map((order: any) => (
                      <li key={order.id} className="py-2 border-b last:border-none">
                        <div className="font-medium">Order ID: {order.id}</div>
                        <ul className="list-disc pl-5">
                          {order.order_items.map((item: any) => (
                            <li key={item.id} className="text-sm">
                              {item.daily_menus?.food_items?.name} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderRecap;
