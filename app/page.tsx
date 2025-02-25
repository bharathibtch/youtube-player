'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVideoStore } from '@/app/store/videoStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const { setVideoUrl, setLastPlayedTime, setLastSavedTime } = useVideoStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl) {
      setVideoUrl(inputUrl);
      setLastPlayedTime(0);
      setLastSavedTime(new Date());
      router.push('/video');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="p-6 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter YouTube URL</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full"
            required
          />
          <Button type="submit" className="w-full">
            PLAY VIDEO
          </Button>
        </form>
      </Card>
    </main>
  );
}
