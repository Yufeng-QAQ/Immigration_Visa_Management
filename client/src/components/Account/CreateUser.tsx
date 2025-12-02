import { useState } from "react";
import api from "../../api/axios";
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
  Typography, InputLabel, FormControl,
  List, ListItem, ListItemText,
} from "@mui/material";
import type { UserItem } from "../../api";
import { checkPassword } from "../../util";
import { notify } from "../Common/Notification/eventBus";

interface UserFormProps {
  onClose: () => void;
  onAddSuccess?: () => void;
}

export default function CreateUser({ onClose, onAddSuccess }: UserFormProps) {
  const roles = ["Administrator", "Asistant"];
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const methods = useForm<UserItem>({
    defaultValues: {
      username: "",
      email: "",
      role: "",
    }
  });

  const { control, handleSubmit } = methods;

  const onSubmit = async (data: UserItem) => {
    const isValid = checkPassword(newPassword, confirmPassword);
    if (!isValid) return;

    await addUser(data);
    if (onAddSuccess) onAddSuccess();
    onClose();
  }

  const addUser = async (data: UserItem) => {
    const finalData = {
      ...data,
      password: newPassword
    };
    console.log(finalData);


    try {
      await api.post("/user/createUser", finalData);
      notify.success("New user created!");

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

  return (
    <FormProvider {...methods}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Create User
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
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Create Password
              </Typography>

              <Grid container columns={{ xs: 18, md: 18 }}>
                <Grid size={{ xs: 18 }} >
                  <TextField aria-label="New Password" size="small" required label="New Password" type="password" fullWidth onChange={(e) => setNewPassword(e.target.value)} />
                </Grid>

                <Grid size={{ xs: 18 }}>
                  <TextField aria-label="Confirm Password" size="small" required label="Confirm Password" type="password" fullWidth onChange={(e) => setConfirmPassword(e.target.value)} />
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

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button aria-label="Submit" type="submit" variant="contained" sx={{ color: '#fdb515' }}>Sumbit</Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

        </form>
      </Box>
    </FormProvider>
  )
}