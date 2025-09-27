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
  Typography, InputLabel, OutlinedInput, InputAdornment, FormControl,
  Dialog,
  Alert,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs, { Dayjs } from 'dayjs';
import type { EmployeeItem, ActiveVisaItem, AddressItem } from "../../api";
import axios from "axios";
import { useState, useEffect } from "react";


interface EditFormProps {
    open: boolean;
    employeeId: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

interface Employee extends EmployeeItem {
  _id: string;
}


export default function Update({ open, employeeId, onClose, onSuccess }:EditFormProps){
    const degrees = ["PhD", "Master", "Bachelor", "Associate", "High School or Equivalent", "Middle School or Lower"];
    const Visatypes = ["J-1", "H-1B", "OPT - 1 Year", "OPT - 3 Years"];
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<EmployeeItem>({
        employeeId: "",
        firstName: "",
        lastName: "",
        middleName: "",
        dateOfBirth: null,
        email: "",
        salary: 0,
        positionTitle: "",
        highestDegree: "",
        addresses: [],
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
    });

    useEffect(() => {
        if (open && employeeId) fetchEmployeeDetails();
      }, [open, employeeId]);


    const fetchEmployeeDetails = async () => {
        try{

            const res = await axios.get(`http://localhost:8000/api/employee/getEmployeeById/${employeeId}`)
            const employee: Employee = res.data;
            //Visa 和 地址 要修.
            setFormData({
                employeeId: employee.employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                middleName: employee.middleName,
                dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : null,
                email: employee.email,
                salary: employee.salary,
                positionTitle: employee.positionTitle,
                highestDegree: employee.highestDegree,
                addresses: employee.addresses,
                departmentInfo: {
                    college: employee.departmentInfo.college,
                    department: employee.departmentInfo.department,
                    supervisor: employee.departmentInfo.supervisor,
                    admin: employee.departmentInfo.admin
                },
                activeVisa: {
                    visaType: employee.activeVisa?.visaType || "",
                    issueDate: employee.activeVisa?.issueDate || null,
                    expireDate: employee.activeVisa?.expireDate || null,
                    status: employee.activeVisa?.status || "Active",
                },
                activateStatus: employee.activateStatus
            });
            console.log(employee.addresses);

        }finally{
            setLoading(false);
        }
        
    }
            // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            //     const { name, value, type, checked } = e.target;
            //     setFormData(prev => ({
            //       ...prev,
            //       [name]: type === 'number' ? Number(value) : type === 'checkbox' ? checked : value
            //     }));
            //   };

            const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value, type, checked } = e.target;
                const val = type === 'number' ? Number(value) : type === 'checkbox' ? checked : value;

