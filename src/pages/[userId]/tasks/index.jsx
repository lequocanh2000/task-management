import React, { useState, useEffect, useCallback } from "react";
//* Mui Import
import Layout from "@/layouts/layout";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputAdornment from "@mui/material/InputAdornment";
import toast from "react-hot-toast";

//* Icon Import
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import TrashCanOutline from "mdi-material-ui/TrashCanOutline";
import PencilBoxOutline from "mdi-material-ui/PencilBoxOutline";
import Plus from "mdi-material-ui/Plus";
import Magnify from "mdi-material-ui/Magnify";

//* Component Import
import PerfectScrollbarComponent from "react-perfect-scrollbar";
import { TaskDetails } from "@/components/taskDetails";
import { inputHoverColor, primaryColor, titleColor, titleColorVer2 } from "@/layouts/layoutContainer";
import { CardTask } from "@/components/card";
import { DialogConfirmation, DialogTaskDetail, DialogAdd } from "@/components/dialog";
// import { ToggleButtonGroup } from "@/components/toggleButtonGroup";
import { FormTaskAdd } from "@/components/forms";

import {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useGetTasksHaveSubsQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/store/tasks/tasksApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTasks, setTasks, setFilterSearch, setFilterType } from "@/store/tasks/tasksSlice";
import useDebounce from "@/hooks/useDebounce";

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
}));

const TitleReport = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColorVer2,
}));

const ToggleButtonCustomize = styled(ToggleButton)(({ theme }) => ({
  borderColor: "#556CD6",
  "&.MuiButtonBase-root.MuiToggleButton-root": {
    padding: "4px 12px",
    textTransform: "none",
    borderRadius: "0px",
  },
}));

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  maxHeight: 484,
  // maxHeight: 620,
  marginTop: theme.spacing(2),
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
}));

const ScrollWrapper = ({ children }) => {
  return (
    <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
      {children}
    </PerfectScrollbar>
  );
};

function Tasks() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const [open, setOpen] = useState(false);
  const [filterTypeTask, setFilterTypeTask] = useState("all");
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search,300)
  const { data: tasksData, error: tasksError, isLoading: tasksIsLoading } = useGetTasksQuery();

  useEffect(() => {
    localStorage.setItem("path", "tasks");
  }, []);

  // useEffect(() => {
  //   console.log(tasks)
  // }, [tasks]);

  useEffect(() => {
    if (!tasksData) return;
    const inCompletedList = tasksData.tasks.filter((task)=>task.completed == 0)
    dispatch(setTasks(inCompletedList));
  }, [tasksData]);

  useEffect(() => {
    dispatch(setFilterSearch(debounce));
  }, [debounce]);

  useEffect(() => {
    if (tasksError) {
      toast.error("Lỗi tải dữ liệu");
    }
  }, [tasksError, tasksIsLoading]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterType = (event, value) => {
    setFilterTypeTask(value);
    dispatch(setFilterType(value));
  };

  const handleShowDiaLogAdd = () => {
    setOpen(true);
  };

  return (
    <Box component="div" sx={{ paddingX: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>

          <CardCustomize sx={{ paddingBottom: 2, paddingX: 4, marginY: 1, minHeight: 580 }}>
          <Stack my={3}>
            <TitleReport variant="h4">List task</TitleReport>
          </Stack>
            <Stack marginTop={2} marginBottom={0}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Stack direction="row" alignItems="center">

                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={filterTypeTask}
                    onChange={handleFilterType}
                    aria-label="text alignment"
                  >
                    <ToggleButtonCustomize
                      color="primary"
                      size="small"
                      value="all"
                      aria-label="left aligned"
                    >
                      All
                    </ToggleButtonCustomize>
                    <ToggleButtonCustomize
                      color="primary"
                      size="small"
                      value="1"
                      aria-label="center aligned"
                    >
                      Tasks
                    </ToggleButtonCustomize>
                    <ToggleButtonCustomize
                      color="primary"
                      size="small"
                      value="2"
                      aria-label="justified"
                    >
                      Sub tasks
                    </ToggleButtonCustomize>
                    <ToggleButtonCustomize
                      color="primary"
                      size="small"
                      value="paused"
                      aria-label="justified"
                    >
                      Paused tasks
                    </ToggleButtonCustomize>
                  </ToggleButtonGroup>
                </Stack>
                <TextField
                  size="small"
                  sx={{ width: "30%" }}
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search task name"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Magnify />
                      </InputAdornment>
                    ),
                  }}
                />
                <AvatarGroup total={11} spacing="small">
                  <Avatar alt="Remy Sharp" src="/images/avatars/1.png" />
                  <Avatar alt="Travis Howard" src="/images/avatars/2.png" />
                  <Avatar alt="Agnes Walker" src="/images/avatars/4.png" />
                  <Avatar alt="Trevor Henderson" src="/images/avatars/5.png" />
                </AvatarGroup>
                <Box component="div" paddingRight={1}>
                  <Button variant="contained" onClick={handleShowDiaLogAdd}>
                    Create task
                  </Button>
                  <DialogAdd open={open} setOpen={setOpen} title={"Create task"}>
                    <FormTaskAdd open={open} setOpen={setOpen} />
                  </DialogAdd>
                </Box>
              </Stack>
              <ScrollWrapper>
                <Stack sx={{ padding: "4px", marginRight: 1 }} spacing={0.1}>
                  {tasks &&
                    tasks.map((task, index) => {
                      return <CardTask task={task} key={index} />;
                    })}
                </Stack>
              </ScrollWrapper>
            </Stack>
          </CardCustomize>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Tasks;

Tasks.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
