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
  
  // Updated GIFs collection with verified working links
  const funnyGifs = [
    'https://media.giphy.com/media/13FrpeVH09Zrb2/giphy.gif',
    'https://media.giphy.com/media/hrRJ41JB2zlgZiYcCw/giphy.gif',
    'https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif',
    'https://media.giphy.com/media/dlMIwDQAxXn1K/giphy.gif',
  ];
  
  useEffect(() => {
    // Select a random GIF from the collection
    const randomGif = funnyGifs[Math.floor(Math.random() * funnyGifs.length)];
    setSelectedGif(randomGif);
    // Reset error and loading states when changing GIFs
    setIsError(false);
    setIsLoading(true);
  }, [funnyGifs]);
  
  // Add error boundary handling
  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }
  
  const handleBack = () => {
    router.push('/video');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    const randomGif = funnyGifs[Math.floor(Math.random() * funnyGifs.length)];
    setSelectedGif(randomGif);
    setIsError(false);
  };
  
  return (
    <Card className="p-6 space-y-4 w-full max-w-3xl shadow-lg">
      <h1 className="text-2xl font-bold text-center">Loading Laughs... 😄</h1>
      <div className="relative rounded-lg overflow-hidden">
        {selectedGif && !isError && (
          <Image 
            src={selectedGif}
            alt="Funny developer GIF"
            width={480}
            height={320}
            className="w-full h-auto rounded-lg shadow-lg mx-auto"
            priority
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setIsError(true);
              setIsLoading(false);
            }}
          />
        )}
        {isLoading && <div className="text-center p-4">Loading...</div>}
        {isError && <div className="text-center p-4 text-red-500">Failed to load GIF</div>}
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
        >
          REFRESH
        </Button>
      </div>
    </Card>
  );
}
