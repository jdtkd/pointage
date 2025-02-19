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
      pointages: {
        Row: {
          id: string
          user_id: string
          type: 'ARRIVEE' | 'DEPART'
          timestamp: string
          location: Json
          commentaire: string | null
          status: 'EN_ATTENTE' | 'VALIDE' | 'REJETE'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pointages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pointages']['Insert']>
      }
    }
  }
} 