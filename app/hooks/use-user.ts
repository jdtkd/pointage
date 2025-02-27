'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useUser() {
  // TODO: Implémenter avec Supabase
  const [user] = useState<User | null>(null);

  const signOut = async () => {
    // TODO: Implémenter la déconnexion
    console.log('Déconnexion...');
  };

  return {
    user,
    signOut,
  };
} 