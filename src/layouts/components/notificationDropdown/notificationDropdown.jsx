// ** React Imports
import { useState, Fragment, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Badge from '@mui/material/Badge'

import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiMenu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
// ** Icons Imports
import BellOutline from "mdi-material-ui/BellOutline";
// ** Third Party Components
import PerfectScrollbarComponent from "react-perfect-scrollbar";
// ** Custom Components Imports
import CustomChip from "@/core/components/mui/chip";
import CustomAvatar from "@/core/components/mui/avatar";
import {
  useGetNotificationsOfUserQuery,
  useUpdateNotificationMutation,
} from "@/store/notifications/notificationsApi";
import { useRouter } from "next/router";
import dayjs from "dayjs";

// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    width: 450,
    overflow: "hidden",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  "& .MuiMenu-list": {
    padding: 0,
  },
}));

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: "8px",
  paddingBottom: "8px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const styles = {
  maxHeight: 318,
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
};

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles,
});

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)({
  width: "2.375rem",
  height: "2.375rem",
  fontSize: "1.125rem",
});

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  // marginBottom: theme.spacing(0),
}));

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Box)(({ theme }) => ({
  flex: "1 1 100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  '&.MuiBox-root p': {
    margin: theme.spacing(0)
  }
}))
const BadgeCustomize = styled(Badge)(({ theme }) => ({
  "&.MuiBadge-root .MuiBadge-badge": {
    minWidth: "auto",
    // minHeight: 10,
    fontSize: 11,
    height: "auto",
    borderRadius: '50%',
    padding: theme.spacing(0.2,0.6),
  },
}));

const activeNotificationColor = 'rgba(0,0,0,0.04)';

const NotificationCard = (props) => {
  const {notification, setAnchorEl} = props
  const [updateNotification, result] = useUpdateNotificationMutation();
  const router = useRouter();
  const userId = router.query.userId;

  useEffect(()=>{
    const timeOut = setTimeout(()=>{
        const disableURLMention = document.querySelectorAll('a.wysiwyg-mention')
        disableURLMention.forEach((element)=>{
          element.addEventListener('click',(event)=>{
            event.preventDefault();
          })
        })
      },600)
    return () => {
      clearTimeout(timeOut);
    };
  },[])

  const handleCheckNotification = (event) => {
    if(!notification) return;
    const {avatar,email,password,type, user_name, ...notificationUpdated} = notification
    const updatedDate = new Date();

    updateNotification({
      ...notificationUpdated,
      updated_at: updatedDate.toISOString(),
      checked: true
    })
    router.replace(`/${userId}/tasks/${notification.task_id}/task-detail`)
    setAnchorEl(null)
    event.stopPropagation();
  }

  return (
    <MenuItem
    onClick={handleCheckNotification}
    sx={{backgroundColor: notification?.checked === 1 ? activeNotificationColor : ''}}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Avatar alt="Flora" src={notification?.avatar} />
        <Box sx={{ mx: 2, flex: "1 1", display: "flex", overflow: "hidden", flexDirection: "column" }}>
          <MenuItemTitle>{notification?.title}</MenuItemTitle>
          <MenuItemSubtitle component='div' dangerouslySetInnerHTML={{__html: notification?.content}}></MenuItemSubtitle>
        </Box>
        <Stack>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {dayjs(new Date(notification?.created_at)).format('MMM D, YYYY')}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {dayjs(new Date(notification?.created_at)).format('h:mm A')}
          </Typography>
        </Stack>
      </Box>
    </MenuItem>
  );
};

const NotificationDropdown = (props) => {
  const { settings, unCheckeds } = props;
  const { direction } = settings;
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const router = useRouter();
  const userId = router.query.userId;
  const { data, error, isLoading } = useGetNotificationsOfUserQuery(userId, {
    skip: userId === undefined,
  });

  useEffect(() => {
    if(!data) return;
    setNotifications(data.notifications)
  }, [data])

  // useEffect(() => {
  //   if(!notifications) return;
  //   console.log(notifications)
  // }, [notifications])

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };
  const ScrollWrapper = ({ children }) => {
    return (
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </PerfectScrollbar>
    );
  };

  return (
    <Fragment>
      <Tooltip title="Notifications">
        <IconButton
          color="primary"
          aria-haspopup="true"
          onClick={handleDropdownOpen}
          aria-controls="customized-menu"
        >
        <BadgeCustomize badgeContent={unCheckeds ? unCheckeds : 0} color='primary'>
          <BellOutline />
        </BadgeCustomize>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: "bottom", horizontal: direction === "ltr" ? "right" : "left" }}
        transformOrigin={{ vertical: "top", horizontal: direction === "ltr" ? "right" : "left" }}
      >
        <MenuItem disableRipple>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography sx={{ fontWeight: 600 }} color="primary">
              Notifications
            </Typography>
            {unCheckeds !== 0 && (
              <CustomChip
                skin="light"
                size="small"
                label={`${unCheckeds} new`}
                color="primary"
                sx={{ height: 20, fontSize: "0.75rem", fontWeight: 500, borderRadius: "10px" }}
              />
            )}

          </Box>
        </MenuItem>
        <ScrollWrapper>
          {notifications.length != 0 && notifications.map((notification,index)=>{
            return (
              <NotificationCard notification={notification} key={index} setAnchorEl={setAnchorEl}/>
            )
          })}
          {!notifications.length && (
            <Stack direction='row' alignItems='center' justifyContent='center' minHeight={200}>
              <Typography variant="h5" fontWeight={600} sx={{color: 'rgba(0,0,0,0.6)'}}>No notifications</Typography>
            </Stack>
          )}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          sx={{
            py: 2,
            borderBottom: 0,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* <Button fullWidth variant="contained" onClick={handleDropdownClose}>
            Read All Notifications
          </Button> */}
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default NotificationDropdown;
