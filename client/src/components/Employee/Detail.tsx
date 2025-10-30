import { useEffect, useState } from "react";
import axios from "axios";
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
  CardContent, Grid, TextField,
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

import DeleteIcon from '@mui/icons-material/Delete';

import EmployeeList from "./EmployeeList";
import EmployeeBasicInfo from "./employee_profile/EmployeeBasicInfo";
import DepartmentInfo from "./employee_profile/DepartmentInfo";
import VisaInfo from "./employee_profile/VisaInfo";
import { VisaHistoryInfo } from "./employee_profile/VisaHistoryInfo";


type VisaRecord = {
  _id?: string;
  visaType: string;
  validPeriod: {
    startDate: Date | null;
    expireDate: Date | null;
  };
  status?: string;
};




interface Department {
  _id: string;
  collegeName: string;
  departmentName: string;
  supervisor?: string;
  admin?: string;
}

interface CommentType {
  _id?: string;
  record: string;
  content: string;
  date: string;
}

interface EmployeeSummary {
  _id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  email: string;
  countryOfBirth: string;
  addresses: string[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  department?: Department | null;
  visaHistory: VisaRecord[];
  activateStatus: boolean;
  comment: CommentType[];
}

interface HistoryVisa {
  visaId: string;
  visaType: string;
  status: string;
  comments: CommentType[];
}

interface ImportEmp {
  empId: string | null;
  open: boolean;
  onClose: () => void;
  onValueChange: () => void;
  change: boolean;
}

export default function EmpDetail({ empId, open, onClose, onValueChange, change }: ImportEmp) {
  const [employeeList, setEmployeeList] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSummary | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [initialEmployeeData, setInitialEmployeeData] = useState<EmployeeSummary | null>(null);
  const [newComment, setNewComment] = useState("");
  const [currentComments, setVisaComments] = useState<CommentType[]>([]);
  //const [historyVisaComments, setHistoryVisaComments] = useState<Record<string, CommentType[]>>({});
  const [historyVisaComments, setHistoryVisaComments] = useState<HistoryVisa[]>([]);


  const showEmployee = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/employee/getEmployee");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      const summary: EmployeeSummary[] = data.map((emp: any) => ({
        _id: emp._id || emp.employeeId,
        employeeId: emp.employeeId,
        firstName: emp.firstName,
        countryOfBirth: emp.countryOfBirth,
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
          _id: visa._id,
          visaType: visa.visaType,
          validPeriod: {
            startDate: visa.issueDate,
            expireDate: visa.expireDate
          },
          status: visa.status || undefined
        })),
        activateStatus: emp.activateStatus || false,

        comment: emp.comments?.map((c: any) => ({
          content: c.content,
          date: c.date
        })) || []

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

  useEffect(() => {
    showEmployee();
  }, [change]);

  const handleShowDetails = () => {
    const emp = employeeList.find((e) => e._id === empId);
    if (emp) {
      setSelectedEmployee(emp);
      setInitialEmployeeData(emp);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/employee/deleteEmployee/${id}`);
      showEmployee();
      onValueChange();
      onClose();
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

  const handleAddAddress = () => {
    setSelectedEmployee((prev) => {
      if (!prev) return prev;
      const newAddresses = [...(prev.addresses || []), ""];
      return { ...prev, addresses: newAddresses };
    });
  };

  const handleRemoveAddress = (index: number) => {
    setSelectedEmployee((prev) => {
      if (!prev) return prev;
      const newAddresses = [...(prev.addresses || [])];
      newAddresses.splice(index, 1);
      return { ...prev, addresses: newAddresses };
    });
  };

  const handleCancel = () => {
    if (initialEmployeeData) {
      setSelectedEmployee(initialEmployeeData);
    }
    setEditMode(false);
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
        countryOfBirth: selectedEmployee.countryOfBirth,
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
        activateStatus: selectedEmployee.activateStatus || false,
        comment: selectedEmployee.comment || "",
      };

      console.log("Submitting employee data:", dataToSubmit);

      await axios.put(
        `http://localhost:8000/api/employee/updateEmployee/${selectedEmployee._id}`,
        dataToSubmit,
        { headers: { "Content-Type": "application/json" } }
      );

      setEditMode(false);
      onValueChange();

    } catch (err) {
      console.error("Failed to update employee:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedEmployee) return;
    if (!newComment.trim()) return;

    const lastVisaIndex = selectedEmployee.visaHistory.length - 1;
    if (lastVisaIndex < 0) {
      alert("No visa found for this employee.");
      return;
    }

    const visaId = selectedEmployee.visaHistory[lastVisaIndex]._id;
    if (!visaId) {
      alert("Visa ID is missing.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/employee/${selectedEmployee._id}/comments`,
        {
          visaId,
          content: newComment
        }
      );


      setSelectedEmployee(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comment: [...prev.comment, response.data.comment]
        };
      });

      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment. See console for details.");
    }
  };

  const fetchVisaComments = async () => {
    if (!selectedEmployee || !selectedEmployee.visaHistory?.length) return;

    const currentVisaId = selectedEmployee.visaHistory[selectedEmployee.visaHistory.length - 1]._id;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/${selectedEmployee._id}/comments/${currentVisaId}`
      );

      setVisaComments(response.data.comments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVisaComments();
  }, [selectedEmployee]);

  useEffect(() => {
    if (!selectedEmployee?._id) return;

    const fetchHistoryComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/employee/${selectedEmployee._id}/history-comments`
        );
        console.log("Fetched history:", res.data.history);
        setHistoryVisaComments(res.data.history || []);
      } catch (err) {
        console.error("Failed to fetch history comments:", err);
      }
    };

    fetchHistoryComments();
  }, [selectedEmployee]);

  useEffect(() => {
    if (empId != null) {
      handleShowDetails();
    }
  }, [empId]);

  if (!open) return null;
  const currentVisa = selectedEmployee?.visaHistory?.find(v => v.status === "Active");
  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="md">
      <Dialog open={open} onClose={() => {onClose(); setEditMode(false); }} fullWidth maxWidth="lg" sx= {{zIndex: 500}} >
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          <EmployeeBasicInfo
            selectedEmployee={selectedEmployee}
            editMode={editMode}
            handleInputChange={handleInputChange}
            handleAddressChange={handleAddressChange}
            handleRemoveAddress={handleRemoveAddress}
            handleAddAddress={handleAddAddress}
          />
          <DepartmentInfo
            department={selectedEmployee?.department}
            salary={selectedEmployee?.salary}
            editMode={editMode}
            handleInputChange={handleInputChange}
          />
          <VisaInfo
            visa={currentVisa}
            comments={currentComments}
            newComment={newComment}
            editMode={editMode}
            handleVisaHistoryChange={handleVisaHistoryChange}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
          />
          <VisaHistoryInfo historyVisaComments={historyVisaComments || []} />
        </DialogContent>

        <DialogActions>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {!editMode ? (
              <>
                <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>Edit</Button>
                <Button variant="outlined" color="error" onClick={() => {
                  if (selectedEmployee?._id && window.confirm("Are you sure you want to delete this employee?")) {
                    deleteEmployee(selectedEmployee._id);
                  }
                }}>Delete</Button>
              </>
            ) : (
              <>
                <Button variant="contained" color="success" onClick={handleSubmit}>Save</Button>
                <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
              </>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
