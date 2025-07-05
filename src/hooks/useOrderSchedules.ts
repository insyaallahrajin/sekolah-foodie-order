
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, isBefore, isToday, isWeekend } from 'date-fns';

interface OrderSchedule {
  id: string;
  is_weekend_enabled: boolean;
  max_orders_per_day: number | null;
  order_start_time: string | null;
  order_end_time: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useOrderSchedules = () => {
  const [orderSchedules, setOrderSchedules] = useState<OrderSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderSchedules();
  }, []);

  const fetchOrderSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('order_schedules')
        .select('*');

      if (error) throw error;
      setOrderSchedules(data || []);
    } catch (error) {
      console.error('Error fetching order schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Check if weekends are disabled
    const schedule = orderSchedules[0]; // Assuming global settings
    if (schedule && !schedule.is_weekend_enabled && isWeekend(date)) {
      return true;
    }
    
    // Disable past dates
    if (isBefore(date, new Date()) && !isToday(date)) return true;
    
    return false;
  };

  const getDateStatus = (date: Date) => {
    const schedule = orderSchedules[0];
    
    if (schedule && !schedule.is_weekend_enabled && isWeekend(date)) {
      return { status: 'closed', message: 'Tutup di hari Sabtu & Minggu' };
    }
    
    return { status: 'available', message: 'Tersedia' };
  };

  return {
    orderSchedules,
    loading,
    isDateDisabled,
    getDateStatus
  };
};
