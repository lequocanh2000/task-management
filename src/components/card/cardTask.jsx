import { useEffect, useState } from "react";
//** Next import
import { useRouter } from "next/router";
//** MUI import
import CustomChip from "@/core/components/mui/chip";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { default as IconButton, default as Stack } from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
//** Icon import
import Check from "mdi-material-ui/Check";
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import CheckboxMultipleMarked from "mdi-material-ui/CheckboxMultipleMarked";
import ChevronDoubleRight from "mdi-material-ui/ChevronDoubleRight";
import SitemapOutline from "mdi-material-ui/SitemapOutline";
import StopCircleOutline from "mdi-material-ui/StopCircleOutline";
import TrashCanOutline from "mdi-material-ui/TrashCanOutline";
//** Component import
import { DialogConfirmation } from "@/components/dialog";
import {
  iconDeleteHover,
  iconSubTaskColor,
  iconTaskColor,
  titleColor,
} from "@/layouts/layoutContainer";
import {
  useLazyGetSubsOfTaskQuery,
} from "@/store/tasks/tasksApi";
import {
  useLazyGetUserByIdQuery,
} from "@/store/users/usersApi";

const statusObj = {
  todo: { text: "To do", color: "secondary" },
  inprogress: { text: "In progress", color: "info" },
  done: { text: "Done", color: "success" },
  failed: { text: "Failed", color: "error" },
  paused: { text: "Paused", color: "warning" },
};

const TaskCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.8, 1.4),
  borderRadius: "2px",
  boxShadow: "0 0 1px 1px rgba(0,0,0,0.2)",
  transition: "all linear 0.15s",
  ":hover": {
    backgroundColor: "rgba(219,222,233,0.3)",
    cursor: "pointer",
  },
}));

const ButtonAction = styled(IconButton)(({ theme }) => ({
  ":hover": {
    color: iconDeleteHover,
  },
}));

const TaskCardTitle = styled(Typography)(({ theme }) => ({
  maxWidth: 420,
  fontSize: 15,
  fontWeight: 500,
  color: titleColor,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}));

const TaskCardAvatar = styled(Avatar)(({ theme }) => ({
  bgcolor: "#ccc",
  width: 30,
  height: 30,
}));


const PointSpan = styled(Box)(({ theme }) => ({
  display: "flex",
  height: 24,
  width: 24,
  backgroundColor: "rgba(204,204,204,0.4)",
  borderRadius: "50%",
  fontSize: 14,
  lineHeight: "14px",
  alignItems: "center",
  justifyContent: "center",
  ":hover": {
    cursor: "pointer",
    backgroundColor: "rgba(204,204,204,0.6)",
  },
}));

const PointTag = (props) => {
  const { point } = props;
  return <PointSpan component="span">{point && point != 0 ? point : "-"}</PointSpan>;
};

