/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axios';

export const searchVideos = async (query: string) => {
  try {
    const response = await axiosInstance.post('/videos/search_youtube/', { query });
    return response.data;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

export const getVideos = async (params: Record<string, any>) => {
  try {
    const response = await axiosInstance.get('/videos/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};