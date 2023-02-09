// ** React Imports
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ** MUI Imports
import Avatar from "@/core/components/mui/avatar";
import { inputHoverColor, titleColor } from "@/layouts/layoutContainer";
import { useAddNotificationMutation } from "@/store/notifications/notificationsApi";
import { useCheckTasksQuery, useLazyCheckTasksQuery, useUpdateTaskMutation } from "@/store/tasks/tasksApi";
import {
  useLazyGetUserByIdQuery,
  useLazyGetUsersWithDepartmentsQuery
} from "@/store/users/usersApi";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiMenu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import PerfectScrollbarComponent from "react-perfect-scrollbar";

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1),
  minWidth: 100,
}));

const Menu = styled(MuiMenu)(({
  "& .MuiMenu-paper": {
    minWidth: 200,
  },
  "& .MuiMenu-list": {
    padding: 0,
  },
}));

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  padding: theme.spacing(2, 1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const styles = {
  maxHeight: 240,
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
};

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles,
});

const ScrollWrapper = ({ children }) => {
  return (
    <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
      {children ? children : "null"}
    </PerfectScrollbar>
  );
};

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  maxWidth: 240,
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

const MenuItemCustomize = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const ContentAssignee = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0.5, 1),
  borderRadius: "2px",
  ":hover": {
    backgroundColor: inputHoverColor,
    cursor: "pointer",
  },
}));

const Assignee = (props) => {
  const { task } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState();
  const [userLogin, setUserLogin] = useState();
  const [usersDepartmentCurrent, setUsersDepartmentCurrent] = useState([]);
  const [usersDepartmentOther, setUsersDepartmentOther] = useState([]);

  const router = useRouter();
  const taskId = router.query.taskId;

  const [updateTask, result] = useUpdateTaskMutation();
  const [addNotification, resultAddNotification] = useAddNotificationMutation();
  const [geUserByIdQuery] = useLazyGetUserByIdQuery();
  const [getUsersWithDepartmentsQuery] = useLazyGetUsersWithDepartmentsQuery();
  const [checkTasksQuery] = useLazyCheckTasksQuery();
  const {data, isError} = useCheckTasksQuery();

  useEffect(()=>{
    if(!data) return;
    console.log(data);
  },[data])

  useEffect(()=>{
    if(isError) {
      toast.error("Error! check tasks from server");
    };
  },[isError])

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUserLogin(userLocalStorage);
  }, []);

  useEffect(() => {
    if (!userLogin) return;
    if(userLogin.position_id != 3){
      getUsersWithDepartments(userLogin.position_id,userLogin.department_id);
      return;
    }
    getUsersWithDepartments(userLogin.position_id,userLogin.department_id,userLogin.id);
  }, [userLogin]);

  useEffect(() => {
    if (task) geUserAssigneedById(task.assignee);
  }, [task]);

  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Update assignee successfully");
      checkTasks();
      return;
    }
    if (result.error) {
      toast.error("Update assignee failed");
      return;
    }
  }, [result]);

  useEffect(() => {
    if (!resultAddNotification) return;
    if (resultAddNotification.isError) {
      console.log("Create notification failed");
      return;
    }
    if (resultAddNotification.isSuccess) {
      console.log("Created notification successfully");
      return;
    }
  }, [resultAddNotification]);

  const geUserAssigneedById = async (userAssigneedId) => {
    const res = await geUserByIdQuery(userAssigneedId);
    if(res.isError){
      toast.error('Error! Get user assigneed from server');
      return;
    }
    if(res.data) setUser(res.data.users[0]);
  }

  const getUsersWithDepartments = async (positionId,departmentId,userLoginId) => {
    const res = await getUsersWithDepartmentsQuery({positionId,departmentId,userId: userLoginId});
    if (res.isError) {
      toast.error("Error! Get users with department from server");
      return;
    }
    const departmentsUsers = res.data.departments_users;
    const departmentsUsersCurrent = departmentsUsers.filter((department) => department.department_id == departmentId);
    const departmentsUsersOther = departmentsUsers.filter((department) => department.department_id != departmentId);
    setUsersDepartmentCurrent(departmentsUsersCurrent)
    setUsersDepartmentOther(departmentsUsersOther)
  };

    const checkTasks = async () => {
    const res = await checkTasksQuery();
    if(res.isError){
      toast.error("Error! check tasks from server");
      return;
    }
    if(res.data) console.log(res.data)
  }

  const handleOpen = (event) => {
    if(task && task.completed == 1){
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAssigneUser = (assignedUser) => {
    const createdDate = new Date();
    const updatedDate = new Date();
    const taskUpdated = {
      ...task,
      assignee: assignedUser.id,
      updated_by: Number(userLogin?.id),
      updated_at: updatedDate.toISOString(),
    };
    updateTask(taskUpdated);
    const notificationAdded = {
      title: `${userLogin?.user_name} assigneed you in a task`,
      content: `<strong>${task?.task_name}</strong>`,
      from_user: Number(userLogin?.id),
      to_user: assignedUser.id,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      notification_type_id: 1,
      task_id: Number(taskId),
    };
    addNotification(notificationAdded);
    setUser(assignedUser);
    setAnchorEl(null);
  };
  return (
    <Stack direction="row" alignItems="center" spacing={2} mt={1}>
      <TitleDetail variant="subtitle2">Assignee</TitleDetail>
      <ContentAssignee onClick={handleOpen}>
        <Avatar alt="Flora" src={user?.avatar} sx={{ width: 36, height: 36, marginRight: 2 }} />
        <Typography variant="body1" marginRight={2}>
          {user?.user_name}
        </Typography>
      </ContentAssignee>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <ScrollWrapper>
          {usersDepartmentCurrent.map((departmentCurrent, index) => {
            return (
              <Box component="div" key={index}>
                <Divider textAlign="left" sx={{mt: 2, mb: 1, fontWeight: 700, fontSize: 14, color: "rgba(118,118,118,1)"}}>{departmentCurrent.department_name}</Divider>
                {departmentCurrent?.users.map((user,index) => {
                  return (
                    <MenuItemCustomize onClick={() => handleSelectAssigneUser(user)} key={index}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt="Flora" src={user.avatar} sx={{ width: 32, height: 32 }} />
                        <MenuItemTitle>{user.user_name}</MenuItemTitle>
                      </Stack>
                    </MenuItemCustomize>
                  );
                })}
              </Box>
            );
          })}
          {usersDepartmentOther.map((departmentOther, index) => {
            return (
              <Box component="div" key={index}>
                <Divider textAlign="left" sx={{mt: 2, mb: 1, fontWeight: 700, fontSize: 14, color: "rgba(118,118,118,1)"}}>{departmentOther.department_name}</Divider>
                {departmentOther?.users.map((user,index) => {
                  return (
                    <MenuItemCustomize onClick={() => handleSelectAssigneUser(user)} key={index}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt="Flora" src={user.avatar} sx={{ width: 32, height: 32 }} />
                        <MenuItemTitle>{user.user_name}</MenuItemTitle>
                      </Stack>
                    </MenuItemCustomize>
                  );
                })}
              </Box>
            );
          })}
        </ScrollWrapper>
      </Menu>
    </Stack>
  );
};

export default Assignee;
