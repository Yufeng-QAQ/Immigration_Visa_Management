import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import LandingPage from "./layout/LandingPage";
import HomePage from "./layout/HomePage";
import logo from "/umbc_logo.png";


function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Box>
            <img src= {logo} width={ 30} />
          </Box>
          <Typography color="secondary" variant="h6" sx={{ flexGrow: 1 , ml : 1}}>
            Visa Management System
          </Typography>
          <Button color="secondary" component={Link} to="/">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Container>
    </Router>






  );
}

export default App;
