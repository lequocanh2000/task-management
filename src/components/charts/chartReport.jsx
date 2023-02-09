import { useEffect, useState } from "react";

// ** Chart import
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function ChartReport(props) {
  const {reports, isLoading} = props
  const [windowSize, setWindowSize] = useState()
  useEffect(()=>{
    setWindowSize(window.innerWidth - 233 - 96)
    console.log(window.innerWidth)
  },[])

  useEffect(()=>{
    const handleResize = () => {
      setWindowSize(window.innerWidth - 233 - 96)
    }
    window.addEventListener('resize',handleResize);
    return () => window.removeEventListener('resize',handleResize);
  },[])

  return (
    <BarChart
      width={windowSize}
      height={400}
      data={reports}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}/>
      <Tooltip />
      <Legend />
      <Bar dataKey="task_completed" fill="#64c179f5" />
      <Bar dataKey="task_failed" fill="#d32f2fd6" />
    </BarChart>
  );
}

export default ChartReport;
