import axios from "axios";
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
import DeleteIcon from '@mui/icons-material/Delete';

import dayjs, { Dayjs } from 'dayjs';
import type { EmployeeItem } from "../../api";
import { notify } from "../Common/Notification/eventBus";


interface EmployeeFormProps {
  onClose: () => void;
  onAddSuccess?: () => void;
}

export default function EmployeeForm({ onClose, onAddSuccess }: EmployeeFormProps) {
const degrees = ["Ph.D.", "Masters", "Bachelor", "Associate", "High School or Equivalent", "Middle School or Lower", "MdA", "MS"];
  const Visatypes = ["J-1", "H-1B initial COS from J-1", "H-1B extension" ,"H-1B extension recapture" ,"H-1B extension AC21 + recapture 7 days" ,"TN petition" ,"H-1B port" , "OPT - 1 Year", "OPT - 3 Years", "Permanent Residency"];
  const genders = ["Male", "Female"]


  const methods = useForm<EmployeeItem>({
    defaultValues: {
      employeeId: "",
      firstName: "",
      lastName: "",
      middleName: "",
      dateOfBirth: null,
      email: "",
      addresses: [{ address: "" }],
      salary: 0,
      positionTitle: "",
      highestDegree: "",
      countryOfBirth: "",
      allCitizenship:[],
      initialH1BStart:null,
      prepExtensionDate:null,
      maxHPeriod:null,
      documentExpiryI94:null,
      filedBy:"",
      gender: "",
      socCode: "",
      socCodeDescription:"",
      departmentInfo: {
        college: "",
        department: "",
        supervisor: "",
        admin: ""
      },
      visaHistory: [{
        visaType: "",
        issueDate: null,
        expireDate: null,
        status: "Active"
      }],
      activateStatus: true,
      comment: "",
    }
  });

  const { control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = async (data: EmployeeItem) => {
    try {
      console.log(data);
      await addEmployee(data);
      if (onAddSuccess) onAddSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const addEmployee = async (data: EmployeeItem) => {
    try {
      await api.post(
        "/employee/createEmployee",
        data,
      );
      notify.success("Employee created successfully!");
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
  };

  return (
    <FormProvider {...methods}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Create New Employee
          </Typography>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Basic Information
              </Typography>

              <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
                <Grid size={{ xs: 7 }}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="First Name" fullWidth variant="standard" />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <Controller
                    name="middleName"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Middle Name" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 7 }}>
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
                <Grid size={{ xs: 18 }} container spacing={2} columns={18} alignItems="center" justifyContent="space-between">
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField {...field} required label="School Email" fullWidth variant="standard" />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="personalEmail"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField {...field} required label="Personal Email" fullWidth variant="standard" />
                      )}
                    />
                  </Grid>


                  

                  <Grid size={{ xs: 6 }} mb={2}>
                    <Controller
                      name="highestDegree"
                      control={control}
                      rules={{ required: "Please select a degree" }}
                      render={({ field }) => (
                        <FormControl fullWidth sx={{ m: 0 }}>
                          <InputLabel id="highest-degree-label">Highest Degree</InputLabel>
                          <Select
                            {...field}
                            required
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

                  <Grid size={{ xs: 3 }} mb={2}>
                    <Controller
                      name="countryOfBirth"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField {...field} required label="Country Of Birth" fullWidth variant="standard" />
                      )}
                    />
                  </Grid>




                  <Grid size={{ xs: 6 }} mb={2}>
                    <Controller
                      name = "allCitizenship"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField {...field} required label="AllCitizenship" fullWidth variant="standard" />
                      )}
                      >
                    </Controller>
                  </Grid>

                  <Grid size={{ xs: 3 }} mb={2}>
                    <Controller
                      name = "filedBy"
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <TextField {...field} required label="FiledBy" fullWidth variant="standard" />
                      )}
                      >
                    </Controller>
                  </Grid>

                  <Grid size={{ xs: 6 }} mb={2}>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: "Please select a gender" }}
                      render={({ field }) => (
                        <FormControl fullWidth sx={{ m: 0 }}>
                          <InputLabel id="gender-label">Gender</InputLabel>
                          <Select
                            {...field}
                            required
                            labelId="gender-label"
                            label="Gender"
                          >
                            {genders.map((gen) => (
                              <MenuItem key={gen} value={gen}>
                                {gen}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>



                </Grid>

                

                <Grid size={{ xs: 12 }}>
                  {fields.map((field, index) => (
                    <Grid key={field.id}>
                      <Box display="flex" gap={1}>
                        <Controller
                          name={`addresses.${index}.address`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              required
                              label={`Address ${index + 1}`}
                              fullWidth
                              variant="standard"
                            />
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            color="error"
                            size="small"
                            onClick={() => remove(index)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Grid size={{ xs: 4 }} mt={1}>
                  <Button
                    type="button"
                    variant="contained"
                    size="small"
                    onClick={() => append({ address: "" })}
                    sx={{ color: '#fdb515' }}
                  >
                    Add Address
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card elevation={2} sx={{ mt: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Department Information
              </Typography>
              <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
                <Grid size={{ xs: 9 }}>
                  <Controller
                    name="departmentInfo.college"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="College" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 9 }}>
                  <Controller
                    name="departmentInfo.department"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Department" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 9 }}>
                  <Controller
                    name="departmentInfo.supervisor"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField {...field} required label="Supervisor" fullWidth variant="standard" />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 9 }}>
                  <Controller
                    name="departmentInfo.admin"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Admin" fullWidth variant="standard" />
                    )}
                  />
                </Grid>

                 <Grid size={{ xs: 4 }}>
                  <Controller
                    name="socCode"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="SocCode" fullWidth variant="standard" />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 10 }}>
                  <Controller
                    name="socCodeDescription"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="SocCodeDescription" fullWidth variant="standard" />
                    )}
                  />
                </Grid>




                <Grid size={{ xs: 4 }}>
                  <Controller
                    name="salary"
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                      <FormControl fullWidth>
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
                
              
               

                




              </Grid>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Current Visa
              </Typography>
              <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
                <Grid size={{ xs: 7 }} mb={2}>

                    <Controller
                    control={control}
                    name={"initialH1BStart"}
                    render={({ field }) => (
                      <DatePicker
                        label="Initial H1B Start"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                  </Grid>



                  <Grid size={{ xs: 7 }} mb={2}>

                    <Controller
                    control={control}
                    name={"prepExtensionDate"}
                    render={({ field }) => (
                      <DatePicker
                        label="Prep Extension Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                  </Grid>

                  <Grid size={{ xs: 7 }} mb={2}>

                    <Controller
                    control={control}
                    name={"maxHPeriod"}
                    render={({ field }) => (
                      <DatePicker
                        label="Max H Period"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                  </Grid>


                  <Grid size={{ xs: 7 }} mb={2}>

                    <Controller
                    control={control}
                    name={"documentExpiryI94"}
                    render={({ field }) => (
                      <DatePicker
                        label="Document Expiry I94"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                  </Grid>





                <Grid size={{ xs: 18 }}mb={2}>
                  <Grid size={{ xs: 7 }}>
                    <Controller
                      name={`visaHistory.0.visaType`}
                      control={control}
                      rules={{ required: "Please select a degree" }}
                      render={({ field }) => (
                        <FormControl fullWidth sx={{ m: 1 }}>
                          <InputLabel id="highest-degree-label">Visa Type</InputLabel>
                          <Select
                            {...field}
                            labelId="activeVisa-label"
                            label="Highest Degree"
                          >
                            {Visatypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid size={{ xs: 7 }}mb={2}>
                  <Controller
                    control={control}
                    name={`visaHistory.0.issueDate`}
                    render={({ field }) => (
                      <DatePicker
                        label="Issue Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 7 }}mb={2}>
                  <Controller
                    control={control}
                    name={`visaHistory.0.expireDate`}
                    render={({ field }) => (
                      <DatePicker
                        label="Exp Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 18 }}mb={2}>
                  <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Add Comment"
                        fullWidth
                        multiline
                        rows={5}
                      />
                    )}
                  />
                </Grid>



              </Grid>

            </CardContent>
          </Card>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button type="submit" variant="contained" sx={{ color: '#fdb515' }}>Create Employee</Button>
          </Box>
        </form>
      </Box>
    </FormProvider>
  );
}


