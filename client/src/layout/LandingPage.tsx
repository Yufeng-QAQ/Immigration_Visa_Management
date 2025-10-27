import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Grid, Box, Typography, Button, Container, TextField } from "@mui/material";


export default function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        username,
        password,
      }, { withCredentials: true });

      console.log(res.data);
      navigate("/home");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to login:", err.message);
        setError(err.response?.data?.error || err.message);
      } else {
        console.error("Failed to login:", err);
        setError("Failed to login");
      }
    }
  };

  return (
    <Container maxWidth="md">
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          py: 5,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Visa Management System
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Manage your immigration and Visa applications with ease.
        </Typography>
      </Box>

      {/* Login Section */}
      <Box
        sx={{
          mt: 1,
          p: 3,
          boxShadow: 3,
          borderRadius: 3,
          maxWidth: 500,
          mx: "auto",
          textAlign: "center",
          bgcolor: "Background"
        }}
      >
        <Typography variant="h5" fontWeight={500} gutterBottom>
          Login
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>

          {error && (
            <Grid size={{ xs: 12 }}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{
        textAlign: "center",
        py: 2,
      }}>
        <Button variant="contained" size="large" onClick={() => navigate("/home")}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

