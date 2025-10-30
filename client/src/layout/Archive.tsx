import { useState } from "react";
import { Box, Container, Grid, Button } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeTable from "../components/Employee/EmployeeTable";
import TemporaryDrawer from "../components/Employee/Sidebar";
import type { EmployeeItem } from "../api";

export default function Archive() {
  const [reload, setReload] = useState<number>(0);
  const employeeColumns: GridColDef<EmployeeItem>[] = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    {
      field: "college", headerName: "college", width: 150,
      valueGetter: (_, row) => {
        const college = row.departmentInfo?.college;
        return college ? college : "N/A";
      }
    },
    {
      field: "department", headerName: "department", width: 150,
      valueGetter: (_, row) => {
        const department = row.departmentInfo?.department;
        return department ? department : "N/A";
      }
    },
    {
      field: "visaType", headerName: "Visa Type", width: 150,
      valueGetter: (_, row) => {
        const visaType = row.visaHistory[0]?.visaType;
        return visaType ? visaType : "N/A";
      }
    },
    {
      field: "expireDate", headerName: "Exp Date", width: 150,
      valueGetter: (_, row) => {
        const date = row.visaHistory[0]?.expireDate;
        return date ? new Date(date).toLocaleDateString("en-US") : "N/A";
      }
    },
    {
      field: "restore",
      headerName: "",
      width: 120,
      renderCell: () => (
        <Button
          variant="contained"
          color="success"
          onClick={(event) => { event.stopPropagation(); }}
        >
          Restore
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 120,
      renderCell: () => (
        <Button
          variant="contained"
          color="error"
          onClick={(event) => { event.stopPropagation(); }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        {/*Left sidebar */}
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ mr: 5 }}>
          <EmployeeTable
            title="Archived Cases"
            url="employee/getEmployee"
            columns={employeeColumns}
            initialSort="employeeId"
            change={false}
          />
        </Grid>

      </Container>
    </Box>









  );
}
