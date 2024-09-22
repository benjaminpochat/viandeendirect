import React, { createContext, useState, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const SnackbarContext = createContext(null)

export default function SnackbarProvider({ children }) {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [severity, setSeverity] = useState<string>('success')

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const showSnackbar = (message, severity = 'success') => {
    setMessage(message)
    setSeverity(severity)
    setOpen(true)
  }

  return <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar 
        open={open} 
        autoHideDuration={30000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert 
            onClose={handleClose} 
            severity={severity} 
            sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
}

export const useSnackbar = () => {
  return useContext(SnackbarContext);
}
