'use client';

import { GifViewer } from '@/components/GifViewer';

export default function GifPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4"
    style={{ 
      backgroundImage: 'url(https://img.freepik.com/free-vector/background-wave-particle-digital-gradient-colorful_483537-1576.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'rgba(0,0,0,0.6)',
    }}
    >
      <GifViewer />
    </div>
  );
}
