import { createRoot } from 'react-dom/client';
import { VideoProvider } from './context/VideoContext';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <VideoProvider>
    <App />
  </VideoProvider>
);