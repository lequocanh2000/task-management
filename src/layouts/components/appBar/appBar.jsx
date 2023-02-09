import React, { useState, useEffect } from "react";
// ** MUI Imports
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import Badge from '@mui/material/Badge'

//** Icon import
import MenuIcon from "@mui/icons-material/Menu";

//** Component import
import { drawerWidth } from "@/layouts/layoutContainer";
import { NotificationDropdown } from "@/layouts/components/notificationDropdown";
import { UserDropdown } from "@/layouts/components/userDropdown";
import { useSettings } from "@/core/hooks/useSettings";
import {
  useGetNotificationsOfUserQuery,
  useUpdateNotificationMutation,
} from "@/store/notifications/notificationsApi";
import { useRouter } from "next/router";
import dayjs from "dayjs";

function AppBarHeader({ mobileOpen, setMobileOpen }) {

  const { settings } = useSettings();
  const [unCheckeds, setUnCheckeds] = useState();

  const router = useRouter();
  const userId = router.query.userId;
  const { data, error, isLoading } = useGetNotificationsOfUserQuery(userId, {
    skip: userId === undefined,
  });

  useEffect(() => {
    if(!data) return;
    const unCheckedList = data.notifications.filter((notification) => notification.checked === 0)
    setUnCheckeds(unCheckedList.length)
  }, [data])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        background: "#fff",
        boxShadow: "0px 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
          <MenuIcon color="primary" />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", marginLeft: "auto" }}>
          <NotificationDropdown unCheckeds={unCheckeds} settings={settings} />
          <UserDropdown settings={settings} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppBarHeader;
