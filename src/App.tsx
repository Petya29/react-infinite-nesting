import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

function App() {

  const mode: ('dark' | 'light') = 'dark';

  const theme = createTheme({
    palette: {
      mode: mode,
      background: {
        default: mode === 'dark' ? '#121212 !important' : '#ffffff !important'
      }
    }
  })

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        app
      </ThemeProvider>
    </div>
  );
}

export default App;