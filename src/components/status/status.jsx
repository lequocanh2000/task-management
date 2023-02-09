import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";

//** Icon import

//** Component import
import { CardStatus } from "@/components/card";
import { status } from "@/components/status/statusContainer";
import { inputHoverColor, titleColor } from "@/layouts/layoutContainer";
import {
  useUpdateTaskMutation
} from "@/store/tasks/tasksApi";

const ContentStatus = styled(Box)(({ theme }) => ({
  minWidth: "24%",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  borderRadius: '2px',
  ":hover": {
    backgroundColor: inputHoverColor,
    cursor: "pointer",
  },
}));

const MenuCustomize = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginLeft: theme.spacing(1),
  }
}));

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1),
  minWidth: 100,
}));

function Status(props) {
  const { task } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [taskStatus, setTaskStatus] = useState();
  const [listTaskStatus, setListTaskStatus] = useState();
  const [updateTask, result] = useUpdateTaskMutation();

  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;

  useEffect(() => {
    if (!task) return;
    setTaskStatus(task.task_status);
  }, [task]);

  useEffect(() => {
    if (!taskStatus) return;
    const statusArr = Object.keys(status);
    const listStatus = statusArr.filter((item) => item !== taskStatus);
    setListTaskStatus(listStatus);
  }, [taskStatus]);

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

  const handleOpen = (event) => {
    if(task && task.completed == 1){
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectStatus = (status) => {
    setTaskStatus(status);
    const createdDate = new Date();
    const updatedDate = new Date();
    const taskUpdated = {
      ...task,
      task_status: status,
      updated_by: Number(userId),
      updated_at: updatedDate.toISOString(),
    };
    updateTask(taskUpdated)
    setAnchorEl(null);
  };

  return (
      <Stack sx={{ marginTop: 0 }} direction="row" alignItems="center" spacing={2}>
        <TitleDetail variant="subtitle2">Status</TitleDetail>
        <ContentStatus onClick={handleOpen}>
          <CardStatus title={status[taskStatus && taskStatus]} />
        </ContentStatus>
        <MenuCustomize
          keepMounted
          id="simple-menu"
          anchorEl={anchorEl}
          onClose={handleClose}
          open={Boolean(anchorEl)}
        >
          {listTaskStatus &&
            listTaskStatus.map((taskStatus, index) => {
              return (
                <MenuItem onClick={() => handleSelectStatus(taskStatus)} key={index}>
                  <CardStatus title={status[taskStatus]} />
                </MenuItem>
              );
            })}
        </MenuCustomize>
      </Stack>
  );
}

export default Status;
