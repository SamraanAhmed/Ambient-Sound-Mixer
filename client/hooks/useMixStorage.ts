import { useEffect } from "react";
import { SoundCategory } from "./useAudio";

const STORAGE_KEY = "ambient-sound-mix";

export interface SavedMix {
  categories: Array<{
    id: string;
    sounds: Array<{ id: string; volume: number; isActive: boolean }>;
  }>;
  timestamp: number;
}

export const useMixStorage = (
  categories: SoundCategory[],
  updateSoundVolume: (
    categoryId: string,
    soundId: string,
    volume: number,
  ) => void,
) => {
  // Auto-save mix when sounds change
  useEffect(() => {
    const activeSounds = categories.flatMap((cat) =>
      cat.sounds.filter((s) => s.isActive),
    );

    if (activeSounds.length > 0) {
      const mixData: SavedMix = {
        categories: categories.map((category) => ({
          id: category.id,
          sounds: category.sounds.map(({ id, volume, isActive }) => ({
            id,
            volume,
            isActive,
          })),
        })),
        timestamp: Date.now(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mixData));
      } catch (error) {
        console.warn("Failed to save mix:", error);
      }
    }
  }, [categories]);

  // Load saved mix on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const mixData: SavedMix = JSON.parse(saved);

        // Update sounds with saved values using updateSoundVolume
        mixData.categories.forEach((savedCategory) => {
          savedCategory.sounds.forEach((savedSound) => {
            if (savedSound.volume > 0) {
              updateSoundVolume(
                savedCategory.id,
                savedSound.id,
                savedSound.volume,
              );
            }
          });
        });
      }
    } catch (error) {
      console.warn("Failed to load saved mix:", error);
    }
  }, [updateSoundVolume]);

  const clearSavedMix = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      categories.forEach((category) => {
        category.sounds.forEach((sound) => {
          updateSoundVolume(category.id, sound.id, 0);
        });
      });
    } catch (error) {
      console.warn("Failed to clear saved mix:", error);
    }
  };

  return { clearSavedMix };
};
