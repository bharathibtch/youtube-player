'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVideoStore } from '@/app/store/videoStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History } from '@/components/History';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const { setVideoUrl, setLastPlayedTime, setLastSavedTime } = useVideoStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl) {
      // Save to history in localStorage
      const newHistoryItem = {
        url: inputUrl,
        timestamp: new Date(),
      };
      
      const existingHistory = localStorage.getItem('videoHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      localStorage.setItem('videoHistory', JSON.stringify([newHistoryItem, ...history]));

      setVideoUrl(inputUrl);
      setLastPlayedTime(0);
      setLastSavedTime(new Date());
      router.push('/video');
    }
  };

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-4" 
      style={{ 
        backgroundImage: 'url(https://img.freepik.com/free-vector/background-wave-particle-digital-gradient-colorful_483537-1576.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <Card className="p-6 w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-extrabold mb-4 text-center tracking-tight" style={{ fontFamily: 'Roboto, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          <span className="text-zinc-800">YouTube</span>
          <span className="text-zinc-800 ml-3">Player</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full"
            required
          />
          <Button 
            type="submit" 
            className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-medium"
          >
            Save & Play
          </Button>
        </form>
      </Card>
      <History />
    </main>
  );
}
