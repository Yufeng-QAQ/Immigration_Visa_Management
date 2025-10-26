import { useState } from "react";
import { Typography, Box, Container, Grid} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import EmployeeTable from "../components/Employee/EmployeeTable";
import TemporaryDrawer from "../components/Employee/Drawer";
import VisaStatsComponent from "../components/Reports/visaSummary";
import type{ EmployeeItem } from "../api";

export default function HomePage() {
  const [reload] = useState<number>(0);

  const employeeColumns: GridColDef<EmployeeItem>[] = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "visaType", headerName: "Visa Type", width: 150, 
      valueGetter: (_, row) => {
        const visaType = row.visaHistory[0]?.visaType;
        return visaType ? visaType : "N/A";
    }},
    { field: "expireDate", headerName: "Exp Date", width: 150, 
      valueGetter: (_, row) => {
        const date = row.visaHistory[0]?.expireDate;
        return date ? new Date(date).toLocaleDateString("en-US") : "N/A";
    }},
    { field: "daysRemain", headerName: "Days Remain", width: 120 },
  ];
  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center',  width: '100%', pb:1, mt:1.5}}>
        <TemporaryDrawer />
        <Grid container spacing={2} columns={{ xs: 12, md: 12 }} justifyContent="center">
          <Typography variant="h2" sx={{whiteSpace: 'nowrap', fontWeight: 'bold'}}>
            Current Live Cases
          </Typography>
        </Grid>

      </Box>
      <Box sx={{ display: 'flex', gap: 2, width: '100%' ,ml:8}}>
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

