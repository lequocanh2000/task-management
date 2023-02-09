import React, { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

//* Component import
import { drawerWidth } from '@/layouts/layoutContainer'
import { Navigation } from '@/layouts/components/navigation'

function SidebarMenu({mobileOpen,setMobileOpen}) {

  const [window, setWindow] = useState();

  useEffect(() => {
    if (window != undefined) {
      setWindow(window.document.body);
    }
  }, []);

  const container = window ? window : null;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
          m: 2,
        }}
      >
        <Navigation/>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
         <Navigation/>
      </Drawer>
    </Box>
  );
}

export default SidebarMenu;
