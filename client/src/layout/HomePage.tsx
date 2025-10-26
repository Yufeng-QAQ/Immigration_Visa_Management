import { useState } from "react";
import { Typography, Box, Container, Grid } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeForm from "../components/Employee/createEmployee";
import Display from "../components/Employee/Display";
import EmployeeTable from "../components/Employee/EmployeeTable";
import TemporaryDrawer from "../components/Employee/Drawer";
import VisaStatsComponent from "../components/Reports/visaSummary";
import type { EmployeeItem } from "../api";

export default function HomePage() {
  const [reload] = useState<number>(0);

  const employeeColumns: GridColDef<EmployeeItem>[] = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
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
    { field: "daysRemain", headerName: "Days Remain", width: 120 },
  ];
  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>

        <Grid container spacing={2} display={"flex"} justifyContent={"space-around"}>
          <Grid size={{ xs: 12, lg: 8 }} sx={{ mr: 5 }}>
            <EmployeeTable
              title="Current Live Cases"
              url="employee/getEmployee"
              columns={employeeColumns}
              reload={reload}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <VisaStatsComponent />
          </Grid>
        </Grid>
      </Container>
    </Box>

    //     <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
    //       <DialogContent>
    //         <EmployeeForm onClose={handleCloseCreateDialog}/>
    //       </DialogContent>
    //     </Dialog>



  );
}

