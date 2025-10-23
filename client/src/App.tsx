import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import LandingPage from "./layout/LandingPage";
import HomePage from "./layout/HomePage";
import ManageEmp from "./layout/ManageEmployee";
import Archive from "./layout/Archive";
import { GlobalNotification } from "./components/MUI/Notification/Notification";
import logo from "/umbc_logo.png";


function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar sx={{mr:1}}>
          <Box>
            <img src= {'/img_src/UMBC_Shield.png'} width={120} />
          </Box>
          <Typography color="background" variant="h6" sx={{ flexGrow: 1 , ml : 2}}>
            Visa Management System
          </Typography>
          <Button color="secondary" component={Link} to="/">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Container sx={{ mt: 4 }}>
        <GlobalNotification />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/manage" element={<ManageEmp />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </Container>
    </Router>






  );
}

export default App;
