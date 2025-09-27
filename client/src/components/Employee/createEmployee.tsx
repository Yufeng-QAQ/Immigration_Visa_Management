// import { useForm, useFieldArray, Controller, FormProvider } from "react-hook-form";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import {
//   TextField,
//   Button,
//   Grid,
//   Box,
//   Select,
//   MenuItem,
//   Card,
//   CardContent,
//   Typography, InputLabel, OutlinedInput, InputAdornment, FormControl
// } from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete';
// import dayjs, { Dayjs } from 'dayjs';
// import type { EmployeeItem } from "../../api";
// import axios from "axios";

// interface EmployeeFormProps {
//   onClose: () => void;
// }

// export default function EmployeeForm({ onClose }: EmployeeFormProps) {
//   const degrees = ["PhD", "Master", "Bachelor", "Associate", "High School or Equivalent", "Middle School or Lower"];
//   const Visatypes = ["J-1", "H-1B", "OPT - 1 Year", "OPT - 3 Years"];

//   const methods = useForm<EmployeeItem>({
//     defaultValues: {
//       employeeId: "",
//       firstName: "",
//       lastName: "",
//       middleName: "",
//       dateOfBirth: null,
//       email: "",
//       addresses: [{ address: "" }],
//       salary: 0,
//       positionTitle: "",
//       highestDegree: "",
//       departmentInfo: {
//         college: "",
//         department: "",
//         supervisor: "",
//         admin: ""
//       },
//       activeVisa: {
//         visaType: "",
//         issueDate: null,
//         expireDate: null,
//         status: "Active"
//       },
//       activateStatus: true
//     }
//   });

//   const { control, handleSubmit} = methods;
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "addresses",
//   });

//   const onSubmit = async (data: EmployeeItem) => {
//   try {
//     await addEmployee(data);
//     console.log(data);
//     onClose(); // 确保请求成功后再关闭
//   } catch (error) {
//     console.error(error);
//   }
// };

//   const addEmployee = async (data: EmployeeItem) => {
//   try {
//     await axios.post(
//       "http://localhost:8000/api/employee/createEmployee",
//       data,
//       { headers: { "Content-Type": "application/json" } }
//     );
//     alert("Employee created successfully!");
//   } catch (error: any) {
//     console.error(error.response?.data || error.message);
//     throw error; // 让 onSubmit catch 到
//   }
// };


  


//   return (
//     <FormProvider {...methods}>
//       <Box>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
//             Create New Employee
//           </Typography>
//           <Card elevation={2}>
//             <CardContent>
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                 Basic Information
//               </Typography>
//               <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
//                 <Grid size={{ xs: 7 }}>
//                   <Controller
//                     name="firstName"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} required label="First Name" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 4 }}>
//                   <Controller
//                     name="middleName"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} label="Middle Name" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 7 }}>
//                   <Controller
//                     name="lastName"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} required label="Last Name" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Controller
//                     name="employeeId"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} required label="Employee ID" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Controller
//                     name="positionTitle"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} required label="Position Title" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 6 }}>
//                   <Controller
//                     control={control}
//                     name="dateOfBirth"
//                     render={({ field }) => (
//                       <DatePicker
//                         label="Date of Birth"
//                         value={field.value ? dayjs(field.value) : null}
//                         onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
//                         slotProps={{ textField: { fullWidth: true } }}
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{xs: 18}} container spacing={2} columns={18} alignItems="center" justifyContent="space-between">
//                   <Grid size={{xs: 12}}>
//                     <Controller
//                       name="email"
//                       control={control}
//                       rules={{ required: true }}
//                       render={({ field }) => (
//                         <TextField {...field} required label="Email" fullWidth variant="standard" />
//                       )}
//                     />
//                   </Grid>
//                   <Grid size={{ xs: 6 }} mb={2}>
//                     <Controller
//                       name="highestDegree"
//                       control={control}
//                       rules={{ required: "Please select a degree" }}
//                       render={({ field }) => (
//                         <FormControl fullWidth sx={{ m: 0 }}>
//                           <InputLabel id="highest-degree-label">Highest Degree</InputLabel>
//                           <Select
//                             {...field}
//                             required
//                             labelId="highest-degree-label"
//                             label="Highest Degree"
//                           >
//                             {degrees.map((deg) => (
//                               <MenuItem key={deg} value={deg}>
//                                 {deg}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       )}
//                     />
//                   </Grid>
//                 </Grid>
//                 <Grid size={{ xs: 12 }}>
//                   {fields.map((field, index) => (
//                     <Grid key={field.id}>
//                       <Box display="flex"  gap={1}>
//                         <Controller
//                           name={`addresses.${index}.address`}
//                           control={control}
//                           rules={{ required: true }}
//                           render={({ field }) => (
//                             <TextField
//                               {...field}
//                               required
//                               label={`Address ${index + 1}`}
//                               fullWidth
//                               variant="standard"
//                             />
//                           )}
//                         />
//                         {index > 0 && (
//                           <Button
//                             type="button"
//                             color="error"
//                             size="small"
//                             onClick={() => remove(index)}
//                             sx={{ ml: 1 }}
//                           >
//                             <DeleteIcon/>
//                           </Button>
//                         )}
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>

//                 <Grid size={{xs:4}} mt={1}>
//                   <Button
//                     type="button"
//                     variant="contained"
//                     size="small"
//                     onClick={() => append({address: ""})}
//                     sx={{ color: '#fdb515'}}
//                   >
//                     Add Address
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//           <Card elevation={2} sx={{mt: 2, mb: 2}}>
//             <CardContent>
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                 Department Information
//               </Typography>
//               <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
//                 <Grid size={{ xs: 9 }}>
//                   <Controller
//                     name="departmentInfo.college"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} required label="College" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 9 }}>
//                   <Controller
//                     name="departmentInfo.department"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} required label="Department" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 9 }}>
//                   <Controller
//                     name="departmentInfo.supervisor"
//                     control={control}
//                     rules={{ required: true }}
//                     render={({ field }) => (
//                       <TextField {...field} required label="Supervisor" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 9 }}>
//                   <Controller
//                     name="departmentInfo.admin"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} label="Admin" fullWidth variant="standard" />
//                     )}
//                   />
//                 </Grid>
                
