import { useEffect, useState } from "react";
import axios from "axios";
import UpdateEmployeeForm from "./Update";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,Grid,TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useForm, useFieldArray, Controller, FormProvider } from "react-hook-form";
import { calculateDaysLeft } from "../../util";
import type { EmployeeItem, ActiveVisaItem, AddressItem } from "../../api";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';


interface VisaRecord {
  visaType: string;
  validPeriod?: {
    startDate?: string;
    expireDate?: string;
  };
}

interface Department {
  _id: string;
  collegeName: string;
  departmentName: string;
  supervisor?: string;
  admin?: string;
}

interface EmployeeSummary {
  _id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  email: string;
  addresses: string[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  department?: Department | null;
  visaHistory: VisaRecord[];
  activateStatus: boolean;
}

export default function Display() {
    const [employeeList, setEmployeeList] = useState<EmployeeSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSummary | null>(null);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    
    const showEmployee = async () => {
        try {
          setLoading(true);
          const res = await axios.get("http://localhost:8000/api/employee/getEmployee");
          const data = Array.isArray(res.data) ? res.data : res.data.data || [];
    
          const summary: EmployeeSummary[] = data.map((emp: any) => ({
            _id: emp._id || emp.employeeId,
            employeeId: emp.employeeId,
            firstName: emp.firstName,
            middleName: emp.middleName || "",
            lastName: emp.lastName,
            dateOfBirth: emp.dateOfBirth || "",
            email: emp.email,
            addresses: emp.addresses || [],
            salary: emp.salary || 0,
            positionTitle: emp.positionTitle || "",
            highestDegree: emp.highestDegree || "",
            department: emp.departmentInfo
              ? {
                  _id: "", 
                  collegeName: emp.departmentInfo.college,
                  departmentName: emp.departmentInfo.department,
                  supervisor: emp.departmentInfo.supervisor,
                  admin: emp.departmentInfo.admin
                }
              : null,
            visaHistory: emp.visaHistory.map((visa: any) => ({
              visaType: visa.visaType,
              validPeriod: {
                startDate: visa.issueDate,
                expireDate: visa.expireDate
              }
            })),
            activateStatus: emp.activateStatus || false
          }));
    
          setEmployeeList(summary);
        } catch (err: any) {
          console.error("Failed to fetch employees:", err);
        } finally {
          setLoading(false);
        }
      };

    type InputValue = string | Date | null;


interface FlexibleInputEvent {
  target: {
    name: string;
    value: InputValue;
  };
}


const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | FlexibleInputEvent
) => {
  if (!selectedEmployee) return;
  const { name, value } = e.target;

  if (name.includes('.')) {
    const keys = name.split('.');
    setSelectedEmployee(prev => {
      if (!prev) return prev;
      const nested: any = { ...prev };
      let current = nested;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value; 
      return nested as EmployeeSummary;
    });
  } else {
    setSelectedEmployee(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value } as EmployeeSummary;
    });
  }
};




    useEffect(() => {
        showEmployee();
    }, []);

    const handleShowDetails = (id: string) => {
        const emp = employeeList.find((e) => e._id === id);
        if (emp) {
          setSelectedEmployee(emp);
          setOpen(true);
        }
      };
      
      const deleteEmployee = async (id: string) => {
        try {
          await axios.delete(`http://localhost:8000/api/employee/deleteEmployee/${id}`);
          alert("Employee deleted successfully!");
          showEmployee(); 
          setOpen(false); 
        } catch (error: any) {
          console.error(error.response?.data || error.message);
        }
      };

      const handleAddressChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            index: number
        ) => {
            const { value } = e.target;
            setSelectedEmployee(prev => {
                if (!prev) return prev;
                const newAddresses = [...prev.addresses];
                newAddresses[index] = value;
                return { ...prev, addresses: newAddresses };
            });
        };

       



