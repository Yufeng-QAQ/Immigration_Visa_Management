import { useState } from "react";
import { Box, Container, Grid, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeForm from "../components/Employee/createEmployee";
import EmployeeTable from "../components/Employee/EmployeeTable";
import TemporaryDrawer from "../components/Employee/Drawer";
import type { EmployeeItem } from "../api";
import { calculateDaysLeft } from "../util";
export default function ManageEmployee() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
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
      field: "daysRemain", headerName: "Days Remain", width: 120,
      valueGetter: (_, row) => {
        const days = row.visaHistory[0]?.expireDate
          ? calculateDaysLeft(row.visaHistory[0].expireDate)
          : "-";
        return days ? days : "N/A";
      },
      renderCell: (params) => {
        const days = params.value

        let color = "/img_src/status_red.png";
        if (days !== "N/A" && days < 30) color = "/img_src/status_red.png";
        else if (days < 60) color = "/img_src/status_orange.png";
        else if (days >= 90) color = "/img_src/status_green.png";

        return (
          <Box
            sx={{
              backgroundImage: `url(${color})`,
              color: "white",
              textAlign: "center",
              width: 80,
              height: 40,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {days}
          </Box>
        );
      },
    },
    {
      field: "archive",
      headerName: "",
      width: 120,
      renderCell: () => (
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => { event.stopPropagation(); }}
        >
          Archive
        </Button>
      ),
    },
  ];

  const triggerReload = () => {
    console.log("reloaded");
  };
  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>
        <Box sx={{ position: "relative" }}>
          <Grid size={{ xs: 12, lg: 8 }} sx={{ mr: 5, cursor: "pointer" }}>
            <EmployeeTable
              title="All Live Cases"
              url="employee/getEmployee"
              columns={employeeColumns}
              initialSort="employeeID"
            />
          </Grid>
          <Grid container
            sx={{
              position: "absolute",
              top: 15,
              right: 90,
              zIndex: 10,
            }}>
            <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
              Create Employee
            </Button>
          </Grid>
        </Box>

        <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
          <DialogContent>
            <EmployeeForm onClose={handleCloseCreateDialog} onAddSuccess={triggerReload} />
          </DialogContent>
        </Dialog>

      </Container>
    </Box>









  );
}
