import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// ** MUI Imports
import { CardTask } from "@/components/card";
import {
  titleColor
} from "@/layouts/layoutContainer";
import { useGetSubsOfTaskQuery, useGetTaskByIdQuery } from "@/store/tasks/tasksApi";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import PerfectScrollbarComponent from "react-perfect-scrollbar";

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1),
  minWidth: 100,
}));

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  maxHeight: 236,
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

function TableDetailTasks(props) {
  const { task } = props;
  const [subTasks, setSubTasks] = useState();
  const [parentTask, setParentTask] = useState();

  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;

  const { data, error, isLoading } = useGetSubsOfTaskQuery(taskId, {
    skip: taskId === undefined,
  });
  const {
    data: parentTaskData,
    error: parentTaskDataError,
    isLoading: parentTaskDataIsLoading,
  } = useGetTaskByIdQuery(task?.parent_id, {
    skip: task === undefined,
  });

  useEffect(() => {
    if (!task) return;
    // console.log(task);
  }, [task]);

  useEffect(() => {
    if (!data) return;
    setSubTasks(data.sub_tasks);
    // console.log("task có subs", data);
    // console.log("subtask có parent", parentTaskData);
    if (!parentTaskData) return;
    setParentTask(parentTaskData.tasks[0]);
    // console.log("task có substask", subTasks);
    // console.log("subtask có parent", parentTask);
  }, [data, parentTaskData, subTasks, parentTask]);

  return (
    <Stack sx={{ marginTop: 10 }} spacing={1}>
      {!parentTask && (
        <TitleDetail variant="subtitle2">
          Sub tasks
        </TitleDetail>
      )}
      <ScrollWrapper>
        <Stack sx={{ paddingY: 1, paddingLeft: 1, paddingRight: 2 }} spacing={0.15}>
          {subTasks &&
            subTasks.length !== 0 &&
            subTasks.map((subTask, index) => {
              return <CardTask task={subTask} isDetailTasks={true} key={index} />;
            })}
        </Stack>
      </ScrollWrapper>

      {parentTask && (
        <>
          <TitleDetail variant="subtitle2">
            Parent task
          </TitleDetail>
          <Stack sx={{ paddingY: 1, paddingLeft: 1, paddingRight: 2 }} spacing={0.15}>
            <CardTask task={parentTask && parentTask} isDetailTasks={true} />
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default TableDetailTasks;
