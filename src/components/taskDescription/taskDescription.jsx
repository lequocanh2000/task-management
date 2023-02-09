import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
//** MUI import
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

//** Component import
import { EditorDescription } from "@/components/editor";
import {
  convertDraftToStringHTML,
  convertStringHTMLToDraft
} from "@/components/editor/editorContainer";
import { titleColor } from "@/layouts/layoutContainer";
import {
  useGetTaskByIdQuery,
  useUpdateTaskMutation
} from "@/store/tasks/tasksApi";

//** DraftWysiwyg import
import { EditorState } from "draft-js";
import toast from "react-hot-toast";

const DescriptionContent = styled(Box)(({ theme }) => ({
  minHeight: 100,
  margin: "0px 8px",
  padding: "0px 8px",
  backgroundColor: "#f9f9f9",
  fontSize: 14,
  borderRadius: theme.shape.borderRadius,
  transition: "all linear 0.15s",
  ":hover": {
    backgroundColor: "#f1f1f1",
    cursor: "pointer",
  },
}));

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1)
}));



function TaskDescription(props) {
  // const {task} = props
  // console.log(task)
  const [task, setTask] = useState();
  const [initDescription, setInitDescription] = useState();
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [descriptionStringHtml, setDescriptionStringHtml] = useState("");
  const [showEditorAndButtons, setShowEditorAndButtons] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const [updateTask, result] = useUpdateTaskMutation();


  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;
  const { data, error, isLoading } = useGetTaskByIdQuery(taskId,{
    skip: taskId === undefined,
  });

  useEffect(() => {
    if(!data) return;
    setTask(data.tasks[0])
    // setInitDescription(task.descriptions)
  }, [data]);

  useEffect(() => {
    if(!task) return;
    if(task.descriptions == "null"){
      setInitDescription('<p></p>')
      return;
    }
    setInitDescription(task.descriptions)
  }, [task]);

  useEffect(() => {
    if(!initDescription) return;
    const descriptionDraft = convertStringHTMLToDraft(initDescription);
    setDescription(descriptionDraft);
    setDescriptionStringHtml(initDescription);
  }, [initDescription]);

  useEffect(() => {
    if(result.isError) {
      toast.error('Update description successfully')
      return;
    };
    if(result.isSuccess) {
      toast.success('Update description failed')
      return;
    }
  }, [result]);

  const handleAddDescription = useCallback((description) => {
    const descriptionHtml = convertDraftToStringHTML(description);
    //call API gửi dữ liệu đi
    const updatedDate = new Date();
    updateTask({
      ...task,
      descriptions: descriptionHtml,
      updated_by: Number(userId),
      updated_at: updatedDate.toISOString(),
    })
    setTask({
      ...task,
      descriptions: descriptionHtml,
      updated_by: Number(userId),
      updated_at: updatedDate.toISOString(),
    })
    //close buttons and Editor

    setDescriptionStringHtml(descriptionHtml);
    setShowEditorAndButtons(false);
  }, [task,description,userId]);

  const handleCancelDescription = useCallback((descriptionStringHtml) => {
    const descriptionDraft = convertStringHTMLToDraft(descriptionStringHtml);
    setDescription(descriptionDraft);
    setShowEditorAndButtons(false);
  }, []);

  const handleShowEditorButtons = useCallback(() => {
    if(task && task.completed == 1){
      return;
    }
    setShowEditorAndButtons(true);
  }, [task]);

  return (
    <Stack sx={{ marginTop: 2 }}>
      <TitleDetail variant="body1" mb={0.5}>Description</TitleDetail>
      {!showEditorAndButtons && (
        <DescriptionContent
          component="div"
          onClick={handleShowEditorButtons}
          dangerouslySetInnerHTML={{ __html: descriptionStringHtml }}
        ></DescriptionContent>
      )}
      {showEditorAndButtons && (
        <Stack ml={1}>
          <EditorDescription
            show={showEditorAndButtons}
            description={description}
            setDescription={setDescription}
            setIsEmpty={setIsEmpty}
          />
          <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleAddDescription(description)}
              disabled={isEmpty}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => handleCancelDescription(descriptionStringHtml)}
            >
              Cancle
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default TaskDescription;
