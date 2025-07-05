
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { DailyMenu } from '@/types/dailyMenu';

export const useDailyMenus = () => {
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);

  const fetchDailyMenus = async (date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('daily_menus')
        .select(`
          *,
          food_items (
            name,
            description,
            image_url,
            category
          )
        `)
        .eq('menu_date', dateStr)
        .eq('is_available', true);

      if (error) throw error;
      setDailyMenus(data || []);
    } catch (error) {
      console.error('Error fetching daily menus:', error);
      toast({
        title: "Error",
        description: "Gagal memuat menu harian",
        variant: "destructive",
      });
    }
  };

  return { dailyMenus, fetchDailyMenus };
};
