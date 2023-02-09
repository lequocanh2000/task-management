//** Icon import
// import MailIcon from "@mui/icons-material/Mail";
// import MenuIcon from "@mui/icons-material/Menu";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
import GridLarge from "mdi-material-ui/GridLarge";
import ClipboardEditOutline from "mdi-material-ui/ClipboardEditOutline";
import AccountMultipleOutline from "mdi-material-ui/AccountMultipleOutline";
import ClipboardTextClockOutline from "mdi-material-ui/ClipboardTextClockOutline";
import ClipboardTextMultipleOutline from "mdi-material-ui/ClipboardTextMultipleOutline";
import ChartBar from "mdi-material-ui/ChartBar";
import { useRouter } from "next/router";

export const navigation = () => {
  const router = useRouter();
  const userId = router.query.userId;

  return [
    {
      id: 0,
      icon: GridLarge,
      title: "Overviews",
      path: `/${userId}/overviews`,
    },
    // {
    //   id: 1,
    //   icon: AccountMultipleOutline,
    //   title: "Danh sách người dùng",
    //   path: `/${userId}/users`,
    // },
    {
      id: 2,
      icon: ClipboardTextMultipleOutline,
      title: "List task",
      path: `/${userId}/tasks`,
    },
    {
      id: 3,
      icon: ClipboardTextClockOutline,
      title: "Task board",
      path: `/${userId}/todo-tasks`,
    },
  ];
};

export const statisticalAndReport = () => {
  const router = useRouter();
  const userId = router.query.userId;

  return [
    {
      id: 1,
      icon: ChartBar,
      title: "Statistics",
      path: `/${userId}/statistics`,
    },
    {
      id: 2,
      icon: ClipboardEditOutline,
      title: "Reports",
      path: `/${userId}/reports`,
    },
  ];
};

// export const navigation = [
//   {
//     id: 0,
//     icon: GridLarge,
//     title: "Tổng quan",
//     path: "/overviews",
//   },
//   {
//     id: 1,
//     icon: AccountMultipleOutline,
//     title: "Danh sách người dùng",
//     path: "/users",
//   },
//   {
//     id: 2,
//     icon: ClipboardTextMultipleOutline,
//     title: "Danh sách công việc",
//     path: "/tasks",
//   },
//   {
//     id: 3,
//     icon: ClipboardTextClockOutline,
//     title: "Công việc",
//     path: "/todo-tasks",
//   },
// ];

// export const statisticalAndReport = [
//   {
//     id: 1,
//     icon: ChartBar,
//     title: "Thống kê",
//     path: "/statistics",
//   },
//   {
//     id: 2,
//     icon: ClipboardEditOutline,
//     title: "Báo cáo",
//     path: "/reports",
//   },
// ];
