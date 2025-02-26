/* eslint-disable */
'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useVideoStore } from '@/app/store/videoStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import 'plyr/dist/plyr.css';
import type { PlyrInstance } from 'plyr-react';

// Dynamically import Plyr with no SSR
const PlyrComponent = dynamic(() => import('plyr-react'), {
  ssr: false,
  loading: () => (
    <div className="relative aspect-video w-full max-w-4xl bg-gray-100 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        Loading player...
      </div>
    </div>
  ),
});

export function VideoPlayer() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { 
    videoUrl, 
    setLastPlayedTime,
    setLastSavedTime,
    calculateResumeTime,
    setIsPlaying,
    isPlaying 
  } = useVideoStore();
  
  const playerRef = useRef<PlyrInstance>(null);
  const initialSeekDone = useRef(false);

  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  useEffect(() => {
    setIsClient(true);
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  useEffect(() => {
    return () => {
      const currentPlayer = playerRef.current;
      if (currentPlayer) {
        setLastPlayedTime(currentPlayer.currentTime || 0);
        setLastSavedTime(new Date());
      }
    };
  }, [setLastPlayedTime, setLastSavedTime]);

  interface PlyrEventDetail {
    detail: {
      plyr: PlyrInstance;
    };
  }

  const handlePlyrEvents = {
    timeupdate: (event: PlyrEventDetail) => {
      if (!event?.detail?.plyr) return;
      const currentTime = event.detail.plyr.currentTime;
      setLastPlayedTime(currentTime);
      setLastSavedTime(new Date());
    },
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    ready: (event: PlyrEventDetail) => {
      if (!initialSeekDone.current && event?.detail?.plyr) {
        const startTime = calculateResumeTime();
        event.detail.plyr.currentTime = startTime;
        if (isPlaying) {
          event.detail.plyr.play();
        }
        initialSeekDone.current = true;
        setLastPlayedTime(startTime);
        setLastSavedTime(new Date());
      }
    }
  };

  const plyrProps = {
    source: {
      type: 'video' as const,
      sources: [
        {
          src: videoId || '',
          provider: 'youtube' as const,
        },
      ],
    },
    options: {
      loadSprite: false,
      autoplay: isPlaying,
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        start: Math.floor(calculateResumeTime()),
      },
    },
    events: handlePlyrEvents
  };

  if (!isClient) return null;

  return (
    <Card className="p-6 w-full max-w-3xl shadow-lg">
      <div className="relative aspect-video w-full">
        {videoId ? (
          <PlyrComponent
            ref={playerRef}
            {...plyrProps}
          />
        ) : (
          <div className="text-center p-4 text-red-500">Invalid YouTube URL</div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button 
          onClick={() => router.push('/')}
          variant="outline"
          className="w-32"
        >
          Edit URL
        </Button>
        <Button 
          onClick={() => router.push('/gif')}
          variant="secondary"
          className="w-32"
        >
          View GIF
        </Button>
      </div>
    </Card>
  );
}
