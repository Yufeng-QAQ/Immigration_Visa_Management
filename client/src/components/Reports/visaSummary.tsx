import api from "../../api/axios";
import { useEffect, useState } from "react";
import { 
    Box, 
    Card,
    CardContent,
    Grid,
    FormControl,
    Typography,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller, FormProvider } from "react-hook-form";
import { AxiosError } from "axios";
import type { EmployeeItem } from "../../api";
import CloseIcon from "@mui/icons-material/Close";
import EmployeeTable from "../Employee/EmployeeTable";
import type { GridColDef } from "@mui/x-data-grid";
import VisaStatsDisplay from "../Reports/visaDisplay"

type ReportItem = {
  visaType: string;
  highestDegree: string;
  countryOfBirth: string;
  salaryFrom: number | null;
  salaryTo: number | null;
  fromDate: Date | null;
  toDate: Date | null;
  admin: string;
  college: string;
  department: string;
};


export default function VisaStatsComponent() {
  const [degrees, setDegrees] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [visaTypes, setVisaTypes] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [colleges, setcolleges] = useState<string[]>([]);
  const [rows, setRows] = useState<EmployeeItem[]>([]);
  const employeeColumns: GridColDef<EmployeeItem>[] = [
      { field: "employeeId", headerName: "Employee ID", width: 130 },
      { field: "firstName", headerName: "First Name", width: 150 },
      { field: "lastName", headerName: "Last Name", width: 150 },
      { field: "salary", headerName: "Salary", width: 130 },
      {
        field: "college", headerName: "college", width: 150,
        valueGetter: (_, row) => {
          const college = row.departmentInfo?.college;
          return college ? college : "N/A";
        }
      },
      {
        field: "department", headerName: "department", width: 150,
        valueGetter: (_, row) => {
          const department = row.departmentInfo?.department;
          return department ? department : "N/A";
        }
      },
      {
        field: "visaType", headerName: "Visa Type", width: 150,
        valueGetter: (_, row) => {
          const visaType = row.visaHistory[0]?.visaType;
          return visaType ? visaType : "N/A";
        }
      },
      {
        field: "expireDate", headerName: "Exp Date", width: 150,
        valueGetter: (_, row) => {
          const date = row.visaHistory[0]?.expireDate;
          return date ? new Date(date).toLocaleDateString("en-US") : "N/A";
        }
      },
    ]
  const methods = useForm<ReportItem>({
    defaultValues: {
        visaType: "",
        highestDegree: "",
        countryOfBirth: "",
        salaryFrom: null,
        salaryTo: null,
        fromDate: null,
        toDate: null,
        admin: "",
        college: "",
        department: "",
    }
    })
    const {control, handleSubmit } = methods;
    const onSubmit = async (data: ReportItem) => {
      try {
        const res = await api.post(
          "/employee/visaStats",
          data,
        )
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];
        setRows(raw);
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("employee/getEmployee");
        const employees: EmployeeItem[] = Array.isArray(res.data) ? res.data : res.data.data || [];
        setDegrees(
          Array.from(
            new Set(employees.map(emp => emp.highestDegree).filter(Boolean))
          )
        );
        setDepartments(
          Array.from(
            new Set(employees.map(emp => emp.departmentInfo.department).filter(Boolean))
          )
        );
        setVisaTypes(
          Array.from(
            new Set(employees.map(emp => emp.visaHistory?.[emp.visaHistory.length - 1]?.visaType).filter(Boolean))
            )
        );
        setCountries(
          Array.from(
            new Set(employees.map(emp => emp.countryOfBirth).filter(Boolean))
          )
        );
        setAdmins(
          Array.from(
            new Set(employees.map(emp => emp.departmentInfo?.admin).filter((admin): admin is string => !!admin))
          )
        );
        setcolleges(
          Array.from(
            new Set(employees.map(emp => emp.departmentInfo.college).filter(Boolean))
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Grid container columns={{xs: 18}}>
        <Grid size={{xs: 18, md:13}}>
          <FormProvider {...methods}>
            <Box   display={"flex"}>
              <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardContent>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Report 
                </Typography>
                <Grid container spacing={2} columns={{ xs: 18, md: 18 }} sx={{ mb: 2 }}>
                <Grid size={{ xs: 4 }}>
                  <Controller
                    name="fromDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Start from"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true, helperText: "",
                        InputProps: {
                          endAdornment: field.value ? (
                            <CloseIcon
                              onClick={() => field.onChange(null)}
                              sx={{ cursor: "pointer", ml: 1 }}
                            />
                          ) : undefined,
                        },
                        } }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Controller
                    name="toDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Ends at"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date: Dayjs | null) => field.onChange(date?.toDate() || null)}
                        slotProps={{ textField: { fullWidth: true ,
                        InputProps: {
                          endAdornment: field.value ? (
                            <CloseIcon
                              onClick={() => field.onChange(null)}
                              sx={{ cursor: "pointer", ml: 1 }}
                            />
                          ) : undefined,
                        },
                        } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid size={{ xs: 5 }}>
                    <Controller
                        name="visaType"
                        control={control}
                        render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <InputLabel id="visa-type-label">Visa Type</InputLabel>
                        <Select
                          {...field}
                          labelId="visa-type-label"
                          label="Visa Type"
                        >
                          {visaTypes.map((visa) => (
                            <MenuItem key={visa} value={visa}>
                              {visa}
                            </MenuItem>
                          ))}
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                        )}
                    />
                </Grid>


                <Grid size={{ xs: 5 }} mb={2}>
                  <Controller
                    name="highestDegree"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 0 }}>
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
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Controller
                        name="countryOfBirth"
                        control={control}
                        render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <InputLabel id="country-label">Country of Birth</InputLabel>
                        <Select
                          {...field}
                          labelId="country-label"
                          label="Country of Birth"
                        >
                          {countries.map((coun) => (
                            <MenuItem key={coun} value={coun}>
                              {coun}
                            </MenuItem>
                          ))}
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Controller
                    name="salaryFrom"
                    control={control}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        fullWidth
                        label="Salary From"
                        />
                    )}
                    />
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Controller
                    name="salaryTo"
                    control={control}
                    render={({ field }) => (
                        <TextField
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        fullWidth
                        label="Salary To"
                        />
                    )}
                    />
                </Grid>            
                
                <Grid size={{ xs: 4 }}>
                    <Controller
                        name="admin"
                        control={control}
                        render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <InputLabel id="admin-label">Admin</InputLabel>
                        <Select
                          {...field}
                          labelId="admin-label"
                          label="Admin"
                        >
                          {admins.map((ad) => (
                            <MenuItem key={ad} value={ad}>
                              {ad}
                            </MenuItem>
                          ))}
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 4 }}>
                    <Controller
                        name="college"
                        control={control}
                        render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <InputLabel id="college-label">College</InputLabel>
                        <Select
                          {...field}
                          labelId="college-label"
                          label="College"
                        >
                          {colleges.map((col) => (
                            <MenuItem key={col} value={col}>
                              {col}
                            </MenuItem>
                          ))}
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <InputLabel id="departmentlabel">Department</InputLabel>
                        <Select
                          {...field}
                          labelId="department-label"
                          label="Department"
                        >
                          {departments.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                              {dept}
                            </MenuItem>
                          ))}
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                        )}
                    />
                </Grid>            
                  <Button variant="contained" color="primary" type="submit" sx={{ width: 100}}>
                        Find
                  </Button>
              </Grid>
              </CardContent>
              </Card>
              </form>
            </Box>
          </FormProvider>
          <Card>
              <CardContent>
                <Grid container spacing={2}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Total Number of cases found: {rows.length}
                </Typography>
                <Grid size={{ xs: 12}} sx={{cursor: "pointer" }}>
                  <EmployeeTable
                    title=""
                    url="employee/getEmployee"
                    columns={employeeColumns}
                    initialSort="daysRemain"
                    change={false}
                    passedRows={rows}
                  />
                  </Grid>
                </Grid>
              </CardContent>
          </Card>
        </Grid>
        <Grid size={{xs:18, md:5}}>
          <Box>
            <Card sx={{ml:1}}>
              <VisaStatsDisplay searchResult={rows}/>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
