import Layout from "@/layouts/layout";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

//** MUI import
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Avatar from "@/core/components/mui/avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material";
import PerfectScrollbarComponent from "react-perfect-scrollbar";

//** Icon import
import MenuIcon from "@mui/icons-material/Menu";

//** Component import
import { inputHoverColor, titleColor , titleColorVer2} from "@/layouts/layoutContainer";
import { TableStatistics } from "@/components/table";
import { TableReport } from "@/components/table";
import { useLazyGetReportsQuery, useLazyGetReportsUsersQuery } from "@/store/reports/reportsApi";
import toast from "react-hot-toast";
import { handleSetReports } from "@/components/charts/chartContainer";
import { useLazyGetUsersQuery } from "@/store/users/usersApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTasks, setFilterMonth, selectReportTasks } from "@/store/reports/reportsSlice";


const ReportCharts = dynamic(() => import("@/components/charts/chartReport"), {
  ssr: false,
});

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
}));

const styles = {
  maxHeight: 240,
  minWidth: 270,
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
};

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

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  maxWidth: 240,
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

const MenuItemCustomize = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const TitleReport = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColor,
  padding: theme.spacing(0,2),
}));

const ContentReportUser = styled(Box)(({ theme }) => ({
  minWidth: "180px",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1),
  borderRadius: "4px",
  border: "1px solid rgba(0,0,0,0.2)",
  ":hover": {
    backgroundColor: inputHoverColor,
    cursor: "pointer",
  },
}));

