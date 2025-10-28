import React from "react";
import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";
import type { Department } from "../../../api";

interface DepartmentInfoProps {
  department?: Department | null;
  salary?: number | string;
  editMode: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DepartmentInfo: React.FC<DepartmentInfoProps> = ({
  department,
  salary,
  editMode,
  handleInputChange,
}) => {
  return (
    <Card elevation={2} sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Department Information
        </Typography>

        <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
          <Grid size={{ xs: 9 }}>
            <TextField
              label="College"
              name="department.collegeName"
              value={department?.collegeName || ""}
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
              value={department?.departmentName || ""}
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
              value={department?.supervisor || ""}
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
              value={department?.admin || ""}
              onChange={handleInputChange}
              fullWidth
              variant="standard"
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>

          <Grid size={{ xs: 7}}>
            <TextField
              label="Salary"
              name="salary"
              value={salary || "0"}
              onChange={handleInputChange}
              fullWidth
              variant="standard"
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DepartmentInfo;

