import React, { useState, useEffect, useRef } from "react";
//** Next Import
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
//** MUI Import
import Layout from "@/layouts/layout";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Divider from "@mui/material/Divider";
import LinkMui from "@mui/material/Link";
//**Icon import */
import MenuLeft from "mdi-material-ui/MenuLeft";
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import CheckboxMultipleMarked from "mdi-material-ui/CheckboxMultipleMarked";
import PencilBoxOutline from "mdi-material-ui/PencilBoxOutline";
import ChevronRight from "mdi-material-ui/ChevronRight";
import Check from "mdi-material-ui/Check";

//** Component Import
import { TaskDetails } from "@/components/taskDetails";
import { TaskDescription } from "@/components/taskDescription";
import { TaskDocuments } from "@/components/taskDocuments";
import { Assignee } from "@/components/assignee";
import { Point } from "@/components/point";
import { DueDate } from "@/components/dueDate";
import { Status } from "@/components/status";
import { TableDetailTasks } from "@/components/table";
import { Creator } from "@/components/creator";
import { TabActivities } from "@/components/tab";
import { iconSubTaskColor, titleColor, iconTaskColor } from "@/layouts/layoutContainer";
import {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useGetTasksHaveSubsQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useLazyGetSubsOfTaskQuery,
} from "@/store/tasks/tasksApi";
import { useLazyGetUserByIdQuery } from "@/store/users/usersApi";
import toast from "react-hot-toast";
import { selectTasks, setTasks, setFilterSearch, setFilterType } from "@/store/tasks/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// #172b4d
const TaskName = styled(Typography)(({ theme }) => ({
  color: titleColor,
  fontWeight: 700,
  // marginTop: theme.spacing(0),
  padding: "8px 8px",
  borderRadius: "4px",
  ":hover": {
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
  },
}));

const TextFieldCustomize = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontWeight: 500,
    fontSize: "24px",
    "& fieldset": {
      border: "none",

      // backgroundColor: "#f9f9f9",
      // color: "#ccc"
    },
    "&.Mui-focused": {
      borderColor: "#C52328",
      borderWidth: "2px",
      backgroundColor: "#f9f9f9",
      fontWeight: 500,
      fontSize: "24px",
    },
    ":hover": {
      backgroundColor: "#f9f9f9",
      cursor: "pointer",
    },
  },
}));

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
  padding: theme.spacing(4, 6),
  marginTop: theme.spacing(4),
}));

