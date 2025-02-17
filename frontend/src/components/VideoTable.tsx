import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
  Box,
  Pagination,
} from '@mui/material';
import { format } from 'date-fns';

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

interface VideoTableProps {
  videos: Video[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

const VideoTable: React.FC<VideoTableProps> = ({ videos, pagination, onPageChange }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Published Date</TableCell>
              <TableCell align="right">Likes</TableCell>
              <TableCell align="right">Views</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <img
                    src={video.thumbnail.url}
                    alt={video.thumbnail.alt_text}
                    style={{ width: 120, height: 'auto' }}
                  />
                </TableCell>
                <TableCell>
                  <Link href={video.url} target="_blank" underline="hover">
                    <Typography variant="body1">{video.title}</Typography>
                  </Link>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {video.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  {format(new Date(video.published_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell align="right">
                  {video.likes_count.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {video.view_count.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={pagination.total_pages}
          page={pagination.current_page}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default VideoTable;