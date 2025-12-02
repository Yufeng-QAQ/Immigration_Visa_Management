import { useState } from "react";
import { AxiosError } from "axios";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  Card,
  CardContent,
  Switch,
  Typography, InputLabel, FormControl,
  List, ListItem, ListItemText,
} from "@mui/material";
import api from "../../api/axios";
import type { UserItem } from "../../api";
import { checkPassword } from "../../util";
import { notify } from "../Common/Notification/eventBus";

interface UserFormProps {
  user: UserItem | null;
  onClose: () => void;
  onAddSuccess?: () => void;
}

export default function UserDetail({ user, onClose, onAddSuccess }: UserFormProps) {
  const roles = ["MasterAdmin", "Administrator", "Asistant"];
  const [checked, setChecked] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const methods = useForm<UserItem>({
    defaultValues: {
      username: user?.username,
      email: user?.email,
      role: user?.role,
    }
  });

  const { control, handleSubmit } = methods;

  const onSubmit = async (data: UserItem) => {
    try {
      const result = await updateUser(data);
      if (!result) return;
      if (onAddSuccess) onAddSuccess();
      onClose();

    } catch (err) {
      notify.error("Failed to update user. Please try again.");
      console.error(err);
    }
  }

  const updateUser = async (data: UserItem) => {
    let finalData = { ...data };
    if (checked) {
      const isValid = checkPassword(newPassword, confirmPassword);
      if (!isValid) return false;
      finalData = {
        ...data,
        password: newPassword
      };
    }

    try {
      await api.put(`/user/updateUser/${user?._id}`, finalData);
      notify.success("User updated!");
      return true;

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  return (
    <FormProvider {...methods}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                User Information
              </Typography>

              <Grid container columns={{ xs: 18, md: 18 }}>
                <Grid size={{ xs: 9 }}>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Username" fullWidth variant="standard" />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 9 }}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Email" fullWidth variant="standard" />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 9 }}>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Please select a role" }}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                          {...field}
                          required
                          labelId="role-label"
                          label="role"
                        >
                          {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Grid container columns={{ xs: 18, md: 18 }}>
                <Grid size={{ xs: 15 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Change Password
                  </Typography>
                </Grid>

                <Grid size={{ xs: 3 }}>
                  <Switch
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    slotProps={{ input: { 'aria-label': 'controlled' } }}
                  />
                </Grid>
              </Grid>



              {checked && (
                <Grid container columns={{ xs: 18, md: 18 }}>
                  <Grid size={{ xs: 18 }}>
                    <TextField size="small" required label="New Password" type="password" fullWidth onChange={(e) => setNewPassword(e.target.value)} />
                  </Grid>

                  <Grid size={{ xs: 18 }}>
                    <TextField size="small" required label="Confirm Password" type="password" fullWidth onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Grid>

                  <Grid size={{ xs: 18 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Password requirements
                    </Typography>
                    <Typography fontSize={14} color="rgba(129, 129, 129, 1)">
                      A valid and strong password should be:
                    </Typography>
                    <List dense sx={{ pl: 2, color: "rgb(129, 129, 129, 1)" }}>
                      <ListItem disableGutters>
                        <ListItemText primary="• Minimum 6 characters" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText primary="• One upper & lower case letter" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemText primary="• At least one number" />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button type="submit" variant="contained" sx={{ color: '#fdb515' }}>Update User</Button>
              </Box>
            </CardContent>
          </Card>

        </form>
      </Box>
    </FormProvider>
  )
}