// ** React Imports
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// ** Icons Imports
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
// ** Styled Components
import { iconTaskColor } from "@/layouts/layoutContainer";
import {
  useAddTaskMutation,
  useLazyGetTaskByIdQuery,
  useLazyGetTaskParamTaskTypeIdQuery
} from "@/store/tasks/tasksApi";

const defaultValues = {
  taskName: "",
  // task_type_id: '',
  parentId: "",
  checkbox: false,
};

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 160,
    },
  },
};

const FormTaskAdd = (props) => {
  const { open, setOpen } = props;
  // ** States
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskTypeId, setTaskTypeId] = useState(1);
  const [parentId, setParentId] = useState("");
  const [checked, setChecked] = useState(true);
  const [checkSelected, setCheckSelected] = useState(true);
  const [parentTask, setParentTask] = useState();

  const [addTask, result] = useAddTaskMutation();
  const [getTaskParamTaskTypeIdQuery] = useLazyGetTaskParamTaskTypeIdQuery();
  const [getTaskTaskByIdQuery] = useLazyGetTaskByIdQuery();


  const router = useRouter();
  const userId = router.query.userId;

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(()=>{
    getTaskParamTaskTypeId()
  },[])

  const getTaskParamTaskTypeId = async () => {
    const res = await getTaskParamTaskTypeIdQuery(1)
    if(res.isError){
      toast.success("Erorr get task type by id from server");
      return;
    }
    const parentTasks = res.data.tasks
    const parentTasksIncompleted = parentTasks.filter((parentTask) => parentTask.completed != 1)
    setTasks(parentTasksIncompleted)
  }

  const getTaskTaskById = async (taskId) => {
    const res = await getTaskTaskByIdQuery(taskId)
    if(res.isError){
      toast.success("Erorr get task by id from server");
      return;
    }
    if(!res.data) return;
    setParentTask(res.data.tasks[0])
  }


  const handleChangeTaskName = (event) => {
    setTaskName(event.target.value);
  };

  const handleChangeTaskTypes = (event) => {
    setTaskTypeId(event.target.value);
    setChecked(!checked);
  };

  const handleChangeParentId = async (event) => {
    const parent_id = event.target.value;
    await getTaskTaskById(parent_id);
    setParentId(parent_id);
    setCheckSelected(true);
  };

  const onSubmit = () => {
    if (taskTypeId == 1) {
      const createdDate = new Date();
      const updatedDate = new Date();
      const task = {
        task_name: taskName,
        symbol_name: '',
        task_type_id: taskTypeId,
        created_by: Number(userId),
        updated_by: Number(userId),
        parent_id: 0,
        created_at: createdDate.toISOString(),
        updated_at: updatedDate.toISOString(),
      }
      addTask({
        ...task
      })
      setOpen(false);
      return;
    }
    if (!parentTask) {
      setCheckSelected(false);
      return;
    }
    const createdDate = new Date();
    const updatedDate = new Date();
    const task = {
      task_name: taskName,
      symbol_name: parentTask.task_name,
      task_type_id: Number(taskTypeId),
      created_by: Number(userId),
      updated_by: Number(userId),
      parent_id: parentTask.id,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
    }
    addTask({
      ...task
    })
    setOpen(false);
  };

  useEffect(() => {
    if(result.isError) {
      toast.error('Create task failed')
      console.log('Create task failed')
      return;
    };
    if(result.isSuccess) {
      toast.success('Create task successfully')
      console.log('Create task successfully')
      return;
    }
  }, [result]);

  return (
    <Card sx={{ maxWidth: 500, boxShadow: "none" }}>
      {/* <CardHeader title='Basic' titleTypographyProps={{ variant: 'h6' }} /> */}
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="taskName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => (
                    <TextField
                      value={taskName}
                      label="Task name"
                      onChange={(e) => {
                        onChange(e);
                        handleChangeTaskName(e);
                      }}
                      placeholder="Enter task name"
                      error={Boolean(errors.taskName)}
                      aria-describedby="validation-basic-first-name"
                    />
                  )}
                />
                {errors.taskName && (
                  <FormHelperText sx={{ color: "error.main" }} id="validation-basic-first-name">
                    *Field required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl error={Boolean(errors.radio)}>
                <FormLabel>Type</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="validation-basic-radio"
                  onChange={handleChangeTaskTypes}
                  value={taskTypeId}
                >
                  <Stack direction="row" spacing={2}>
                    <Stack direction="row" alignItems="center">
                      <Typography>Task</Typography>
                      <Radio value={1}/>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <Typography>Subtask</Typography>
                      <Radio value={2} />
                    </Stack>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Grid>
            {taskTypeId != 1 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-outlined-label">Parent task</InputLabel>
                  <Select
                    label="Parent task"
                    value={parentId}
                    id="demo-simple-select-outlined"
                    labelId="demo-simple-select-outlined-label"
                    MenuProps={MenuProps}
                    onChange={handleChangeParentId}
                  >
                    <MenuItem value="" disabled>Choose parent task</MenuItem>
                    {tasks && tasks.map((task,index)=>{
                      return (
                        <MenuItem value={task.id} key={index}>
                          <Stack direction='row' spacing={2} alignItems='center'>
                            <CheckboxMarked sx={{color: iconTaskColor}}/>
                            <Typography variant="body2">{task.task_name}</Typography>
                          </Stack>
                        </MenuItem>
                      )
                    })}
                    {/* <MenuItem value={1}>Task 1</MenuItem>
                    <MenuItem value={2}>Task 2</MenuItem>
                    <MenuItem value={3}>Task 3</MenuItem> */}
                  </Select>
                </FormControl>
                {!checkSelected && (
                  <FormHelperText sx={{ color: "error.main" }} id="validation-basic-select">
                    *Field required
                  </FormHelperText>
                )}
              </Grid>
            )}
            {/* <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined-label'>Parent task</InputLabel>
                <Select
                  label='Parent task'
                  value={parentId}
                  id='demo-simple-select-outlined'
                  labelId='demo-simple-select-outlined-label'
                  MenuProps={MenuProps}
                  onChange={handleChangeParentId}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
                {!checkSelected && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-select'>
                    *Vui lòng nhập thông tin
                  </FormHelperText>
                )}
            </Grid> */}

            <Grid item xs={12} sx={{textAlign: "right", mt: 4}}>
              <Button size="large" type="submit" variant="contained">
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormTaskAdd;
