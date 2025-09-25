import { Typography, Box, Container, Paper } from "@mui/material";
import Employee from "../components/Employee";
import Display from "../components/Employee/Display";

export default function HomePage() {
  return (
    <Container>
      <Box sx={{ py: 5 }}>
        <Typography variant="h3" gutterBottom>
          Home Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This is the homepage of your Visa Management System.
          From here you can navigate to manage visa applications, view status, and more.
        </Typography>

      </Box>
    <Employee/>
    <Display/>
    </Container>

   

   


    

   
  );
}

