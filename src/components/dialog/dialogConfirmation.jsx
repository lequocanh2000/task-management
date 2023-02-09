import {
  useDeleteTaskMutation,
  useLazyGetSubsOfTaskQuery,
  useUpdatePausedTaskMutation
} from "@/store/tasks/tasksApi";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { Fragment, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";

import { useDeleteCommentMutation } from "@/store/comments/commentsApi";
import { useDeleteDocumentMutation } from "@/store/documents/documentsApi";

// type DialogConfirmationProps = {
//     open: boolean;
//     setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     deleteTitle?: string;
//     enterprise?: GetEnterprise;
//     isDeleteEnterprise?: boolean;
// };

const DialogConfirmation = (props) => {
  const {
    comment,
    open,
    setOpen,
    deleteTitle,
    warningTitle,
    task,
    isDeleteTask,
    isDeleteComment,
    isDeleteLogWork,
    document,
    isDeleteDocument,
    isPauseTask,
  } = props;

  const [deleteTask, resultDeleteTask] = useDeleteTaskMutation();
  const [deleteSubTask, resultDeleteSubTask] = useDeleteTaskMutation();
  const [deleteDocument, resultDocument] = useDeleteDocumentMutation();
  const [getSubsOfTaskQuery] = useLazyGetSubsOfTaskQuery();
  const [deleteComment, resultComment] = useDeleteCommentMutation();
  const [updatePausedTask, resultPausedTask] = useUpdatePausedTaskMutation();

  // const getSubsOfTask = async (taskId) => {
  //   const res = await getSubsOfTaskQuery(taskId);
  //   if(res.isError){
  //     toast.error('DialogConfirmation > Delete task, Error get getSubsOfTask from server');
  //     return;
  //   }
  //   const subtasks = res.data.sub_tasks;
  //   console.log(subtasks)
  //   subtasks.forEach((sub)=>{
  //     setTimeout(()=>{
  //       console.log(sub.id)
  //       deleteSubTask(sub.id)
  //     },200)
  //   })

  // }

  const DeleteConfirmText = () => (
    <Fragment>
      <Typography component="span" variant="body1">
        {deleteTitle ? deleteTitle : "Are you sure want to delete ?"}
      </Typography>
      {isDeleteComment && (
        // comment &&
        <Typography
          component="span"
          variant="body1"
          fontWeight={600}
        ></Typography>
      )}
      {isDeleteLogWork && (
        // comment &&
        <Typography
          component="span"
          variant="body1"
          fontWeight={600}
        >{`${"work log A"} ?`}</Typography>
      )}
      {isDeleteTask && (
        // task &&
        <Typography
          component="span"
          variant="body1"
          fontWeight={600}
        >{`${task?.task_name} ?`}</Typography>
      )}
      {isDeleteDocument && (
        // task &&
        <Typography
          component="span"
          variant="body1"
          fontWeight={600}
        >{`${document?.descriptions} ?`}</Typography>
      )}
      {isPauseTask && (
        // task &&
        <Typography
          component="span"
          variant="body1"
          fontWeight={600}
        >{`${task?.task_name} ?`}</Typography>
      )}
    </Fragment>
  );

  const handleClose = useCallback(() => setOpen(false), []);
  const handleAgree = useCallback(() => {
    // if (isDeleteComment && comment) {
    //     deleteEnterprise({ enterpriseId: enterprise.id });
    //     setOpen(false);
    // }
    if (isDeleteComment) {
      if (!comment) return;
      console.log(comment.comment_id);
      deleteComment(comment.comment_id);
      setOpen(false);
      return;
    }

    if (isDeleteLogWork) {
      //call api delete comment
      // deleteEnterprise({ enterpriseId: enterprise.id });
      setOpen(false);
      toast.success("Deleted successfully");
      return;
    }

    if (isDeleteTask) {
      if (!task) return;
      // if(task.task_type_id == 1){
      //   deleteTask(task.id)
      //   getSubsOfTask(task.id)
      //   setOpen(false)
      //   return;
      // }
      deleteTask(task.id);
      setOpen(false);
      return;
      //call api delete comment
      // deleteTask(task?.id);
      // setOpen(false);
    }

    if (isDeleteDocument) {
      //call api delete comment
      deleteDocument(document?.id);
      setOpen(false);
      return;
    }

    if (isPauseTask) {
      //call api delete comment
      if (!task) return;
      console.log("pause", task.id);
      updatePausedTask({id: task.id, paused: !task.paused});
      setOpen(false);
    }
  }, [task, document, comment]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (resultDeleteTask.isSuccess) {
      toast.success("Deleted task successfully");
      return;
    }
    if (resultDeleteTask.error) {
      toast.error("Deleted task failed");
      return;
    }
    if (resultDocument.isSuccess) {
      toast.success("Deleted document successfully");
      return;
    }
    if (resultDocument.error) {
      toast.error("Deleted document failed");
      return;
    }
    if (resultDeleteSubTask.isSuccess) {
      console.log("Deleted subtask successfully");
      return;
    }
    if (resultDeleteSubTask.error) {
      console.log("Deleted subtask failed");
      return;
    }
    if (resultComment.isSuccess) {
      toast.success("Deleted comment successfully");
      return;
    }
    if (resultComment.error) {
      toast.error("Deleted comment failed");
      return;
    }
    if (resultPausedTask.isSuccess) {
      toast.success(resultPausedTask.data.message);
      return;
    }
    if (resultPausedTask.error) {
      toast.error("Task pause failed");
      return;
    }
  }, [resultDeleteTask, resultDocument, resultDeleteSubTask, resultComment, resultPausedTask]);

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleClose}
        onClick={handleClick}
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            marginBottom={2}
            sx={{ color: "#000000de" }}
          >
            <DeleteConfirmText />
          </DialogContentText>
          <Alert severity="warning" sx={{ display: "flex" }}>
            <AlertTitle>Warning</AlertTitle>
            <Typography component="span" variant="body2">
              {warningTitle
                ? warningTitle
                : "Information will be deleted from the system when you click "}
              <Typography component="span" fontSize={13} fontWeight={600}>
                {" "}
                YES
              </Typography>
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions className="dialog-actions-dense" sx={{ paddingX: 3 }}>
          <Button variant="text" onClick={handleAgree}>
            YES
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default DialogConfirmation;
