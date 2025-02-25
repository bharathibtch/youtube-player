import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GIF Viewer',
  description: 'View and interact with GIF animations',
}

export default function GifLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 