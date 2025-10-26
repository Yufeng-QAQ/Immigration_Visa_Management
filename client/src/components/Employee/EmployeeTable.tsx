import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
} from "@mui/material";
import UpdateEmployeeForm from "./Update";

interface EmployeeTableProps {
  url: string;
  title: string;
  columns: GridColDef[];
  reload?: number;
}

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

import type { EmployeeItem, ActiveVisaItem } from "../../api";

const BASE_URL = "http://localhost:8000/api/";

export default function EmployeeTable({ url, title, columns, reload }: EmployeeTableProps) {
  const [rows, setRows] = useState<EmployeeItem[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [employeeList, setEmployeeList] = useState<EmployeeSummary[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSummary | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const showEmployee = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:8000/api/employee/getEmployee");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      const summary: EmployeeSummary[] = data.map((emp: EmployeeItem) => ({
        _id: emp._id,
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
        visaHistory: emp.visaHistory.map((visa: ActiveVisaItem) => ({
          visaType: visa.visaType,
          validPeriod: {
            startDate: visa.issueDate,
            expireDate: visa.expireDate
          }
        })),
        activateStatus: emp.activateStatus || false
      }));

      setEmployeeList(summary);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to fetch data:", err.message);
        setError(err.response?.data?.error || err.message);
      } else {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to fetch data:", err.message);
        setError(err.response?.data?.error || err.message);
      } else {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data");
      }
    }
  };

  useEffect(() => {
    showEmployee();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axios.get(`${BASE_URL}${url}`);
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];

        setRows(raw);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Failed to fetch data:", err.message);
          setError(err.response?.data?.error || err.message);
        } else {
          console.error("Failed to fetch data:", err);
          setError("Failed to fetch data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, reload]);

  return (
    <Card>
      <Box p={2} lineHeight={1}>
        <Grid>
          {title && <Typography variant="h2" mb={2}>{title}</Typography>}
        </Grid>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <DataGrid
                loading={isloading}
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id || row.id}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                disableColumnResize
                onRowClick={(params) => handleShowDetails(params.row._id)}
              />
            </Grid>
          </Grid>
        )}
      </Box>
      {/*Format */}
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
                  <Typography key={idx}>{addr}</Typography>
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
    </Card>
  );
};
