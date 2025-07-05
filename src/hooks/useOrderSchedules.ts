
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, isBefore, isToday, isWeekend } from 'date-fns';
import { OrderSchedule } from '@/types/orderSchedule';

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
