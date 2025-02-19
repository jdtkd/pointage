import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_KEY');
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Fonction utilitaire pour vérifier la connexion
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('pointages')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      return false;
    }

    console.log('Connexion Supabase OK');
    return true;
  } catch (error) {
    console.error('Erreur lors du test de connexion:', error);
    return false;
  }
} 