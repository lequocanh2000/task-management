import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

//** Icon import
import Check from "mdi-material-ui/Check";
import Close from "mdi-material-ui/Close";

//** Component import
import { titleColor } from "@/layouts/layoutContainer";
import {
  useUpdateTaskMutation
} from "@/store/tasks/tasksApi";

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1),
  minWidth: 100,
}));

const PointSpan = styled(Box)(({ theme }) => ({
  display: "flex",
  height: 28,
  width: 28,
  backgroundColor: "rgba(204,204,204,0.4)",
  borderRadius: "50%",
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  lineHeight: "14px",
  alignItems: "center",
  justifyContent: "center",
  ":hover": {
    cursor: "pointer",
    backgroundColor: "rgba(204,204,204,0.6)",
  },
}));

const PointContent = styled(Box)(({ theme }) => ({
  padding: "8px 0",
  minWidth: "24%",
  // width: '100%',
  borderRadius: "2px",
  ":hover": {
    cursor: "pointer",
    backgroundColor: "rgba(204,204,204,0.4)",
  },
}));

const PointButton = styled(Button)(({ theme }) => ({
  minWidth: "unset",
  padding: "6px 6px",
}));

const maxPoint = 10;
const minPoint = 0;

function Point(props) {
  const { task } = props
  const [point, setPoint] = useState(0);
  const [pointCurrent, setPointCurrent] = useState(4);
  const [isChangePoint, setIsChangePoint] = useState(false);
  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;
  const [updateTask, result] = useUpdateTaskMutation();

  useEffect(() => {
    if (!task) return;
    setPoint(task.point);
    setPointCurrent(task.point)
  }, [task]);

  const handleChangePoint = (event) => {
    if (event.target.value > maxPoint) return;
    if (event.target.value < minPoint) return;
    console.log(event.target.value);
    setPoint(event.target.value);
  };

  const handleShowChangePoint = () => {
    if(task && task.completed == 1){
      return;
    }
    setIsChangePoint(true);
  };

  const handleSave = () => {
    const updatedDate = new Date();
    const taskUpdate = {
      ...task,
      point: Number(point),
      updated_by: Number(userId),
      updated_at: updatedDate.toISOString(),
    }
    console.log(taskUpdate)
    updateTask(taskUpdate)
    setPoint(point);
    setIsChangePoint(false);
  };

  const handleCancel = () => {
    setPoint(pointCurrent);
    setIsChangePoint(false);
  };

  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Update point successfully");
      return;
    }
    if (result.error) {
      toast.error("Update point failed");
      return;
    }
  }, [result]);

  return (
    <Stack direction="row" marginTop={1} alignItems="center" spacing={2}>
      <TitleDetail variant="subtitle2">Point</TitleDetail>
      {!isChangePoint && (
        <PointContent component="div" onClick={handleShowChangePoint}>
          <PointSpan component="span" ml={1}>{point !== 0 ? point : '-'}</PointSpan>
        </PointContent>
      )}
      {isChangePoint && (
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            type="number"
            // label="Point"
            variant="standard"
            InputProps={{
              inputProps: { max: maxPoint, min: minPoint },
            }}
            sx={{ minWidth: 100 }}
            value={point}
            onChange={handleChangePoint}
            // onBlur={ () => setIsChangePoint(false) }
            helperText="max point is 10"
          />
          <Stack direction="row" spacing={0.5} sx={{ marginTop: 1 }}>
            <PointButton variant="outlined" size="small" color="secondary" onClick={handleSave}>
              <Check sx={{ fontSize: "16px" }} />
            </PointButton>
            <PointButton variant="outlined" size="small" color="secondary" onClick={handleCancel}>
              <Close sx={{ fontSize: "16px" }} />
            </PointButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default Point;
