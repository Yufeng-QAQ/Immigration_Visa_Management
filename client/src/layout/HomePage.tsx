import { useState } from "react";
import { Typography, Box, Container, Grid} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import { CssBaseline } from '@mui/material';
import EmployeeTable from "../components/Employee/EmployeeTable";
import TemporaryDrawer from "../components/Employee/Drawer";
import VisaStatsComponent from "../components/Reports/visaSummary";


export default function HomePage() {
  const [reload] = useState<number>(0);

  const employeeColumns: GridColDef[] = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "visaType", headerName: "Visa Type", width: 150 },
    { field: "expireDate", headerName: "Exp Date", width: 150 },
    { field: "daysRemain", headerName: "Days Remain", width: 120 },
  ];
  return (
    <Container maxWidth={false} disableGutters>
      <CssBaseline />
      <Box sx={{ display: 'flex', alignItems: 'center',  width: '100%', pb:1}}>
        <TemporaryDrawer />
        <Grid container spacing={2} columns={{ xs: 12, md: 12 }} justifyContent="center" >
          <Typography variant="h2" sx={{whiteSpace: 'nowrap', pl:'100%'}}>
            Current Live Cases
          </Typography>
        </Grid>

      </Box>
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <Box sx={{ flex: 2}}>
          <Grid container spacing={2}>
            <EmployeeTable
              title=""
              url="employee/getEmployee"
              columns={employeeColumns}
              reload={reload}
            />
          </Grid>
        </Box>
        


        <Box sx={{ flex: 1 , minWidth: 0 , pl:1}}>
          <VisaStatsComponent />
        </Box>
      </Box>
    </Container>

   

   


    

   
  );
}

