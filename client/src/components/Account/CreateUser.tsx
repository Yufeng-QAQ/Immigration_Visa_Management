import api from "../../api/axios";
import { AxiosError } from "axios";
import { useForm, useFieldArray, Controller, FormProvider } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography, InputLabel, OutlinedInput, InputAdornment, FormControl
} from "@mui/material";
import type { UserItem } from "../../api";
import { useState } from "react";

export default function CreateUser() {
  const roles = ["Administrator", "Asistant"];
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const methods = useForm<UserItem>({
    defaultValues: {
      username: "",
      email: "",
      role: "",
      password: "",
    }
  });

  const { control, handleSubmit } = methods;

  const onSubmit = async (data: UserItem) => {
    console.log(data);

  }

  return (
    <FormProvider {...methods}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{mb: 2}}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Create User
              </Typography>

              <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
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

                <Grid size={{ xs: 9 }} mb={2}>
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

              <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
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

                <Grid size={{ xs: 9 }} mb={2}>
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
        </form>
      </Box>
    </FormProvider>
  )
}