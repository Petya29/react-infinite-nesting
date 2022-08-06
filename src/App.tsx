import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { DndList } from './pages/DndList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {

  const mode: ('dark' | 'light') = 'dark';

  const theme = createTheme({
    palette: {
      mode: mode,
      background: {
        default: mode === 'dark' ? '#121212 !important' : '#ffffff !important'
      }
    }
  });

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DndList />
        </ThemeProvider>
      </DndProvider>
    </div>
  );
}

export default App;