function TaskDetail() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userId = router.query.userId;
  const taskId = router.query.taskId;
  const [path, setPath] = useState("");

  // console.log('userId',userId);
  // console.log('taskId',taskId);
  const [show, setShow] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [currentTaskName, setCurrentTaskName] = useState("");

  const [task, setTask] = useState();
  const [userLogin, setUserLogin] = useState();
  const [userAssigneed, setUserAssigneed] = useState();
  const [disableCompleted, setDisableCompleted] = useState(true);

  const { data, error, isLoading } = useGetTaskByIdQuery(taskId, {
    skip: taskId === undefined,
  });
  // const { data, error, isLoading } = useGetTaskByIdQuery(taskId);
  const [updateTask, result] = useUpdateTaskMutation();
  const [updateCompleted, resultCompleted] = useUpdateTaskMutation();

  const [getSubsOfTaskQuery] = useLazyGetSubsOfTaskQuery();
  const [getUserByIdQuery] = useLazyGetUserByIdQuery();

  useEffect(() => {
    if (!data) return;
    setTask(data.tasks[0]);
    setTaskName(data.tasks[0].task_name);
    setCurrentTaskName(data.tasks[0].task_name);
  }, [data]);

  useEffect(() => {
    if (!task) return;
    getUserAssigneed(task.assignee);
  }, [task]);

  useEffect(() => {
    if (!userLogin) return;
    if (!task) return;
    if (!userAssigneed) return;
    if (userLogin.position_id == 1 && task.paused == 0) {
      setDisableCompleted(false);
      return;
    }
    if (
      (userLogin.position_id == 2 && userLogin.id == task.created_by && task.paused == 0) ||
      (userLogin.position_id == 2 &&
        userLogin.department_id == userAssigneed.department_id &&
        task.paused == 0)
    ) {
      setDisableCompleted(false);
      return;
    }
    setDisableCompleted(true);
  }, [userLogin, task, userAssigneed]);

  useEffect(()=>{
    console.log('disableCompleted',disableCompleted)
  },[disableCompleted])

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    const path = localStorage.getItem("path");
    setUserLogin(userLocalStorage);
    setPath(path);
    dispatch(setFilterType("all"));
  }, []);

  useEffect(() => {
    if (taskId && task) {
      console.log(task.paused);
      console.log(task);
      if (task.paused) {
        setDisableCompleted(true);
        return;
      }
      getSubsOfTask(taskId);
    }
  }, [taskId, task]);

  const showInputChangName = () => {
    if(task && task.completed == 1){
      return;
    }
    setShow(true);
  };

  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Update name successfully");
      return;
    }
    if (result.error) {
      toast.error("Update name failed");
      return;
    }
    if (resultCompleted.isSuccess) {
      toast.success("Update completed successfully");
      return;
    }
    if (resultCompleted.error) {
      toast.error("Update completed failed");
      return;
    }
  }, [result, resultCompleted]);

  const getUserAssigneed = async (userId) => {
    const res = await getUserByIdQuery(userId);
    if (res.isError) {
      console.log("Error from server respone");
      return;
    }
    if (!res.data) return;
    console.log(res.data.users[0]);
    setUserAssigneed(res.data.users[0]);
  };

  const getSubsOfTask = async (taskId) => {
    const res = await getSubsOfTaskQuery(taskId);
    if (res.isError) {
      console.log("subtask");
    }
    // setDisableCompleted(false);
    if (res.data.sub_tasks.length == 0) return;
    res.data.sub_tasks.forEach((subTask) => {
      if (!subTask.completed) {
        setDisableCompleted(true);
        return;
      }
    });
  };

  const handleSave = () => {
    if (!userLogin) return;
    const updatedDate = new Date();
    const taskUpdated = {
      ...task,
      task_name: taskName,
      updated_by: Number(userLogin.id),
      updated_at: updatedDate.toISOString(),
    };
    console.log(taskUpdated);
    updateTask(taskUpdated);
    setShow(false);
  };

  const handleCancel = () => {
    setTaskName(currentTaskName);
    setShow(false);
  };

  const handleChangeTaskName = (event) => {
    setTaskName(event.target.value);
  };

  const handleComplete = () => {
    if (!task) return;
    if (!userLogin) return;
    if (task.task_status == "done") {
      const updatedDate = new Date();
      const completeDate = new Date();

      const taskUpdated = {
        ...task,
        completed: true,
        updated_by: Number(userLogin.id),
        updated_at: updatedDate.toISOString(),
        complete_date: completeDate.toISOString(),
      };
      console.log(taskUpdated);
      updateCompleted(taskUpdated);
      return;
    }
    toast(
      (t) => (
        <Alert severity="error" onClose={() => toast.dismiss(t.id)}>
          <AlertTitle>Error</AlertTitle>
          You should update the status to <strong>DONE</strong> before click{" "}
          <strong>COMPLETE</strong>
        </Alert>
      ),
      {
        position: "top-center",
        style: {
          padding: "0",
          margin: "0",
          background: "#fdeded",
        },
      }
    );
  };

  const handleBreadcrumbPath = () => {
    let breadcrumbPath = "Task list";
    if(path == "todo-tasks") breadcrumbPath = "Task Board";
    if(path == "reports") breadcrumbPath = "Reports";

    return [
      <Link href={`/${userId}/${path}`} key={1}>
        <a style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
          {/* {path && path == "tasks" ? "Task list" : "Task Board"} */}
          {breadcrumbPath}
        </a>
      </Link>,
      <Link href={"#"} key={2}>
        <a>{taskName}</a>
      </Link>,
    ]
  }

  // const breadcrumbs = [
  //   <Link href={`/${userId}/${path}`} key={1}>
  //     <a style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
  //       {path && path == "tasks" ? "Task list" : "Task Board"}
  //     </a>
  //   </Link>,
  //   <Link href={"#"} key={2}>
  //     <a>{taskName}</a>
  //   </Link>,
  // ];

  return (
    <Box component="div" paddingX={3}>
      <Stack spacing={2} marginBottom={2}>
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb">
          {/* {breadcrumbs} */}
          {handleBreadcrumbPath()}
        </Breadcrumbs>
      </Stack>
      <CardCustomize>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row">
            {task?.task_type_id == 1 ? (
              <>
                <CheckboxMarked sx={{ color: iconTaskColor }} />
                <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
                  T-{task?.id}
                </Typography>
              </>
            ) : (
              <>
                <CheckboxMultipleMarked sx={{ color: iconSubTaskColor }} />
                <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
                  ST-{task?.id}
                </Typography>
              </>
            )}
          </Stack>
          <Stack direction="row" alignItems="center">
            {task?.paused == 1 && (
              <Stack direction="row" alignItems="center" spacing={1} mr={4}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#ed6c02" }}>
                  Paused
                </Typography>
                {/* <Check fontSize="small" sx={{ color: "#ed6c02" }} /> */}
              </Stack>
            )}

            {task?.failed == 1 && (
              <Stack direction="row" alignItems="center" spacing={1} mr={4}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#d32f2f" }}>
                  Failed
                </Typography>
                {/* <Check fontSize="small" sx={{ color: "#ed6c02" }} /> */}
              </Stack>
            )}

            {userLogin?.position_id != 3 && task?.completed == 0 && (
              <Button
                variant="contained"
                color="success"
                disabled={disableCompleted}
                onClick={handleComplete}
              >
                Complete
              </Button>
            )}

            {/* <Button
                variant="contained"
                color="success"
                disabled={disableCompleted}
                onClick={handleComplete}
              >
                Complete
              </Button> */}

            {task?.completed != 1 ? null : (
              <Stack direction="row" alignItems="center" spacing={1} mr={1}>
                <Typography variant="subtitle1" sx={{ color: "#2e7d32" }}>
                  Completed
                </Typography>
                <Check fontSize="small" sx={{ color: "#2e7d32" }} />
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack sx={{ marginRight: 1 }}>
          <Stack sx={{ marginTop: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontSize={13}>
                Created at
              </Typography>
              <Typography variant="body2" fontSize={13}>
                {dayjs(new Date(task?.created_at)).format("ddd, MMM D, YYYY h:mm A")}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontSize={13}>
                Updated at
              </Typography>
              <Typography variant="body2" fontSize={13}>
                {dayjs(new Date(task?.updated_at)).format("ddd, MMM D, YYYY h:mm A")}
              </Typography>
            </Stack>
            <Divider sx={{ mt: 3, mb: 1 }} />
          </Stack>
          {!show ? (
            <TaskName variant="h5" onClick={showInputChangName}>
              {taskName}
            </TaskName>
          ) : (
            <Stack sx={{ marginTop: 2 }}>
              <TextFieldCustomize value={taskName} onChange={handleChangeTaskName} size="small" />
              <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSave}
                  disabled={taskName == "" ? true : false}
                >
                  Save
                </Button>
                <Button variant="outlined" size="small" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}

          <TaskDescription task={task && task} />
          <TaskDocuments task={task && task} />
          <Divider sx={{ mt: 3, mb: 3 }} />
          <Status task={task && task} />
          <Point task={task && task} />
          <Assignee task={task && task} />
          <DueDate task={task && task} />
          <Creator task={task && task} />
          <TableDetailTasks task={task && task} />
          <TabActivities task={task && task}/>
        </Stack>
      </CardCustomize>
    </Box>
  );
}

export default TaskDetail;

TaskDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
