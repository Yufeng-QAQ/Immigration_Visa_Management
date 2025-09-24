import { useState } from "react";
import { Typography, Box, Container, Grid, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";


import EmployeeForm from "../components/Employee/createEmployee";


export default function HomePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };
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

        <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="lg">
          <DialogContent>
            <EmployeeForm onClose={handleCloseCreateDialog}/>
          </DialogContent>
        </Dialog>


      </Box>
    </Container>
  );
}

