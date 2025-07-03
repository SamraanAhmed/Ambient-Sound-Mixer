import { SoundCategory as SoundCategoryType } from "@/hooks/useAudio";
import { SubSoundControl } from "./SubSoundControl";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SoundCategoryProps {
  category: SoundCategoryType;
  onVolumeChange: (soundId: string, volume: number) => void;
}

export const SoundCategory: React.FC<SoundCategoryProps> = ({
  category,
  onVolumeChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const activeSounds = category.sounds.filter((s) => s.isActive);
  const hasActiveSounds = activeSounds.length > 0;

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border transition-all duration-300",
        hasActiveSounds
          ? "border-ambient-500/30 shadow-lg shadow-ambient-500/5"
          : "border-border",
      )}
    >
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full p-6 flex items-center justify-between transition-all duration-300 hover:bg-muted/5 rounded-2xl",
          !isExpanded && "rounded-b-2xl",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "text-3xl transition-all duration-300",
              hasActiveSounds && "scale-110",
            )}
          >
            {category.icon}
          </div>
          <div className="text-left">
            <h2
              className={cn(
                "text-xl font-semibold transition-colors",
                hasActiveSounds ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {category.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Count */}
          {hasActiveSounds && (
            <div className="flex items-center gap-2 px-3 py-1 bg-ambient-500/10 rounded-full border border-ambient-500/20">
              <div className="w-1.5 h-1.5 bg-ambient-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-ambient-600 dark:text-ambient-400">
                {activeSounds.length} active
              </span>
            </div>
          )}

          {/* Expand/Collapse Icon */}
          <div className="text-muted-foreground transition-transform duration-300">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </button>

      {/* Category Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.sounds.map((sound) => (
              <SubSoundControl
                key={sound.id}
                id={sound.id}
                name={sound.name}
                volume={sound.volume}
                isActive={sound.isActive}
                onVolumeChange={(volume) => onVolumeChange(sound.id, volume)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
