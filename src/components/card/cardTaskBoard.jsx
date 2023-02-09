import { useEffect, useState } from "react";
//** MUI import
import AvatarMui from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
//** Icon import
import Badge from "@mui/material/Badge";
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import CheckboxMultipleMarked from "mdi-material-ui/CheckboxMultipleMarked";
import LinkVariant from "mdi-material-ui/LinkVariant";
import MessageTextOutline from "mdi-material-ui/MessageTextOutline";
import toast from "react-hot-toast";
//** React-Beautiful-DnD import
import { Draggable } from "react-beautiful-dnd";
//** Component import
import CustomChip from "@/core/components/mui/chip";
import { iconSubTaskColor, iconTaskColor } from "@/layouts/layoutContainer";
import { useLazyGetDocumentAndCommentOfTaskQuery } from "@/store/tasks/tasksApi";
import { useLazyGetUserByIdQuery } from "@/store/users/usersApi";
import { useRouter } from "next/router";

const statusObj = {
  todo: { text: "To do", color: "secondary" },
  inprogress: { text: "In progress", color: "info" },
  done: { text: "Done", color: "success" },
  failed: { text: "Failed", color: "error" },
  paused: { text: "Paused", color: "warning" },
};

const Avatar = styled(AvatarMui)(({ theme }) => ({
  width: 32,
  height: 32,
}));

const BadgeCustomize = styled(Badge)(({ theme }) => ({
  "&.MuiBadge-root .MuiBadge-badge": {
    minWidth: "auto",
    fontSize: 12,
    height: "auto",
    padding: "2px 4px",
  },
}));

const StackCustomize = styled(Stack)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: "12px 12px",
  borderRadius: theme.shape.borderRadius,
  transition: "0.2s",
  ":hover": {
    cursor: "pointer",
    // backgroundColor: "rgba(0,0,0,0.1)",
    boxShadow: "0 0 2px 2px rgba(0,0,0,0.1)",
    transform: "scale(1.02)",
  },
}));

const SpanCustomize = styled(Box)(({ theme }) => ({
  ":hover": {
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    textDecorationColor: "rgba(0,0,0,0.8)",
  },
}));

function CardTaskBoard(props) {
  const { task, index } = props;

  const router = useRouter();
  const userId = router.query.userId;

  const [path, setPath] = useState("");
  const [user, setUser] = useState();
  const [documentTotal, setDocumentTotal] = useState();
  const [commentTotal, setCommentTotal] = useState();
  const [getDocumentAndCommentOfTaskQuery] = useLazyGetDocumentAndCommentOfTaskQuery();
  const [getUserByIdQuery] = useLazyGetUserByIdQuery();

  useEffect(() => {
    const path = localStorage.getItem("path");
    setPath(path);
  }, []);

  useEffect(() => {
    if (!task) return;
    getUserAssignee(task?.assignee);
    getDocumentAndCommentOfTask(task.id);
  }, [task]);

  const getUserAssignee = async (userAssigneeId) => {
    const res = await getUserByIdQuery(userAssigneeId);
    if (res.isError) {
      toast.success("Erorr! get user by id from server");
      return;
    }
    if (!res.data) return;
    setUser(res.data.users[0]);
  };

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
    // console.log(task?.id)
  };

  return (
    <Draggable draggableId={task?.id.toString()} index={index} key={task?.id}>
      {(provided) => (
        <Box
          component="div"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <StackCustomize>
            <Stack direction="row" justifyContent="space-between">
              <SpanCustomize component="span" onClick={handleClick}>
                <Typography variant="subtitle2">{task?.task_name}</Typography>
              </SpanCustomize>
              <Stack direction="row">
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
                {task?.task_type_id === 1 ? (
                  <CheckboxMarked fontSize="small" sx={{ color: iconTaskColor,ml:1 }} />
                ) : (
                  <CheckboxMultipleMarked fontSize="small" sx={{ color: iconSubTaskColor,ml:1 }} />
                )}
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BadgeCustomize badgeContent={commentTotal} color="primary">
                  <Tooltip title="Comments">
                    <MessageTextOutline fontSize="small" color="secondary" />
                  </Tooltip>
                </BadgeCustomize>
                <BadgeCustomize badgeContent={documentTotal} color="primary">
                  <Tooltip title="Document's links">
                    <LinkVariant fontSize="small" color="secondary" />
                  </Tooltip>
                </BadgeCustomize>
              </Stack>
              <Tooltip title={user?.user_name}>
                <Avatar alt="Flora" src={user?.avatar} />
              </Tooltip>
            </Stack>
          </StackCustomize>
        </Box>
      )}
    </Draggable>
  );
}

export default CardTaskBoard;

{
  /* <Draggable draggableId="1" index={1}>
                        {(provided) => (
                          <Box
                            component="div"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CardTaskBoard type={"task"} />
                          </Box>
                        )}
                      </Draggable> */
}
