import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface VideoState {
  videoUrl: string;
  lastPlayedTime: number;
  lastSavedTime: Date | null;
  isPlaying: boolean;
  setVideoUrl: (url: string) => void;
  setLastPlayedTime: (time: number) => void;
  setLastSavedTime: (time: Date) => void;
  setIsPlaying: (playing: boolean) => void;
  calculateResumeTime: () => number;
}

const initialState = {
  videoUrl: '',
  lastPlayedTime: 0,
  lastSavedTime: null,
  isPlaying: false,
};

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setVideoUrl: (url) => set({ videoUrl: url }),
      setLastPlayedTime: (time) => {
        set({ 
          lastPlayedTime: time,
          lastSavedTime: new Date()
        });
      },
      setLastSavedTime: (time) => set({ lastSavedTime: time }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      calculateResumeTime: () => {
        const { lastPlayedTime, lastSavedTime } = get();
        
        if (!lastSavedTime) return 0;
        
        const now = new Date();
        const savedDate = new Date(lastSavedTime);
        const timeDifference = (now.getTime() - savedDate.getTime()) / (1000 * 60); // in minutes
        
        // Calculate the time that should have passed
        const expectedTime = lastPlayedTime + (timeDifference * 60); // Convert minutes to seconds
        
        // If the expected time is more than 10 minutes, cap at 10:00
        if (expectedTime >= 600) { // 10 minutes in seconds
          return 600;
        }
        
        return expectedTime;
      }
    }),
    {
      name: 'video-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        videoUrl: state.videoUrl,
        lastPlayedTime: state.lastPlayedTime,
        lastSavedTime: state.lastSavedTime,
        isPlaying: state.isPlaying,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // If we need to migrate from version 0 to version 1
          return {
            ...initialState,
            ...persistedState,
            // Add any necessary state transformations here
          };
        }
        return persistedState;
      },
    }
  )
);
