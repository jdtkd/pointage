interface HeuresAffichageProps {
  heures: number;
  className?: string;
  showLabel?: boolean;
}

export function HeuresAffichage({ heures, className = "", showLabel = false }: HeuresAffichageProps) {
  const heuresEntieres = Math.floor(heures);
  const minutes = Math.round((heures - heuresEntieres) * 60);
  
  return (
    <span className={className}>
      {heuresEntieres.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
      {showLabel && <span className="text-xs ml-1">h</span>}
    </span>
  );
} 