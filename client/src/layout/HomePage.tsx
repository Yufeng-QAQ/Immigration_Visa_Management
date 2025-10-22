import { useState } from "react";
import { Typography, Box, Container, Grid, Button} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeForm from "../components/Employee/createEmployee";
import EmployeeTable from "../components/Employee/EmployeeTable";
import Display from "../components/Employee/Display";
import TemporaryDrawer from "../components/Employee/Drawer";
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
    { field: "visaType", headerName: "Visa Type", width: 150 },
    { field: "expireDate", headerName: "Exp Date", width: 150 },
    { field: "daysRemain", headerName: "Days Remain", width: 120 },
  ];
  return (
    <Container>
      {/*Left sidebar */}
      <TemporaryDrawer />
      <Box sx={{ display: 'flex', alignItems: 'center',  width: '100%'}}>
        <Grid container spacing={2} columns={{ xs: 12, md: 12 }}>
          
          <Typography variant="h2">
            Current Live Cases
          </Typography>
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
            title=""
            url="employee/getEmployee"
            columns={employeeColumns}
            reload={reload}
          />
        </Grid>
      </Box>

     <Display />
      <Box>
        <VisaStatsComponent />
      </Box>
        <Grid container>
          <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
            Create Employee
          </Button>
        </Grid>
    </Container>

   

   


    

   
  );
}

