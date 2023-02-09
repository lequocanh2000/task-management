import Layout from "@/layouts/layout";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

//** MUI import
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material";
import toast from "react-hot-toast";

//** Icon import
import MenuIcon from "@mui/icons-material/Menu";

//** Component import
import { inputHoverColor, titleColor, titleColorVer2 } from "@/layouts/layoutContainer";
import { TableStatistics } from "@/components/table";
import {
  useLazyGetStatisticsByPositionQuery,
  useLazyGetStatisticsQuery,
  useLazyGetStatisticsUsersQuery,
} from "@/store/statistics/statisticsApi";
import {
  useGetDepartmentsQuery,
  useLazyGetDepartmentsQuery,
} from "@/store/departments/departmentsApi";
import { handleSetStatistics } from "@/components/charts/chartContainer";

const StatisticsCharts = dynamic(() => import("@/components/charts/chartStatistics"), {
  ssr: false,
});

const StatisticsChartsUsers = dynamic(() => import("@/components/charts/chartStatisticsUsers"), {
  ssr: false,
});

const TitleReport = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColor,
  padding: theme.spacing(0,2),
}));

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
}));

function Statistics() {
  const [userLogin, setUserLogin] = useState();
  const [year, setYear] = useState("2022");

  const [statistics, setStatistics] = useState([]);
  const [statisticsUsers, setStatisticsUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectDepartmentId, setSelectDepartmentId] = useState("all");

  const [getStatisticsUsersQuery] = useLazyGetStatisticsUsersQuery();
  const [getStatisticsByPositionQuery] = useLazyGetStatisticsByPositionQuery();
  const [getDepartmentsQuery] = useLazyGetDepartmentsQuery();

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUserLogin(userLocalStorage);
    getDepartments();
  }, []);

  useEffect(() => {
    if (!year) return;
    if (!userLogin) return;
    if (userLogin.position_id == 3) return;

    if (userLogin.position_id == 1 && selectDepartmentId == "all") {
      getStatisticsUsers(year);
      return;
    }
    if (userLogin.position_id == 1 && selectDepartmentId != "all") {
      getStatisticsUsers(year, selectDepartmentId);
      return;
    }
    if (userLogin.position_id == 2 && selectDepartmentId == "all") {
      getStatisticsUsers(year, undefined, userLogin.id);
      return;
    }
    if (userLogin.position_id == 2 && selectDepartmentId != "all") {
      getStatisticsUsers(year, selectDepartmentId, userLogin.id);
      return;
    }
  }, [year, selectDepartmentId, userLogin]);

  useEffect(() => {
    if (!year) return;
    if (!userLogin) return;
    if(userLogin.position_id == 1){
      getStatisticsByPosition(year,userLogin.position_id);
      return;
    }
    if(userLogin.position_id == 2){
      getStatisticsByPosition(year,userLogin.position_id,userLogin.id);
      return;
    }
    if(userLogin.position_id == 3){
      getStatisticsByPosition(year,userLogin.position_id,userLogin.id);
      return;
    }
  }, [year,userLogin]);

  const getDepartments = async () => {
    const res = await getDepartmentsQuery();
    if (res.isError) {
      toast.error("Error get departments server");
      return;
    }
    setDepartments(res.data.departments);
  };

  const getStatisticsUsers = async (year, departmentId, createdBy) => {
    console.log("year", year);
    console.log("departmentId", departmentId);
    console.log("createdBy", createdBy);
    const res = await getStatisticsUsersQuery({
      year,
      departmentId: departmentId,
      createdBy: createdBy,
    });
    if (res.isError) {
      toast.error("Error get statistics - users from server");
      return;
    }
    console.log(res.data.statistics_users);
    setStatisticsUsers(res.data.statistics_users);
  };

  const getStatisticsByPosition = async (year, positionId, userId) => {
    const res = await getStatisticsByPositionQuery({
      year,
      positionId,
      userId,
    });
    if (res.isError) {
      toast.error("Error get statistics by position from server");
      return;
    }
    const statisticsData = res.data.statistics
    if(!statisticsData) return;
    console.log(statisticsData);
    setStatistics(statisticsData);
  };

  const handleChangeYear = (event) => {
    console.log(event.target.value);
    setYear(event.target.value);
  };

  const handleChangeDepartment = (event) => {
    console.log(event.target.value);
    setSelectDepartmentId(event.target.value);
  };

  return (
    <Box component="div" padding={1}>
      <CardCustomize sx={{ marginY: 2, paddingX: 2 }}>
        <Stack my={3}>
          <TitleReport variant="h4" sx={{color: titleColorVer2}}>Statistics Chart</TitleReport>
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
                  sx={{ width: 140 }}
                  onChange={handleChangeYear}
                >
                  <MenuItem value={2022}>2022</MenuItem>
                  <MenuItem value={2021}>2021</MenuItem>
                  <MenuItem value={2020}>2020</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
          {userLogin && userLogin.position_id != 3 && (
            <Stack direction="row" alignItems="center">
              <TitleReport variant="body1">Department</TitleReport>
              <Box component="div">
                <FormControl>
                  <Select
                    value={selectDepartmentId}
                    id="demo-simple-select-outlined"
                    labelId="demo-simple-select-outlined-label"
                    size="small"
                    sx={{ width: 220 }}
                    onChange={handleChangeDepartment}
                  >
                    <MenuItem value={"all"}>Tất cả</MenuItem>
                    {departments.map((department, index) => {
                      return (
                        <MenuItem value={`${department.id}`} key={index}>
                          {department.department_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          )}
        </Stack>
        {userLogin && userLogin.position_id != 3 && (
          <Box component="div" marginBottom={10} mt={5}>
            <StatisticsChartsUsers statisticsUsers={statisticsUsers} />
          </Box>
        )}

        <Box component="div" marginY={10}>
          <StatisticsCharts statistics={statistics} />
        </Box>
      </CardCustomize>
      <TableStatistics statistics={statistics} year={year} />
    </Box>
  );
}

export default Statistics;

Statistics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
