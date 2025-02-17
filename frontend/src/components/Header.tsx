import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import YouTubeIcon from '@mui/icons-material/YouTube'

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <YouTubeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GoNeutral YouTube Explorer
        </Typography>
        
        <Box>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            color="inherit"
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header