import { Clock } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">Aucun pointage</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Les pointages effectués apparaîtront ici.
      </p>
    </div>
  );
} 