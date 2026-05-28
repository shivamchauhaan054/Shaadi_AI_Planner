export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      wedding_intakes: {
        Row: {
          id: string;
          wedding_date: string;
          guest_count: number;
          city: string;
          venue_type: string;
          total_budget: number;
          priorities: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_date: string;
          guest_count: number;
          city: string;
          venue_type: string;
          total_budget: number;
          priorities?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_date?: string;
          guest_count?: number;
          city?: string;
          venue_type?: string;
          total_budget?: number;
          priorities?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      recommendations: {
        Row: {
          id: string;
          intake_id: string;
          recommendations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          intake_id: string;
          recommendations?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          intake_id?: string;
          recommendations?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recommendations_intake_id_fkey";
            columns: ["intake_id"];
            isOneToOne: false;
            referencedRelation: "wedding_intakes";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          intake_id: string;
          vendor_category: string;
          vendor_name: string;
          amount_paid: number;
          payment_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          intake_id: string;
          vendor_category: string;
          vendor_name: string;
          amount_paid: number;
          payment_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          intake_id?: string;
          vendor_category?: string;
          vendor_name?: string;
          amount_paid?: number;
          payment_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_intake_id_fkey";
            columns: ["intake_id"];
            isOneToOne: false;
            referencedRelation: "wedding_intakes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/** Shorthand for table row types */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

/** Shorthand for insert payloads */
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

/** Shorthand for update payloads */
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type WeddingIntake = Tables<"wedding_intakes">;
export type WeddingIntakeInsert = TablesInsert<"wedding_intakes">;
export type WeddingIntakeUpdate = TablesUpdate<"wedding_intakes">;

export type Recommendation = Tables<"recommendations">;
export type RecommendationInsert = TablesInsert<"recommendations">;
export type RecommendationUpdate = TablesUpdate<"recommendations">;

export type Payment = Tables<"payments">;
export type PaymentInsert = TablesInsert<"payments">;
export type PaymentUpdate = TablesUpdate<"payments">;
