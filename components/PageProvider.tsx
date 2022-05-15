import { ThemeProvider } from "@mui/material";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import darkTheme from "./theme/darkTheme";
import lightTheme from "./theme/lightTheme";

interface PageProviderProps {
  children: ReactNode;
}
const PageProvider = ({ children }: PageProviderProps) => {
  const { resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(darkTheme);
useEffect(() => {
    resolvedTheme === "light"
      ? setCurrentTheme(lightTheme)
      : setCurrentTheme(darkTheme);
  }, [resolvedTheme]);
  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
};
export default PageProvider;