import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: 'makanan' | 'minuman';
  image_url: string | null;
  is_available: boolean;
}

const FoodManagement = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: 0,
    category: 'makanan' as 'makanan' | 'minuman',
    image_url: '',
    is_active: true,
  });

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data menu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editingItem) {
        const { error } = await supabase
          .from('food_items')
          .update(formData)
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Item berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('food_items')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Item berhasil ditambahkan",
        });
      }

      await fetchItems();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving food item:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan item",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      base_price: item.base_price,
      category: item.category,
      image_url: item.image_url || '',
      is_active: item.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Item berhasil dihapus",
      });
      
      fetchItems();
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus item",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      base_price: 0,
      category: 'makanan',
      image_url: '',
      is_active: true
    });
  };

  const handleAddNew = () => {
    setEditingItem(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Manajemen Menu
          </h1>
          <p className="text-gray-600">Kelola menu makanan dan minuman</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Perbarui informasi menu' : 'Tambahkan menu makanan atau minuman baru'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Kategori
                  </Label>
                  <Select value={formData.category} onValueChange={(value: 'makanan' | 'minuman') => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="makanan">Makanan</SelectItem>
                      <SelectItem value="minuman">Minuman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="base_price" className="text-right">
                    Harga
                  </Label>
                  <Input
                    id="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image_url" className="text-right">
                    URL Gambar
                  </Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingItem ? 'Perbarui' : 'Tambah'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>
                    <Badge variant={item.category === 'makanan' ? 'default' : 'secondary'}>
                      {item.category}
                    </Badge>
                  </CardDescription>
                </div>
                <Badge variant={item.is_active ? 'default' : 'destructive'}>
                  {item.is_active ? 'Tersedia' : 'Tidak Tersedia'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              
              <p className="text-sm text-gray-600 mb-3">
                {item.description || 'Tidak ada deskripsi'}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-orange-600">
                  Rp {item.base_price.toLocaleString('id-ID')}
                </span>
                
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Belum Ada Menu</h3>
            <p className="text-gray-600 mb-4">Mulai tambahkan menu makanan dan minuman</p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Menu Pertama
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodManagement;
