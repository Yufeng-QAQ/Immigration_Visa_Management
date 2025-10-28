import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import EmpDetail from "./Detail";
import {
  Alert,
  Grid,
  Typography,
  Box,
  Card,
} from "@mui/material";
// import UpdateEmployeeForm from "./Update";
import { notify } from "../MUI/Notification/eventBus";

interface EmployeeTableProps {
  url: string;
  title: string;
  columns: GridColDef[];
  initialSort: string
}

import type { EmployeeItem} from "../../api";

const BASE_URL = "http://localhost:8000/api/";

export default function EmployeeTable({ url, title, columns, initialSort}: EmployeeTableProps) {
  const [reload, setReload] = useState(false);
  const [rows, setRows] = useState<EmployeeItem[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const handleDetail = (id: string) => {
    setSelectedEmpId(id);
    setOpen(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axios.get(`${BASE_URL}${url}`);
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];

        setRows(raw);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Failed to fetch data:", err.message);
          setError(err.response?.data?.error || err.message);
        } else {
          console.error("Failed to fetch data:", err);
          setError("Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, reload]);
  const handleValueChange = () => {
    setReload(prev => !prev);
  };
  useEffect(()=>{
    notify.success("Employee updated successfully!");
  },[reload]);
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
            <Grid size={{ xs: 12 }}>
              <DataGrid
                loading={isloading}
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id || row.id}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10, page: 0 } },
                  sorting: {
                    sortModel: [{ field: initialSort, sort: 'asc' }], 
                  },
                }}
                disableColumnResize
                onRowClick={(params) => handleDetail(params.row._id)}
              />
              <EmpDetail 
                empId={selectedEmpId}
                open={open}
                onClose={() => setOpen(false)}
                onValueChange={handleValueChange}
                 />
            </Grid>
          </Grid>
        )}
      </Box>

    </Card>
  );
};
