export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cash_payments: {
        Row: {
          amount_paid: number
          cashier_id: string | null
          change_amount: number | null
          created_at: string | null
          id: string
          order_id: string | null
          receipt_number: string | null
        }
        Insert: {
          amount_paid: number
          cashier_id?: string | null
          change_amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          receipt_number?: string | null
        }
        Update: {
          amount_paid?: number
          cashier_id?: string | null
          change_amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          receipt_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_payments_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          allergies: string[] | null
          class: string
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          class: string
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          class?: string
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_menus: {
        Row: {
          available_quantity: number | null
          created_at: string | null
          food_item_id: string | null
          id: string
          is_available: boolean | null
          menu_date: string
          price: number
          remaining_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          available_quantity?: number | null
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          is_available?: boolean | null
          menu_date: string
          price: number
          remaining_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          available_quantity?: number | null
          created_at?: string | null
          food_item_id?: string | null
          id?: string
          is_available?: boolean | null
          menu_date?: string
          price?: number
          remaining_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_menus_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          base_price: number
          category: Database["public"]["Enums"]["menu_category"]
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category: Database["public"]["Enums"]["menu_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category?: Database["public"]["Enums"]["menu_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kitchen_reports: {
        Row: {
          created_at: string | null
          id: string
          kitchen_staff_id: string | null
          notes: string | null
          order_id: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          kitchen_staff_id?: string | null
          notes?: string | null
          order_id?: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string | null
          id?: string
          kitchen_staff_id?: string | null
          notes?: string | null
          order_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_reports_kitchen_staff_id_fkey"
            columns: ["kitchen_staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kitchen_reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      online_payments: {
        Row: {
          created_at: string | null
          fraud_status: string | null
          gross_amount: number
          id: string
          order_id: string | null
          payment_type: string | null
          settlement_time: string | null
          transaction_id: string | null
          transaction_status: string | null
          transaction_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fraud_status?: string | null
          gross_amount: number
          id?: string
          order_id?: string | null
          payment_type?: string | null
          settlement_time?: string | null
          transaction_id?: string | null
          transaction_status?: string | null
          transaction_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fraud_status?: string | null
          gross_amount?: number
          id?: string
          order_id?: string | null
          payment_type?: string | null
          settlement_time?: string | null
          transaction_id?: string | null
          transaction_status?: string | null
          transaction_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "online_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          daily_menu_id: string | null
          id: string
          order_id: string | null
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          daily_menu_id?: string | null
          id?: string
          order_id?: string | null
          quantity?: number
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          daily_menu_id?: string | null
          id?: string
          order_id?: string | null
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_daily_menu_id_fkey"
            columns: ["daily_menu_id"]
            isOneToOne: false
            referencedRelation: "daily_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_schedules: {
        Row: {
          created_at: string | null
          id: string
          is_weekend_enabled: boolean | null
          max_orders_per_day: number | null
          order_end_time: string | null
          order_start_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_weekend_enabled?: boolean | null
          max_orders_per_day?: number | null
          order_end_time?: string | null
          order_start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_weekend_enabled?: boolean | null
          max_orders_per_day?: number | null
          order_end_time?: string | null
          order_start_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          child_id: string | null
          created_at: string | null
          delivery_date: string
          id: string
          order_date: string
          parent_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          special_notes: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          delivery_date: string
          id?: string
          order_date: string
          parent_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          special_notes?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          delivery_date?: string
          id?: string
          order_date?: string
          parent_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          special_notes?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      menu_category: "makanan" | "minuman"
      order_status:
        | "pending"
        | "paid"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
      payment_method: "online" | "cash"
      user_role: "parent" | "admin" | "kitchen" | "cashier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      menu_category: ["makanan", "minuman"],
      order_status: [
        "pending",
        "paid",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      payment_method: ["online", "cash"],
      user_role: ["parent", "admin", "kitchen", "cashier"],
    },
  },
} as const
