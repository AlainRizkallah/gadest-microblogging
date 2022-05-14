import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import darkTheme from '../styles/theme/darkTheme';
import lightTheme from '../styles/theme/lightTheme';
import { CssBaseline } from '@mui/material';
import {QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient()

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <UserProvider>
      <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      </QueryClientProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

export default MyApp