const handleVisaHistoryChange = (
    index: number,
    field: "startDate" | "expireDate" | "visaType",
    value: string | Date | null
    ) => {
    setSelectedEmployee(prev => {
        if (!prev) return prev;

        const newVisaHistory = [...prev.visaHistory];

        if (field === "startDate" || field === "expireDate") {
        newVisaHistory[index] = {
            ...newVisaHistory[index],
            validPeriod: {
            ...newVisaHistory[index].validPeriod,
            [field]: value, 
            },
        };
        } else {
        newVisaHistory[index] = {
            ...newVisaHistory[index],
            visaType: value ? String(value) : "",
        };
        }

        return {
        ...prev,
        visaHistory: newVisaHistory,
        };
    });
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedEmployee) return;

  try {
    setLoading(true);

    
    const dataToSubmit = {
      _id: selectedEmployee._id,
      employeeId: selectedEmployee.employeeId,
      firstName: selectedEmployee.firstName,
      middleName: selectedEmployee.middleName || "",
      lastName: selectedEmployee.lastName,
      dateOfBirth: selectedEmployee.dateOfBirth || "",
      email: selectedEmployee.email,
      addresses: selectedEmployee.addresses || [],
      salary: selectedEmployee.salary || 0,
      positionTitle: selectedEmployee.positionTitle || "",
      highestDegree: selectedEmployee.highestDegree || "",
      departmentInfo: selectedEmployee.department
        ? {
            college: selectedEmployee.department.collegeName,
            department: selectedEmployee.department.departmentName,
            supervisor: selectedEmployee.department.supervisor,
            admin: selectedEmployee.department.admin
          }
        : null,
      
      activeVisa: selectedEmployee.visaHistory?.[0]
        ? {
            visaType: selectedEmployee.visaHistory[0].visaType,
            issueDate: selectedEmployee.visaHistory[0].validPeriod?.startDate
              ? new Date(selectedEmployee.visaHistory[0].validPeriod.startDate)
              : null,
            expireDate: selectedEmployee.visaHistory[0].validPeriod?.expireDate
              ? new Date(selectedEmployee.visaHistory[0].validPeriod.expireDate)
              : null,
            status: "Active"
          }
        : null,
      activateStatus: selectedEmployee.activateStatus || false
    };

    console.log("Submitting employee data:", dataToSubmit);

    await axios.put(
      `http://localhost:8000/api/employee/updateEmployee/${selectedEmployee._id}`,
      dataToSubmit,
      { headers: { "Content-Type": "application/json" } }
    );

    setEditMode(false);
    showEmployee();
  } catch (err) {
    console.error("Failed to update employee:", err);
  } finally {
    setLoading(false);
  }
};


    if (loading) return <div>Loading...</div>;

      return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
        Employee List
      </Typography>

      {employeeList.length === 0 ? (
        <Typography>No employee data available</Typography>
      ) : (
        employeeList.map((employee) => (
          <Box
            key={employee._id}
            sx={{
              marginBottom: 2,
              border: "1px solid #ccc",
              padding: 2,
              borderRadius: 1,
              cursor: "pointer",
            }}
            onClick={() => handleShowDetails(employee._id)}
          >
            <Typography variant="h6">
              {employee.firstName} {employee.lastName}
            </Typography>
            {employee.visaHistory.length > 0 ? (
              <List dense>
                {employee.visaHistory.map((visa, idx) => {
                  const expire = visa.validPeriod?.expireDate
                    ? new Date(visa.validPeriod.expireDate).toLocaleDateString()
                    : "N/A";
                  const days = visa.validPeriod?.expireDate
                    ? calculateDaysLeft(visa.validPeriod.expireDate)
                    : "-";
                  return (
                    <ListItem key={idx}>
                      <ListItemText primary={visa.visaType || "Unknown"} secondary={`Expires: ${expire} (${days} days left)`} />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No visa records
              </Typography>
            )}
          </Box>
        ))
      )}

        <Button variant="contained" onClick={showEmployee} sx={{ mt: 2 }}>
            Refresh Data
        </Button>
        
        <Dialog open={open} onClose={() => {setOpen(false);setEditMode(false); }} fullWidth maxWidth="lg">
            <DialogTitle>Employee Details</DialogTitle>
            <DialogContent>
                <Card elevation={2}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                            Basic Information
                        </Typography>
                            
                            <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>

                                {/* First Name */}
                                <Grid size={{ xs: 7 }}>
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.firstName || ""}
                                        onChange={e => handleInputChange(e)}
                                        InputProps={{ readOnly: !editMode }}
                                    />
                                </Grid>

                                {/* MiddleName */}
                                <Grid size={{ xs: 4 }}>
                                    <TextField
                                        label="Middle Name"
                                        name="middleName"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.middleName || ""}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                    />
                                </Grid>

                                {/* LastName */}
                                <Grid size={{ xs: 7 }}>
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.lastName || ""}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                    />
                                </Grid>

                                {/* ID */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Employee ID"
                                        name="employeeId"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.employeeId || ""}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                    />
                                </Grid>

                                {/* Postion Title */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Postion Title"
                                        name="positionTitle"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.positionTitle || ""}
                                        onChange={handleInputChange}
                                        InputProps={{ readOnly: !editMode }}
                                    />
                                </Grid>

                                {/* Date of Birth */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>

                                    <Grid size={{ xs: 6 }}>
                                        <DatePicker
                                        label="Date of Birth"
                                        value={selectedEmployee?.dateOfBirth ? dayjs(selectedEmployee.dateOfBirth) : null}
                                        onChange={(newValue) => {
                                            if (editMode) handleInputChange({
                                            target: { name: "dateOfBirth", value: newValue?.toDate() || null }
                                            });
                                        }}
                                        slotProps={{
                                            textField: {
                                            fullWidth: true,
                                            variant: "standard",
                                            InputProps: { readOnly: !editMode }
                                            }
                                        }}
                                        />
                                    </Grid>
                                </LocalizationProvider>


                                <Grid size={{xs: 18}} container spacing={2} columns={18} alignItems="center" justifyContent="space-between">

                                    {/* Email */}
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            fullWidth
                                            variant="standard"
                                            value={selectedEmployee?.email|| ""}
                                            onChange={handleInputChange}
                                            InputProps={{ readOnly: !editMode }}
                                        />
                                    </Grid>
                                    <Grid size ={{xs:6}} mb ={2}>
                                      <FormControl fullWidth sx={{m:0}}>
                                        <InputLabel>Highest Degree</InputLabel>
                                        <Select
                                          name="highestDegree"
                                          value={selectedEmployee?.highestDegree|| ""}
                                          onChange={handleInputChange}
                                          variant="standard"
                                          disabled={!editMode} 
                                        >
                                        <MenuItem value = "Middle School or Lower">Middle School</MenuItem>
                                        <MenuItem value = "High School or Equivalent">High School</MenuItem>
                                        <MenuItem value = "Associate">Associate</MenuItem>
                                        <MenuItem value = "Bachelor">Bachelor</MenuItem>
                                        <MenuItem value = "Master">Master</MenuItem>
                                        <MenuItem value = "PhD">PhD</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>

                                </Grid>

                                <Grid size={{ xs: 12 }}>

                                    {selectedEmployee?.addresses && selectedEmployee.addresses.length > 0 ? (
                                        selectedEmployee.addresses.map((addr: string | { address: string }, idx: number) => {
                                        const value = typeof addr === "string" ? addr : addr.address;

                                        return (
                                            <Box key={idx} sx={{ mb: 1 }}>
                                            <TextField
                                                label={`Address ${idx + 1}`}
                                                fullWidth
                                                variant="standard"
                                                value={value}
                                                onChange={e => handleAddressChange(e, idx)}
                                                InputProps={{ readOnly: !editMode }}
                                            />
                                            </Box>
                                        );
                                        })
                                    ) : (
                                        <Typography>No addresses</Typography>
                                    )}
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
                                <TextField
                                    label="College"
                                    name="department.collegeName"
                                    value={selectedEmployee?.department?.collegeName || ""}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="standard"
                                    InputProps={{ readOnly: !editMode }}
                                />

                            </Grid>

                            <Grid size={{ xs: 9 }}>
                                <TextField
                                    label="Department"
                                    name="department.departmentName"
                                    value={selectedEmployee?.department?.departmentName || ""}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="standard"
                                    InputProps={{ readOnly: !editMode }}
                                />
                            </Grid>

                            <Grid size={{ xs: 9 }}>
                                <TextField
                                    label="Supervisor"
                                    name="department.supervisor"
                                    value={selectedEmployee?.department?.supervisor || ""}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="standard"
                                    InputProps={{ readOnly: !editMode }}
                                />
                            </Grid>

                            <Grid size={{ xs: 9 }}>
                                <TextField
                                    label="Admin"
                                    name="department.admin"
                                    value={selectedEmployee?.department?.admin || ""}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="standard"
                                    InputProps={{ readOnly: !editMode }}
                                />
                            </Grid>
                            
                            <Grid size={{ xs: 7 }}>
                                <TextField
                                    label="Salary"
                                    name="salary"
                                    fullWidth
                                    variant="standard"
                                    value={selectedEmployee?.salary|| "0"}
                                    onChange={handleInputChange}
                                    InputProps={{ readOnly: !editMode }}
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
                                    <FormControl fullWidth sx={{m:0}}>
                                      <InputLabel>Visa Type</InputLabel>
                                      <Select
                                          name="VisaType"
                                          value={selectedEmployee?.visaHistory[0]?.visaType|| ""}
                                          onChange={e => handleVisaHistoryChange(0, "visaType", e.target.value)}
                                          variant="standard"
                                          disabled={!editMode} 
                                        >
                                          <MenuItem value="F1">F1</MenuItem>
                                          <MenuItem value="J1">J1</MenuItem>
                                          <MenuItem value="H1B">H1B</MenuItem>
                                          <MenuItem value="OPT">OPT</MenuItem>

                                        </Select>
                                    </FormControl>


      

                                    
                                </Grid>
                            </Grid>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid size={{ xs: 7 }}>
                                <DatePicker
                                label="Issue Date"
                                value={
                                    selectedEmployee?.visaHistory?.[0]?.validPeriod?.startDate
                                    ? dayjs(selectedEmployee.visaHistory[0].validPeriod.startDate)
                                    : null
                                }
                                onChange={(newValue) =>
                                    editMode && handleVisaHistoryChange(0, "startDate", newValue?.toDate() || null)
                                }
                                slotProps={{
                                    textField: {
                                    fullWidth: true,
                                    variant: "standard",
                                    InputProps: { readOnly: !editMode }
                                    }
                                }}
                                />
                            </Grid>


                            <Grid size={{ xs: 7 }}>
                                <DatePicker
                                label="Expire Date"
                                value={
                                    selectedEmployee?.visaHistory?.[0]?.validPeriod?.expireDate
                                    ? dayjs(selectedEmployee.visaHistory[0].validPeriod.expireDate)
                                    : null
                                }
                                onChange={(newValue) =>
                                    editMode && handleVisaHistoryChange(0, "expireDate", newValue?.toDate() || null)
                                }
                                slotProps={{
                                    textField: {
                                    fullWidth: true,
                                    variant: "standard",
                                    InputProps: { readOnly: !editMode }
                                    }
                                }}
                                />
                            </Grid>
                        </LocalizationProvider>
                        </Grid>
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
  {!editMode && (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setEditMode(true)}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
            if (selectedEmployee?._id) {
            const confirmDelete = window.confirm(
                "Are you sure you want to delete this employee?"
            );
            if (confirmDelete) {
                deleteEmployee(selectedEmployee._id);
            }
            }
        }}
        >
        Delete
    </Button>

    </>
  )}

  {editMode && (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={(e) => {
            handleSubmit(e);

            }}
        >
        Save
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
            setEditMode(false);
            setOpen(false);
        }}
        >
        Cancel
        </Button>
    </>
  )}
</Box>

            </DialogActions>
        </Dialog>

        </Container>
      );
}
