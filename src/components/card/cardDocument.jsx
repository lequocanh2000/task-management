import { useEffect, useState } from "react";
//** Next import
//** MUI import
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { default as IconButton, default as Stack } from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
//** Icon import
import TrashCanOutline from "mdi-material-ui/TrashCanOutline";
//** Component import
import { DialogConfirmation } from "@/components/dialog";
import {
  iconDeleteHover,
  primaryColor
} from "@/layouts/layoutContainer";

const ButtonDelete = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  ":hover": {
    color: iconDeleteHover,
    cursor: "pointer",
  },
}));

const AvatarDocument = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
}));

const LinkDocument = styled("a")(({ theme }) => ({
  color: primaryColor,
  textDecoration: "underline",
  ":hover": {
    opacity: "0.8",
  },
}));

function CardDocument(props) {
  const { document, task } = props;
  const [open, setOpen] = useState(false);
  const [documentDetails, setDocumentDetails] = useState();

  const handleDeleteDocument = (task) => {
    if(task && task.completed == 1){
      return;
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!document) return;
    setDocumentDetails(document.document_details);
  }, [document]);

  useEffect(() => {
    if (!documentDetails) return;
    console.log(document.document_details);
  }, [documentDetails]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={3} sm={3}>
        <Typography variant="body2">{document?.descriptions}</Typography>
      </Grid>
      <Grid item xs={3} sm={2} sx={{overflow: 'hidden'}}>
        <Stack>
          {documentDetails &&
            documentDetails.map((documentDetail, index) => {
              return (
                <LinkDocument href={documentDetail.url} target="_blank" key={index}>
                  {documentDetail.name}
                </LinkDocument>
              );
            })}
        </Stack>
      </Grid>
      <Grid item xs={2} sm={2} display="flex" justifyContent="center">
        <Tooltip title={`${document?.user_name}`} placement="right">
          <AvatarDocument alt="Remy Sharp" src={`${document?.avatar}`}/>
        </Tooltip>
      </Grid>
      <Grid item xs={2} sm={2} display="flex" justifyContent="center">
        <Tooltip title="Delete" placement="right-start">
          <ButtonDelete
            sx={{ color: "#7c7c7c", height: "40px" }}
            onClick={() => handleDeleteDocument(task)}
          >
            <DialogConfirmation
              deleteTitle={`Do you want to delete `}
              open={open}
              setOpen={setOpen}
              isDeleteDocument={true}
              document={document && document}
            />
            <TrashCanOutline />
          </ButtonDelete>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default CardDocument;
