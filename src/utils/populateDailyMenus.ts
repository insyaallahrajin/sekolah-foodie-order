
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';

export const populateDailyMenus = async () => {
  try {
    // Get all active food items
    const { data: foodItems, error: foodError } = await supabase
      .from('food_items')
      .select('*')
      .eq('is_active', true);

    if (foodError) throw foodError;

    if (!foodItems || foodItems.length === 0) {
      throw new Error('No active food items found');
    }

    // Generate dates for the next 7 days
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      dates.push(format(addDays(new Date(), i), 'yyyy-MM-dd'));
    }

    // Create daily menu entries
    const dailyMenus = [];
    for (const date of dates) {
      // Add all food items for each date
      for (const item of foodItems) {
        dailyMenus.push({
          menu_date: date,
          food_item_id: item.id,
          price: item.base_price,
          is_available: true,
          available_quantity: 50,
          remaining_quantity: 50
        });
      }
    }

    // Check if daily menus already exist for these dates
    const { data: existingMenus, error: checkError } = await supabase
      .from('daily_menus')
      .select('menu_date, food_item_id')
      .in('menu_date', dates);

    if (checkError) throw checkError;

    // Filter out existing combinations
    const existingCombinations = new Set(
      existingMenus?.map(menu => `${menu.menu_date}-${menu.food_item_id}`) || []
    );

    const newMenus = dailyMenus.filter(menu => 
      !existingCombinations.has(`${menu.menu_date}-${menu.food_item_id}`)
    );

    if (newMenus.length === 0) {
      console.log('All daily menus already exist for the next 7 days');
      return;
    }

    // Insert daily menus
    const { error: insertError } = await supabase
      .from('daily_menus')
      .insert(newMenus);

    if (insertError) throw insertError;

    console.log(`Successfully created ${newMenus.length} daily menu items`);
    
  } catch (error) {
    console.error('Error populating daily menus:', error);
    throw error;
  }
};
