// ** React Imports
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";

// ** MUI Imports
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";

// ** Icon Imports
import CloseCircleOutline from "mdi-material-ui/CloseCircleOutline";

// ** Third Party Imports
import DatePickerWrapper from "@/core/styles/libs/react-datepicker";
import { inputHoverColor, titleColor } from "@/layouts/layoutContainer";
import { useLazyCheckTasksQuery, useUpdateTaskMutation } from "@/store/tasks/tasksApi";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TextFieldDuedate = styled(TextField)(({ theme }) => ({
  width: 166,
  ":hover": {
    backgroundColor: inputHoverColor,
  },
  "& fieldset": { border: "none" },
}));

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1),
  minWidth: 100,
}));



const CustomInput = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly } = props;

  return (
    <TextFieldDuedate
      inputRef={ref}
      {...props}
      sx={{
        "& .MuiInputBase-input.MuiOutlinedInput-input": {
        padding: (1,1.2),
      }}}
      label={label || ""}
      {...(readOnly && { inputProps: { readOnly: true } })}
    />
  );
});

const formatIsoToDateTime = (iso) => {
  const dateTime = new Date(iso);
  if (dateTime.getTime() > 0) return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
  return null;
};

const DueDate = (props) => {
  const { task } = props;

  // ** States
  const [dueDate, setDueDate] = useState(null);

  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;
  const [updateTask, result] = useUpdateTaskMutation();
  const [checkTasksQuery] = useLazyCheckTasksQuery();

  useEffect(() => {
    if (!task) return;
    if (task.due_date === null) {
      setDueDate(null);
    } else {
      const duedate = new Date(task.due_date);
      setDueDate(duedate);
    }
  }, [task]);

  useEffect(() => {
    if (!dueDate) return;
    const date = dayjs(dueDate).toISOString();
    const isoToDateTime = formatIsoToDateTime(date);
  }, [dueDate]);

  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Set deadline successfully");
      checkTasks();
      return;
    }
    if (result.error) {
      toast.error("Set deadline failed");
      return;
    }
  }, [result]);

  const checkTasks = async () => {
    const res = await checkTasksQuery();
    if(res.isError){
      toast.error("Error! check tasks from server");
      return;
    }
    if(res.data) console.log(res.data)
  }


  const handleChangeDueDate = (date) => {
    if(task && task.completed == 1){
      return;
    }
    const updatedDate = new Date();
    const due = new Date(date);
    const taskUpdate = {
      ...task,
      due_date: due.toISOString(),
      updated_by: Number(userId),
      updated_at: updatedDate.toISOString(),
    };
    updateTask(taskUpdate);
    setDueDate(date);
  };

  const handleDeleteDueDate = () => {
    if(task && task.completed == 1){
      return;
    }
    if (!dueDate) return;
    const updatedDate = new Date();
    const taskUpdate = {
      ...task,
      due_date: null,
      updated_by: Number(userId),
      updated_at: updatedDate.toISOString(),
    };
    console.log(taskUpdate);
    updateTask(taskUpdate);
    setDueDate(null);
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ marginTop: 1 }} spacing={2}>
      <TitleDetail variant="subtitle2">Due date</TitleDetail>
      <DatePickerWrapper>
        <DatePicker
          selected={dueDate}
          id="basic-input"
          onChange={(date) => handleChangeDueDate(date)}
          placeholderText="Set deadline"
          customInput={<CustomInput/>}
        />
      </DatePickerWrapper>
      <IconButton onClick={handleDeleteDueDate}>
        <CloseCircleOutline />
      </IconButton>
    </Stack>
  );
};

export default DueDate;
