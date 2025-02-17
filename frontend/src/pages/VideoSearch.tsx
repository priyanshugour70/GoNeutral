import { useState, useEffect } from 'react';
import { Container, Typography, Alert, CircularProgress, Box } from '@mui/material';
import SearchBar from '../components/SearchBar';
import VideoFilters from '../components/VideoFilters';
import VideoTable from '../components/VideoTable';
import useVideos from '../hooks/useVideos';

const VideoSearch = () => {
  const { videos, loading, error, pagination, fetchVideos, searchYouTube } = useVideos();
  const [filters, setFilters] = useState({
    keyword: '',
    min_likes: '',
    start_date: null,
    end_date: null,
    ordering: '-published_date',
  });

  useEffect(() => {
    fetchVideos(filters);
  }, [fetchVideos, filters]);

  const handleSearch = async (query: string) => {
    await searchYouTube(query);
  };

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    fetchVideos({ ...filters, page });
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2 }}>
        YouTube Video Search
      </Typography>

      <SearchBar onSearch={handleSearch} />
      <VideoFilters filters={filters} onFilterChange={handleFilterChange} />

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <VideoTable
          videos={videos}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default VideoSearch;