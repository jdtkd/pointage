import { Clock } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12 border rounded-lg bg-card">
      <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Aucun pointage</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Aucun pointage n'a été trouvé pour la période sélectionnée.
      </p>
    </div>
  );
} 