import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <Box
        sx={{
          textAlign: "center",
          py: 10,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Visa Management System
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your immigration and visa applications with ease.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate("/home")}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

