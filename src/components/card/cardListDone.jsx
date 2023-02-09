import { useEffect, useState } from "react";
// ** MUI Imports
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// ** Custom Components
import CustomChip from "@/core/components/mui/chip";

// ** Icons Imports
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import CheckboxMultipleMarked from "mdi-material-ui/CheckboxMultipleMarked";
//** Component import
import {
  iconSubTaskColor,
  iconTaskColor,
  titleColor
} from "@/layouts/layoutContainer";
import { useLazyGetUserByIdQuery } from "@/store/users/usersApi";
import { styled } from "@mui/material";
import toast from "react-hot-toast";

const textColor = "rgba(0,0,0,0.6)";
const statusObj = {
  done: { text: "Done", color: "success" },
  failed: { text: "Failed", color: "error" },
};

const TitleOverview = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColor,
  padding: theme.spacing(0, 2),
}));

const Row = (props) => {
  const { task } = props;
  const [user, setUser] = useState();
  const [getUserByIdQuery] = useLazyGetUserByIdQuery();
  useEffect(() => {
    if (!task) return;
    getUser(task);
  }, [task]);

  const getUser = async (task) => {
    const res = await getUserByIdQuery(task.assignee);
    if (res.isError) {
      toast.error("CardListDone > Row, Error get user from server");
      return;
    }
    console.log(res.data);
    setUser(res.data.users[0]);
  };

  let iconTask = <CheckboxMarked sx={{ color: iconTaskColor }} />;
  if (task?.task_type_id == 2) {
    iconTask = <CheckboxMultipleMarked sx={{ color: iconSubTaskColor }} />;
  }

  return (
    <TableRow
      sx={{
        "& .MuiTableCell-root": {
          border: 0,
          py: (theme) => `${theme.spacing(1)} !important`,
        },
      }}
    >
      <TableCell>
        <Stack direction="row" justifyContent="left" alignItems="center">
          <Stack>
            <Typography variant="body2" sx={{ fontWeight: 600, color: textColor }}>
              T-{task?.id}
            </Typography>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" fontWeight={500} sx={{ color: textColor }}>
          {task?.task_name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" justifyContent='center' spacing={0.5}>
          <Tooltip title={task?.task_type_id == 1 ? "Task" : "Sub Task"}>
            {iconTask}
          </Tooltip>
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="center" alignItems="flex-end">
          <CustomChip
            skin="light"
            size="small"
            label={statusObj[task?.task_status].text}
            color={statusObj[task?.task_status].color}
            sx={{
              height: 20,
              fontWeight: 500,
              "& .MuiChip-label": { px: 1.625, lineHeight: 1.539 },
            }}
          />
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2" fontWeight={500} sx={{ color: textColor }}>
          {task?.point}
        </Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end" mr={2} alignItems="flex-end">
          <Tooltip title={user?.user_name}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
              }}
            ></Avatar>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

const CardListDone = (props) => {
  const { taskDones } = props;
  return (
    <Card>
      <Stack mt={2}>
        <TitleOverview variant="h5" sx={{ color: "#5ebc6f", }}>
          List done
        </TitleOverview>
        <TitleOverview variant="subtitle1" sx={{ color: "rgba(0,0,0,0.4)", fontSize: 15, fontWeight: 500}}>
          Tasks have status done
        </TitleOverview>
      </Stack>
      <TableContainer sx={{ minHeight: 230, maxHeight: 230 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{ "& .MuiTableCell-root": { py: (theme) => `${theme.spacing(1)} !important` } }}
            >
              <TableCell align="left">
                <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                  Key
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                  Name
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                  Type
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                  Point
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                  Assigneed
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskDones &&
              taskDones.map((task, index) => {
                return <Row task={task} key={index} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default CardListDone;
