import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface VisaInput {
  visaType: string;
  startDate: string;
  expireDate: string;
  status?: 'Active' | 'Expired' | 'Pending';
}

interface AddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface TaskItemCreate {
  employeeId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;  
  email: string;
  addresses: AddressInput[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  department: string;
  visaHistory: VisaInput[];
  activateStatus: boolean;
}

interface Employee extends TaskItemCreate {
  _id: string;
}

interface Props {
  open: boolean;
  employeeId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateEmployeeForm({ open, employeeId, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<Partial<TaskItemCreate>>({
    addresses: [],
    visaHistory: [],
    activateStatus: true
  });
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open && employeeId) fetchEmployeeDetails();
  }, [open, employeeId]);

  const fetchEmployeeDetails = async () => {
    if (!employeeId) return;
    try {
      setLoading(true);
      //setError(null);
      const res = await axios.get(`http://localhost:8000/api/employee/getEmployeeById/${employeeId}`);
      const employee: Employee = res.data;

      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: employee.middleName,
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().slice(0, 10) : '',
        email: employee.email,
        salary: employee.salary,
        positionTitle: employee.positionTitle,
        highestDegree: employee.highestDegree,
        department: employee.department,
        activateStatus: employee.activateStatus,
        addresses: employee.addresses || [],
        visaHistory: employee.visaHistory?.map(v => ({
          visaType: v.visaType || '',
          startDate: v.startDate ? new Date(v.startDate).toISOString().slice(0,10) : '',
          expireDate: v.expireDate ? new Date(v.expireDate).toISOString().slice(0,10) : '',
          status: v.status || 'Active'
        })) || []
      });
    } catch (err: any) {
      //setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? checked : value
    }));
  };

  // const addAddress = () => setFormData(prev => ({
  //   ...prev,
  //   addresses: [...(prev.addresses || []), { street: '', city: '', state: '', zip: '', country: '' }]
  // }));

  // const removeAddress = (index: number) => {
  //   const newAddr = [...(formData.addresses || [])];
  //   newAddr.splice(index, 1);
  //   setFormData(prev => ({ ...prev, addresses: newAddr }));
  // };

  // const handleAddressChange = (index: number, field: keyof AddressInput, value: string) => {
  //   const newAddr = [...(formData.addresses || [])];
  //   newAddr[index] = { ...newAddr[index], [field]: value };
  //   setFormData(prev => ({ ...prev, addresses: newAddr }));
  // };

  const addVisa = () => setFormData(prev => ({
    ...prev,
    visaHistory: [...(prev.visaHistory || []), { visaType: '', startDate: '', expireDate: '', status: 'Active' }]
  }));

  const removeVisa = (index: number) => {
    const newVisa = [...(formData.visaHistory || [])];
    newVisa.splice(index, 1);
    setFormData(prev => ({ ...prev, visaHistory: newVisa }));
  };

  const handleVisaChange = (index: number, field: keyof VisaInput, value: string) => {
    const newVisa = [...(formData.visaHistory || [])];
    newVisa[index] = { ...newVisa[index], [field]: value };
    setFormData(prev => ({ ...prev, visaHistory: newVisa }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    try {
      setLoading(true);
      //setError(null);

      const dataToSubmit = {
        ...formData,
        visaHistory: (formData.visaHistory || []).map(v => ({
          visaType: v.visaType,
          startDate: new Date(v.startDate),
          expireDate: new Date(v.expireDate),
          status: v.status || 'Active'
        }))
      };

      await axios.put(
        `http://localhost:8000/api/employee/updateEmployee/${employeeId}`,
        dataToSubmit,
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
    } catch (err: any) {
      //setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ addresses: [], visaHistory: [], activateStatus: true });
    //setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Employee Information</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {loading && !formData.firstName && (
            <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>
          )}
          {/* {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} */}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Update Successful!</Alert>}

          <Box>
            <TextField label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} required disabled={loading} />
            <TextField label="Middle Name" name="middleName" value={formData.middleName || ''} onChange={handleInputChange} disabled={loading} />
            <TextField label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} required disabled={loading} />
            <TextField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleInputChange} InputLabelProps={{ shrink: true }} disabled={loading} />
            <TextField label="Email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} required disabled={loading} />
            <TextField label="Salary" name="salary" type="number" value={formData.salary || 0} onChange={handleInputChange} disabled={loading} />
            <TextField label="Position Title" name="positionTitle" value={formData.positionTitle || ''} onChange={handleInputChange} disabled={loading} />
            <TextField label="Highest Degree" name="highestDegree" value={formData.highestDegree || ''} onChange={handleInputChange} disabled={loading} />
            <TextField label="Department" name="department" value={formData.department || ''} onChange={handleInputChange} disabled={loading} />
            <FormControlLabel
              control={<Checkbox checked={formData.activateStatus || false} onChange={handleInputChange} name="activateStatus" />}
              label="Active Status"
            />
          </Box>

          {/* Address List */}
          <Box>
            <Box>
              <Typography>Address List</Typography>
            </Box>
            <Box mt={2}>
  <Typography>Address</Typography>
  <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
    <TextField
      label="Street"
      value={formData.addresses?.[0]?.street || ''}
      onChange={e => setFormData(prev => ({
        ...prev,
        addresses: [{
          ...prev.addresses?.[0],
          street: e.target.value,
          city: prev.addresses?.[0]?.city || '',
          state: prev.addresses?.[0]?.state || '',
          zip: prev.addresses?.[0]?.zip || '',
          country: prev.addresses?.[0]?.country || ''
        }]
      }))}
      fullWidth
    />
    <TextField
      label="City"
      value={formData.addresses?.[0]?.city || ''}
      onChange={e => setFormData(prev => ({
        ...prev,
        addresses: [{
          ...prev.addresses?.[0],
          street: prev.addresses?.[0]?.street || '',
          city: e.target.value,
          state: prev.addresses?.[0]?.state || '',
          zip: prev.addresses?.[0]?.zip || '',
          country: prev.addresses?.[0]?.country || ''
        }]
      }))}
      fullWidth
    />
    <TextField
      label="State"
      value={formData.addresses?.[0]?.state || ''}
      onChange={e => setFormData(prev => ({
        ...prev,
        addresses: [{
          ...prev.addresses?.[0],
          street: prev.addresses?.[0]?.street || '',
          city: prev.addresses?.[0]?.city || '',
          state: e.target.value,
          zip: prev.addresses?.[0]?.zip || '',
          country: prev.addresses?.[0]?.country || ''
        }]
      }))}
      fullWidth
    />
    <TextField
      label="ZIP Code"
      value={formData.addresses?.[0]?.zip || ''}
      onChange={e => setFormData(prev => ({
        ...prev,
        addresses: [{
          ...prev.addresses?.[0],
          street: prev.addresses?.[0]?.street || '',
          city: prev.addresses?.[0]?.city || '',
          state: prev.addresses?.[0]?.state || '',
          zip: e.target.value,
          country: prev.addresses?.[0]?.country || ''
        }]
      }))}
      fullWidth
    />
    <TextField
      label="Country"
      value={formData.addresses?.[0]?.country || ''}
      onChange={e => setFormData(prev => ({
        ...prev,
        addresses: [{
          ...prev.addresses?.[0],
          street: prev.addresses?.[0]?.street || '',
          city: prev.addresses?.[0]?.city || '',
          state: prev.addresses?.[0]?.state || '',
          zip: prev.addresses?.[0]?.zip || '',
          country: e.target.value
        }]
      }))}
      fullWidth
    />
  </Box>

</Box>
          </Box>

          {/* Visa List */}
          <Box>
            <Box>
              <Typography>Visa History</Typography>
              <Button startIcon={<Add />} size="small" onClick={addVisa}>Add Visa</Button>
            </Box>
            {(formData.visaHistory || []).map((visa, idx) => (
              <Box key={idx}>
                <TextField label="Visa Type" value={visa.visaType} onChange={e => handleVisaChange(idx, 'visaType', e.target.value)} required />
                <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={visa.startDate} onChange={e => handleVisaChange(idx, 'startDate', e.target.value)} required />
                <TextField label="Expire Date" type="date" InputLabelProps={{ shrink: true }} value={visa.expireDate} onChange={e => handleVisaChange(idx, 'expireDate', e.target.value)} required />
                <IconButton color="error" size="small" onClick={() => removeVisa(idx)}><Remove /></IconButton>
              </Box>
            ))}
          </Box>

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading || success}>{loading ? 'Updating...' : 'Update'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
