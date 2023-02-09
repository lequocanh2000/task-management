import Layout from "@/layouts/layout";
import { forwardRef, useState, useEffect } from "react";
import { useRouter } from "next/router";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
// ** Third Party Imports
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import CheckboxMultipleMarked from "mdi-material-ui/CheckboxMultipleMarked";
// ** Components Imports
import {
  CardBestWishes,
  CardOverviewStatistics,
  CardListDone,
  CardListFailed,
  CardPieCharts,
  CardMembers,
} from "@/components/card";
import { useLazyGetOverviewsQuery } from "@/store/overviews/overviewsApi";

function OverViews() {
  const [userLogin, setUserLogin] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskTodos, setTaskTodos] = useState([]);
  const [taskInprogress, setTaskInprogress] = useState([]);
  const [taskDones, setTaskDones] = useState([]);
  const [taskFaileds, setTaskFaileds] = useState([]);
  const [members, setMembers] = useState([]);
  const [numberCompleted, setNumberCompleted] = useState();
  const [numberFailed, setNumberFailed] = useState();

  const [getOverviewsQuery] = useLazyGetOverviewsQuery();

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUserLogin(userLocalStorage);
  }, []);

  useEffect(() => {
    if (!userLogin) return;
    console.log(userLogin);
    if(userLogin.position_id == 1){
      getOverviews();
    }
    if(userLogin.position_id == 2){
      getOverviews(userLogin.id,userLogin.department_id);
    }
    if(userLogin.position_id == 3){
      getOverviews(userLogin.id);
    }
  }, [userLogin]);

  const getOverviews = async (userId,departmentId) => {
    const res = await getOverviewsQuery({ userId, departmentId });
    if (res.isError) {
      toast.error("Error get overviews from server");
      return;
    }
    if (!res.data.overviews) return;
    const overviewsData = res.data.overviews;
    console.log(overviewsData);
    setTasks(overviewsData.tasks);
    setTaskTodos(overviewsData.task_todos);
    setTaskInprogress(overviewsData.task_inprogress);
    setTaskDones(overviewsData.task_dones);
    setTaskFaileds(overviewsData.task_faileds);
    setMembers(overviewsData.members);
    setNumberCompleted(overviewsData.number_tasks_completed);
    setNumberFailed(overviewsData.number_tasks_failed);
  };
  return (
    <div>
      <CardBestWishes user={userLogin}/>
      <Box component="div" marginTop={1.5}>
        <CardOverviewStatistics
          tasks={tasks}
          taskTodos={taskTodos}
          taskInprogress={taskInprogress}
          taskDones={taskDones}
        />
      </Box>
      <Grid container marginTop={1} columnSpacing={1.5}>
        <Grid item xs={12} md={8} lg={8}>
          <Stack spacing={1.5}>
            <CardListDone taskDones={taskDones}/>
            <CardListFailed taskFaileds={taskFaileds}/>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Stack spacing={1.5}>
            <CardPieCharts numberCompleted={numberCompleted} numberFailed={numberFailed}/>
            <CardMembers members={members}/>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export default OverViews;

OverViews.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
