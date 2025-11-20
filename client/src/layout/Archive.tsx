import { useState } from "react";
import { useConfirm } from "../components/Common/Confirm";
import { Box, Container, Grid, Button } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";

import type { EmployeeItem } from "../api";
import api from "../api/axios";
import { notify } from "../components/Common/Notification/eventBus";

import EmployeeTable from "../components/Employee/EmployeeTable";
import TemporaryDrawer from "../components/Employee/Sidebar";
import UploadEmployee from "../components/Employee/import"

export default function Archive() {
  const confirm = useConfirm();
  const employeeColumns: GridColDef<EmployeeItem>[] = [
    { field: "employeeId", headerName: "Employee ID", width: 130 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
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
    {
      field: "restore",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          onClick={(event) => {
            event.stopPropagation();
            handleRestore(params.row._id); 
          }}
        >
          Restore
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={(event) => {
            event.stopPropagation();
            deleteEmployee(params.row._id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const [reload, setReload] = useState(false);

   const triggerReload = () => {
    setReload(prev => !prev);
  };

  const handleRestore = async (id: string) => {
  try {
    const result = await confirm({
      content: "Are you sure to restore this employee?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (result) {
      await api.post(`/employee/restore/${id}`);
      notify.success("Employee restored successfully!");
      triggerReload();
    }
    
  } catch (err) {
    console.error("Failed to restore employee:", err);
    alert("Failed to restore employee.");
  }
};


const deleteEmployee = async (id: string) => {
  try {
    const result = await confirm({
      title: "Warning!",
      content: "Are you sure you want to delete this employee?",
      confirmText: "Delete",
      cancelText: "No",
      isDelete: true
    });

    if (result) {
      await api.delete(`/employee/deleteEmployee/${id}`);
      notify.success("Employee restored successfully!");
      triggerReload();
    }

  } catch (err: unknown) {
    console.error("Failed to delete employee:", err);
    alert("Failed to delete employee.");
  }
};

  return (
    <Box sx={{ ml: 7 }}>
      <Container>
        {/*Left sidebar */}
        <Box sx={{ mb: 2, mt: 2 }}>
          <TemporaryDrawer />
        </Box>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ mr: 5 }}>
          <EmployeeTable
            title="Archived Cases"
            url="employee/getEmployeeArchive"
            columns={employeeColumns}
            initialSort="employeeId"
            change={reload}
          />
        </Grid>
      </Container>

      <UploadEmployee>
        
      </UploadEmployee>
    </Box>









  );
}
