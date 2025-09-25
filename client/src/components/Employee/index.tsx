import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Paper,
  Switch, 
  FormControlLabel 
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";


interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface VisaInput {
  visaType: string;
  startDate: string;
  expireDate: string;
}

interface Department {
  id?: string;
  collegeName: string;
  departmentName: string;
}

interface TaskItemCreate {
  employeeId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  email: string;
  salary: number;
  positionTitle: string;
  highestDegree: string;
  department: Department;
  activateStatus: boolean;
  addresses: Address[];
  visaHistory: VisaInput[];
}


export default function EmployeeForm() {
  const { control, handleSubmit, register, setValue } = useForm<TaskItemCreate>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      salary: 0,
      positionTitle: "",
      highestDegree: "",
      department: { collegeName: "", departmentName: "" },
      activateStatus: true,
      addresses: [{ street: "", city: "", state: "", zip: "", country: "" }],
      visaHistory: [{ visaType: "", startDate: "", expireDate: "" }],
    }
  });

  const addEmployee = async (data: TaskItemCreate) => {
    try {
      await axios.post(
        "http://localhost:8000/api/employee/createEmployee",
        { ...data, employeeId: uuidv4() },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Employee created successfully!");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
    }
  };

  const onSubmit = (data: TaskItemCreate) => addEmployee(data);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "visaHistory",
  });


  return(
    <form onSubmit={handleSubmit(onSubmit)}>

        {/* Name名字 */}
        <Controller
            name = "firstName"
            control = {control}
            render = {({field}) => <TextField {...field} label = "First Name" />}
        />
        <Controller
            name = "middleName"
            control = {control}
            render = {({field}) => <TextField {...field} label = "Middle Name" />}
        />

        <Controller
            name = "lastName"
            control = {control}
            render = {({field}) => <TextField {...field} label = "Last Name" />}
        />

        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
          <TextField
            {...field}
            label="Date Of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
    />
  )}
/>

        <Controller
            name = "email"
            control = {control}
            render = {({field}) => <TextField {...field} label = "Email" />}
        />

        <Controller
            name = "salary"
            control = {control}
            render = {({field}) => <TextField {...field} label = "Salary" />}
        />

        <Controller
            name = "positionTitle"
            control = {control}
            render = {({field}) => <TextField {...field} label = "Position Title" />}
        />

        <Controller
            name = "highestDegree"
            control = {control}
            render = {({field}) => <TextField {...field} label = "Highest Degree" />}
        />

        <Controller
            name = "department.collegeName"
            control = {control}
            render = {({field}) => <TextField {...field} label = "College Name " />}
        />

        <Controller
            name = "department.departmentName"
            control = {control}
            render = {({field}) => <TextField {...field} label = "Department Name " />}
        />


        {/* <Controller
            name="department"
            control={control}
            render={({ field }) => (
                <TextField {...field} select label="Department" fullWidth margin="normal">
                {departments.map((d, idx) => (
                    <MenuItem key={idx} value={JSON.stringify(d)}>
                    {d.collegeName} - {d.departmentName}
                </MenuItem>
                ))}
                </TextField>
            )}
        /> */}

        <Controller
            name="activateStatus"
            control={control}
            render={({ field }) => (
                <FormControlLabel
                    control={
                        <Switch
                        {...field}
                        checked={field.value} 
                        onChange={(e) => field.onChange(e.target.checked)}
                />
                    }
                    label="Activate Status"
            />
            )}
        />

        <Controller
            name="addresses.0.street"
            control={control}
            render={({ field }) => <TextField {...field} label="Street" fullWidth margin="normal" />}
        />

        <Controller
            name="addresses.0.city"
            control={control}
            render={({ field }) => <TextField {...field} label="City" fullWidth margin="normal" />}
        />

        <Controller
            name="addresses.0.state"
            control={control}
            render={({ field }) => <TextField {...field} label="State" fullWidth margin="normal" />}
        />

        <Controller
            name="addresses.0.zip"
            control={control}
            render={({ field }) => <TextField {...field} label="Zip" fullWidth margin="normal" />}
        />

        <Controller
            name="addresses.0.country"
            control={control}
            render={({ field }) => <TextField {...field} label="Country" fullWidth margin="normal" />}
        />


        {fields.map((item, index) => (
        <Paper key={item.id} sx={{ p: 2, mb: 1, position: "relative" }}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Controller
              name={`visaHistory.${index}.visaType`}
              control={control}
              render={({ field }) => <TextField {...field} label="Visa Type" />}
            />
            <Controller
              name={`visaHistory.${index}.startDate`}
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" InputLabelProps={{ shrink: true }} label="Start Date" />
              )}
            />
            <Controller
              name={`visaHistory.${index}.expireDate`}
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" InputLabelProps={{ shrink: true }} label="Expire Date" />
              )}
            />
          </Box>
          <IconButton
            color="error"
            onClick={() => remove(index)}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <Remove />
          </IconButton>
        </Paper>
      ))}

      <Button
        startIcon={<Add />}
        type="button"
        onClick={() => append({ visaType: "", startDate: "", expireDate: "" })}
        sx={{ mt: 1 }}
      >
        Add Visa
      </Button>
      
      <Button type="submit" variant="contained" sx={{ mt: 3 }}>Submit</Button>
    </form>

  );


}