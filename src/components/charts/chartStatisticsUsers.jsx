import { useEffect, useState } from "react";

//** MUI import
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// ** Chart import
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
// ** Chart import

const objColor = {
  tasks_completed: "green",
  point_completed: "#556cd6",
  tasks_failed: "red",
};

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
}));

const TitleTooltip = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  textAlign: "center",
  marginBottom: theme.spacing(0.5),
  color: "rgba(0,0,0,0.7)",
}));

const data = [
  {
    name: "Giang vien A",
    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Giang vien B",
    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Giang vien C",
    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    uv: 2000,
    pv: 5000,
    amt: 2290,
  },
  {
    name: "Giang vien D",
    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Giang vien E",
    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Giang vien F",
    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Giang vien G",
    url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function CustomXAxisLabel(props) {
  // console.log(props);
  return (
    <g transform={`translate(${props.x},${props.y})`}>
      <image
        xlinkHref={props.payload.value}
        x={-15}
        y={0}
        height="30px"
        width="30px"
        className="avatar-statistics-users"
        textAnchor="middle"
        fill="#666"
      />
    </g>
  );
}

const CustomTooltip = (props) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <Stack bgcolor={"rgba(255,255,255,0.6)"} p={"8px 16px"} border={'2px solid rgba(0,0,0,0.8)'}>
        <TitleTooltip variant="body1">{payload[0].payload.user_name}</TitleTooltip>
        <Typography variant="subtitle2" sx={{color: 'rgba(0,0,0,0.7)', mb: 2}}>{`Bộ môn: ${payload[0].payload.department_name}`}</Typography>
        <Typography sx={{ color: objColor["tasks_completed"] }}>
          Tasks Completed: {payload[0].payload.tasks_completed}
        </Typography>
        <Typography sx={{ color: objColor["point_completed"] }}>
          Points Completed: {payload[1].payload.point_completed}
        </Typography>
        <Typography sx={{ color: objColor["tasks_failed"] }}>
          Tasks Failed: {payload[2].payload.tasks_failed}
        </Typography>
      </Stack>
    );
  }

  return null;
};

function ChartStatisticsUsers(props) {
  const { statisticsUsers } = props;
  const [windowSize, setWindowSize] = useState();

  useEffect(() => {
    setWindowSize(window.innerWidth - 233 - 96);
    console.log(window.innerWidth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth - 233 - 96);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LineChart
      width={windowSize}
      height={400}
      data={statisticsUsers ? statisticsUsers : []}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      {statisticsUsers && statisticsUsers.length !=0 && <XAxis dataKey="avatar" interval={0} tick={<CustomXAxisLabel />} />}
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend
        verticalAlign="bottom"
        height={36}
        wrapperStyle={{ position: "relative", marginTop: "-20px" }}
      />
      <Line type="monotone" dataKey="point_completed" stroke="#8884d8" activeDot={{ r: 6 }} />
      <Line type="monotone" dataKey="tasks_completed" stroke="#4ec079" activeDot={{ r: 6 }} />
      <Line type="monotone" dataKey="tasks_failed" stroke="#ff0000" activeDot={{ r: 6 }} />
    </LineChart>
  );
}

export default ChartStatisticsUsers;
