import { useState } from "react";
import { Typography, Box, Container, Grid, Button} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeForm from "../components/Employee/createEmployee";
import EmployeeTable from "../components/Employee/EmployeeTable";
import Display from "../components/Employee/Display";
import TemporaryDrawer from "../components/Employee/Drawer";


export default function ManageEmployee() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);
  const triggerReload = () => {
    setReload(prev => prev + 1);
  };
  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };
 
  return (
    <Container>
    {/*Left sidebar */}
    <TemporaryDrawer />
     <Display />
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
    </Container>

   

   


    

   
  );
}
