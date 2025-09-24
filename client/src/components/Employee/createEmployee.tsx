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
import dayjs, { Dayjs } from 'dayjs';
import type { EmployeeItem } from "../../api";

interface EmployeeFormProps {
  onClose: () => void;
}

export default function EmployeeForm({ onClose }: EmployeeFormProps) {
  const degrees = ["Middle School or Lower", "High School or Equivalent", "Associate", "Bachelor", "Master", "PhD"];
  const methods = useForm<EmployeeItem>({
    defaultValues: {
      employeeId: "",
      firstName: "",
      lastName: "",
      middleName: "",
      dateOfBirth: new Date(Date.now()),
      email: "",
      addresses: [],
      salary: 0,
      positionTitle: "",
      highestDegree: "",
      department: "",
      activateStatus: true
    },
  });

  const { control, handleSubmit, setValue, getValues } = methods;
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "addresses"
  // });

  const onSubmit = (data: EmployeeItem) => {
    console.log(data);
    onClose();
  }

  return (
    <FormProvider {...methods}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Create New Employee
          </Typography>
          <Card elevation={2}>
            <CardContent>
              <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="First Name" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="middleName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} label="Middle Name" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Last Name" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="employeeId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Employee ID" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Email" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <DatePicker
                        label="Date of Birth"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>

                {/* The Address class has not implement yet. Thus use string[] instead */}
                {/* Will prevent rendering if use AddressItem[] without sending class object */}
                <Grid size={{ xs: 10 }}>
                  <Controller
                    name="addresses"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Address" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Controller
                    name="positionTitle"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Position Title" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="salary"
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Salary</InputLabel>
                        <OutlinedInput
                          {...field}
                          id="outlined-adornment-amount"
                          startAdornment={<InputAdornment position="start">$</InputAdornment>}
                          label="Salary"
                          type="number"
                          inputProps={{ min: 0 }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="highestDegree"
                    control={control}
                    rules={{ required: "Please select a degree" }}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel id="highest-degree-label">Highest Degree</InputLabel>
                        <Select
                          {...field}
                          labelId="highest-degree-label"
                          label="Highest Degree"
                        >
                          {degrees.map((deg) => (
                            <MenuItem key={deg} value={deg}>
                              {deg}
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
          <Box sx={{ mt: 1 }}>
            <Button type="submit" variant="contained">Create Employee</Button>
          </Box>
        </form>
      </Box>
    </FormProvider>
  );
}