function Reports() {
  const dispatch = useAppDispatch();
  // const tasksReport = useAppSelector(selectReportTasks);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userLogin, setUserLogin] = useState();
  const [userSeleted, setUserSeleted] = useState();
  const [year, setYear] = useState("2022");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersDepartmentCurrent, setUsersDepartmentCurrent] = useState([]);
  const [usersDepartmentOther, setUsersDepartmentOther] = useState([]);
  const [getReportsQuery] = useLazyGetReportsQuery();
  const [getGetReportsUsersQuery] = useLazyGetReportsUsersQuery();

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUserLogin(userLocalStorage);
    localStorage.setItem("path", "reports");
  }, []);

  useEffect(() => {
    if (!year) return;
    if (!userSeleted) return;
    getReports(year, userSeleted.id);
  }, [year, userSeleted]);



  useEffect(() => {
    if (!year) return;
    if (!userLogin) return;
    if (userLogin.position_id == 1) {
      getGetReportsUsers(year, userLogin.department_id);
      return;
    }
    if (userLogin.position_id == 2) {
      getGetReportsUsers(year, userLogin.department_id, userLogin.department_id, userLogin.id);
      return;
    }
  }, [year, userLogin]);

  useEffect(() => {
    console.log(reports);
  }, [reports]);

  const getReports = async (year, userId) => {
    const res = await getReportsQuery({ year, userId });
    if (res.isError) {
      toast.error("Error! get reports from server");
      return;
    }
    const reportsData = res.data.reports;
    const tasksData = res.data.tasks;
    console.log(res.data.reports);
    setReports(reportsData);
    dispatch(setTasks(tasksData))
  };

  const getGetReportsUsers = async (year, userDepartmentId , departmentId, userId ) => {
    const res = await getGetReportsUsersQuery({ year, departmentId, userId });
    if (res.isError) {
      toast.error("Error! get reports users from server");
      return;
    }
    const departmentsUsers = res.data.departments_users;
    const departmentsUsersCurrent = departmentsUsers.filter((department) => department.department_id == userDepartmentId);
    const departmentsUsersOther = departmentsUsers.filter((department) => department.department_id !== userDepartmentId);
    console.log(departmentsUsersCurrent)
    console.log(departmentsUsersOther)
    setUsersDepartmentCurrent(departmentsUsersCurrent)
    setUsersDepartmentOther(departmentsUsersOther)
    if(!userSeleted){
      if(departmentsUsersCurrent.length != 0){
        setUserSeleted(departmentsUsersCurrent[0].users[0])
        return;
      }
      if(departmentsUsersOther.length != 0){
        setUserSeleted(departmentsUsersOther[0].users[0])
        return;
      }
    }
    if(departmentsUsersCurrent.length == 0 && departmentsUsersOther.length == 0){
      setUserSeleted(undefined)
    }
  };

  const handleChangeYear = (event) => {
    console.log(event.target.value);
    setYear(event.target.value);
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectUser = (user) => {
    console.log(user);
    setUserSeleted(user);
    setAnchorEl(null);
  }

  return (
    <div>
      <Box component="div" padding={1}>
        <CardCustomize sx={{ marginY: 2, paddingX: 2 }}>
          <Stack my={3}>
            <TitleReport variant="h4" sx={{color: titleColorVer2}}>Report Chart</TitleReport>
          </Stack>
          <Stack direction="row" spacing={4} alignItems="center" marginTop={3} marginLeft={6}>
            <Stack direction="row" alignItems="center">
              <TitleReport variant="body1">Year</TitleReport>
              <Box component="div">
                <FormControl>
                  <Select
                    value={year}
                    id="demo-simple-select-outlined"
                    labelId="demo-simple-select-outlined-label"
                    size="small"
                    sx={{ width: 120, fontWeight: 600 }}
                    onChange={handleChangeYear}
                  >
                    <MenuItem value={2022}>2022</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                    <MenuItem value={2020}>2020</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center">
              <TitleReport variant="body1">User</TitleReport>
              <ContentReportUser onClick={handleOpen}>
                <Avatar alt="Flora"
                  src={userSeleted?.avatar}
                  sx={{ width: 36, height: 36, marginRight: 2 }} />
                <Typography variant="body1" marginRight={2} fontWeight={600}>
                  {userSeleted?.user_name}
                </Typography>
              </ContentReportUser>
              <Menu
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}

              >
                <ScrollWrapper>
                  {usersDepartmentCurrent.map((departmentCurrent, index) => {
                    return (
                      <Box component="div" key={index}>
                        <Divider textAlign="left" sx={{mt: 2, mb: 1, fontWeight: 700, fontSize: 14, color: "rgba(118,118,118,1)"}}>{departmentCurrent.department_name}</Divider>
                        {departmentCurrent?.users.map((user,index) => {
                          return (
                            <MenuItemCustomize onClick={() => handleSelectUser(user)} key={index}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt="Flora" src={user.avatar} sx={{ width: 32, height: 32 }} />
                                <MenuItemTitle>{user.user_name}</MenuItemTitle>
                              </Stack>
                            </MenuItemCustomize>
                          );
                        })}
                      </Box>
                    );
                  })}
                  {usersDepartmentOther.map((departmentOther, index) => {
                    return (
                      <Box component="div" key={index}>
                        <Divider textAlign="left" sx={{mt: 2, mb: 1, fontWeight: 700, fontSize: 14, color: "rgba(118,118,118,1)"}}>{departmentOther.department_name}</Divider>
                        {departmentOther?.users.map((user,index) => {
                          return (
                            <MenuItemCustomize onClick={() => handleSelectUser(user)} key={index}>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt="Flora" src={user.avatar} sx={{ width: 32, height: 32 }} />
                                <MenuItemTitle>{user.user_name}</MenuItemTitle>
                              </Stack>
                            </MenuItemCustomize>
                          );
                        })}
                      </Box>
                    );
                  })}
                  {
                    usersDepartmentCurrent.length == 0 &&
                    usersDepartmentOther.length == 0 && (
                      <Stack direction="row" height={80} width={180} justifyContent="center" alignItems="center">
                        <Typography variant="h6" sx={{color: "rgba(0,0,0,0.6)"}}>Empty</Typography>
                      </Stack>
                    )
                  }
                </ScrollWrapper>
              </Menu>
            </Stack>
          </Stack>
          <Box component="div" marginY={4}>
            <ReportCharts reports={reports} isLoading={isLoading} />
          </Box>
        </CardCustomize>
        <TableReport year={year} />
      </Box>
    </div>
  );
}

export default Reports;

Reports.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
