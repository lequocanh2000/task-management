import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/layout";
// ** MUI Imports
import toast from "react-hot-toast";
import AvatarMui from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import AccordionMui from "@mui/material/Accordion";

import AccordionSummaryMui from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
//** Icon Imports
import ChevronDown from "mdi-material-ui/ChevronDown";

import Plus from "mdi-material-ui/Plus";
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import CheckboxMultipleMarked from "mdi-material-ui/CheckboxMultipleMarked";
import TrashCanOutline from "mdi-material-ui/TrashCanOutline";
import PencilBoxOutline from "mdi-material-ui/PencilBoxOutline";
import MessageTextOutline from "mdi-material-ui/MessageTextOutline";
import LinkVariant from "mdi-material-ui/LinkVariant";

//** React-Beautiful-DnD import
import { DragDropContext, Droppable, Draggable, resetServerContext } from "react-beautiful-dnd";

// MessageTextOutline
//LinkVariant
//** Component import
import { ToggleButtonGroup } from "@/components/toggleButtonGroup";
import { CardTask, CardTaskBoard } from "@/components/card";
import { TaskDetails } from "@/components/taskDetails";
import { AccordionTask } from "@/components/accordion";
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import { inputHoverColor, primaryColor, titleColor, titleColorVer2 } from "@/layouts/layoutContainer";
import { iconTaskColor, iconSubTaskColor, textColor } from "@/layouts/layoutContainer";
import {
  useGetTaskByIdQuery,
  useGetTasksHaveSubsQuery,
  useUpdateTaskMutation,
} from "@/store/tasks/tasksApi";

const boxBoardColor = "#F4F5F7";
// const boxBoardColor = "#ccc";

const CardCustomizeStatus = styled(Box)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1),
  textTransform: "uppercase",
  fontWeight: 700,
  fontSize: 15,
  textAlign: 'center',
}));

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
}));

const BoardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: boxBoardColor,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const TitleReport = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColor,
  padding: theme.spacing(0,2),
}));


function TodoTasks() {
  const [todos, setTodos] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [dones, setDones] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksHaveSubs, setTasksHaveSubs] = useState([]);

  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;

  const { data, error, isLoading } = useGetTasksHaveSubsQuery();
  const [updateTask, result] = useUpdateTaskMutation();

  useEffect(() => {
    localStorage.setItem("path", "todo-tasks");
  }, []);

  useEffect(() => {
    if (!data) return;
    const taskImcompletedList = data.tasks.filter((taskImcompleted)=>taskImcompleted.completed == 0)
    setTasks(taskImcompletedList);
  }, [data]);

  useEffect(()=>{
    if (!tasks) return;
    const tasksSubs = [];
    tasks.forEach((task, index) => {
      if (task.sub_tasks.length) {
        tasksSubs.push(task);
      }
    });
    setTasksHaveSubs(tasksSubs);
  },[tasks])

  useEffect(() => {
    if (!tasks.length) return;
    const todoList = tasks.filter((task)=> task.sub_tasks.length == 0 && task.task_status == "todo");
    const inprogressList = tasks.filter((task)=> task.sub_tasks.length == 0 && task.task_status == "inprogress");
    const doneList = tasks.filter((task)=> task.sub_tasks.length == 0 && task.task_status == "done");
    setTodos(todoList);
    setInprogress(inprogressList);
    setDones(doneList);
  }, [tasks]);

  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Cập nhật status thành công");
      return;
    }
    if (result.error) {
      toast.error("Cập nhật status thất bại");
      return;
    }
  }, [result]);

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
        const taskSlected = tasks.find((task) => task.id == taskId);
        const { sub_tasks, ...task } = taskSlected;
        const updatedDate = new Date();
        const taskUpdated = {
          ...task,
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
        const taskSlected = tasks.find((task) => task.id == taskId);
        const { sub_tasks, ...task } = taskSlected;
        const updatedDate = new Date();
        const taskUpdated = {
          ...task,
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
        const taskSlected = tasks.find((task) => task.id == taskId);
        const { sub_tasks, ...task } = taskSlected;
        const updatedDate = new Date();
        const taskUpdated = {
          ...task,
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

  return (
    <Grid container columnSpacing={1}>
      <Grid item xs={12}>
        <CardCustomize sx={{paddingX: 8, paddingY: 4, minHeight: 680}}>
          <TitleReport variant="h4" sx={{color: titleColorVer2, px: 0, mb: 3}}>Tasks Board</TitleReport>
          <Grid container columnSpacing={2}>
            <Grid item xs={4}>
              <CardCustomizeStatus component="div" sx={{backgroundColor: '#adadad80', color: '#686868'}}>
                To do
              </CardCustomizeStatus>
            </Grid>
            <Grid item xs={4}>
              <CardCustomizeStatus component="div" sx={{backgroundColor: '#0a66b780', color: '#3b4b95'}}>
                In propress
              </CardCustomizeStatus>
            </Grid>
            <Grid item xs={4}>
              <CardCustomizeStatus component="div" sx={{backgroundColor: '#9fe794', color: '#478b52'}}>
                Done
              </CardCustomizeStatus>
            </Grid>
          </Grid>

          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container columnSpacing={2} sx={{ backgroundColor: "#fefefe", marginTop: 2 }}>
              <Grid item xs={4}>
                <Droppable droppableId="todo">
                  {(provided) => (
                    <BoardContainer
                      component="div"
                      sx={{ height: "100%" }}
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
                      sx={{ height: "100%" }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Stack spacing={1.5} padding={0.5}>
                        {inprogress &&
                          inprogress.map((task, index) => {
                            return <CardTaskBoard task={task} index={task.id} key={index} />;
                          })}
                        {/* <CardTaskBoard type={"task"} id={4} index={4} />
                      <CardTaskBoard type={"task"} id={5} index={5} /> */}
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
                      sx={{ height: "100%" }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Stack spacing={1.5} padding={0.5}>
                        {dones &&
                          dones.map((task, index) => {
                            return <CardTaskBoard task={task} index={task.id} key={index} />;
                          })}
                        {/* <CardTaskBoard type={"task"} id={6} index={6} /> */}
                        {provided.placeholder}
                      </Stack>
                    </BoardContainer>
                  )}
                </Droppable>
              </Grid>
            </Grid>
          </DragDropContext>
          {tasksHaveSubs &&
            tasksHaveSubs.map((task, index) => {
              return <AccordionTask task={task} key={index} />;
            })}
        </CardCustomize>
      </Grid>
    </Grid>
  );
}

export default TodoTasks;

TodoTasks.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  resetServerContext();
  return { props: { data: [] } };
}
