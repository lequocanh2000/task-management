// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import AlarmCheck from "mdi-material-ui/AlarmCheck";
import CheckCircleOutline from "mdi-material-ui/CheckCircleOutline";
import ClipboardTextMultipleOutline from "mdi-material-ui/ClipboardTextMultipleOutline";
import Poll from "mdi-material-ui/Poll";
// ** Custom Components Imports
import CustomAvatar from "@/core/components/mui/avatar";

const textColor = "rgba(0,0,0,0.6)";

const renderStats = (salesData) => {
  return salesData.map((sale, index) => (
    <Grid item xs={12} sm={6} md={6} lg={6} xl={3} key={index}>
      <Card sx={{ padding: 4, borderRadius: "8px", color: textColor }}>
        <Stack direction="row" alignItems="center" key={index}>
          <CustomAvatar skin="light" variant="rounded" color={sale.color} sx={{ mr: 3, p: 4 }}>
            {sale.icon}
          </CustomAvatar>
          <Stack>
            <Typography variant="h5" sx={{ fontWeight: 700, color: sale.titleColor }}>
              {sale.title}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 30 }}>
              {sale.text}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  ));
};

const CardOverviewStatistics = (props) => {
  const { tasks, taskTodos, taskInprogress, taskDones } = props;
  const salesData = [
    {
      text: `${tasks ? tasks.length : 0}`,
      color: "primary",
      title: "Total task",
      titleColor: "rgba(85,108,214,1)",
      icon: <ClipboardTextMultipleOutline fontSize="large" />,
    },
    {
      text: `${taskTodos ? taskTodos.length : 0} / ${tasks ? tasks.length : 0}`,
      color: "secondary",
      title: "To do",
      titleColor: "rgba(109,120,141,1)",
      icon: <Poll fontSize="large" />,
    },
    {
      text: `${taskInprogress ? taskInprogress.length : 0} / ${tasks ? tasks.length : 0}`,
      color: "info",
      title: "In progress",
      titleColor: "rgba(2,136,209,1)",
      icon: <AlarmCheck fontSize="large" />,
    },
    {
      text: `${taskDones ? taskDones.length : 0} / ${tasks ? tasks.length : 0}`,
      color: "success",
      title: "Done",
      titleColor: "rgba(46,125,50,1)",
      icon: <CheckCircleOutline fontSize="large" />,
    },
  ];
  return (
    <Grid container spacing={1.5}>
      {renderStats(salesData)}
    </Grid>
  );
};

export default CardOverviewStatistics;
