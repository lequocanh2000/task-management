import { useState } from "react";

//** MUI import
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

//** Icon import
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import MenuDown from "mdi-material-ui/MenuDown";
import PencilBoxOutline from "mdi-material-ui/PencilBoxOutline";

//** Component import
import PerfectScrollbarComponent from "react-perfect-scrollbar";

import { Assignee } from "@/components/assignee";
import { Creator } from "@/components/creator";
import { DueDate } from "@/components/dueDate";
import { Status } from "@/components/status";
import { TabActivities } from "@/components/tab";
import { TableDetailTasks } from "@/components/table";
import { TaskDescription } from "@/components/taskDescription";
import { TaskDocuments } from "@/components/taskDocuments";
import { primaryColor, titleColor } from "@/layouts/layoutContainer";

//** DraftWysiwyg import

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

const CardMention = () => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Avatar alt="Flora" src="/images/avatars/4.png" sx={{ width: 36, height: 36 }} />
    <MenuItemTitle>Quoc Anh</MenuItemTitle>
  </Stack>
);

const ButtonStatus = () => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        size="medium"
        color="success"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<MenuDown />}
      >
        Done
      </Button>
      <Menu
        keepMounted
        id="simple-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={handleClose}>
          <Button variant="outlined" size="small">
            In propress
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Button variant="outlined" size="small" color="secondary">
            To do
          </Button>
        </MenuItem>
      </Menu>
    </div>
  );
};

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  maxHeight: 560,
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

function TaskDetails() {
  // console.log(process.env.nodeEnv);
  // console.log(process.env.NODE_ENV);
  // console.log(process.env.NEXT_PUBLIC_PORT);
  // const [initDescription, setInitDescription] = useState(
  //   "<p><strong><em><ins>Only you know how I feel hahaha</ins></em></strong></p>"
  // );
  // const [description, setDescription] = useState(EditorState.createEmpty());
  // const [descriptionStringHtml, setDescriptionStringHtml] = useState("");
  // const [showEditorAndButtons, setShowEditorAndButtons] = useState(false);

  // useEffect(() => {
  //   const descriptionDraft = convertStringHTMLToDraft(initDescription);
  //   setDescription(descriptionDraft);
  //   setDescriptionStringHtml(initDescription);
  // }, []);

  // const handleAddDescription = useCallback((description) => {
  //   //call API gửi dữ liệu đi

  //   //close buttons and Editor
  //   const descriptionHtml = convertDraftToStringHTML(description);
  //   setDescriptionStringHtml(descriptionHtml);
  //   setShowEditorAndButtons(false);
  // }, []);

  // const handleCancelDescription = useCallback((descriptionStringHtml) => {
  //   const descriptionDraft = convertStringHTMLToDraft(descriptionStringHtml);
  //   setDescription(descriptionDraft);
  //   setShowEditorAndButtons(false);
  // }, []);

  // const handleShowEditorButtons = useCallback(() => {
  //   setShowEditorAndButtons(true);
  // }, []);

  return (
    <>
      {/* <Typography variant="h5" color="primary">
        Task detail
      </Typography> */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row">
          <CheckboxMarked color="success" />
          <Typography variant="body1" color="primary" sx={{ marginLeft: 1 }}>
            T-1
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <ButtonStatus />
          <IconButton>
            <PencilBoxOutline />
          </IconButton>
        </Stack>
      </Stack>
      {/* <ScrollWrapper> */}
        <Stack sx={{ marginRight: 1 }}>
          <Stack sx={{ marginTop: 0 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontSize={13}>
                Created at
              </Typography>
              <Typography variant="body2" fontSize={13}>
                October 21, 2022 at 8:52 PM
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" fontSize={13}>
                Updated at
              </Typography>
              <Typography variant="body2" fontSize={13}>
                October 21, 2022 at 8:52 PM
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="h5" sx={{ color: titleColor, fontWeight: 500, marginTop: 2 }}>
            Request server username a password
          </Typography>
          <TaskDescription />
          <TaskDocuments />
          <Status />
          <Assignee />
          <DueDate />
          <TableDetailTasks />
          <Creator />
          <Stack
            sx={{ marginTop: 2 }}
          >
            <Typography variant="subtitle2">Activity</Typography>
            <TabActivities />
          </Stack>
        </Stack>
      {/* </ScrollWrapper> */}
    </>
  );
}

export default TaskDetails;
