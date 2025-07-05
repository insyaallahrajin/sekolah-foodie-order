
export interface Order {
  id: string;
  parent_id: string | null;
  child_id: string | null;
  order_date: string;
  delivery_date: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  special_notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    daily_menu_id: string | null;
    daily_menus?: {
      food_items: {
        name: string;
        image_url: string;
      };
    };
  }[];
  children?: {
    name: string;
    class: string;
  };
}
