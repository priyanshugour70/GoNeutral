import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface Filters {
  keyword: string;
  min_likes: string;
  start_date: Date | null;
  end_date: Date | null;
  ordering: string;
}

interface VideoFiltersProps {
  filters: Filters;
  onFilterChange: (key: string, value: string | Date | null) => void;
}

const VideoFilters: React.FC<VideoFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <Box sx={{ my: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Keyword"
            value={filters.keyword || ""}
            onChange={(e) => onFilterChange("keyword", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Minimum Likes"
            value={filters.min_likes || ""}
            onChange={(e) => onFilterChange("min_likes", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={filters.start_date ? dayjs(filters.start_date) : null}
              onChange={(date: Dayjs | null) =>
                onFilterChange("start_date", date ? date.toDate() : null)
              }
              slots={{ textField: TextField }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.ordering || ""}
              label="Sort By"
              onChange={(e) => onFilterChange("ordering", e.target.value)}
            >
              <MenuItem value="-published_date">Latest First</MenuItem>
              <MenuItem value="-likes_count">Most Likes</MenuItem>
              <MenuItem value="-view_count">Most Views</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoFilters;
