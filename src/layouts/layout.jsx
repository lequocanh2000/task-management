import React from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

//** Component import
import { AppBarHearder } from "@/layouts/components/appBar";
import { SidebarMenu } from "@/layouts/components/sidebar-menu";
import {drawerWidth} from '@/layouts/layoutContainer'

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBarHearder mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <SidebarMenu mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginTop: "64px",
          backgroundColor: "#f9f9f9",
          minHeight: "100vh"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
