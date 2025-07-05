
export interface DailyMenu {
  id: string;
  menu_date: string;
  food_item_id: string | null;
  price: number;
  is_available: boolean | null;
  available_quantity: number | null;
  remaining_quantity: number | null;
  created_at: string | null;
  updated_at: string | null;
  food_items?: {
    name: string;
    description: string | null;
    image_url: string | null;
    category: 'makanan' | 'minuman';
  };
}
