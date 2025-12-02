import { useState, type ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

import {type ConfirmOptions, ConfirmContext } from "./confirmContext";

interface ConfirmProviderProps {
  children: ReactNode;
}

export default function ConfirmProvider ({children}: ConfirmProviderProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolveCallback, setResolveCallback] = useState<(value: boolean) => void>();

  const confirm = (opts: ConfirmOptions = {}) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleClose = (confirmed: boolean) => {
    setOpen(false);
    if (resolveCallback) resolveCallback(confirmed);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog
        open={open}
        onClose={() => handleClose(false)}
      >
        {options.title && 
          <DialogTitle 
            id="confirm-dialog-title"
            color={options.isDelete? "error" : "primary"}
          >
            {options.title}
          </DialogTitle>}

        {options.content && (
          <DialogContent>
            <Typography>{options.content}</Typography>
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={() => handleClose(false)} color="inherit">
            {options.cancelText || "Cancel"}
          </Button>
          <Button onClick={() => handleClose(true)} 
            color={options.isDelete? "error" : "primary"}
            variant="contained" 
            autoFocus
          >
            {options.confirmText || "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};
