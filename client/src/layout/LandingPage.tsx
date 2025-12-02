import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Grid, Box, Typography, Button, Container, TextField } from "@mui/material";
import api from "../api/axios";
import { notify } from "../components/Common/Notification/eventBus";
import { useAuth } from "../components/Common/UserAuth/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const user = await api.get(`/user/getUserById/${res.data?.userId}`);
      if (user) {
        login(user.data);
      }

      notify.success(res.data?.message)
      navigate("/home");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to login:", err.message);
        setError(err.response?.data?.message || err.message);
        notify.error(err.response?.data?.message);
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
          maxWidth: 350,
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

          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              fullWidth
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

