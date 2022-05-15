import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ad8921',
      light: '#deb02a',
      dark: '#634e11',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#610000',
      light: '#a10000',
      dark: '#330101',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#B2B2B2',
      contrastText: '#FF6347',
    },
    background: {
      paper: '#ffeaab',
      default: '#faefcf',
    },
    text: {
      // primary: '#ffffff',
      secondary: '#383838',
      disabled: '#777777',
    },
  },
});

export default lightTheme;
