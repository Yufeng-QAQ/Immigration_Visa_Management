import { useEffect, useState } from 'react';
import Snackbar, { type SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  open?: boolean;
  onClose?: () => void;
}

export default function Notification({ message, type, open = false, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    console.log("opened");
    console.log(open);
    setVisible(open);
  }, [open]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <Snackbar open={visible} autoHideDuration={6000} onClose={handleClose} sx={{ zIndex: 9999 }}>
      <Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

