// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Hook
import { useSettings } from '@/core/hooks/useSettings'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: 298,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 250,
    position: 'static'
  }
}))

const CardBestWishes = (props) => {
  const {user} = props
  // ** Hook
  const { settings } = useSettings()

  return (
    <Card sx={{ position: 'relative', backgroundColor: "#556cd633" }}>
      <CardContent sx={{ p: theme => `${theme.spacing(2, 2.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={8} >
            <Typography variant='h3' sx={{fontWeight: '600', mt: 3,  ml:3, color: "rgba(0,0,0,0.6)"}}>
              Welcome back,
            </Typography>
            <Typography variant='h3' sx={{fontWeight: '700', mb: 2, ml:3, color: "#3b4b95"}}>
              {user?.user_name} !
            </Typography>
            {/* <Box component='span' sx={{ fontWeight: 'bold', color: "#3b4b95" }}>
                {user?.user_name}
              </Box> */}
            <Typography variant='body1' fontSize={18} fontWeight={600} sx={{ ml:3, p: 0.05 ,color: "rgba(0,0,0,0.7)"}}>
              Today will be a great day for you{' '}😎
            </Typography>
            <Typography variant='body1' fontSize={18} fontWeight={600} sx={{ mb: 4, ml:3, p: 0.05 , color: "rgba(0,0,0,0.7)"}}  >
              Wishing you a new day full of energy for a productive day.🎉
            </Typography>
          </Grid>
          <StyledGrid item xs={12} sm={4}>
            <Img alt='Congratulations John' src={`/images/cards/illustration-john-${settings.mode}.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CardBestWishes
