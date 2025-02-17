import { useState, useCallback } from 'react';
import { getVideos, searchVideos } from '../api/videoService';

interface Video {
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

interface Pagination {
  current_page: number;
  total_pages: number;
  count: number;
}

const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    total_pages: 1,
    count: 0,
  });

  const fetchVideos = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVideos(filters);
      setVideos(response.results);
      setPagination({
        current_page: response.current_page,
        total_pages: response.total_pages,
        count: response.count,
      });
    }catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
      setLoading(false);
    }
  }, []);

  const searchYouTube = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      await searchVideos(query);
      await fetchVideos();
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
      setLoading(false);
    }
  }, [fetchVideos]);

  return {
    videos,
    loading,
    error,
    pagination,
    fetchVideos,
    searchYouTube,
  };
};

export default useVideos;