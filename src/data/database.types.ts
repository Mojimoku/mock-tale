// Auto-generated from the Supabase project schema (jblmlfkffvbudkfceieg).
// Regenerate with the Supabase MCP `generate_typescript_types` tool (or
// `supabase gen types typescript`) after any schema migration — don't hand-edit.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      catalog_ingredients: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          name: string;
          normalized_name: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          id?: string;
          name: string;
          normalized_name: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          name?: string;
          normalized_name?: string;
        };
        Relationships: [];
      };
      catalog_spirits: {
        Row: {
          brand: string;
          category: string | null;
          created_at: string;
          id: string;
          normalized_name: string;
          product: string;
        };
        Insert: {
          brand: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          normalized_name: string;
          product: string;
        };
        Update: {
          brand?: string;
          category?: string | null;
          created_at?: string;
          id?: string;
          normalized_name?: string;
          product?: string;
        };
        Relationships: [];
      };
      drink_entries: {
        Row: {
          category: string;
          created_at: string;
          flavor_tags: string[];
          id: string;
          ingredients: string[];
          is_off_menu: boolean;
          is_shared: boolean;
          listed_description: string | null;
          listed_ingredients: string[] | null;
          na_products: Json;
          name: string;
          notes: string | null;
          price: number | null;
          rating: number;
          restaurant_id: string;
          tasting_notes: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          flavor_tags?: string[];
          id?: string;
          ingredients?: string[];
          is_off_menu?: boolean;
          is_shared?: boolean;
          listed_description?: string | null;
          listed_ingredients?: string[] | null;
          na_products?: Json;
          name: string;
          notes?: string | null;
          price?: number | null;
          rating: number;
          restaurant_id: string;
          tasting_notes?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          flavor_tags?: string[];
          id?: string;
          ingredients?: string[];
          is_off_menu?: boolean;
          is_shared?: boolean;
          listed_description?: string | null;
          listed_ingredients?: string[] | null;
          na_products?: Json;
          name?: string;
          notes?: string | null;
          price?: number | null;
          rating?: number;
          restaurant_id?: string;
          tasting_notes?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "drink_entries_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      drink_ingredient_links: {
        Row: {
          catalog_ingredient_id: string;
          drink_entry_id: string;
        };
        Insert: {
          catalog_ingredient_id: string;
          drink_entry_id: string;
        };
        Update: {
          catalog_ingredient_id?: string;
          drink_entry_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "drink_ingredient_links_catalog_ingredient_id_fkey";
            columns: ["catalog_ingredient_id"];
            isOneToOne: false;
            referencedRelation: "catalog_ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "drink_ingredient_links_drink_entry_id_fkey";
            columns: ["drink_entry_id"];
            isOneToOne: false;
            referencedRelation: "drink_entries";
            referencedColumns: ["id"];
          },
        ];
      };
      drink_spirit_links: {
        Row: {
          catalog_spirit_id: string;
          drink_entry_id: string;
        };
        Insert: {
          catalog_spirit_id: string;
          drink_entry_id: string;
        };
        Update: {
          catalog_spirit_id?: string;
          drink_entry_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "drink_spirit_links_catalog_spirit_id_fkey";
            columns: ["catalog_spirit_id"];
            isOneToOne: false;
            referencedRelation: "catalog_spirits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "drink_spirit_links_drink_entry_id_fkey";
            columns: ["drink_entry_id"];
            isOneToOne: false;
            referencedRelation: "drink_entries";
            referencedColumns: ["id"];
          },
        ];
      };
      restaurants: {
        Row: {
          city: string;
          created_at: string;
          cuisine_type: string | null;
          id: string;
          name: string;
          neighborhood: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          city: string;
          created_at?: string;
          cuisine_type?: string | null;
          id?: string;
          name: string;
          neighborhood: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          city?: string;
          created_at?: string;
          cuisine_type?: string | null;
          id?: string;
          name?: string;
          neighborhood?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      resolve_catalog_ingredient: {
        Args: { p_category?: string; p_name: string };
        Returns: {
          category: string;
          created_at: string;
          id: string;
          name: string;
          normalized_name: string;
        };
      };
      resolve_catalog_spirit: {
        Args: { p_brand: string; p_category?: string; p_product: string };
        Returns: {
          brand: string;
          category: string | null;
          created_at: string;
          id: string;
          normalized_name: string;
          product: string;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
