/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { getVideos } from '../api/videoService';

interface VideoData {
  id: number;
  title: string;
  description: string;
  url: string;
  published_date: string;
  thumbnail: {
    url: string;
    alt_text: string;
  };
  likes_count: number;
  view_count: number;
}

interface VideoContextType {
  videos: VideoData[];
  loading: boolean;
  error: string | null;
  fetchVideos: (filters: { keyword?: string; minLikes?: number; startDate?: string; endDate?: string; ordering?: string }) => Promise<void>;
}

const VideoContext = createContext<VideoContextType | null>(null);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async (filters: { keyword?: string; minLikes?: number; startDate?: string; endDate?: string; ordering?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVideos(filters);
      setVideos(data.results);
    } catch (err: unknown) {
      setError(typeof err === "string" ? err : 'An unknown error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoContext.Provider value={{ videos, loading, error, fetchVideos }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};