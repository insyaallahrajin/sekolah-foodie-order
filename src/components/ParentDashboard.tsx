
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, User, Calendar, Clock, CheckCircle, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'makanan' | 'minuman';
  image: string;
  available: boolean;
}

interface Order {
  id: number;
  items: { item: MenuItem; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed';
  createdAt: string;
}

const ParentDashboard = ({ user, onLogout }: { user: string; onLogout: () => void }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      items: [
        { item: { id: 1, name: "Nasi Gudeg", price: 15000, category: 'makanan', image: "🍛", available: true }, quantity: 1 },
        { item: { id: 5, name: "Es Teh Manis", price: 5000, category: 'minuman', image: "🧊", available: true }, quantity: 2 }
      ],
      total: 25000,
      status: 'ready',
      createdAt: new Date().toLocaleDateString('id-ID')
    }
  ]);

  const menuItems: MenuItem[] = [
    { id: 1, name: "Nasi Gudeg", price: 15000, category: 'makanan', image: "🍛", available: true },
    { id: 2, name: "Gado-gado", price: 12000, category: 'makanan', image: "🥗", available: true },
    { id: 3, name: "Soto Ayam", price: 13000, category: 'makanan', image: "🍜", available: true },
    { id: 4, name: "Bakso", price: 10000, category: 'makanan', image: "🍲", available: false },
    { id: 5, name: "Es Teh Manis", price: 5000, category: 'minuman', image: "🧊", available: true },
    { id: 6, name: "Jus Jeruk", price: 8000, category: 'minuman', image: "🍊", available: true },
    { id: 7, name: "Kopi Susu", price: 7000, category: 'minuman', image: "☕", available: true },
    { id: 8, name: "Air Mineral", price: 3000, category: 'minuman', image: "💧", available: true },
  ];

  const addToCart = (item: MenuItem) => {
    if (!item.available) return;
    
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.item.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${item.name} berhasil ditambahkan`,
    });
  };

  const updateQuantity = (itemId: number, change: number) => {
    setCart(cart.map(cartItem => {
      if (cartItem.item.id === itemId) {
        const newQuantity = Math.max(0, cartItem.quantity + change);
        return newQuantity === 0 ? null : { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    }).filter(Boolean) as { item: MenuItem; quantity: number }[]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  const submitOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Silakan pilih menu terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const newOrder: Order = {
      id: orders.length + 1,
      items: [...cart],
      total: getCartTotal(),
      status: 'pending',
      createdAt: new Date().toLocaleDateString('id-ID')
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    
    toast({
      title: "Pesanan berhasil!",
      description: `Pesanan senilai Rp ${getCartTotal().toLocaleString('id-ID')} telah dikirim`,
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Menunggu" },
      confirmed: { color: "bg-blue-100 text-blue-800", text: "Dikonfirmasi" },
      ready: { color: "bg-green-100 text-green-800", text: "Siap Diambil" },
      completed: { color: "bg-gray-100 text-gray-800", text: "Selesai" }
    };
    
    const config = statusConfig[status];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 school-gradient rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Orang Tua</h1>
                <p className="text-sm text-gray-600">Selamat datang, {user}</p>
              </div>
            </div>
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveTab('menu')}
            variant={activeTab === 'menu' ? 'default' : 'outline'}
            className={activeTab === 'menu' ? 'school-gradient text-white' : ''}
          >
            Menu Makanan
          </Button>
          <Button
            onClick={() => setActiveTab('orders')}
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            className={activeTab === 'orders' ? 'school-gradient text-white' : ''}
          >
            Pesanan Saya
          </Button>
        </div>

        {activeTab === 'menu' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Hari Ini</h2>
              
              {/* Makanan */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🍽️</span>
                  Makanan
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {menuItems.filter(item => item.category === 'makanan').map((item) => (
                    <Card key={item.id} className="card-hover border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{item.image}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-green-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                            {!item.available && (
                              <Badge variant="destructive" className="mt-1">Habis</Badge>
                            )}
                          </div>
                          <Button
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                            size="sm"
                            className="school-gradient text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Minuman */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🥤</span>
                  Minuman
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {menuItems.filter(item => item.category === 'minuman').map((item) => (
                    <Card key={item.id} className="card-hover border-0 shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{item.image}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-green-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                            {!item.available && (
                              <Badge variant="destructive" className="mt-1">Habis</Badge>
                            )}
                          </div>
                          <Button
                            onClick={() => addToCart(item)}
                            disabled={!item.available}
                            size="sm"
                            className="school-gradient text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            <div>
              <Card className="border-0 shadow-xl sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coffee className="h-5 w-5 mr-2" />
                    Keranjang Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Keranjang masih kosong</p>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((cartItem) => (
                        <div key={cartItem.item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{cartItem.item.name}</h5>
                            <p className="text-xs text-gray-600">Rp {cartItem.item.price.toLocaleString('id-ID')}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(cartItem.item.id, -1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{cartItem.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(cartItem.item.id, 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-green-600">
                            Rp {getCartTotal().toLocaleString('id-ID')}
                          </span>
                        </div>
                        <Button 
                          onClick={submitOrder}
                          className="w-full school-gradient text-white"
                        >
                          Pesan Sekarang
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Pesanan</h2>
            
            {orders.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada pesanan</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-0 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Pesanan #{order.id}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {order.createdAt}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {order.items.map((orderItem, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{orderItem.item.name} x{orderItem.quantity}</span>
                            <span>Rp {(orderItem.item.price * orderItem.quantity).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-green-600">Rp {order.total.toLocaleString('id-ID')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
