
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Coffee, Settings, Plus, Edit, Users, Clock, CheckCircle } from "lucide-react";
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
  customerEmail: string;
}

const AdminDashboard = ({ user, onLogout }: { user: string; onLogout: () => void }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: "Nasi Gudeg", price: 15000, category: 'makanan', image: "🍛", available: true },
    { id: 2, name: "Gado-gado", price: 12000, category: 'makanan', image: "🥗", available: true },
    { id: 3, name: "Soto Ayam", price: 13000, category: 'makanan', image: "🍜", available: true },
    { id: 4, name: "Bakso", price: 10000, category: 'makanan', image: "🍲", available: false },
    { id: 5, name: "Es Teh Manis", price: 5000, category: 'minuman', image: "🧊", available: true },
    { id: 6, name: "Jus Jeruk", price: 8000, category: 'minuman', image: "🍊", available: true },
    { id: 7, name: "Kopi Susu", price: 7000, category: 'minuman', image: "☕", available: true },
    { id: 8, name: "Air Mineral", price: 3000, category: 'minuman', image: "💧", available: true },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      items: [
        { item: { id: 1, name: "Nasi Gudeg", price: 15000, category: 'makanan', image: "🍛", available: true }, quantity: 1 },
        { item: { id: 5, name: "Es Teh Manis", price: 5000, category: 'minuman', image: "🧊", available: true }, quantity: 2 }
      ],
      total: 25000,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('id-ID'),
      customerEmail: 'orangtua@email.com'
    },
    {
      id: 2,
      items: [
        { item: { id: 2, name: "Gado-gado", price: 12000, category: 'makanan', image: "🥗", available: true }, quantity: 1 },
        { item: { id: 6, name: "Jus Jeruk", price: 8000, category: 'minuman', image: "🍊", available: true }, quantity: 1 }
      ],
      total: 20000,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('id-ID'),
      customerEmail: 'wali@email.com'
    }
  ]);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'makanan',
    image: '🍽️',
    available: true
  });

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Status pesanan diperbarui",
      description: `Pesanan #${orderId} statusnya menjadi ${getStatusText(newStatus)}`,
    });
  };

  const getStatusText = (status: Order['status']) => {
    const statusText = {
      pending: "Menunggu",
      confirmed: "Dikonfirmasi",
      ready: "Siap Diambil",
      completed: "Selesai"
    };
    return statusText[status];
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

  const toggleItemAvailability = (itemId: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
    
    const item = menuItems.find(item => item.id === itemId);
    toast({
      title: "Status menu diperbarui",
      description: `${item?.name} ${item?.available ? 'tidak tersedia' : 'tersedia'}`,
    });
  };

  const saveMenuItem = (item: MenuItem) => {
    if (editingItem) {
      setMenuItems(menuItems.map(menuItem => 
        menuItem.id === item.id ? item : menuItem
      ));
      toast({
        title: "Menu berhasil diperbarui",
        description: `${item.name} telah diperbarui`,
      });
    } else {
      const newMenuItem = { ...item, id: Math.max(...menuItems.map(i => i.id)) + 1 };
      setMenuItems([...menuItems, newMenuItem]);
      toast({
        title: "Menu berhasil ditambahkan",
        description: `${item.name} telah ditambahkan ke menu`,
      });
    }
    setEditingItem(null);
    setIsAddingItem(false);
    setNewItem({ name: '', price: 0, category: 'makanan', image: '🍽️', available: true });
  };

  const getOrderStats = () => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    return { pending, confirmed, ready, totalRevenue };
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 school-gradient rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Selamat datang, {user}</p>
              </div>
            </div>
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
              <p className="text-sm text-gray-600">Menunggu</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-600">{stats.confirmed}</h3>
              <p className="text-sm text-gray-600">Dikonfirmasi</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-green-600">{stats.ready}</h3>
              <p className="text-sm text-gray-600">Siap Diambil</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Coffee className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-orange-600">
                Rp {stats.totalRevenue.toLocaleString('id-ID')}
              </h3>
              <p className="text-sm text-gray-600">Total Penjualan</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setActiveTab('orders')}
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            className={activeTab === 'orders' ? 'school-gradient text-white' : ''}
          >
            Kelola Pesanan
          </Button>
          <Button
            onClick={() => setActiveTab('menu')}
            variant={activeTab === 'menu' ? 'default' : 'outline'}
            className={activeTab === 'menu' ? 'school-gradient text-white' : ''}
          >
            Kelola Menu
          </Button>
        </div>

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kelola Pesanan</h2>
            
            {orders.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada pesanan masuk</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-0 shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Pesanan #{order.id}</CardTitle>
                          <CardDescription>
                            {order.customerEmail} • {order.createdAt}
                          </CardDescription>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
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
                      
                      <div className="border-t pt-4 flex items-center justify-between">
                        <div className="font-semibold">
                          Total: <span className="text-green-600">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          {order.status === 'pending' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Konfirmasi
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Siap Diambil
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              size="sm"
                              className="bg-gray-600 hover:bg-gray-700 text-white"
                            >
                              Selesai
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kelola Menu</h2>
              <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                <DialogTrigger asChild>
                  <Button className="school-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Menu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Menu Baru</DialogTitle>
                    <DialogDescription>
                      Tambahkan item makanan atau minuman baru ke menu
                    </DialogDescription>
                  </DialogHeader>
                  <MenuItemForm
                    item={newItem as MenuItem}
                    onSave={saveMenuItem}
                    onCancel={() => {
                      setIsAddingItem(false);
                      setNewItem({ name: '', price: 0, category: 'makanan', image: '🍽️', available: true });
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Makanan */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🍽️</span>
                Makanan
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.filter(item => item.category === 'makanan').map((item) => (
                  <Card key={item.id} className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{item.image}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-green-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Menu</DialogTitle>
                              <DialogDescription>
                                Ubah informasi menu item
                              </DialogDescription>
                            </DialogHeader>
                            {editingItem && (
                              <MenuItemForm
                                item={editingItem}
                                onSave={saveMenuItem}
                                onCancel={() => setEditingItem(null)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleItemAvailability(item.id)}
                          />
                          <Label className="text-sm">
                            {item.available ? 'Tersedia' : 'Tidak Tersedia'}
                          </Label>
                        </div>
                        {!item.available && (
                          <Badge variant="destructive">Habis</Badge>
                        )}
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.filter(item => item.category === 'minuman').map((item) => (
                  <Card key={item.id} className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{item.image}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-green-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Menu</DialogTitle>
                              <DialogDescription>
                                Ubah informasi menu item
                              </DialogDescription>
                            </DialogHeader>
                            {editingItem && (
                              <MenuItemForm
                                item={editingItem}
                                onSave={saveMenuItem}
                                onCancel={() => setEditingItem(null)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleItemAvailability(item.id)}
                          />
                          <Label className="text-sm">
                            {item.available ? 'Tersedia' : 'Tidak Tersedia'}
                          </Label>
                        </div>
                        {!item.available && (
                          <Badge variant="destructive">Habis</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuItemForm = ({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item: MenuItem; 
  onSave: (item: MenuItem) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Menu</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Harga (Rp)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Kategori</Label>
        <Select
          value={formData.category}
          onValueChange={(value: 'makanan' | 'minuman') => 
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="makanan">Makanan</SelectItem>
            <SelectItem value="minuman">Minuman</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Emoji/Icon</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="🍽️"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.available}
          onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
        />
        <Label>Tersedia</Label>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="school-gradient text-white flex-1">
          Simpan
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Batal
        </Button>
      </div>
    </form>
  );
};

export default AdminDashboard;
