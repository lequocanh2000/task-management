import { useRouter } from "next/router";
import { useEffect, useState } from "react";
//** MUI import
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

//** Icon import
import Plus from "mdi-material-ui/Plus";

//** Component import
import { CardDocument } from "@/components/card";
import { DialogAdd } from "@/components/dialog";
import { FromDocumentAdd } from "@/components/forms";
import {
  primaryColor,
  titleColor
} from "@/layouts/layoutContainer";
import { useGetDocumentsOfTaskQuery } from "@/store/documents/documentsApi";

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1)
}));

const ButtonAdd = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  bgcolor: primaryColor,
  ":hover": {
    color: primaryColor,
    bgcolor: primaryColor,
    // cursor: "pointer",
  },
}));




function TaskDocuments(props) {
  const {task} = props
  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;
  const [open, setOpen] = useState(false);

  const [taskDocuments, setTaskDocuments] = useState();

  const { data, error, isLoading } = useGetDocumentsOfTaskQuery(taskId, {
    skip: taskId === undefined,
  });

  useEffect(() => {
    if (!data) return;
    setTaskDocuments(data.documents);
  }, [data]);

  const handleShowDiaLogAdd = () => {
    if(task && task.completed == 1){
      return;
    }
    setOpen(true);
  };

  return (
    <Stack sx={{ marginTop: 2 }}>
      <Stack direction="row" alignItems="center" spacing={3}>
        <TitleDetail variant="subtitle2">Document</TitleDetail>
        <ButtonAdd size="small" onClick={handleShowDiaLogAdd}>
          <Plus fontSize="small" />
        </ButtonAdd>
        <DialogAdd open={open} setOpen={setOpen} title={"Add documents"}>
          <FromDocumentAdd setOpen={setOpen} />
        </DialogAdd>
      </Stack>
      <Stack sx={{ marginLeft: 1, marginTop: 0 }}>
        <Grid container spacing={2} marginBottom={1}>
          <Grid item xs={3} sm={3}>
            <Typography variant="body2">Description</Typography>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Typography variant="body2">File</Typography>
          </Grid>
          <Grid item xs={2} sm={2} display="flex" justifyContent="center">
            <Typography variant="body2">Creator</Typography>
          </Grid>
          <Grid item xs={2} sm={2} display="flex" justifyContent="center">
            <Typography variant="body2">Action</Typography>
          </Grid>
        </Grid>
        {taskDocuments &&
          taskDocuments.map((document, index) => {
            return (
              <CardDocument document={document} key={index} task={task}/>
            );
          })}
      </Stack>
    </Stack>
  );
}

export default TaskDocuments;
