import { status } from '@/components/status/statusContainer';
import { doneColor, inpropressColor, todoColor } from "@/layouts/layoutContainer";
import Typography from "@mui/material/Typography";


const CardStatus = (props) => {
  const {title} = props
  let color = ''
  if(title === status.todo)
    color = todoColor
  if(title === status.inprogress)
    color = inpropressColor
  if(title === status.done)
    color = doneColor
  return (
    <Typography
      variant="body1"
      sx={{
      background: `rgba(${color}, 0.2)`,
      color: `rgb(${color})`,
      paddingX: 1,
      borderRadius: 1,
      fontWeight: 600, }}
    >
      {title}
    </Typography>
  );
};

export default CardStatus
