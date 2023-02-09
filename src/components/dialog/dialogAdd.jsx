// ** React Imports
import { useRouter } from "next/router";

// ** MUI Imports
import {
  useAddTaskMutation
} from "@/store/tasks/tasksApi";
import DialogMui from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";

// ** Icons Imports
import Close from 'mdi-material-ui/Close';

const Dialog = styled(DialogMui)(({ theme }) => ({
  // maxWi,
  "&.MuiDialog-root .MuiDialog-paper": {
    minWidth: "500px",
    maxWidth: "70%",
    // minHeight: "600px"
  },
}));

const DialogAdd = (props) => {
  // ** State
  const {open , setOpen , title , children} = props
  const handleClose = () => setOpen(false)
  const [addTask, result] = useAddTaskMutation();
  const router = useRouter()

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h6' component='span'>
            {title}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 10, right: 10, position: 'absolute', color: theme => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DialogAdd
