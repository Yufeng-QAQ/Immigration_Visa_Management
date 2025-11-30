import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import api from "../api/axios";

import TemporaryDrawer from "../components/Employee/Sidebar";
import UserList from "../components/Account/UserList";
import CreateUser from "../components/Account/CreateUser";

export default function AccountAdmin() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    // const res = await axios.get("http://localhost:5000/api/users");
    // setUsers(res.data);
    const res = await api.get("/user/getAllUsers");
    setUsers(res.data);
  };

  const handleDelete = async (id: string) => {
    // await axios.delete(`http://localhost:5000/api/users/${id}`);
    // fetchUsers();
    console.log("Click delete", id);

  };

  const handleEdit = (user: any) => {
    console.log("Edit user:", user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>

        <Grid container mb={1}>
          <Grid size={{ xs: 12, md: 7 }}>
            <CreateUser></CreateUser>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <UserList users={users} onDelete={handleDelete} onEdit={handleEdit} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}