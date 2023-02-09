import React, { useState, useEffect } from "react";
// ** Next import
import Link from "next/link";
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { primaryColor, activeBgColor } from "@/layouts/layoutContainer";

//** data navigation import
import {
  navigation,
  statisticalAndReport,
} from "@/layouts/components/navigation/navigationContainer";

const textColor = "#909090";

const ItemNav = (props) => {
  //** next router
  const router = useRouter();
  // console.log(router.pathname)
  // console.log(router)

  const [active, setActive] = useState();
  const { nav } = props;
  const Icon = nav.icon;

  useEffect(() => {
    if (router.asPath === nav.path) {
      setActive(true);
      return;
    }
    setActive(false);
  }, [router.asPath]);

  const style = {
    color: active ? primaryColor : textColor,
  };

  const styleBg = {
    background: active ? `linear-gradient(to left, ${activeBgColor + " 5%"}, #f8f8fb)` : "",
    borderRight: active ? `3px solid ${primaryColor}` : "",
  };

  return (
    <>
      <ListItem disablePadding>
        <Link href={nav.path}>
          <ListItemButton sx={styleBg}>
            <ListItemIcon sx={{ minWidth: "auto", marginRight: 1 }}>
              <Icon sx={style} />
            </ListItemIcon>
            <Typography variant="body1" color="primary" fontWeight={600} paddingY={1} sx={style}>
              {nav.title}
            </Typography>
          </ListItemButton>
        </Link>
      </ListItem>
    </>
  );
};

function Navigation() {
  return (
    <div>
      <Box component="div" display="flex" justifyContent="center" paddingY={4}>
        <Typography variant="h5" color="primary" fontFamily="fantasy" sx={{color: "#3b4b95"}}>
          LQA'S AMTASKS
        </Typography>
      </Box>
      <Divider textAlign="left" sx={{ color: "#909090", paddingTop: 0, fontWeight: 600 }}>
        Management
      </Divider>
      <List>
        {navigation().map((nav) => (
          <ItemNav key={nav.id} nav={nav} />
        ))}
      </List>
      <Divider textAlign="left" sx={{ color: "#909090", paddingTop: 2, fontWeight: 600 }}>
        Statistical & Report
      </Divider>
      <List>
        {statisticalAndReport().map((nav) => (
          <ItemNav key={nav.id} nav={nav} />
        ))}
      </List>
    </div>
  );
}

export default Navigation;
