import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import type { LogItem } from "../../api";
import api from "../../api/axios";
import { AxiosError } from "axios";

export default function SystemLog() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/log/getLogs");
      setLogs(res.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Box sx={{ p: 2, backgroundColor: "white", maxHeight: "800px", overflow: "auto"}}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        System Logs
      </Typography>
      <Card sx={{
        borderRadius: 3,
        backgroundColor: "rgba(245, 245, 245, 1)",
        boxShadow: "none",
        border: "1px solid #eee",
      }}>
        <CardContent>
          <Stack spacing={1}>
            {logs.length === 0 ? (
              <Typography>No logs found.</Typography>
            ) : (
              logs.map((log, index) => (
                <Typography key={index} variant="body1">
                  {new Date(log.createdAt).toLocaleString()}:{" "}
                  <Box component="span" fontWeight="bold" color="primary.main">
                    {log.username}
                  </Box>{" "}
                  {log.operation}
                  {log.recordName ? ` ${log.recordName}` : ""}
                </Typography>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>

    </Box>
  );
}
