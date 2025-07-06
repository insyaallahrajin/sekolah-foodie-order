
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OrderSchedule } from '@/types/orderSchedule';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<OrderSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<OrderSchedule | null>(null);
  const [formData, setFormData] = useState({
    is_weekend_enabled: false,
    max_orders_per_day: 100,
    order_start_time: '12:00',
    order_end_time: '17:00',
  });

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('order_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Error",
        description: "Gagal memuat jadwal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editingSchedule) {
        const { error } = await supabase
          .from('order_schedules')
          .update(formData)
          .eq('id', editingSchedule.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Jadwal berhasil diperbarui",
        });
      } else {
        const { error } = await supabase
          .from('order_schedules')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Jadwal berhasil ditambahkan",
        });
      }

      await fetchSchedules();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan jadwal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      is_weekend_enabled: false,
      max_orders_per_day: 100,
      order_start_time: '12:00',
      order_end_time: '17:00',
    });
    setEditingSchedule(null);
  };

  const handleEdit = (schedule: OrderSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      is_weekend_enabled: schedule.is_weekend_enabled || false,
      max_orders_per_day: schedule.max_orders_per_day || 100,
      order_start_time: schedule.order_start_time || '12:00',
      order_end_time: schedule.order_end_time || '17:00',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('order_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Jadwal berhasil dihapus",
      });

      await fetchSchedules();
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus jadwal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Jadwal Pemesanan</CardTitle>
          <CardDescription>Atur jadwal dan batasan pemesanan makanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  Tambah Jadwal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="is_weekend_enabled" className="text-right">
                      Aktif di Akhir Pekan
                    </Label>
                    <Switch
                      id="is_weekend_enabled"
                      checked={formData.is_weekend_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_weekend_enabled: checked })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="max_orders_per_day" className="text-right">
                      Maksimal Pesanan per Hari
                    </Label>
                    <Input
                      type="number"
                      id="max_orders_per_day"
                      value={formData.max_orders_per_day}
                      onChange={(e) => setFormData({ ...formData, max_orders_per_day: parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="order_start_time" className="text-right">
                      Waktu Mulai Pemesanan
                    </Label>
                    <Input
                      type="time"
                      id="order_start_time"
                      value={formData.order_start_time}
                      onChange={(e) => setFormData({ ...formData, order_start_time: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="order_end_time" className="text-right">
                      Waktu Selesai Pemesanan
                    </Label>
                    <Input
                      type="time"
                      id="order_end_time"
                      value={formData.order_end_time}
                      onChange={(e) => setFormData({ ...formData, order_end_time: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardHeader>
                    <CardTitle>Jadwal #{schedule.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      Maks: {schedule.max_orders_per_day || 'Unlimited'} pesanan, Akhir pekan:{' '}
                      {schedule.is_weekend_enabled ? 'Aktif' : 'Tidak Aktif'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(schedule)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(schedule.id)}>
                      Hapus
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {schedules.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Belum ada jadwal yang dibuat</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManagement;
