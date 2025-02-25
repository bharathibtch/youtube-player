import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Video Player',
  description: 'Watch your selected video',
}

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 