export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      time_entries: {
        Row: {
          id: string
          user_id: string
          clock_in: string
          clock_out: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clock_in: string
          clock_out?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clock_in?: string
          clock_out?: string | null
          created_at?: string
        }
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
  }
} 