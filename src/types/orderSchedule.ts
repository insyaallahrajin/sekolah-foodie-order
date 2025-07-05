
export interface OrderSchedule {
  id: string;
  is_weekend_enabled: boolean;
  max_orders_per_day: number | null;
  order_start_time: string | null;
  order_end_time: string | null;
  created_at: string | null;
  updated_at: string | null;
}
