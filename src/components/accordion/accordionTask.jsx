import { useCallback, useEffect, useState } from "react";
// ** MUI Imports
import CustomChip from "@/core/components/mui/chip";
import AccordionMui from "@mui/material/Accordion";
import AvatarMui from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummaryMui from "@mui/material/AccordionSummary";
//** Icon Imports
import ChevronDown from "mdi-material-ui/ChevronDown";

import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import LinkVariant from "mdi-material-ui/LinkVariant";
import MessageTextOutline from "mdi-material-ui/MessageTextOutline";

//** React-Beautiful-DnD import
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// MessageTextOutline
//LinkVariant
//** Component import
import { CardTaskBoard } from "@/components/card";
import { iconTaskColor, textColor } from "@/layouts/layoutContainer";
import {
  useLazyGetDocumentAndCommentOfTaskQuery,
  useUpdateTaskMutation
} from "@/store/tasks/tasksApi";
import { useLazyGetUserByIdQuery } from "@/store/users/usersApi";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const boxBoardColor = "#F4F5F7";
const statusObj = {
  todo: { text: "To do", color: "secondary" },
  inprogress: { text: "In progress", color: "info" },
  done: { text: "Done", color: "success" },
  failed: { text: "Failed", color: "error" },
  paused: { text: "Paused", color: "warning" },
};
const CardCustomize = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  textTransform: "uppercase",
  fontWeight: 700,
  fontSize: 14,
}));

const BoardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: boxBoardColor,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const BadgeCustomize = styled(Badge)(({ theme }) => ({
  "&.MuiBadge-root .MuiBadge-badge": {
    minWidth: "auto",
    fontSize: 12,
    height: "auto",
    padding: "2px 4px",
  },
}));

const Avatar = styled(AvatarMui)(({ theme }) => ({
  width: 32,
  height: 32,
}));

const Accordion = styled(AccordionMui)(({ theme }) => ({
  boxShadow: "none !important",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: "8px 0",
  },
}));

const AccordionSummary = styled(AccordionSummaryMui)(({ theme }) => ({
  // padding: theme.spacing(0, 4),
  border: "1px solid rgba(0,0,0,0.05)",
  backgroundColor: "#f4f5f7",
  // boxShadow: "0 0 2px 2px 2px rgba(0,0,0,0.8)" ,
  borderRadius: theme.shape.borderRadius,
  minHeight: theme.spacing(6),
  "&.Mui-expanded": {
    minHeight: theme.spacing(6),
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "6px 0",
  },
  ":hover": {
    backgroundColor: "#f4f5f7",
  },
}));
const AccordionTitle = styled(Box)(({ theme }) => ({
  maxWidth: 460,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  fontWeight: 600,
  ":hover": {
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    textDecorationColor: textColor,
    cursor: "pointer",
    opacity: "0.9",
  },
}));

