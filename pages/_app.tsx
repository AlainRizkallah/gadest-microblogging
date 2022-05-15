import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0';
import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import { CssBaseline } from '@mui/material';
import { CacheProvider, css, EmotionCache } from "@emotion/react";
import createEmotionCache from "../components/theme/createEmotionCache";
import { GlobalStyles } from "@mui/material";
import {QueryClient, QueryClientProvider} from 'react-query'
import PageProvider from '../components/PageProvider';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient()

const clientSideEmotionCache = createEmotionCache();

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

type CustomAppProps = AppProps & {
  emotionCache: EmotionCache 
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: CustomAppProps) {

  return (
    <UserProvider>
      <ThemeProvider>
        <CacheProvider value={emotionCache}>
          <PageProvider>
            <CssBaseline />
            <GlobalStyles
            styles={css`  
              :root {
                body {
                  background-color: #fff;
                  color: #121212;
                }
              }
[data-theme="dark"] {
                body {
                  background-color: #121212;
                  color: #fff;
                }
              }
            `}
          />
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          </PageProvider>
        </CacheProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

export default MyApp
