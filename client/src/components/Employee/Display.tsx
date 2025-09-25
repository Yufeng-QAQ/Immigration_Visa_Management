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
} from "@mui/material";

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

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface EmployeeSummary {
  _id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  email: string;
  addresses: Address[];
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
  const [error, setError] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSummary | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const showEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
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
        department: emp.department || null,
        visaHistory: emp.visaHistory || [],
        activateStatus: emp.activateStatus || false,
      }));

      setEmployeeList(summary);
    } catch (err: any) {
      console.error("Failed to fetch employees:", err);
      setError(err.response?.data?.error || "Failed to fetch employee information");
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

  const calculateDaysLeft = (expireDate?: string) => {
    if (!expireDate) return "-";
    const diff = new Date(expireDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee ? (
            <Box>
              <Typography variant="h6">
                {selectedEmployee.firstName} {selectedEmployee.middleName} {selectedEmployee.lastName}
              </Typography>
              <Typography>
                Date of Birth: {selectedEmployee.dateOfBirth ? new Date(selectedEmployee.dateOfBirth).toLocaleDateString() : "N/A"}
              </Typography>
              <Typography>Email: {selectedEmployee.email}</Typography>
              <Typography>Position: {selectedEmployee.positionTitle}</Typography>
              <Typography>Highest Degree: {selectedEmployee.highestDegree}</Typography>
              <Typography>Salary: ${selectedEmployee.salary}</Typography>
              <Typography>
                Department: {selectedEmployee.department ? `${selectedEmployee.department.collegeName} - ${selectedEmployee.department.departmentName}` : "N/A"}
              </Typography>
              <Typography>Activate Status: {selectedEmployee.activateStatus ? "Active" : "Inactive"}</Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Addresses:
              </Typography>
              {selectedEmployee.addresses.length > 0 ? (
                selectedEmployee.addresses.map((addr, idx) => (
                  <Typography key={idx}>
                    {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                  </Typography>
                ))
              ) : (
                <Typography>No addresses</Typography>
              )}

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Visa History:
              </Typography>
              {selectedEmployee.visaHistory.length === 0 ? (
                <Typography>No visa records</Typography>
              ) : (
                <List dense>
                  {selectedEmployee.visaHistory.map((visa: VisaRecord, idx: number) => {
                    const start = visa.validPeriod?.startDate
                      ? new Date(visa.validPeriod.startDate).toLocaleDateString()
                      : "N/A";
                    const expire = visa.validPeriod?.expireDate
                      ? new Date(visa.validPeriod.expireDate).toLocaleDateString()
                      : "N/A";
                    return (
                      <ListItem key={idx}>
                        <ListItemText primary={visa.visaType || "Unknown"} secondary={`${start} - ${expire}`} />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          ) : (
            <Typography>No employee selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditOpen(true);
              setOpen(false);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (selectedEmployee?._id && window.confirm("Are you sure you want to delete this employee?")) {
                deleteEmployee(selectedEmployee._id);
              }
            }}
            >
            Delete
          </Button>
  
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


