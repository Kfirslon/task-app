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
      profiles: {
        Row: {
          created_at: string | null
          name: string | null
          stripe_customer_id: string | null
          subscription_plan: string | null
          tasks_limit: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          name?: string | null
          stripe_customer_id?: string | null
          subscription_plan?: string | null
          tasks_limit?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          name?: string | null
          stripe_customer_id?: string | null
          subscription_plan?: string | null
          tasks_limit?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          image_url: string | null
          label: string | null
          rank: number | null
          task_id: string
          title: string
          updated_at: string | null
          user_id: string | null
          priority: string | null
          estimated_time: number | null
          ai_insights: Json | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          image_url?: string | null
          label?: string | null
          rank?: number | null
          task_id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          priority?: string | null
          estimated_time?: number | null
          ai_insights?: Json | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          image_url?: string | null
          label?: string | null
          rank?: number | null
          task_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          priority?: string | null
          estimated_time?: number | null
          ai_insights?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
