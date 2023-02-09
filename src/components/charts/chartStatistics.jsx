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
// ** Chart import

function ChartStatistics(props) {
  const {statistics} = props
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
      data={statistics}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis label={{ value: 'Point', angle: -90, position: 'insideLeft' }}/>
      <Tooltip />
      <Legend />
      <Bar dataKey="commitment_point" fill="#8884d8" />
      <Bar dataKey="complete_point" fill="#82ca9d" />
      {/* <Bar dataKey="complete_point" stackId="a" fill="#82ca9d" />
      <Bar dataKey="commitment_point" stackId="a" fill="#8884d8" /> */}
    </BarChart>
  );
}

export default ChartStatistics;
