// ** React Imports
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
// ** MUI Imports
import { DialogConfirmation } from "@/components/dialog";
import { EditorComment } from "@/components/editor";
import {
  convertDraftToStringHTML,
  convertStringHTMLToDraft,
} from "@/components/editor/editorContainer";
import {
  useAddCommentMutation,
  useGetCommentsOfTaskQuery
} from "@/store/comments/commentsApi";
import {
  useAddNotificationMutation
} from "@/store/notifications/notificationsApi";
import { useGetUserByIdQuery } from "@/store/users/usersApi";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TabMui from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { EditorState, convertToRaw } from "draft-js";
import toast from "react-hot-toast";

const CardActiveCommentContent = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  // marginTop: "-10px",
  // lineHeight: '14px',
  ":hover": {
    cursor: "auto",
  },
}));

const status = {
  todo: "To do",
  inprogress: "In progress",
  done: "Done",
};

const Tab = styled(TabMui)(({ theme }) => ({
  fontSize: 13,
  textTransform: "unset",
  minWidth: 50,
}));

const AvatarActivity = styled(Avatar)(({ theme }) => ({
  bgcolor: "#ccc",
  width: 40,
  height: 40,
  // marginRight: theme.spacing(1),
  // marginLeft: theme.spacing(2),
}));

const TextFieldActivityComment = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#c4c4c4",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5a5fe0",
    },
  },
}));

const TextFieldContent = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    paddingLeft: "8px",
    textAlign: "justify",
  },
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#fbfbfb",
  "& fieldset": { border: "none" },
  // '&.Mui-focused fieldset': {
  //   borderColor: 'green',
  //   // border: '1px solid green'
  // },
}));

const ButtonActivity = styled(Box)(({ theme }) => ({
  color: "#767676",
  fontWeight: 500,
  marginRight: "16px",
  fontSize: 14,
  ":hover": {
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    cursor: "pointer",
    opacity: "0.8",
  },
}));

const todoColor = "87,87,87";
const TagActivity = styled(Box)(({ theme }) => ({
  background: `rgba(${todoColor}, 0.1)`,
  color: `rgb(${todoColor})`,
  padding: "0 4px",
  marginLeft: "8px",
  borderRadius: "4px",
  fontSize: "13px",
  fontWeight: 700,
  textTransform: "uppercase",
}));

const CardActivityComment = (props) => {
  const { comment, userId } = props;
  // const initComment = "<p>Give to me document, pls. Give to me document, pls. </p>";
  // const [commentCurrent, setCommentCurrent] = useState("");
  const [editComment, setEditComment] = useState(EditorState.createEmpty());
  const [editCommentStringHtml, setEditCommentStringHtml] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);


  useEffect(() => {
    if (!comment) return;
    console.log(comment)
    const editCommentDraft = convertStringHTMLToDraft(comment?.content);
    setEditComment(editCommentDraft);
    setEditCommentStringHtml(comment?.content);
  }, [comment]);

  const handleEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  const handleDelete = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const editCommentHtml = convertDraftToStringHTML(editComment);
    console.log(editCommentHtml);
    setEditCommentStringHtml(editCommentHtml);
    setIsEdit(false);
  }, [editComment]);

  const handleCancelEditComment = useCallback(() => {
    const editCommentDraft = convertStringHTMLToDraft(editCommentStringHtml);
    setEditComment(editCommentDraft);
    setIsEdit(false);
  }, [editCommentStringHtml]);

  return (
    <Stack direction="row" spacing={2} marginBottom={3}>
      <AvatarActivity alt="Ana" src={comment?.avatar} />
      <Stack width="100%">
        <Typography variant="body1" fontWeight={500}>
          {comment?.user_name}
        </Typography>
        <Typography variant="body2" fontSize={13}>
          Created at {dayjs(new Date(comment?.created_at)).format("MMMM D, YYYY h:mm A")}
        </Typography>
        <Typography variant="body2" fontSize={13}>
          Updated at {dayjs(new Date(comment?.updated_at)).format("MMMM D, YYYY h:mm A")}
        </Typography>

        {!isEdit && (
          <CardActiveCommentContent
            component="div"
            dangerouslySetInnerHTML={{ __html: editCommentStringHtml }}
          ></CardActiveCommentContent>
        )}

        {isEdit && (
          <Stack>
            <EditorComment comment={editComment} setComment={setEditComment} setIsEmpty={setIsEmpty}/>
            <Box component="div" sx={{ marginTop: 1 }}>
              <Button variant="contained" sx={{ marginRight: 2 }} onClick={handleSave} disabled={isEmpty}>
                Save
              </Button>
              <ButtonActivity component="span" onClick={handleCancelEditComment}>
                Cancel
              </ButtonActivity>
            </Box>
          </Stack>
        )}

        {!isEdit && userId && (comment?.created_by === Number(userId)) && (
          <Box component="div" sx={{ marginTop: 1 }}>
            <ButtonActivity component="span" onClick={handleEdit}>
              Edit
            </ButtonActivity>
            <ButtonActivity component="span" onClick={handleDelete}>
              Delete
            </ButtonActivity>
          </Box>
        )}
        <DialogConfirmation
          deleteTitle={"Do you want to delete this comment "}
          open={open}
          setOpen={setOpen}
          comment={comment}
          isDeleteComment={true}
        />
      </Stack>
    </Stack>
  );
};

