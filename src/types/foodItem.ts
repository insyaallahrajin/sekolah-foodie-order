
export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  category: 'makanan' | 'minuman';
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
