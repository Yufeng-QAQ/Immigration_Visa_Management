import { Box, Container, Grid } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeTable from "../components/Employee/EmployeeTable";
import TemporaryDrawer from "../components/Employee/Drawer";
import VisaStatsComponent from "../components/Reports/visaSummary";
import type { EmployeeItem } from "../api";
import { calculateDaysLeft } from "../util";

export default function HomePage() {
  
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
    {
      field: "daysRemain",
      headerName: "Days Remain",
      width: 120,
      valueGetter: (_, row) => {
        const days = row.visaHistory[0]?.expireDate
          ? calculateDaysLeft(row.visaHistory[0].expireDate)
          : "-";
        return days ? days : "N/A";
      },
      renderCell: (params) => {
        const days = params.value;

        let bgColor = "gray";

        if (days === "N/A" || days === "-") {
          bgColor = "gray";
        } else if (days < 30) {
          bgColor = "#e53935";
        } else if (days < 60) {
          bgColor = "#fb8c00";
        } else if (days >= 90) {
          bgColor = "#43a047";
        } else {
          bgColor = "#e53935";
        }

        return (
          <Box
            sx={{
              mt: 0.7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 40,
              borderRadius: 2,
              fontWeight: "bold",
              color: "white",
              backgroundColor: bgColor,
            }}
          >
            {days}
          </Box>
        );
      },
    }

  ];
  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>

        <Grid container spacing={2} display={"flex"} justifyContent={"space-around"}>
          <Grid size={{ xs: 12, lg: 8 }} sx={{ mr: 5, cursor: "pointer"}}>
            <EmployeeTable
              title="Current Live Cases"
              url="employee/getEmployee"
              columns={employeeColumns}
              initialSort="daysRemain"
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <VisaStatsComponent />
          </Grid>
        </Grid>
      </Container>

      {/* //     <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
//       <DialogContent>
//         <EmployeeForm onClose={handleCloseCreateDialog} />
//       </DialogContent>
//     </Dialog> */}
    </Box>
  );
}

