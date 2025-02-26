'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function GifViewer() {
  const router = useRouter();
  const [selectedGif, setSelectedGif] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Define gifs as a constant array
  const GIFS = [
    'https://media.giphy.com/media/13FrpeVH09Zrb2/giphy.gif',
    'https://media.giphy.com/media/hrRJ41JB2zlgZiYcCw/giphy.gif',
    'https://media.giphy.com/media/dlMIwDQAxXn1K/giphy.gif',
  ] as const;
  
  const getRandomGif = () => {
    // Ensure we have gifs to choose from
    if (GIFS.length === 0) {
      throw new Error('No GIFs available');
    }
    
    // Get a random index between 0 and GIFS.length - 1
    const index = Math.floor(Math.random() * GIFS.length);
    return GIFS[index];
  };
  
  const loadNewGif = () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const newGif = getRandomGif();
      setSelectedGif(newGif);
    } catch (error) {
      console.error('Error loading GIF:', error);
      setIsError(true);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setIsMounted(true);
    loadNewGif();
  }, []);
  
  const handleBack = () => {
    router.push('/video');
  };

  const handleRefresh = () => {
    loadNewGif();
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="w-full h-[320px] bg-gray-200 rounded-lg flex items-center justify-center">
        <svg 
          className="w-12 h-12 text-gray-300 animate-spin" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }
  
  return (
    <Card className="p-6 space-y-4 w-full max-w-3xl shadow-lg">
      <h1 className="text-2xl font-bold text-center">GIFs... 😄</h1>
      <div className="relative rounded-lg overflow-hidden">
        {isLoading && <LoadingSkeleton />}
        {selectedGif && (
          <div className={isLoading ? 'hidden' : 'block'}>
            <Image 
              src={selectedGif}
              alt="Funny developer GIF"
              width={480}
              height={320}
              className="w-full h-auto rounded-lg shadow-lg mx-auto"
              priority
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                console.error('Failed to load image:', selectedGif);
                setIsError(true);
                setIsLoading(false);
              }}
            />
          </div>
        )}
        {isError && (
          <div className="text-center p-4 text-red-500">
            Failed to load GIF. Please try refreshing.
          </div>
        )}
      </div>
      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleBack}
          variant="default"
          size="lg"
          className="w-32"
        >
          BACK
        </Button>
        <Button 
          onClick={handleRefresh}
          variant="default"
          size="lg"
          className="w-32"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'REFRESH'}
        </Button>
      </div>
    </Card>
  );
}
