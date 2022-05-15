import { Box, Container } from "@mui/material";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <Container maxWidth="md">
    <div className="layout">{props.children}</div>
    </Container>
  </div>
);

export default Layout;
