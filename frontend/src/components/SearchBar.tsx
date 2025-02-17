import { useState } from 'react';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, width: '100%', mx: 'auto', mt: 3 }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search YouTube videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar;