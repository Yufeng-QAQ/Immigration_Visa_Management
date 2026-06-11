import { useEffect, useState } from "react";
import { useConfirm } from "../components/Common/Confirm";
import {
  Button,
  Container,
  Box,
  Dialog,
  DialogContent,
  Grid,
} from "@mui/material";
import api from "../api/axios";
import { AxiosError } from "axios";
import { notify } from "../components/Common/Notification/eventBus";

import TemporaryDrawer from "../components/Employee/Sidebar";
import UserList from "../components/Account/UserList";
import CreateUser from "../components/Account/CreateUser";
import UserDetail from "../components/Account/UserDetail";
import SystemLog from "../components/Account/systemLog";
import type { UserItem } from "../api";

export default function AccountAdmin() {
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const fetchUsers = async () => {
    const res = await api.get("/user/getAllUsers");
    setUsers(res.data);
  };

  const handleDelete = async (id: string, username: string) => {
    const result = await confirm({
      title: "Warning!",
      content: "Are you sure to delete this user?",
      confirmText: "Delete",
      cancelText: "Cancel",
      isDelete: true
    })

    if (result) {
      try {
        await api.delete(`/user/deleteUser/${id}`);
        notify.success(`User "${username}" deteled successfully!`)
        fetchUsers();
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data || error.message);
        } else if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
        throw error;
      }
    }
  };

  const handleEdit = (user: UserItem) => {
    setSelectedUser(user);
    handleOpenEditDialog();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [, setReload] = useState(false);
  const triggerReload = () => {
    setReload(prev => !prev);
    fetchUsers();
  };

  const handleOpenCreateDialog = () => {setIsCreateDialogOpen(true)};
  const handleCloseCreateDialog = () => {setIsCreateDialogOpen(false)};

  const handleOpenEditDialog = () => {setIsEditDialogOpen(true)};
  const handleCloseEditDialog = () => {setIsEditDialogOpen(false)};

  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>

        <Grid container mb={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
              Create User
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7, lg: 6 }}>
            <UserList users={users} onDelete={handleDelete} onEdit={handleEdit} />
          </Grid>

          <Grid size={{ xs: 12, md: 5, lg: 6 }}>
            <SystemLog></SystemLog>
          </Grid>
        </Grid>

        <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
          <DialogContent aria-label="Create User">
            <CreateUser onClose={handleCloseCreateDialog} onAddSuccess={triggerReload} />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogContent aria-label="User Detial">
            <UserDetail user={selectedUser} onClose={handleCloseEditDialog} onAddSuccess={triggerReload} />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}