// src/hooks/useAudio.tsx
import { useCallback, useEffect, useRef, useState } from "react";

export interface SubSound {
  id: string;
  name: string;
  url: string; // Path to the audio file
  volume: number; // 0-100
  isActive: boolean;
}

export interface SoundCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  sounds: SubSound[];
}

// AudioState not strictly necessary as an interface for the return type of useAudio
// export interface AudioState {
//   isPlaying: boolean;
//   categories: SoundCategory[];
// }

const INITIAL_CATEGORIES: Omit<SoundCategory, "sounds">[] = [
  {
    id: "nature",
    name: "Nature",
    icon: "🌿",
    description: "Natural outdoor ambience",
  },
  {
    id: "indoor",
    name: "Indoor",
    icon: "🏠",
    description: "Cozy indoor atmospheres",
  },
  {
    id: "synthetic",
    name: "Synthetic",
    icon: "⚡",
    description: "Generated ambient tones",
  },
  {
    id: "wildlife",
    name: "Wildlife",
    icon: "🦋",
    description: "Animal and nature sounds",
  },
  {
    id: "weather",
    name: "Weather",
    icon: "⛈️",
    description: "Atmospheric weather sounds",
  },
];

const INITIAL_SOUNDS: Record<string, Omit<SubSound, "volume" | "isActive">[]> =
  {
    nature: [
      {
        id: "gentle-rain",
        name: "Gentle Rain",
        url: "/sounds/gentle-rain.mp3",
      },
      {
        id: "ocean-waves",
        name: "Ocean Waves",
        url: "/sounds/ocean-waves.mp3",
      },
      {
        id: "forest-breeze",
        name: "Forest Breeze",
        url: "/sounds/forest-breeze.mp3",
      },
    ],
    indoor: [
      {
        id: "fireplace",
        name: "Fireplace Crackle",
        url: "/sounds/fireplace.mp3",
      },
      {
        id: "cafe-chatter",
        name: "Cafe Chatter",
        url: "/sounds/cafe-chatter.mp3",
      },
      {
        id: "ticking-clock",
        name: "Ticking Clock",
        url: "/sounds/ticking-clock.mp3",
      },
    ],
    synthetic: [
      {
        id: "white-noise",
        name: "White Noise",
        url: "/sounds/white-noise.mp3",
      },
      { id: "pink-noise", name: "Pink Noise", url: "/sounds/pink-noise.mp3" },
      {
        id: "brown-noise",
        name: "Brown Noise",
        url: "/sounds/brown-noise.mp3",
      },
    ],
    wildlife: [
      {
        id: "morning-birds",
        name: "Morning Birdsong",
        url: "/sounds/morning-birds.mp3",
      },
      { id: "crickets", name: "Crickets", url: "/sounds/crickets.mp3" },
      { id: "frogs", name: "Frogs", url: "/sounds/frogs.mp3" },
    ],
    weather: [
      {
        id: "soft-thunder",
        name: "Soft Thunder",
        url: "/sounds/soft-thunder.mp3",
      },
      {
        id: "stormy-wind",
        name: "Stormy Wind",
        url: "/sounds/stormy-wind.mp3",
      },
      {
        id: "snow-blizzard",
        name: "Snow Blizzard",
        url: "/sounds/snow-blizzard.mp3",
      },
    ],
  };

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [globalSpeed, setGlobalSpeed] = useState(1.0); // 1.0 = normal speed
  const [globalFrequency, setGlobalFrequency] = useState(1000); // 1000Hz = normal
  const [categories, setCategories] = useState<SoundCategory[]>(() =>
    INITIAL_CATEGORIES.map((category) => ({
      ...category,
      sounds: INITIAL_SOUNDS[category.id].map((sound) => ({
        ...sound,
        volume: 0,
        isActive: false,
      })),
    })),
  );

  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const gainNodes = useRef<Map<string, GainNode>>(new Map());
  const filterNodes = useRef<Map<string, BiquadFilterNode>>(new Map());
  const audioContext = useRef<AudioContext | null>(null);

  // Get all sounds flattened
  const allSounds = categories.flatMap((category) => category.sounds);

  // Initialize audio context and elements
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Create AudioContext only if it doesn't exist or is closed
        if (!audioContext.current || audioContext.current.state === "closed") {
          audioContext.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        }

        for (const category of INITIAL_CATEGORIES) {
          for (const sound of INITIAL_SOUNDS[category.id]) {
            // Only create if not already present in refs
            if (!audioRefs.current.has(sound.id)) {
              const audio = new Audio();
              audio.src = sound.url;
              audio.loop = true;
              audio.preload = "auto"; // Preload audio for faster playback

              // Handle load errors gracefully
              audio.addEventListener("error", () => {
                console.warn(`Failed to load audio: ${sound.name} from ${sound.url}`);
              });

              // Add a loadeddata listener to confirm loading
              audio.addEventListener("loadeddata", () => {
                // console.log(`Audio loaded: ${sound.name}`);
              });

              // Create audio processing chain: source -> filter -> gain -> destination
              const gainNode = audioContext.current.createGain();
              const filterNode = audioContext.current.createBiquadFilter();
              const source = audioContext.current.createMediaElementSource(audio);

              // Configure filter
              filterNode.type = "lowpass";
              filterNode.frequency.value = globalFrequency; // Apply initial global frequency
              filterNode.Q.value = 1; // Default Q value, often 1 is good for lowpass

              // Connect the audio chain
              source.connect(filterNode);
              filterNode.connect(gainNode);
              gainNode.connect(audioContext.current.destination);

              gainNode.gain.value = 0; // Initialize gain to 0 (silent)

              audioRefs.current.set(sound.id, audio);
              gainNodes.current.set(sound.id, gainNode);
              filterNodes.current.set(sound.id, filterNode);
            }
          }
        }
      } catch (error) {
        console.error("Audio initialization failed:", error);
        // Fallback or show a message to the user if audio context fails
      }
    };

    initAudio();

    // Cleanup function
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = ""; // Clear src to release resources
        // Do not reload, just clear.
      });
      audioRefs.current.clear();
      gainNodes.current.clear();
      filterNodes.current.clear();

      // Close AudioContext if it exists and is not already closed
      if (audioContext.current?.state !== "closed") {
        audioContext.current?.close();
        audioContext.current = null; // Clear the ref
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // Effect to manage individual sound playback based on isActive and volume
  useEffect(() => {
    allSounds.forEach((sound) => {
      const audio = audioRefs.current.get(sound.id);
      const gainNode = gainNodes.current.get(sound.id);

      if (audio && gainNode) {
        // Set gain based on the sound's volume
        // Using `setValueAtTime` for smoother transitions than direct `gain.value =`
        gainNode.gain.setValueAtTime(
          sound.volume / 100,
          audioContext.current?.currentTime || 0,
        );

        if (sound.isActive && sound.volume > 0) {
          // Play only if it's active AND has volume
          // Ensure audio context is not suspended when trying to play
          if (audioContext.current?.state === 'suspended') {
            audioContext.current.resume().then(() => {
              audio.play().catch((e) => console.warn(`Autoplay blocked for ${sound.name}:`, e));
            });
          } else {
            audio.play().catch((e) => console.warn(`Failed to play ${sound.name}:`, e));
          }
        } else {
          audio.pause();
        }
      }
    });
  }, [allSounds]); // Re-run when any sound's properties (volume, isActive) change

  // Effect to manage global playback state (Play/Pause Mix button)
  useEffect(() => {
    // This effect ensures that when the global `isPlaying` state changes,
    // all sounds respond accordingly, respecting their individual `isActive` and `volume`
    allSounds.forEach((sound) => {
      const audio = audioRefs.current.get(sound.id);
      if (audio) {
        if (isPlaying && sound.isActive && sound.volume > 0) {
          if (audioContext.current?.state === 'suspended') {
            audioContext.current.resume().then(() => {
              audio.play().catch((e) => console.warn(`Autoplay blocked for ${sound.name}:`, e));
            });
          } else {
            audio.play().catch((e) => console.warn(`Failed to play ${sound.name}:`, e));
          }
        } else {
          audio.pause();
        }
      }
    });
  }, [isPlaying, allSounds]); // Depends on global isPlaying and individual sound states

  const togglePlayback = useCallback(async () => {
    if (!audioContext.current) {
      console.warn("AudioContext not initialized.");
      return;
    }

    try {
      if (audioContext.current.state === "suspended") {
        // Resume context on user gesture
        await audioContext.current.resume();
      }

      if (isPlaying) {
        // Pause all sounds and set global state
        audioRefs.current.forEach((audio) => audio.pause());
        setIsPlaying(false);
      } else {
        // Attempt to play all currently active sounds
        const playPromises = allSounds
          .filter((s) => s.isActive && s.volume > 0)
          .map((s) => {
            const audio = audioRefs.current.get(s.id);
            if (audio) {
              return audio.play().catch((e) => console.warn(`Failed to play ${s.name}:`, e));
            }
            return Promise.resolve(); // Resolve for sounds without audio element or if already playing
          });

        await Promise.allSettled(playPromises); // Wait for all play attempts
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback control error:", error);
    }
  }, [isPlaying, allSounds]);

  const updateSoundVolume = useCallback(
    (categoryId: string, soundId: string, volume: number) => {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                sounds: category.sounds.map((sound) =>
                  sound.id === soundId
                    ? { ...sound, volume, isActive: volume > 0 } // isActive truly reflects if volume is > 0
                    : sound,
                ),
              }
            : category,
        ),
      );

      const gainNode = gainNodes.current.get(soundId);
      if (gainNode && audioContext.current) {
        // Set gain using `setValueAtTime` for smooth volume changes
        gainNode.gain.setValueAtTime(
          volume / 100, // Convert 0-100 to 0-1 range
          audioContext.current.currentTime,
        );
      }

      const audio = audioRefs.current.get(soundId);
      // If setting volume > 0 and mixer is playing, ensure individual sound also plays
      if (audio && volume > 0 && isPlaying) {
        if (audioContext.current?.state === 'suspended') {
            audioContext.current.resume().then(() => {
              audio.play().catch((e) => console.warn(`Autoplay blocked for ${soundId} on volume change:`, e));
            });
          } else {
            audio.play().catch((e) => console.warn(`Failed to play ${soundId} on volume change:`, e));
          }
      } else if (audio && volume === 0) {
        // If volume becomes 0, pause the individual audio
        audio.pause();
      }
    },
    [isPlaying],
  );

  const randomizeMix = useCallback(() => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        sounds: category.sounds.map((sound) => {
          const shouldBeActive = Math.random() > 0.6; // 40% chance to be active
          const volume = shouldBeActive
            ? Math.floor(Math.random() * 60) + 30 // 30-90% volume
            : 0;

          // Update gain node directly for immediate audio effect
          const gainNode = gainNodes.current.get(sound.id);
          if (gainNode && audioContext.current) {
            gainNode.gain.setValueAtTime(
              volume / 100,
              audioContext.current.currentTime,
            );
          }

          // Play/pause the audio based on new volume
          const audio = audioRefs.current.get(sound.id);
          if (audio) {
            if (volume > 0 && isPlaying) {
              if (audioContext.current?.state === 'suspended') {
                audioContext.current.resume().then(() => {
                  audio.play().catch((e) => console.warn(`Autoplay blocked for ${sound.id} during randomize:`, e));
                });
              } else {
                audio.play().catch((e) => console.warn(`Failed to play ${sound.id} during randomize:`, e));
              }
            } else {
              audio.pause();
            }
          }

          return {
            ...sound,
            volume,
            isActive: volume > 0,
          };
        }),
      })),
    );
  }, [isPlaying]);

  const resetAllSounds = useCallback(() => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        sounds: category.sounds.map((sound) => {
          const gainNode = gainNodes.current.get(sound.id);
          if (gainNode && audioContext.current) {
            gainNode.gain.setValueAtTime(
              0, // Set gain to 0
              audioContext.current.currentTime,
            );
          }

          const audio = audioRefs.current.get(sound.id);
          audio?.pause(); // Pause the audio

          return {
            ...sound,
            volume: 0,
            isActive: false,
          };
        }),
      })),
    );
    setIsPlaying(false); // Also stop the global playback
  }, []);

  const updateGlobalSpeed = useCallback((speed: number) => {
    setGlobalSpeed(speed);

    // Update playback rate for all audio elements
    audioRefs.current.forEach((audio) => {
      audio.playbackRate = speed;
    });
  }, []);

  const updateGlobalFrequency = useCallback((frequency: number) => {
    setGlobalFrequency(frequency);

    // Update frequency for all filter nodes
    filterNodes.current.forEach((filterNode) => {
      if (audioContext.current) { // Ensure context is available
        filterNode.frequency.setValueAtTime(
          frequency,
          audioContext.current.currentTime,
        );
      }
    });
  }, []);

  return {
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
  };
};