function AccordionTask(props) {
  const { task } = props;
  const router = useRouter();
  const userId = router.query.userId;
  const [path, setPath] = useState("");

  const [todos, setTodos] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [dones, setDones] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [user, setUser] = useState();
  const [documentTotal, setDocumentTotal] = useState();
  const [commentTotal, setCommentTotal] = useState();
  const [getUserByIdQuery] = useLazyGetUserByIdQuery();
  const [updateTask, result] = useUpdateTaskMutation();
  const [getDocumentAndCommentOfTaskQuery] = useLazyGetDocumentAndCommentOfTaskQuery();

  useEffect(() => {
    if (!task) return;
    getUserById(task.assignee);
    setSubTasks(task.sub_tasks);
    getDocumentAndCommentOfTask(task.id);
  }, [task]);

  useEffect(() => {
    if (!subTasks.length) return;
    console.log(subTasks);
    const todoList = subTasks.filter((subTask) => subTask.task_status == "todo");
    const inprogressList = subTasks.filter((subTask) => subTask.task_status == "inprogress");
    const doneList = subTasks.filter((subTask) => subTask.task_status == "done");
    setTodos(todoList);
    setInprogress(inprogressList);
    setDones(doneList);
  }, [subTasks]);

  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Update status successfully");
      return;
    }
    if (result.error) {
      toast.error("Update status failed");
      return;
    }
  }, [result]);

  const getUserById = async (userId) => {
    const res = await getUserByIdQuery(userId);
    if (res.isError) {
      toast.error("Error! Get user by id from server");
      return;
    }
    setUser(res.data.users[0]);
  };

  const removeTaskAfterUpdateStatus = (currentStatus, taskId) => {
    if (currentStatus == "todo") {
      const todoList = todos.filter((task) => task.id != taskId);
      setTodos(todoList);
      return;
    }
    if (currentStatus == "inprogress") {
      const inprogressList = inprogress.filter((task) => task.id != taskId);
      setInprogress(inprogressList);
      return;
    }
    if (currentStatus == "done") {
      const doneList = dones.filter((task) => task.id != taskId);
      setDones(doneList);
      return;
    }
  };

  const onDragEnd = useCallback(
    (result) => {
      const { destination, source, draggableId } = result;
      if (destination == null) return;
      const { droppableId: newStatus } = destination;
      const { droppableId: currentStatus } = source;
      const taskId = Number(draggableId);

      if (currentStatus == newStatus) {
        return;
      }

      if (newStatus == "todo") {
        const taskSlected = subTasks.find((task) => task.id == taskId);
        const updatedDate = new Date();
        const taskUpdated = {
          ...taskSlected,
          task_status: newStatus,
          updated_by: Number(userId),
          updated_at: updatedDate.toISOString(),
        };
        removeTaskAfterUpdateStatus(currentStatus, taskId);
        setTodos([...todos, taskSlected]);
        updateTask(taskUpdated);

        return;
      }
      if (newStatus == "inprogress") {
        const taskSlected = subTasks.find((task) => task.id == taskId);
        const updatedDate = new Date();
        const taskUpdated = {
          ...taskSlected,
          task_status: newStatus,
          updated_by: Number(userId),
          updated_at: updatedDate.toISOString(),
        };
        removeTaskAfterUpdateStatus(currentStatus, taskId);
        setInprogress([...inprogress, taskSlected]);
        updateTask(taskUpdated);
        return;
      }
      if (newStatus == "done") {
        const taskSlected = subTasks.find((task) => task.id == taskId);
        const updatedDate = new Date();
        const taskUpdated = {
          ...taskSlected,
          task_status: newStatus,
          updated_by: Number(userId),
          updated_at: updatedDate.toISOString(),
        };
        removeTaskAfterUpdateStatus(currentStatus, taskId);
        setDones([...dones, taskSlected]);
        updateTask(taskUpdated);
        return;
      }
    },
    [todos, inprogress, dones]
  );

  useEffect(() => {
    const path = localStorage.getItem("path");
    setPath(path);
  }, []);

  const getDocumentAndCommentOfTask = async (taskId) => {
    const res = await getDocumentAndCommentOfTaskQuery(taskId);
    if (res.isError) {
      toast.success("Erorr! get total document and comment of task from server");
      return;
    }
    if (!res.data) return;
    setDocumentTotal(res.data.document_total);
    setCommentTotal(res.data.commnet_total);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    router.replace(`/${userId}/tasks/${task?.id}/task-detail`);
  };

  return (
    <Accordion sx={{ marginTop: 1 }}>
      <AccordionSummary
        expandIcon={<ChevronDown />}
        aria-controls="panel-content-1"
        id="panel-header-1"
      >
        <Stack
          direction="row"
          width={"100%"}
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckboxMarked fontSize="small" sx={{ color: iconTaskColor }} />
            <AccordionTitle component="span" onClick={handleClick}>
              {task?.task_name}
            </AccordionTitle>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3} paddingRight={2}>
            <Box component="div" sx={{ marginTop: "2px" }}>
              <BadgeCustomize badgeContent={commentTotal} color="primary">
                <Tooltip title="Comments">
                  <MessageTextOutline fontSize="small" color="secondary" />
                </Tooltip>
              </BadgeCustomize>
            </Box>
            <Box component="div" sx={{ marginTop: "2px" }}>
              <BadgeCustomize badgeContent={documentTotal} color="primary">
                <Tooltip title="Document's links">
                  <LinkVariant fontSize="small" color="secondary" />
                </Tooltip>
              </BadgeCustomize>
            </Box>
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
            <Tooltip title={user?.user_name}>
              <Avatar alt="Flora" src={user?.avatar} />
            </Tooltip>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: "#eee", padding: 0, border: "none" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container columnSpacing={2} sx={{ backgroundColor: "#fefefe", marginTop: 2 }}>
            <Grid item xs={4}>
              <Droppable droppableId="todo">
                {(provided) => (
                  <BoardContainer
                    component="div"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Stack spacing={1.5} padding={0.5}>
                      {todos &&
                        todos.map((task, index) => {
                          return <CardTaskBoard task={task} index={task.id} key={index} />;
                        })}
                      {provided.placeholder}
                    </Stack>
                  </BoardContainer>
                )}
              </Droppable>
            </Grid>

            <Grid item xs={4}>
              <Droppable droppableId="inprogress">
                {(provided) => (
                  <BoardContainer
                    component="div"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Stack spacing={1.5} padding={0.5}>
                      {inprogress &&
                        inprogress.map((task, index) => {
                          return <CardTaskBoard task={task} index={task.id} key={index} />;
                        })}
                      {provided.placeholder}
                    </Stack>
                  </BoardContainer>
                )}
              </Droppable>
            </Grid>

            <Grid item xs={4}>
              <Droppable droppableId="done">
                {(provided) => (
                  <BoardContainer
                    component="div"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Stack spacing={1.5} padding={0.5}>
                      {dones &&
                        dones.map((task, index) => {
                          return <CardTaskBoard task={task} index={task.id} key={index} />;
                        })}
                      {provided.placeholder}
                    </Stack>
                  </BoardContainer>
                )}
              </Droppable>
            </Grid>
          </Grid>
        </DragDropContext>
      </AccordionDetails>
    </Accordion>
  );
}

export default AccordionTask;
