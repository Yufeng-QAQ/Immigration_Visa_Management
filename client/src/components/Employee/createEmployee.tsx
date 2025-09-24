import { useForm, useFieldArray, Controller, FormProvider } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  FormControlLabel,
  Checkbox
} from "@mui/material";

import type { EmployeeItem } from "../../api";

interface EmployeeFormProps {
  onClose: () => void;
}

export default function EmployeeForm({ onClose }: EmployeeFormProps) {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses"
  });

  const onSubmit = (data: EmployeeItem) => {
    console.log(data);
    onClose();
  }

  return (
    <FormProvider {...methods}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid container spacing={1} columns={{ xs: 12, md: 12 }}>
            <Grid size={{ xs: 6, md: 12 }}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label="First Name" fullWidth/>
                )}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 12 }}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label="Last Name" fullWidth />
                )}
              />
            </Grid>

            <Box>
              <Button type="submit" variant="contained">Create Employee</Button>
            </Box>


          </Grid>
        </form>
      </Box>
    </FormProvider>
  );
}