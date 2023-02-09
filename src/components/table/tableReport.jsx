// ** React Imports
import { useCallback, useEffect, useState } from "react";

// ** MUI Import
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";

import TabContext from "@mui/lab/TabContext";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CheckboxMarked from "mdi-material-ui/CheckboxMarked";
import CheckboxMultipleMarked from "mdi-material-ui/CheckboxMultipleMarked";

// ** Icons Imports

// ** Custom Components
import CustomChip from "@/core/components/mui/chip";

// ** Util Import
import { titleColor, titleColorVer2 } from "@/layouts/layoutContainer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectReportTasks, setFilterMonth } from "@/store/reports/reportsSlice";
import { styled } from "@mui/material";
import PerfectScrollbarComponent from "react-perfect-scrollbar";

//** Component import
import {
  iconSubTaskColor,
  iconTaskColor
} from "@/layouts/layoutContainer";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const statusObj = {
  done: { text: "Done", color: "success" },
  failed: { text: "Failed", color: "error" },
};

const styles = {
  maxHeight: 240,
  width: "100%",
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
};

const SpanCustomize = styled(Box)(({ theme }) => ({
  ":hover": {
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    textDecorationColor: "rgba(0,0,0,0.8)",
  },
}));

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles,
});

const ScrollWrapper = ({ children }) => {
  return (
    <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
      {children ? children : "null"}
    </PerfectScrollbar>
  );
};

const months = [
  {
    value: "1",
    text: "January",
  },
  {
    value: "2",
    text: "February",
  },
  {
    value: "3",
    text: "March",
  },
  {
    value: "4",
    text: "April",
  },
  {
    value: "5",
    text: "May",
  },
  {
    value: "6",
    text: "June",
  },
  {
    value: "7",
    text: "July",
  },
  {
    value: "8",
    text: "August",
  },
  {
    value: "9",
    text: "September",
  },
  {
    value: "10",
    text: "October",
  },
  {
    value: "11",
    text: "November",
  },
  {
    value: "12",
    text: "December",
  },
];

const minWidthSelect = 126;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 230,
      minWidth: minWidthSelect,
    },
  },
};

const TitleReport = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColor,
  padding: theme.spacing(0, 2),
}));

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
  padding: "0 16px  ",
}));

const colorText = "rgba(0,0,0,0.7)";

const RenderTabContent = ({ tasks }) => {
  const router = useRouter();
  const userId = router.query.userId;

  const handleClick = useCallback((taskId) => {
    router.push(`/${userId}/tasks/${taskId}/task-detail`);
  },[userId]);
  return (
    <TableContainer sx={{ minHeight: 240, maxHeight: 380 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-root": {
                py: (theme) => `${theme.spacing(1)} !important`,
                color: colorText,
              },
            }}
          >
            <TableCell>Key</TableCell>
            <TableCell align="left">Task Name</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Create At</TableCell>
            <TableCell align="center">Point</TableCell>
            <TableCell align="right">Assignee</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ maxHeight: 200, overflowY: "scroll" }}>
          {tasks?.map((row, index) => {
            let iconTask = <CheckboxMarked sx={{ color: iconTaskColor }} />;
            if (row.task_type_id == 2) {
              iconTask = <CheckboxMultipleMarked sx={{ color: iconSubTaskColor }} />;
            }
            // <CheckboxMultipleMarked sx={{ color: iconSubTaskColor }} />
            return (
              <TableRow
                key={index}
                sx={{
                  "& .MuiTableCell-root": {
                    border: 0,
                    py: (theme) => `${theme.spacing(1)} !important`,
                    color: colorText,
                  },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, whiteSpace: "nowrap", color: "#0052cc" }}
                  >
                    {`${row.task_type_id == 1 ? `T-${row.id}` : `ST-${row.id}`}`}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <SpanCustomize component="span" onClick={() => handleClick(row.id)}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      {`${row.task_name}`}
                    </Typography>
                  </SpanCustomize>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    {iconTask}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {`${row.task_type_id == 1 ? "Task" : "Sub Task"}`}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <CustomChip
                    skin="light"
                    size="small"
                    label={
                      row.failed == 1 ? statusObj["failed"].text : statusObj[row.task_status].text
                    }
                    color={
                      row.failed == 1 ? statusObj["failed"].color : statusObj[row.task_status].color
                    }
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      "& .MuiChip-label": { px: 1.625, lineHeight: 1.539 },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textAlign: "center" }}
                    color={row.point > 10 ? "error" : ""}
                  >
                    {dayjs(new Date(row.created_at)).format("DD/MM/YYYY")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, textAlign: "center" }}
                    color={row.point > 10 ? "error" : ""}
                  >
                    {row.point}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent="flex-end" mr={1}>
                    <Tooltip title={row.user_name}>
                      <Avatar alt={row.user_name} src={row.avatar} sx={{ height: 34, width: 34 }} />
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {tasks?.length == 0 && (
        <Stack direction="row" minHeight={240} justifyContent="center" alignItems="center">
          <Typography variant="h5" fontWeight={600} sx={{ color: "rgba(0,0,0,0.4)" }}>
            Table empty
          </Typography>
        </Stack>
      )}
    </TableContainer>
  );
};

const TableReport = (props) => {
  // ** State
  const { year } = props;
  const [value, setValue] = useState("1");
  const [month, setMonth] = useState("all");
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectReportTasks);

  useEffect(() => {
    dispatch(setFilterMonth(month));
    console.log(month);
  }, [month]);

  const handleSelectMonth = (event) => {
    setMonth(event.target.value);
  };

  return (
    <CardCustomize>
      <Stack spacing={1.25} marginY={2}>
        <TitleReport variant="h4" ml={0} sx={{ color: titleColorVer2 }}>
          Summary of tasks
        </TitleReport>
        <TitleReport variant="body1" sx={{ color: titleColorVer2 }}>
          Report of tasks for {year}
        </TitleReport>
      </Stack>
      <TabContext value={value}>
        <Stack direction="row" alignItems="center" mt={3} mb={2}>
          <TitleReport>Month </TitleReport>
          <Box component="div">
            <FormControl>
              <Select
                value={month}
                id="demo-simple-select-outlined"
                labelId="demo-simple-select-outlined-label"
                size="small"
                MenuProps={MenuProps}
                sx={{ minWidth: minWidthSelect }}
                onChange={handleSelectMonth}
              >
                <MenuItem value={"all"}>All</MenuItem>
                {months.map((month, index) => {
                  return (
                    <MenuItem value={month.value} key={index}>
                      {month.text}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Stack>
        <TabPanel sx={{ p: 0, mb: 2.5 }} value="1">
          <RenderTabContent tasks={tasks} />
        </TabPanel>
      </TabContext>
    </CardCustomize>
  );
};

export default TableReport;
