import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import VideoSearch from './pages/VideoSearch';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <VideoSearch />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;