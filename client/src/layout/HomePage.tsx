import { useState } from "react";
import { Typography, Box, Container, Grid, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeForm from "../components/Employee/createEmployee";
import EmployeeTable from "../components/Employee/EmployeeTable";
import Display from "../components/Employee/Display";
import VisaStatsComponent from "../components/Reports/visaSummary";

export default function HomePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);
  const triggerReload = () => {
    setReload(prev => prev + 1);
    console.log("reloaded");
    
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const employeeColumns: GridColDef[] = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "positionTitle", headerName: "Position", width: 180 },
    { field: "salary", headerName: "Salary", width: 120 },
  ];
  return (
    <Container>
      <Box sx={{ py: 5 }}>
        <Grid container spacing={2} columns={{ xs: 12, md: 12 }}>
          <Typography variant="h3" gutterBottom>
            Home Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This is the homepage of your Visa Management System.
            From here you can navigate to manage visa applications, view status, and more.
          </Typography>
        </Grid>

        <Grid container>
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Create Employee
          </Button>
        </Grid>

        <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
          <DialogContent>
            <EmployeeForm onClose={handleCloseCreateDialog} onAddSuccess={triggerReload}/>
          </DialogContent>
        </Dialog>
      </Box>

      <Box>
        <Grid container>
          <EmployeeTable
            title="Employee Directory"
            url="employee/getEmployee"
            columns={employeeColumns}
            reload={reload}
          />
        </Grid>
      </Box>
     <Display></Display>
      <Box>
        <VisaStatsComponent></VisaStatsComponent>
      </Box>
    </Container>

   

   


    

   
  );
}

