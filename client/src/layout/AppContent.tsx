import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { CssBaseline } from '@mui/material';

import LandingPage from "./LandingPage";
import HomePage from "./HomePage";
import ManageEmp from "./ManageEmployee";
import Archive from "./Archive";
import AccountAdmin from "./AccountAdmin";

import { GlobalNotification } from "../components/Common/Notification/Notification";
import { notify } from "../components/Common/Notification/eventBus";
import { useAuth } from "../components/Common/UserAuth/AuthContext";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import api from "../api/axios";


export default function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLandingPage = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      notify.success("Logout Sucessfully")
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ mr: 1 }}>
          <Box>
            <img src={'/img_src/UMBC_Shield.png'} width={120} />
          </Box>
          <Typography color="background" variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Visa Management System
          </Typography>
          {!isLandingPage && (
            <Button color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          )}
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

      <Container sx={{ mt: 4 }}>
        <GlobalNotification />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/manage" element={<ManageEmp />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/account" element={<ProtectedRoute userRole={user?.role} allowedRoles={['MasterAdmin']}>
            <AccountAdmin />
          </ProtectedRoute>} />
        </Routes>
      </Container>
    </>
  );
}
