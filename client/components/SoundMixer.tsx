import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudio } from "@/hooks/useAudio";
import { useMixStorage } from "@/hooks/useMixStorage";
import {
  Pause,
  Play,
  Shuffle,
  RotateCcw,
  Settings,
  Zap,
  Radio,
} from "lucide-react";
import { SoundCategory } from "./SoundCategory";
import { useState } from "react";

export const SoundMixer: React.FC = () => {
  const {
    isPlaying,
    categories,
    allSounds,
    globalSpeed,
    globalFrequency,
    togglePlayback,
    updateSoundVolume,
    randomizeMix,
    resetAllSounds,
    updateGlobalSpeed,
    updateGlobalFrequency,
  } = useAudio();

  const { clearSavedMix } = useMixStorage(categories, updateSoundVolume);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeSounds = allSounds.filter((s) => s.isActive);
  const hasActiveSounds = activeSounds.length > 0;
  const activeCategories = categories.filter((cat) =>
    cat.sounds.some((s) => s.isActive),
  );

  const handleClearMix = () => {
    clearSavedMix();
    resetAllSounds();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-ambient-500 to-foreground bg-clip-text text-transparent mb-4">
            Ambient Sound Mixer
          </h1>
          <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-3xl mx-auto">
            Create your perfect soundscape for focus, relaxation, or sleep.
            Choose from five categories of ambient sounds to craft your ideal
            environment.
          </p>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          <Button
            onClick={togglePlayback}
            size="lg"
            className="h-14 md:h-16 px-6 md:px-8 text-base md:text-lg font-medium bg-ambient-600 hover:bg-ambient-700 text-white shadow-lg shadow-ambient-500/25 transition-all duration-300 hover:scale-105 min-w-[160px]"
            disabled={!hasActiveSounds}
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Pause Mix
              </>
            ) : (
              <>
                <Play className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Play Mix
              </>
            )}
          </Button>

          <Button
            onClick={randomizeMix}
            variant="outline"
            size="lg"
            className="h-14 md:h-16 px-4 md:px-6 border-ambient-500/30 hover:bg-ambient-500/10 hover:border-ambient-500/50 transition-all duration-300"
          >
            <Shuffle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Randomize
          </Button>

          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            size="lg"
            className="h-14 md:h-16 px-4 md:px-6 hover:bg-muted/50 transition-all duration-300"
          >
            <Settings className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Options
          </Button>
        </div>

        {/* Advanced Controls */}
        {showAdvanced && (
          <div className="flex justify-center mb-8">
            <div className="bg-card border border-border rounded-xl p-6 max-w-4xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Speed Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-ambient-500" />
                    <label className="text-sm font-medium">Speed Control</label>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {globalSpeed.toFixed(2)}x
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[globalSpeed]}
                      onValueChange={([value]) => updateGlobalSpeed(value)}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Slow</span>
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Adjust playback speed. Lower values create deeper, slower
                    rhythms.
                  </p>
                </div>

                {/* Frequency Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-purple-500" />
                    <label className="text-sm font-medium">
                      Frequency Filter
                    </label>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {globalFrequency}Hz
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[globalFrequency]}
                      onValueChange={([value]) => updateGlobalFrequency(value)}
                      min={200}
                      max={8000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Bass</span>
                      <span>Mid</span>
                      <span>Treble</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Low-pass filter frequency. Lower values create warmer,
                    bassier sounds.
                  </p>
                </div>

                {/* Reset Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Reset Options</label>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={handleClearMix}
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Sounds
                    </Button>
                    <Button
                      onClick={() => {
                        updateGlobalSpeed(1.0);
                        updateGlobalFrequency(1000);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Reset Controls
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reset volumes and audio settings to defaults.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        {hasActiveSounds && (
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-3 bg-card rounded-xl border border-ambient-500/30 shadow-sm">
              <div className="w-2 h-2 bg-ambient-500 rounded-full animate-pulse" />
              <span className="text-sm md:text-base font-medium">
                {activeSounds.length} sound
                {activeSounds.length !== 1 ? "s" : ""} active across{" "}
                {activeCategories.length} categor
                {activeCategories.length !== 1 ? "ies" : "y"}
              </span>
            </div>
          </div>
        )}

        {/* Sound Categories */}
        <div className="space-y-6 md:space-y-8">
          {categories.map((category) => (
            <SoundCategory
              key={category.id}
              category={category}
              onVolumeChange={(soundId, volume) =>
                updateSoundVolume(category.id, soundId, volume)
              }
            />
          ))}
        </div>

        {/* Usage Tips */}
        <div className="mt-12 md:mt-16">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-6 text-center text-muted-foreground">
              💡 Sound Mixing Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-sm">
              <div className="p-4 md:p-5 bg-card/50 rounded-xl border border-border/50">
                <strong className="block text-foreground mb-2 text-base">
                  🎯 Deep Focus
                </strong>
                <p className="text-muted-foreground">
                  Combine gentle rain with white noise and soft cafe chatter
                  (20-40% volume each).
                </p>
              </div>
              <div className="p-4 md:p-5 bg-card/50 rounded-xl border border-border/50">
                <strong className="block text-foreground mb-2 text-base">
                  🧘 Relaxation
                </strong>
                <p className="text-muted-foreground">
                  Mix fireplace crackle, forest breeze, and crickets for a cozy
                  evening atmosphere.
                </p>
              </div>
              <div className="p-4 md:p-5 bg-card/50 rounded-xl border border-border/50">
                <strong className="block text-foreground mb-2 text-base">
                  😴 Sleep
                </strong>
                <p className="text-muted-foreground">
                  Use ocean waves or brown noise as a base (50-70%) with minimal
                  other sounds.
                </p>
              </div>
              <div className="p-4 md:p-5 bg-card/50 rounded-xl border border-border/50">
                <strong className="block text-foreground mb-2 text-base">
                  🌧️ Stormy Vibes
                </strong>
                <p className="text-muted-foreground">
                  Layer soft thunder, gentle rain, and stormy wind for dramatic
                  weather ambience.
                </p>
              </div>
              <div className="p-4 md:p-5 bg-card/50 rounded-xl border border-border/50">
                <strong className="block text-foreground mb-2 text-base">
                  🏠 Cozy Indoor
                </strong>
                <p className="text-muted-foreground">
                  Blend fireplace, ticking clock, and pink noise for a warm
                  study environment.
                </p>
              </div>
              <div className="p-4 md:p-5 bg-card/50 rounded-xl border border-border/50">
                <strong className="block text-foreground mb-2 text-base">
                  🦋 Nature Immersion
                </strong>
                <p className="text-muted-foreground">
                  Combine morning birds, forest breeze, and frogs for a full
                  outdoor experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Development Notice */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
            <span className="text-amber-500 text-sm">⚠️</span>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Audio files are not included in this demo. Add MP3 files to{" "}
              <code className="px-1 py-0.5 bg-amber-500/20 rounded text-xs">
                public/sounds/
              </code>{" "}
              for full functionality.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Your mix is automatically saved and will be restored on your next
            visit
          </p>
        </div>
      </div>
    </div>
  );
};
