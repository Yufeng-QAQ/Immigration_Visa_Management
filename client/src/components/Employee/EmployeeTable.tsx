import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef , GridRowsProp} from "@mui/x-data-grid";
import EmpDetail from "./EmpDetail";
import {
  Alert,
  Grid,
  Typography,
  Box,
  Card,
} from "@mui/material";
import api from "../../api/axios";

interface EmployeeTableProps {
  url: string;
  title: string;
  columns: GridColDef[];
  initialSort: string;
  change: boolean;
  passedRows?: EmployeeItem[];
}

import type { EmployeeItem } from "../../api";

export default function EmployeeTable({ url, title, columns, initialSort, change, passedRows}: EmployeeTableProps) {
  const [reload, setReload] = useState(false);
  const [rows, setRows] = useState<EmployeeItem[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.get(url);
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];

        setRows(raw);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Failed to fetch data:", err.response?.data.message);
          setError(err.response?.data.message || err.message);
        } else {
          console.error("Failed to fetch data:", err);
          setError("Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, reload, change]);

  const handleDetail = (id: string) => {
    setSelectedEmpId(id);
    setOpen(true);
  };

  const handleValueChange = () => {
    setReload(prev => !prev);
    // setnotifyMsg("Employee updated successfully!");
  };
  const handleClose = () => {
    setOpen(false);
    // setnotifyMsg("Employee deleted successfully!");
  };
  // useEffect(() => {
  //   // if(selectedEmpId != null) notify.success(notifyMsg);
  // }, [reload]);

  return (
    <Card>
      <Box p={2} lineHeight={1}>
        <Grid>
          {title && <Typography variant="h6" fontWeight={600} mb={2}>{title}</Typography>}
        </Grid>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <DataGrid
                loading={isloading}
                rows={passedRows? passedRows: rows}
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
                onClose={handleClose}
                onValueChange={handleValueChange}
                change={change}
                 />
            </Grid>
          </Grid>
        )}
      </Box>
    </Card>
  );
};
