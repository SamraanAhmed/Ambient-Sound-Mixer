import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

interface SoundControlProps {
  id: string;
  name: string;
  volume: number;
  isActive: boolean;
  onVolumeChange: (volume: number) => void;
}

const soundIcons: Record<string, string> = {
  rain: "🌧️",
  ocean: "🌊",
  wind: "💨",
  fire: "🔥",
  birds: "🐦",
  coffee: "☕",
  thunder: "⛈️",
  night: "🌙",
};

export const SoundControl: React.FC<SoundControlProps> = ({
  id,
  name,
  volume,
  isActive,
  onVolumeChange,
}) => {
  const icon = soundIcons[id] || "🎵";

  return (
    <div
      className={cn(
        "group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]",
        isActive
          ? "bg-card border-ambient-500/30 shadow-lg shadow-ambient-500/10"
          : "bg-card/50 border-border hover:border-border/80",
      )}
    >
      {/* Sound Icon & Name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "text-2xl transition-all duration-300",
              isActive && "scale-110",
            )}
          >
            {icon}
          </div>
          <div>
            <h3
              className={cn(
                "font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">{volume}%</p>
          </div>
        </div>

        {/* Volume Icon */}
        <div
          className={cn(
            "transition-colors",
            isActive ? "text-ambient-500" : "text-muted-foreground/50",
          )}
        >
          {volume > 0 ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
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
            isActive && "opacity-100",
            !isActive && "opacity-70",
          )}
        />

        {/* Visual Level Indicator */}
        <div className="flex gap-1 h-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-full transition-all duration-200",
                i < Math.floor(volume / 10) ? "bg-ambient-500" : "bg-muted/30",
              )}
            />
          ))}
        </div>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-ambient-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};