                if (name.includes('.')) {
                    // 处理嵌套对象，比如 "departmentInfo.college"
                    const keys = name.split('.'); // ['departmentInfo', 'college']
                    setFormData(prev => {
                    let nested: any = { ...prev };
                    let current = nested;

                    // 遍历到倒数第二个 key
                    for (let i = 0; i < keys.length - 1; i++) {
                        current[keys[i]] = { ...current[keys[i]] }; // 保留已有嵌套对象
                        current = current[keys[i]];
                    }

                    // 设置最后一个 key 的值
                    current[keys[keys.length - 1]] = val;

                    return nested;
                    });
                } else {
                    // 处理顶层字段
                    setFormData(prev => ({
                    ...prev,
                    [name]: val
                    }));
                }
            };




            const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();

                try{
                    setLoading(true);

                    const dataToSubmit = {
                        ...formData,
                        activeVisa: {
                            visaType: formData.activeVisa?.visaType || "",
                            issueDate: formData.activeVisa?.issueDate
                            ? new Date(formData.activeVisa.issueDate)
                            : null,
                            expireDate: formData.activeVisa?.expireDate
                            ? new Date(formData.activeVisa.expireDate)
                            : null,
                            status: formData.activeVisa?.status || "Active"
                        },
                        departmentInfo: {
                            college: formData.departmentInfo?.college || "",
                            department: formData.departmentInfo?.department || "",
                            supervisor: formData.departmentInfo?.supervisor || "",
                            admin: formData.departmentInfo?.admin || ""
                        }
                    };


                    await axios.put(
                        `http://localhost:8000/api/employee/updateEmployee/${employeeId}`,
                        dataToSubmit,
                        { headers: { "Content-Type": "application/json" } }
                    );

                    setSuccess(true);

                } finally{
                    setLoading(false);
                }
            }

                const handleClose = () => {
                    setFormData({
                        employeeId: "",
                        firstName: "",
                        lastName: "",
                        middleName: "",
                        dateOfBirth: null,
                        email: "",
                        salary: 0,
                        positionTitle: "",
                        highestDegree: "",
                        addresses: [],
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
                    });

                    setSuccess(false);
                    setLoading(false);
                    onClose();
                }



    
            const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
                const { value } = e.target;

                setFormData(prev => {
                    const newAddresses = prev.addresses ? [...prev.addresses] : [];
                    newAddresses[index] = { ...newAddresses[index], address: value };
                    return {
                    ...prev,
                    addresses: newAddresses
                    };
                });
            };

            const addAddress = () => {
                setFormData(prev => ({
                    ...prev,
                    addresses: [...(prev.addresses || []), { address: '' }]
                }));
            };

            const removeAddress = (index: number) => {
                setFormData(prev => ({
                    ...prev,
                    addresses: prev.addresses?.filter((_, i) => i !== index) || []
                }));
            };
            
            const handleVisaChange = (
                field: keyof ActiveVisaItem, // "visaType" | "issueDate" | "expireDate" | "status"
                value: string | Date
                ) => {
                setFormData(prev => ({
                    ...prev,
                    activeVisa: {
                    ...prev.activeVisa!,
                    [field]: value
                    }
                }));
            };

            const formatDate = (date: string | Date | null) => {
                if (!date) return "";
                const d = new Date(date);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
            };
        



        

     

      return(
        <Dialog open = {open} onClose={handleClose}>
            <DialogTitle>Update Employee Information</DialogTitle>
            <form onSubmit = {handleSubmit}>
                <DialogContent>
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Update Successful!</Alert>}

                    <Box>
                        <TextField label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} required disabled={loading} />
                        <TextField label="Middle Name" name="middleName" value={formData.middleName || ''} onChange={handleInputChange} disabled={loading} />
                        <TextField label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} required disabled={loading} />
                        <TextField label="Email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} required disabled={loading} />
                        <TextField label="Salary" name="salary" type="number" value={formData.salary || 0} onChange={handleInputChange} disabled={loading} />
                        <TextField label="Position Title" name="positionTitle" value={formData.positionTitle || ''} onChange={handleInputChange} disabled={loading} />
                        <TextField label="Highest Degree" name="highestDegree" value={formData.highestDegree || ''} onChange={handleInputChange} disabled={loading} />

                        <TextField
                            label="Date of Birth"
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().slice(0, 10) : ''}
                            onChange={e => {
                                const newDate = e.target.value ? new Date(e.target.value) : null;
                                setFormData(prev => ({ ...prev, dateOfBirth: newDate }));
                            }}
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                        />                        

                        <TextField
                            label="College"
                            name="departmentInfo.college"
                            value={formData.departmentInfo?.college || ''}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Department"
                            name="departmentInfo.department"
                            value={formData.departmentInfo?.department  || ''}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <TextField
                            label="supervisor"
                            name="departmentInfo.supervisor"
                            value={formData.departmentInfo?.supervisor || ''}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <TextField
                            label="Admin"
                            name="departmentInfo.admin"
                            value={formData.departmentInfo?.admin || ''}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    </Box>



                    <Box>
                        <Box>
                            <Typography>Address List</Typography>
                        </Box>
                        <Box>
                            {formData.addresses.map((addr, index) => (
                                <Box key={index} display="flex" alignItems="center" mb={1}>
                                <TextField
                                    label={`Address ${index + 1}`}
                                    value={addr.address || ''}
                                    onChange={e => handleAddressChange(e, index)}
                                    disabled={loading}
                                    fullWidth
                                />
                                <Button
                                    onClick={() => removeAddress(index)}
                                    color="error"
                                    variant="outlined"
                                    sx={{ ml: 1 }}
                                >
                                    Remove
                                </Button>
                                </Box>
                            ))}
                            <Button onClick={addAddress} variant="contained" sx={{ mt: 2 }}>
                                Add Address
                            </Button>
                        </Box>


                        <Box>
                            <Typography>Visa</Typography>
                               <TextField
                                    label="Visa Type"
                                    value={formData.activeVisa?.visaType || ""}
                                    onChange={e => handleVisaChange("visaType", e.target.value)}
                                    required
                                />

                               <TextField
                                    label="Issue Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formatDate(formData.activeVisa?.issueDate)}
                                    onChange={e => handleVisaChange("issueDate", e.target.value)}
                                    required
                                />


                                <TextField
                                    label="Expire Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formatDate(formData.activeVisa?.expireDate)}
                                    onChange={e => handleVisaChange("expireDate", e.target.value)}
                                    required
                                />

                                <TextField
                                    label="Status"
                                    value={formData.activeVisa?.status || ""}
                                    onChange={e => handleVisaChange("status", e.target.value)}
                                    required
                                />
                        </Box>

                        



                    </Box>





                </DialogContent>
            </form>
        </Dialog>
      )




}