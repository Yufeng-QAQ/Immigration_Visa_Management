import { Typography, Box, Container, Paper } from "@mui/material";

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
    </Container>
  );
}

