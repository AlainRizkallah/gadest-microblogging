import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <Box px={5}>
    <div className="layout">{props.children}</div>
    </Box>
  </div>
);

export default Layout;
