import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { notificationEmitter } from "./eventBus";

const colors: Record<string, { bg: string; text: string }> = {
  success: { bg: "#359a38ff", text: "#ffffff" },
  error: { bg: "#c03329ff", text: "#ffffff" },
  info: { bg: "#2196f3", text: "#ffffff" },
  warning: { bg: "#ff9800", text: "#ffffff" },
};

export const GlobalNotification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info" | "warning">("success");

  useEffect(() => {
    const handler = (newType: typeof type, newMessage: string) => {
      setType(newType);
      setMessage(newMessage);
      setOpen(true);
    };

    notificationEmitter.on(handler);
    return () => notificationEmitter.off(handler);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ zIndex: 1300 }}
    >
      <Alert
        onClose={handleClose}
        variant="filled"
        sx={{
          width: "100%",
          fontSize: "1.3rem",
          minHeight: "70px",
          padding: "12px 24px",
          backgroundColor: colors[type].bg,
          color: colors[type].text,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
        }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