function Comments(props) {
  const {task} = props
  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;
  const [commentList, setCommentList] = useState();
  const [isAddComment, setIsAddComment] = useState(false);
  const [comment, setComment] = useState(EditorState.createEmpty());
  const [user, setUser] = useState();
  const [isEmpty, setIsEmpty] = useState(true);

  // const [commentStringHtml, setCommentStringHtml] = useState("");

  const { data, error, isLoading } = useGetCommentsOfTaskQuery(taskId, {
    skip: taskId === undefined,
  });
  const { data: userData, error: userError, isLoading: userIsLoading } = useGetUserByIdQuery(userId, {
    skip: userId === undefined,
  });
  const [addComment, result] = useAddCommentMutation();
  const [addNotification, resultAddNotification] = useAddNotificationMutation();


  // useEffect(() => {
  //   if (!data) return;
  //   setCommentList(data.comments);
  //   if(!commentList) return;
  //   console.log(commentList)
  // }, [data, commentList]);

  useEffect(() => {
    if (!data) return;
    setCommentList(data.comments);
  }, [data]);

  useEffect(() => {
    if (!userData) return;
    setUser(userData.users[0]);
  }, [userData]);

  useEffect(() => {
    if (!result) return;
    if (result.isError){
      toast.error('Create comment failed');
      return;
    }
    if (result.isSuccess){
      toast.success('Created comment successfully');
      return;
    }
  }, [result]);

  useEffect(() => {
    if (!resultAddNotification) return;
    if (resultAddNotification.isError){
      console.log('Create notification failed');
      return;
    }
    if (resultAddNotification.isSuccess){
      console.log('Created notification successfully');
      return;
    }
  }, [resultAddNotification]);

  useEffect(()=>{
    setTimeout(()=>{
      const disableURLMention = document.querySelectorAll('a.wysiwyg-mention')
      disableURLMention.forEach((element)=>{
        element.addEventListener('click',(event)=>{
          event.preventDefault();
        })
      })
    },500)
  },[commentList])

  const handleCancel = useCallback(() => {
    setComment(EditorState.createEmpty());
    setIsAddComment(false);
  }, []);

  const handleAddComment = useCallback(() => {
    const commentHtml = convertDraftToStringHTML(comment);
    if (commentHtml) {
      const createdDate = new Date();
      const updatedDate = new Date();
      const commentAdded = {
        content: commentHtml,
        created_at: createdDate.toISOString(),
        updated_at: updatedDate.toISOString(),
        task_id: taskId,
        created_by: userId,
        updated_by: userId,
      };
      addComment(commentAdded);
      console.log(commentHtml);
      const convertRaw = convertToRaw(comment.getCurrentContent());
      const mentions = Object.values(convertRaw.entityMap)
      const listUserTagged = []
      mentions.forEach((mention)=>{
        listUserTagged.push(mention.data.url)
      })
      console.log(listUserTagged);
      listUserTagged.forEach((userTaggedId)=>{
        const notificationAdded = {
          title: `${user.user_name} tagged you in a comment`,
          content: commentHtml,
          from_user: Number(userId),
          to_user: userTaggedId,
          created_at: createdDate.toISOString(),
          updated_at: updatedDate.toISOString(),
          notification_type_id: 2,
          task_id: Number(taskId),
        }
        addNotification(notificationAdded)
        console.log({notificationAdded})
      })
      setComment(EditorState.createEmpty());
      setIsAddComment(false);
    }
  }, [comment,taskId,userId,user]);

  const handleShowEditorAddComment = useCallback(() => {
    if(task && task.completed == 1){
      return;
    }
    setIsAddComment(true);
  }, [task]);


  return (
    <>
      <Stack direction="row" spacing={2}>
        <AvatarActivity alt="Ana" src={user?.avatar} />
        {!isAddComment ? (
          <TextFieldActivityComment
            fullWidth
            id="size-small"
            label="Comment"
            size="small"
            onClick={handleShowEditorAddComment}
            disabled={task && task.completed == 1 ? true : false }
          />
        ) : (
          <Stack width="100%">
            <EditorComment comment={comment} setComment={setComment} setIsEmpty={setIsEmpty}/>
            <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
              <Button variant="contained" size="small" onClick={handleAddComment} disabled={isEmpty}>
                Create
              </Button>
              <Button variant="outlined" size="small" color="secondary" onClick={handleCancel}>
                Cancle
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
      <Stack marginTop={5}>
        {commentList &&
          commentList.map((comment, index) => {
            return <CardActivityComment comment={comment} userId={userId} key={index} />;
          })}

      </Stack>
    </>
  );
}

export default Comments;
