import { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("login click");
    
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
    <Container maxWidth="xs">
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h4" gutterBottom>
          User Login
        </Typography>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Typography color="error">{error}</Typography>}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}
