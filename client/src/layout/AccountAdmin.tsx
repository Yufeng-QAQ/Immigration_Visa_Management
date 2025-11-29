import {
  Button,
  Container,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import TemporaryDrawer from "../components/Employee/Sidebar";

export default function AccountAdmin () {
  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>
      </Container>
    </Box>
  );
}