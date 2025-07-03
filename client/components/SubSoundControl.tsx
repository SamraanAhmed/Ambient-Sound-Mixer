import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

interface SubSoundControlProps {
  id: string;
  name: string;
  volume: number;
  isActive: boolean;
  onVolumeChange: (volume: number) => void;
}

export const SubSoundControl: React.FC<SubSoundControlProps> = ({
  id,
  name,
  volume,
  isActive,
  onVolumeChange,
}) => {
  return (
    <div
      className={cn(
        "group p-4 rounded-xl border transition-all duration-300",
        isActive
          ? "bg-card border-ambient-500/20 shadow-sm"
          : "bg-card/30 border-border/50 hover:border-border/80",
      )}
    >
      {/* Sound Name & Volume */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h4
            className={cn(
              "font-medium text-sm transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {name}
          </h4>
          <p className="text-xs text-muted-foreground/70">{volume}%</p>
        </div>

        {/* Volume Icon */}
        <div
          className={cn(
            "transition-colors ml-2",
            isActive ? "text-ambient-500" : "text-muted-foreground/40",
          )}
        >
          {volume > 0 ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
        </div>
      </div>

      {/* Volume Slider */}
      <div className="space-y-2">
        <Slider
          value={[volume]}
          onValueChange={([value]) => onVolumeChange(value)}
          max={100}
          step={1}
          className={cn(
            "w-full transition-all duration-300",
            isActive ? "opacity-100" : "opacity-60",
          )}
        />

        {/* Mini Visual Level Indicator */}
        <div className="flex gap-0.5 h-0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full transition-all duration-200",
                i < Math.floor(volume / 12.5)
                  ? "bg-ambient-500/80"
                  : "bg-muted/20",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
