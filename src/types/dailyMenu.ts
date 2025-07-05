
export interface DailyMenu {
  id: string;
  menu_date: string;
  food_item_id: string;
  price: number;
  is_available: boolean;
  available_quantity: number | null;
  remaining_quantity: number | null;
  food_items: {
    name: string;
    description: string;
    image_url: string;
    category: string;
  };
}
