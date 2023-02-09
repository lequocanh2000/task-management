// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Icons Imports
import Circle from 'mdi-material-ui/Circle'

// ** Custom Components Imports
// import ReactApexcharts from '@/core/components/react-apexcharts'
import ReactApexcharts from '@/core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from '@/core/utils/hex-to-rgba'

const CardPieCharts = (props) => {
  const {numberCompleted,numberFailed} = props
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      theme.palette.warning.main,
      hexToRGBA(theme.palette.warning.main, 0.8),
      hexToRGBA(theme.palette.warning.main, 0.6),
      hexToRGBA(theme.palette.warning.main, 0.4),
      hexToRGBA(theme.palette.warning.main, 0.2)
    ],
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    stroke: { width: 3, lineCap: 'round', colors: [theme.palette.background.paper] },
    fill: {
      colors: [hexToRGBA('#64c179f5',0.84), hexToRGBA('#d32f2fd6',0.84)]
    },
    labels: ['Task', 'Task'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        endAngle: 130,
        startAngle: -130,
        customScale: 0.9,
        donut: {
          size: '64%',
          labels: {
            show: true,
            name: {
              offsetY: 25
            },
            value: {
              offsetY: -15,
              formatter: value => `${value}`
            },
            total: {
              show: true,
              label: 'Total',
              formatter: value => `${value.globals.seriesTotals.reduce((total, num) => total + num)}`
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Task Chart'
        titleTypographyProps={{
          sx: {
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
            color: "rgba(0,0,0,0.7)",
            fontWeight: 600,
          },
        }}
      />
      <CardContent
        sx={{
          padding : 0,
          '& .apexcharts-datalabel-value': { fontWeight: '500 !important', fontSize: '2rem !important' },
          '& .apexcharts-datalabel-label': {
            fontSize: '1.2rem !important',
            fill: `${theme.palette.text.secondary} !important`
          }
        }}
      >
        <ReactApexcharts type='donut' height={168} options={options} series={[numberCompleted ? numberCompleted : 0, numberFailed ? numberFailed : 0]} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ mr: 1.25, fontSize: '0.75rem', color: hexToRGBA('#64c179f5',0.84) }} />
            <Typography variant='body1' fontWeight={600} sx={{ color: 'rgba(0,0,0,0.7)' }}>
              Completed
            </Typography>
          </Box>
          <Box sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
            <Circle sx={{ mr: 1.25, fontSize: '0.75rem', color: hexToRGBA('#d32f2fd6',0.84) }} />
            <Typography variant='body1' fontWeight={600} sx={{ color: 'rgba(0,0,0,0.7)' }}>
              Failed
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardPieCharts
