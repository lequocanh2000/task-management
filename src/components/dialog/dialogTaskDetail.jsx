// ** React Imports

// ** MUI Imports
import DialogMui from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from "@mui/material/styles"

import { TaskDetails } from "@/components/taskDetails"

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const Dialog = styled(DialogMui)(({ theme }) => ({
  // maxWi,
  "&.MuiDialog-root .MuiDialog-paper": {
    minWidth: "70%",
    maxWidth: "70%",
  },
}));

const DialogTaskDetail = (props) => {
  // ** State
  const {open , setOpen} = props
  const handleClose = () => setOpen(false)

  return (
    <div>
      {/* <Button variant='outlined' onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h6' component='span'>
            Task detail
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
          <TaskDetails/>
        </DialogContent>
        {/* <DialogActions sx={{ p: theme => {theme.spacing(3)} !important }}>
          <Button onClick={handleClose}>Save changes</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  )
}

export default DialogTaskDetail
