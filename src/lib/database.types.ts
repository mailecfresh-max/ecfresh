export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          pin_code: string | null;
          loyalty_points: number;
          total_purchases: number;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          pin_code?: string | null;
          loyalty_points?: number;
          total_purchases?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          pin_code?: string | null;
          loyalty_points?: number;
          total_purchases?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          address: string;
          pin_code: string;
          landmark: string | null;
          optional_phone: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          address: string;
          pin_code: string;
          landmark?: string | null;
          optional_phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          address?: string;
          pin_code?: string;
          landmark?: string | null;
          optional_phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          image: string;
          order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image: string;
          order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image?: string;
          order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          image: string;
          description: string;
          nutritional_info: string | null;
          recipe_idea: string | null;
          variants: any; // JSON
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          image: string;
          description: string;
          nutritional_info?: string | null;
          recipe_idea?: string | null;
          variants: any;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          image?: string;
          description?: string;
          nutritional_info?: string | null;
          recipe_idea?: string | null;
          variants?: any;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string;
          image: string;
          order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image: string;
          order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image?: string;
          order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: any; // JSON
          total: number;
          delivery_fee: number;
          loyalty_used: number;
          delivery_date: string;
          time_slot: string;
          address: any; // JSON
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          items: any;
          total: number;
          delivery_fee: number;
          loyalty_used: number;
          delivery_date: string;
          time_slot: string;
          address: any;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          items?: any;
          total?: number;
          delivery_fee?: number;
          loyalty_used?: number;
          delivery_date?: string;
          time_slot?: string;
          address?: any;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}