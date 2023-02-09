// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// ** Icons Imports

const ButtonToggleSimple = () => {
  // ** State
  const [alignment, setAlignment] = useState('all')

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment)
  }

  return (
    <ToggleButtonGroup exclusive value={alignment} onChange={handleAlignment} aria-label='text alignment'>
      <ToggleButton color="primary" size='small' sx={{borderColor: '#556CD6'}} value='all' aria-label='left aligned' >
        All
      </ToggleButton>
      <ToggleButton color="primary" size='small' sx={{borderColor: '#556CD6'}} value='task' aria-label='center aligned' >
        Tasks
      </ToggleButton>
      <ToggleButton color="primary" size='small' sx={{borderColor: '#556CD6'}} value='subtask' aria-label='justified' >
        Sub tasks
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default ButtonToggleSimple
