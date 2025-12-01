import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { UserItem } from "../../api";

interface UserListProps {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
  onDelete: (id: string, username: string) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  return (
    <Box sx={{ p: 2, backgroundColor: "white" }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        User Information
      </Typography>

      <Stack spacing={2} >
        {users.map((user) => (
          <Card
            key={user._id}
            sx={{
              borderRadius: 3,
              backgroundColor: "rgba(245, 245, 245, 1)",
              boxShadow: "none",
              border: "1px solid #eee",
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                  {user.username}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    aria-label="Delete"
                    sx={{ color: "red", p: 1 }}
                    onClick={() => onDelete(user._id, user.username)}
                  >
                    <DeleteIcon fontSize="small" />
                    <Typography fontSize={14}>Delete</Typography>
                  </Button>

                  <Button
                    aria-label="Edit"
                    sx={{ cursor: "pointer" }}
                    onClick={() => onEdit(user)}
                  >
                    <EditIcon fontSize="small" />
                    <Typography fontSize={14}>Edit</Typography>
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Grid display={"flex"} mb={1}>
                <Typography color="gray" fontSize={14}>
                  Email Address:
                </Typography>
                <Typography fontWeight={500} ml={1} fontSize={14}>
                  {user.email}
                </Typography>
              </Grid>

              <Grid display={"flex"} mb={1}>
                <Typography color="gray" fontSize={14}>
                  Role:
                </Typography>
                <Typography fontWeight={500} ml={1} fontSize={14}>
                  {user.role}
                </Typography>
              </Grid>

              <Grid display={"flex"} mb={1}>
                <Typography fontSize={14} color="gray">
                  Created At:
                </Typography>
                <Typography fontWeight={500} fontSize={14} ml={1}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "Unknown"}
                </Typography>
              </Grid>

            </CardContent>
          </Card>
        ))}
      </Stack>
      {/* <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogContent aria-label="Create User">
          <CreateUser onClose={handleCloseCreateDialog} onAddSuccess={triggerReload} />
        </DialogContent>
      </Dialog> */}
    </Box>
  );
};

