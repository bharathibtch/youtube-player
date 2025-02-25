// This file should be removed to avoid conflicts with pages/video.tsx

'use client';

import { VideoPlayer } from '@/components/VideoPlayer';
import { useVideoStore } from '@/app/store/videoStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VideoPage() {
  const router = useRouter();
  const { videoUrl, setIsPlaying, isPlaying } = useVideoStore();
  
  useEffect(() => {
    // Redirect to home if no video URL is set
    if (!videoUrl) {
      router.push('/');
      return;
    }

    // Set playing state when entering the page
    if (!isPlaying) {
      setIsPlaying(true);
    }

    // Cleanup when leaving the page
    return () => {
      // Keep the playing state when navigating away
      // This allows the time to keep counting
    };
  }, [videoUrl, router, setIsPlaying, isPlaying]);

  if (!videoUrl) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <VideoPlayer />
    </div>
  );
}
