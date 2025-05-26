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
      centers: {
        Row: {
          created_at: string
          description: string | null
          founded_year: number | null
          id: string
          location: string | null
          mission: string | null
          name: string
          short_name: string
          updated_at: string
          vision: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id: string
          location?: string | null
          mission?: string | null
          name: string
          short_name: string
          updated_at?: string
          vision?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          location?: string | null
          mission?: string | null
          name?: string
          short_name?: string
          updated_at?: string
          vision?: string | null
          website?: string | null
        }
        Relationships: []
      }
      kpi_update_requests: {
        Row: {
          center_id: string
          created_at: string
          current_target: number
          current_value: number
          data_source: string
          evaluator_comments: string | null
          id: string
          impact_on_related_kpis: string | null
          justification: string
          kpi_id: string
          kpi_name: string
          measurement_period: string
          proposed_target: number | null
          proposed_value: number
          reviewed_by: string | null
          reviewed_date: string | null
          status: Database["public"]["Enums"]["request_status"]
          submitted_by: string
          submitted_date: string | null
          supporting_documents: string[] | null
          updated_at: string
        }
        Insert: {
          center_id: string
          created_at?: string
          current_target: number
          current_value: number
          data_source: string
          evaluator_comments?: string | null
          id?: string
          impact_on_related_kpis?: string | null
          justification: string
          kpi_id: string
          kpi_name: string
          measurement_period: string
          proposed_target?: number | null
          proposed_value: number
          reviewed_by?: string | null
          reviewed_date?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_by: string
          submitted_date?: string | null
          supporting_documents?: string[] | null
          updated_at?: string
        }
        Update: {
          center_id?: string
          created_at?: string
          current_target?: number
          current_value?: number
          data_source?: string
          evaluator_comments?: string | null
          id?: string
          impact_on_related_kpis?: string | null
          justification?: string
          kpi_id?: string
          kpi_name?: string
          measurement_period?: string
          proposed_target?: number | null
          proposed_value?: number
          reviewed_by?: string | null
          reviewed_date?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_by?: string
          submitted_date?: string | null
          supporting_documents?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_update_requests_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_update_requests_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          category: string | null
          center_id: string
          created_at: string
          current_value: number
          id: string
          measurement: string | null
          name: string
          target_value: number
          unit: string | null
          updated_at: string
          why_it_matters: string | null
        }
        Insert: {
          category?: string | null
          center_id: string
          created_at?: string
          current_value?: number
          id?: string
          measurement?: string | null
          name: string
          target_value: number
          unit?: string | null
          updated_at?: string
          why_it_matters?: string | null
        }
        Update: {
          category?: string | null
          center_id?: string
          created_at?: string
          current_value?: number
          id?: string
          measurement?: string | null
          name?: string
          target_value?: number
          unit?: string | null
          updated_at?: string
          why_it_matters?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          request_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          request_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          request_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "kpi_update_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          managed_center_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          managed_center_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          managed_center_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      workflow_history: {
        Row: {
          action: Database["public"]["Enums"]["workflow_action"]
          comments: string | null
          created_at: string
          from_state: Database["public"]["Enums"]["request_status"] | null
          id: string
          performed_by: string
          request_id: string
          to_state: Database["public"]["Enums"]["request_status"]
        }
        Insert: {
          action: Database["public"]["Enums"]["workflow_action"]
          comments?: string | null
          created_at?: string
          from_state?: Database["public"]["Enums"]["request_status"] | null
          id?: string
          performed_by: string
          request_id: string
          to_state: Database["public"]["Enums"]["request_status"]
        }
        Update: {
          action?: Database["public"]["Enums"]["workflow_action"]
          comments?: string | null
          created_at?: string
          from_state?: Database["public"]["Enums"]["request_status"] | null
          id?: string
          performed_by?: string
          request_id?: string
          to_state?: Database["public"]["Enums"]["request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "workflow_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "kpi_update_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_managed_center: {
        Args: { user_id?: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id?: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      request_status:
        | "draft"
        | "submitted"
        | "under-review"
        | "approved"
        | "rejected"
        | "revision-requested"
        | "resubmitted"
      user_role: "evaluator" | "manager"
      workflow_action:
        | "submit"
        | "start-review"
        | "approve"
        | "reject"
        | "request-revision"
        | "resubmit"
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
      request_status: [
        "draft",
        "submitted",
        "under-review",
        "approved",
        "rejected",
        "revision-requested",
        "resubmitted",
      ],
      user_role: ["evaluator", "manager"],
      workflow_action: [
        "submit",
        "start-review",
        "approve",
        "reject",
        "request-revision",
        "resubmit",
      ],
    },
  },
} as const
