'use client';

import { useNetworkStatus } from '@/hooks/use-network-status';
import { AlertCircle } from 'lucide-react';

export function OfflineFallback() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-yellow-900 p-2 text-center">
      <div className="flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Vous êtes hors ligne. Les données seront synchronisées une fois la connexion rétablie.</span>
      </div>
    </div>
  );
} 