function CardTask(props) {
  const { isDetailTasks, task } = props;
  const router = useRouter();
  const userId = router.query.userId;
  const [open, setOpen] = useState(false);
  const [userLogin, setUserLogin] = useState();
  const [openPause, setOpenPause] = useState(false);
  const [userAssignee, setUserAssignee] = useState();
  const [subTasks, setSubTasks] = useState();
  //Next router

  const [getUserByIdQuery] = useLazyGetUserByIdQuery();
  const [getSubsOfTaskQuery] = useLazyGetSubsOfTaskQuery();

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUserLogin(userLocalStorage);
  }, []);

  useEffect(() => {
    if (!task) return;
    getUserAssigneed(task.assignee);
    getSubsOfTask(task.id);
  }, [task]);

  const getUserAssigneed = async (userAssigneeId) => {
    const res = await getUserByIdQuery(userAssigneeId);
    if (res.isError) {
      toast.success("Erorr get user by id from server");
      return;
    }
    if (!res.data) return;
    setUserAssignee(res.data.users[0]);
  };

  const getSubsOfTask = async (taskId) => {
    const res = await getSubsOfTaskQuery(taskId);
    if (res.isError) {
      toast.success("Erorr get subs of task from server");
      return;
    }
    if (!res.data) return;
    setSubTasks(res.data.sub_tasks);
  };

  const handleClickTask = () => {
    router.replace(`/${userId}/tasks/${task?.id}/task-detail`);
  };

  const handleDeleteTask = (event) => {
    event.stopPropagation();
    if (userLogin?.position_id == 3) {
      toast(
        (t) => (
          <Alert severity="warning" onClose={() => toast.dismiss(t.id)}>
            <AlertTitle>Warning</AlertTitle>
            You can't <strong>delete</strong>
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
      return;
    }
    setOpen(true);
  };

  const handlePauseTask = (event) => {
    event.stopPropagation();
    if (userLogin?.position_id == 3) {
      toast(
        (t) => (
          <Alert severity="warning" onClose={() => toast.dismiss(t.id)}>
            <AlertTitle>Warning</AlertTitle>
            You can't <strong>pause</strong>
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
      return;
    }
    setOpenPause(true);
  };

  let IconTask = () => (
    <Tooltip title="Task">
      <CheckboxMarked sx={{ color: iconTaskColor }} />
    </Tooltip>
  );
  let TaskCardSymbol = () => (
    <Typography variant="body2" sx={{ marginLeft: 2, color: titleColor, fontWeight: 500 }}>
      T-{task?.id}
    </Typography>
  );

  if (task?.task_type_id !== 1) {
    IconTask = () => (
      <Tooltip title="Sub task">
        <CheckboxMultipleMarked sx={{ color: iconSubTaskColor }} />
      </Tooltip>
    );
    TaskCardSymbol = () => (
      <Typography variant="body2" sx={{ marginLeft: 2, color: titleColor, fontWeight: 500 }}>
        ST-{task?.id}
      </Typography>
    );
  }

  return (
    <TaskCard paddingX={2} onClick={handleClickTask}>
      <IconTask />
      <TaskCardSymbol />

      {task && task.task_type_id == 1 && (
        <Stack direction="row" alignItems="center" ml={2} mr={1}>
          <TaskCardTitle variant="body1">{task.task_name}</TaskCardTitle>
        </Stack>
      )}
      {task && task.task_type_id == 2 && (
        <Stack direction="row" alignItems="center" ml={2} mr={1}>
          <TaskCardTitle variant="body1" sx={{ opacity: 0.85 }}>
            {task.symbol_name}
          </TaskCardTitle>
          <ChevronDoubleRight fontSize="small" color="action" sx={{ mx: 1 }} />
          <TaskCardTitle variant="body1">{task.task_name}</TaskCardTitle>
        </Stack>
      )}

      <Stack direction="row" alignItems="center" ml="auto" spacing={2}>
        {subTasks && subTasks.length !== 0 && (
          <Tooltip title={`${subTasks.length} child issue`}>
            <SitemapOutline fontSize="small" />
          </Tooltip>
        )}
        <PointTag point={task?.point} />
        {task?.failed == 1 && (
          <CustomChip
            skin="light"
            size="small"
            label={statusObj["failed"].text}
            color={statusObj["failed"].color}
            sx={{
              height: 20,
              fontWeight: 700,
              "& .MuiChip-label": { px: 1.625, lineHeight: 1.539 },
            }}
          />
        )}

        {task?.paused == 1 && (
          <CustomChip
            skin="light"
            size="small"
            label={statusObj["paused"].text}
            color={statusObj["paused"].color}
            sx={{
              height: 20,
              fontWeight: 700,
              "& .MuiChip-label": { px: 1.625, lineHeight: 1.539 },
            }}
          />
        )}

        <CustomChip
          skin="light"
          size="small"
          label={statusObj[task?.task_status].text}
          color={statusObj[task?.task_status].color}
          sx={{ height: 20, fontWeight: 700, "& .MuiChip-label": { px: 1.625, lineHeight: 1.539 } }}
        />

        {isDetailTasks && task?.completed == 1 && (
          <Tooltip title="Completed">
            <Check fontSize="small" sx={{ color: "#2e7d32" }} />
          </Tooltip>
        )}

        <Tooltip title={userAssignee?.user_name}>
          <TaskCardAvatar alt="Ana" src={userAssignee?.avatar} />
        </Tooltip>

        {!isDetailTasks && (
          <Stack direction="row" spacing={1}>
            {/* {task?.task_status != "todo" && task?.task_type_id == 1 && (
              <Tooltip title="Pasue">
                <ButtonAction
                  sx={{ color: "#7c7c7c", ":hover": { color: "#ff9800" } }}
                  onClick={handlePauseTask}
                >
                  <StopCircleOutline />
                </ButtonAction>
              </Tooltip>
            )} */}
            {task?.task_status != "todo" && (
              <Tooltip title="Pasue">
                <ButtonAction
                  sx={{ color: "#7c7c7c", ":hover": { color: "#ff9800" } }}
                  onClick={handlePauseTask}
                >
                  <StopCircleOutline />
                </ButtonAction>
              </Tooltip>
            )}
            {task?.task_status == "todo" && task?.paused != 1 && (
              <Tooltip title="Delete">
                <ButtonAction sx={{ color: "#7c7c7c" }} onClick={handleDeleteTask}>
                  <TrashCanOutline />
                </ButtonAction>
              </Tooltip>
            )}
          </Stack>
        )}
      </Stack>
      <DialogConfirmation
        deleteTitle={`Are you sure want to delete `}
        warningTitle={
          task?.task_type_id == 1
            ? `Subtasks will also be deleted after you click `
            : `The information of this task will be deleted from the system after you click `
        }
        open={open}
        setOpen={setOpen}
        isDeleteTask={true}
        task={task && task}
      />
      <DialogConfirmation
        deleteTitle={
          task?.paused == 0 ? "Are you sure want to pause " : "Are you sure want to continue "
        }
        warningTitle={
          task?.task_type_id == 1 && task?.paused == 0
            ? `Subtasks will also be paused after you click `
            : task?.task_type_id == 2 && task?.paused == 0
            ? `This task will be paused after you click `
            : `This task will be continue after you click `
        }
        open={openPause}
        setOpen={setOpenPause}
        isPauseTask={true}
        task={task && task}
      />
    </TaskCard>
  );
}

export default CardTask;
