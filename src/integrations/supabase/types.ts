export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      catering_leads: {
        Row: {
          created_at: string
          email: string
          event_date: string
          event_location: string | null
          event_type: string
          full_name: string
          headcount: number
          id: string
          notes: string | null
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          event_date: string
          event_location?: string | null
          event_type: string
          full_name: string
          headcount: number
          id?: string
          notes?: string | null
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          event_date?: string
          event_location?: string | null
          event_type?: string
          full_name?: string
          headcount?: number
          id?: string
          notes?: string | null
          phone?: string
        }
        Relationships: []
      }
      consent_events: {
        Row: {
          action: string
          channel: string
          created_at: string
          customer_id: string | null
          email: string | null
          id: string
          ip_address: string | null
          phone: string | null
          source: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          channel: string
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          phone?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          channel?: string
          created_at?: string
          customer_id?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          phone?: string | null
          source?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          birthday_day: number | null
          birthday_month: number | null
          created_at: string
          email: string | null
          email_consent_ip: string | null
          email_consent_timestamp: string | null
          email_opt_in: boolean
          first_name: string | null
          id: string
          last_name: string | null
          last_sign_in_at: string | null
          phone: string
          phone_verified: boolean
          pos_loyalty_linked: boolean
          signup_source: string
          sms_consent_ip: string | null
          sms_consent_timestamp: string | null
          sms_opt_in: boolean
          unsubscribe_token: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          birthday_day?: number | null
          birthday_month?: number | null
          created_at?: string
          email?: string | null
          email_consent_ip?: string | null
          email_consent_timestamp?: string | null
          email_opt_in?: boolean
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          phone: string
          phone_verified?: boolean
          pos_loyalty_linked?: boolean
          signup_source?: string
          sms_consent_ip?: string | null
          sms_consent_timestamp?: string | null
          sms_opt_in?: boolean
          unsubscribe_token?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          birthday_day?: number | null
          birthday_month?: number | null
          created_at?: string
          email?: string | null
          email_consent_ip?: string | null
          email_consent_timestamp?: string | null
          email_opt_in?: boolean
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          phone?: string
          phone_verified?: boolean
          pos_loyalty_linked?: boolean
          signup_source?: string
          sms_consent_ip?: string | null
          sms_consent_timestamp?: string | null
          sms_opt_in?: boolean
          unsubscribe_token?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      franchise_inquiries: {
        Row: {
          capital: string
          created_at: string
          email: string
          experience_details: string | null
          full_name: string
          has_ownership_experience: boolean
          id: string
          locations_interest: string
          market: string
          notes: string | null
          phone: string
          timeline: string
        }
        Insert: {
          capital: string
          created_at?: string
          email: string
          experience_details?: string | null
          full_name: string
          has_ownership_experience: boolean
          id?: string
          locations_interest: string
          market: string
          notes?: string | null
          phone: string
          timeline: string
        }
        Update: {
          capital?: string
          created_at?: string
          email?: string
          experience_details?: string | null
          full_name?: string
          has_ownership_experience?: boolean
          id?: string
          locations_interest?: string
          market?: string
          notes?: string | null
          phone?: string
          timeline?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          availability: string[]
          created_at: string
          email: string
          experience_details: string | null
          full_name: string
          has_experience: boolean
          id: string
          is_adult: boolean
          notes: string | null
          phone: string
          position: string
          preferred_location: string
          sms_opt_in: boolean
        }
        Insert: {
          availability?: string[]
          created_at?: string
          email: string
          experience_details?: string | null
          full_name: string
          has_experience: boolean
          id?: string
          is_adult: boolean
          notes?: string | null
          phone: string
          position: string
          preferred_location: string
          sms_opt_in?: boolean
        }
        Update: {
          availability?: string[]
          created_at?: string
          email?: string
          experience_details?: string | null
          full_name?: string
          has_experience?: boolean
          id?: string
          is_adult?: boolean
          notes?: string | null
          phone?: string
          position?: string
          preferred_location?: string
          sms_opt_in?: boolean
        }
        Relationships: []
      }
      opening_signups: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          location_slug: string | null
          phone: string
          signup_source: string
          sms_opt_in: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          location_slug?: string | null
          phone: string
          signup_source?: string
          sms_opt_in?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          location_slug?: string | null
          phone?: string
          signup_source?: string
          sms_opt_in?: boolean
        }
        Relationships: []
      }
      suppression_list: {
        Row: {
          channel: string
          created_at: string
          id: string
          reason: string | null
          value: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          reason?: string | null
          value: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          reason?: string | null
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      normalize_phone: { Args: { _phone: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