//                 <Grid size={{ xs: 7 }}>
//                   <Controller
//                     name="salary"
//                     control={control}
//                     rules={{ required: true, min: 0 }}
//                     render={({ field }) => (
//                       <FormControl fullWidth>
//                         <InputLabel htmlFor="outlined-adornment-amount">Salary</InputLabel>
//                         <OutlinedInput
//                           {...field}
//                           id="outlined-adornment-amount"
//                           startAdornment={<InputAdornment position="start">$</InputAdornment>}
//                           label="Salary"
//                           type="number"
//                           inputProps={{ min: 0 }}
//                         />
//                       </FormControl>
//                     )}
//                   />
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           <Card elevation={2}>
//             <CardContent>
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                 Current Visa
//               </Typography>
//               <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
//                 <Grid size={{ xs: 18 }}>
//                   <Grid size={{ xs: 7 }}>
//                     <Controller
//                       name="activeVisa.visaType"
//                       control={control}
//                       rules={{ required: "Please select a degree" }}
//                       render={({ field }) => (
//                         <FormControl fullWidth sx={{ m: 1 }}>
//                           <InputLabel id="highest-degree-label">Visa Type</InputLabel>
//                           <Select
//                             {...field}
//                             labelId="activeVisa-label"
//                             label="Highest Degree"
//                           >
//                             {Visatypes.map((type) => (
//                               <MenuItem key={type} value={type}>
//                                 {type}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       )}
//                     />
//                   </Grid>
//                 </Grid>
//                 <Grid size={{ xs: 7 }} ml={1}>
//                   <Controller
//                     control={control}
//                     name="activeVisa.issueDate"
//                     render={({ field }) => (
//                       <DatePicker
//                         label="Issue Date"
//                         value={field.value ? dayjs(field.value) : null}
//                         onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
//                         slotProps={{ textField: { fullWidth: true } }}
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 7 }}>
//                   <Controller
//                     control={control}
//                     name="activeVisa.expireDate"
//                     render={({ field }) => (
//                       <DatePicker
//                         label="Exp Date"
//                         value={field.value ? dayjs(field.value) : null}
//                         onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
//                         slotProps={{ textField: { fullWidth: true } }}
//                       />
//                     )}
//                   />
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//           <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
//             <Button type="submit" variant="contained" sx={{ color: '#fdb515'}}>Create Employee</Button>
//           </Box>
//         </form>
//       </Box>
//     </FormProvider>
//   );
// }


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

interface EmployeeFormProps {
  onClose: () => void;
}

export default function EmployeeForm({ onClose }: EmployeeFormProps) {
  const degrees = ["PhD", "Master", "Bachelor", "Associate", "High School or Equivalent", "Middle School or Lower"];
  const Visatypes = ["J-1", "H-1B", "OPT - 1 Year", "OPT - 3 Years"];

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
      departmentInfo: {
        college: "",
        department: "",
        supervisor: "",
        admin: ""
      },
      activeVisa: {
        visaType: "",
        issueDate: null,
        expireDate: null,
        status: "Active"
      },
      activateStatus: true
    }
  });

  const { control, handleSubmit} = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = (data: EmployeeItem) => {
    console.log(data);
    onClose();
  }

  //   const onSubmit = async (data: EmployeeItem) => {
//   try {
//     await addEmployee(data);
//     console.log(data);
//     onClose(); // 确保请求成功后再关闭
//   } catch (error) {
//     console.error(error);
//   }
// };

//   const addEmployee = async (data: EmployeeItem) => {
//   try {
//     await axios.post(
//       "http://localhost:8000/api/employee/createEmployee",
//       data,
//       { headers: { "Content-Type": "application/json" } }
//     );
//     alert("Employee created successfully!");
//   } catch (error: any) {
//     console.error(error.response?.data || error.message);
//     throw error; // 让 onSubmit catch 到
//   }
// };


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
                    rules={{ required: true }}
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
                <Grid size={{xs: 18}} container spacing={2} columns={18} alignItems="center" justifyContent="space-between">
                  <Grid size={{xs: 12}}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField {...field} required label="Email" fullWidth variant="standard" />
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
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {fields.map((field, index) => (
                    <Grid key={field.id}>
                      <Box display="flex"  gap={1}>
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
                            <DeleteIcon/>
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Grid size={{xs:4}} mt={1}>
                  <Button
                    type="button"
                    variant="contained"
                    size="small"
                    onClick={() => append({address: ""})}
                    sx={{ color: '#fdb515'}}
                  >
                    Add Address
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card elevation={2} sx={{mt: 2, mb: 2}}>
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
                
                <Grid size={{ xs: 7 }}>
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
                <Grid size={{ xs: 18 }}>
                  <Grid size={{ xs: 7 }}>
                    <Controller
                      name="activeVisa.visaType"
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
                <Grid size={{ xs: 7 }} ml={1}>
                  <Controller
                    control={control}
                    name="activeVisa.issueDate"
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
                <Grid size={{ xs: 7 }}>
                  <Controller
                    control={control}
                    name="activeVisa.expireDate"
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
              </Grid>
            </CardContent>
          </Card>
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button type="submit" variant="contained" sx={{ color: '#fdb515'}}>Create Employee</Button>
          </Box>
        </form>
      </Box>
    </FormProvider>
  );
}

