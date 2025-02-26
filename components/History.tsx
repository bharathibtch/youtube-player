import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVideoStore } from '@/app/store/videoStore';
import { useRouter } from 'next/navigation';

interface HistoryItem {
  url: string;
  timestamp: Date;
  videoId?: string;
}

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { setVideoUrl, setLastPlayedTime, setLastSavedTime } = useVideoStore();
  const router = useRouter();

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('videoHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const formatVideoUrl = (url: string) => {
    // Extract video title or ID for display
    try {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `Video: ${videoId}`;
    } catch {
      return url;
    }
  };

  const handleHistoryItemPress = (url: string) => {
    setVideoUrl(url);
    setLastPlayedTime(0);
    setLastSavedTime(new Date());
    router.push('/video');
  };

  const clearHistory = () => {
    localStorage.removeItem('videoHistory');
    setHistory([]);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6 p-6 w-full max-w-md shadow-lg bg-zinc-100/95">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-800">Recent Videos</h2>
          <Button 
            variant="link"
            size="sm"
            onClick={clearHistory}
            className="text-gray-600 hover:text-black p-0 h-auto font-medium transition-colors no-underline hover:no-underline"
          >
            Clear History
          </Button>
        </div>
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={index}
              onClick={() => handleHistoryItemPress(item.url)}
              className="bg-white p-4 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors shadow-sm border border-zinc-200"
            >
              <p className="text-zinc-800 font-medium text-sm truncate">
                {formatVideoUrl(item.url)}
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
} 