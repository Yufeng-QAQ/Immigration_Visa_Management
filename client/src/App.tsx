import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import LandingPage from "./layout/LandingPage";
import HomePage from "./layout/HomePage";
import ManageEmp from "./layout/ManageEmployee";
import Archive from "./layout/Archive";
import { GlobalNotification } from "./components/MUI/Notification/Notification";
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <Router >
      {/* Navigation Bar */}
      <CssBaseline />
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
      <Box 
        sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/img_src/bkgr_img.png)',
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
        zIndex: -1,
        opacity: 0.5
      }}
      />
      {/* Page Content */}
      <Container sx={{ mt: 4} }>
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
