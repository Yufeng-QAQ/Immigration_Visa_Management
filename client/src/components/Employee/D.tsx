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
  CardContent,Grid,TextField
} from "@mui/material";
import { useForm, useFieldArray, Controller, FormProvider } from "react-hook-form";
import { calculateDaysLeft } from "../../util";

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
        
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
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
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.firstName || ""}
                                        slotProps={{
                                            input: { readOnly: true },
                                        }}
                                    />
                                </Grid>

                                {/* MiddleName */}
                                <Grid size={{ xs: 4 }}>
                                    <TextField
                                        label="Middle Name"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.middleName || ""}
                                        slotProps={{
                                            input: { readOnly: true },
                                        }}
                                    />
                                </Grid>

                                {/* LastName */}
                                <Grid size={{ xs: 7 }}>
                                    <TextField
                                        label="Last Name"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.lastName || ""}
                                        slotProps={{
                                            input: { readOnly: true },
                                        }}
                                    />
                                </Grid>

                                {/* ID */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Employee ID"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.employeeId || ""}
                                        slotProps={{
                                            input: { readOnly: true },
                                        }}
                                    />
                                </Grid>

                                {/* Postion Title */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Postion Title"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.positionTitle || ""}
                                        slotProps={{
                                            input: { readOnly: true },
                                        }}
                                    />
                                </Grid>

                                {/* Date of Birth */}
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        label="Date of Birth"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.dateOfBirth ? new Date(selectedEmployee.dateOfBirth).toLocaleDateString() : "N/A"}
                                        slotProps={{
                                            input: { readOnly: true },
                                        }}
                                    />
                                </Grid>

                                <Grid size={{xs: 18}} container spacing={2} columns={18} alignItems="center" justifyContent="space-between">

                                    {/* Email */}
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            variant="standard"
                                            value={selectedEmployee?.email|| ""}
                                            slotProps={{
                                                input: { readOnly: true },
                                            }}
                                        />
                                    </Grid>
                                        
                                    {/* Degree */}
                                    <Grid size={{ xs: 6 }} mb={2}>
                                        <TextField
                                            label="HighestDegree"
                                            fullWidth
                                            variant="standard"
                                            value={selectedEmployee?.highestDegree|| ""}
                                            slotProps={{
                                                input: { readOnly: true },
                                            }}
                                        />
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
                                                slotProps={{ input: { readOnly: true } }}
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
                                    fullWidth
                                    variant="standard"
                                    value={selectedEmployee?.department?.collegeName|| ""}
                                    slotProps={{
                                    input: { readOnly: true },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 9 }}>
                                <TextField
                                    label="Department"
                                    fullWidth
                                    variant="standard"
                                    value={selectedEmployee?.department?.departmentName|| ""}
                                    slotProps={{
                                    input: { readOnly: true },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 9 }}>
                                <TextField
                                    label="Supervisor"
                                    fullWidth
                                    variant="standard"
                                    value={selectedEmployee?.department?.supervisor|| ""}
                                    slotProps={{
                                    input: { readOnly: true },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 9 }}>
                                <TextField
                                    label="Admin"
                                    fullWidth
                                    variant="standard"
                                    value={selectedEmployee?.department?.admin|| ""}
                                    slotProps={{
                                    input: { readOnly: true },
                                    }}
                                />
                            </Grid>
                            
                            <Grid size={{ xs: 7 }}>
                                <TextField
                                    label="Salary"
                                    fullWidth
                                    variant="standard"
                                    value={selectedEmployee?.salary|| "0"}
                                    slotProps={{
                                    input: { readOnly: true },
                                    }}
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
                                    <TextField
                                        label="VisaType"
                                        fullWidth
                                        variant="standard"
                                        value={selectedEmployee?.visaHistory[0].visaType|| ""}
                                        slotProps={{
                                        input: { readOnly: true },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 7 }}>
                                <TextField
                                    label="Issue Date"
                                    fullWidth
                                    variant="standard"
                                    value={
                                    selectedEmployee?.visaHistory[0]?.validPeriod?.startDate
                                        ? new Date(selectedEmployee.visaHistory[0].validPeriod.startDate).toLocaleDateString()
                                        : ""
                                    }
                                    InputProps={{
                                    readOnly: true,
                                    }}
                                />
                            </Grid>


                            <Grid size={{ xs: 7 }}>
                                <TextField
                                    label="Expire Date"
                                    fullWidth
                                    variant="standard"
                                    value={
                                    selectedEmployee?.visaHistory[0]?.validPeriod?.expireDate
                                        ? new Date(selectedEmployee.visaHistory[0].validPeriod.expireDate).toLocaleDateString()
                                        : ""
                                    }
                                    InputProps={{
                                    readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>

                <Button 
                    variant="contained"
                    onClick={() => {
                        setEditOpen(true);
                        setOpen(false);
                    }}
                >Edit</Button>

                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                    if (selectedEmployee?._id && window.confirm("Are you sure you want to delete this employee?")) {
                        deleteEmployee(selectedEmployee._id);
                    }
                    }}
                >Delete</Button>
            </DialogActions>
        </Dialog>

        <UpdateEmployeeForm
            open={editOpen}
            employeeId={selectedEmployee?._id || ""}
            onClose={() => setEditOpen(false)}
            onSuccess={() => {
            setEditOpen(false);
            showEmployee();
            }}
        />
        </Container>
      );
}
