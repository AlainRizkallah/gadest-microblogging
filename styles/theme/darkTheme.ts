import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    info: {
            main: '#FFFFFF',
            light: '#FFFFFF',
            dark: '#B2B2B2',
            contrastText: '#383838',
          },
    background: {
      default: "#323236"
    }
  },
});

export default darkTheme;

