import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Card, Grid, CircularProgress, Alert, Typography } from "@mui/material";

interface EmployeeTableProps {
  url: string;
  title: string;
  columns: GridColDef[];
}

const BASE_URL = "http://localhost:8000/api/";

export default function EmployeeTable({ url, title, columns }: EmployeeTableProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axios.get(`${BASE_URL}${url}`);
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];

        setRows(raw);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Card>
      <Box p={2} lineHeight={1}>
        <Grid>
          {title && <Typography variant="h2" mb={2}>{title}</Typography>}
        </Grid>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{xs: 12}}>
                  <DataGrid
                    loading={isloading}
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row._id || row.id}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                  />
            </Grid>
          </Grid>
        )}
      </Box>
    </Card>
  );
};
