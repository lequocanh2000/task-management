// ** React Imports
import { useCallback, useEffect, useState } from "react";

// ** MUI Imports
import { Comments } from "@/components/comments";
import { DialogConfirmation } from "@/components/dialog";
import { EditorComment } from "@/components/editor";
import {
  convertDraftToStringHTML,
  convertStringHTMLToDraft,
} from "@/components/editor/editorContainer";
import { titleColor } from "@/layouts/layoutContainer";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TabMui from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { EditorState } from "draft-js";

const CardActiveCommentContent = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
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
}));

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1),
  minWidth: 100,
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
  // // const {title} = props
  const initComment = "<p>Give to me document, pls. Give to me document, pls. </p>";
  const [editComment, setEditComment] = useState(EditorState.createEmpty());
  const [editCommentStringHtml, setEditCommentStringHtml] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const editCommentDraft = convertStringHTMLToDraft(initComment);
    setEditComment(editCommentDraft);
    setEditCommentStringHtml(initComment);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  const handleDelete = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const editCommentHtml = convertDraftToStringHTML(editComment);
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
      <AvatarActivity alt="Ana" src={`/images/avatars/2.png`} />
      <Stack width="100%">
        <Typography variant="body1" fontWeight={500}>
          Annie
        </Typography>
        <Typography variant="body2" fontSize={13}>
          October 21, 2022 at 8:52 PM
        </Typography>

        {!isEdit && (
          <CardActiveCommentContent
            component="div"
            dangerouslySetInnerHTML={{ __html: editCommentStringHtml }}
          ></CardActiveCommentContent>
        )}

        {isEdit && (
          <Stack>
            <EditorComment
              // editComment={editComment}
              // setEditComment={setEditComment}
              comment={editComment}
              setComment={setEditComment}
            />
            <Box component="div" sx={{ marginTop: 1 }}>
              <Button variant="contained" sx={{ marginRight: 2 }} onClick={handleSave}>
                Save
              </Button>
              <ButtonActivity component="span" onClick={handleCancelEditComment}>
                Cancel
              </ButtonActivity>
            </Box>
          </Stack>
        )}

        {!isEdit && (
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
          isDeleteComment={true}
        />
      </Stack>
    </Stack>
  );
};

const CardActivityLogWork = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  const handleDelete = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Stack direction="row" spacing={2} marginBottom={3}>
      <AvatarActivity alt="Ana" src={`/images/avatars/2.png`} />
      <Stack width="100%">
        <Typography variant="body1" fontWeight={500}>
          Annie
          <Box component="span" fontWeight={400} marginLeft={1}>
            logged 6h
          </Box>
          {/* <TagActivity component="span">work log</TagActivity> */}
        </Typography>
        <Typography variant="body2" fontSize={13}>
          October 21, 2022 at 8:52 PM
        </Typography>
        <Box component="div">I'm completed task</Box>
        <Box component="div" sx={{ marginTop: 1 }}>
          <ButtonActivity component="span" onClick={handleEdit}>
            Edit
          </ButtonActivity>
          <ButtonActivity component="span" onClick={handleDelete}>
            Delete
          </ButtonActivity>
        </Box>
      </Stack>
      <DialogConfirmation
        deleteTitle={"Do you want to delete this log "}
        open={open}
        setOpen={setOpen}
        isDeleteLogWork={true}
      />
    </Stack>
  );
};

const CardActivity = (props) => {
  const { title, type } = props;
  return (
    <Stack direction="row" spacing={2} marginBottom={3}>
      <AvatarActivity alt="Ana" src={`/images/avatars/2.png`} />
      <Stack width="100%">
        <Typography variant="body1" fontWeight={500}>
          Annie
          <Box component="span" fontWeight={400} marginLeft={1}>
            {/* added a */}
            {title}
          </Box>
          <TagActivity component="span">
            {/* commemt */}
            {type}
          </TagActivity>
        </Typography>
        <Typography variant="body2" fontSize={13}>
          October 21, 2022 at 8:52 PM
        </Typography>
        <Box component="div">I'm completed task</Box>
      </Stack>
    </Stack>
  );
};

const TabActivities = (props) => {
  const {task} = props

  // ** State
  const [value, setValue] = useState("3");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ marginTop: 8 }}>
      <TitleDetail variant="subtitle2">Activity</TitleDetail>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="simple tabs example">
          {/* <Tab value="1" label="All" /> */}
          {/* <Tab value="2" label="History" /> */}
          <Tab value="3" label="Comments" />
          {/* <Tab value="4" label="Log work" /> */}
        </TabList>
        {/* <TabPanel value="1">
        <CardActivity title={"added a"} type={"comment"} />
        <CardActivity title={"logged 6h"} type={"logwork"} />
        <CardActivity title={"added a"} type={"comment"} />
        <CardActivity title={"logged 7h"} type={"logwork"} />
      </TabPanel>
      <TabPanel value="2">
        <CardActivity title={"added a"} type={"comment"} />
        <CardActivity title={"logged 6h"} type={"logwork"} />
        <CardActivity title={"added a"} type={"comment"} />
        <CardActivity title={"logged 7h"} type={"logwork"} />
        <CardActivity title={"updated status"} type={"update status"} />
      </TabPanel> */}
        <TabPanel value="3">
          <Comments task={task}/>
        </TabPanel>
        {/* <TabPanel value="4">
        <CardActivityLogWork />
      </TabPanel> */}
      </TabContext>
    </Stack>
  );
};

export default TabActivities;
