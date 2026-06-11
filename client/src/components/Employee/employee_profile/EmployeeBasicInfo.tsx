import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface EmployeeBasicInfoProps {
  selectedEmployee: any;
  editMode: boolean;
  handleInputChange: (e: any) => void;
  handleAddressChange: (e: any, idx: number) => void;
  handleRemoveAddress: (idx: number) => void;
  handleAddAddress: () => void;
}

const EmployeeBasicInfo: React.FC<EmployeeBasicInfoProps> = ({
  selectedEmployee,
  editMode,
  handleInputChange,
  handleAddressChange,
  handleRemoveAddress,
  handleAddAddress,
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Basic Information
        </Typography>

        <Grid container spacing={2} columns={{ xs: 12, md: 12 }}>
          {/* First Name */}
          <Grid size={{ xs: 3 }}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              variant="standard"
              value={selectedEmployee?.firstName || ""}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>

          {/* Middle Name */}
          <Grid size={{ xs: 2 }}>
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

          {/* Last Name */}
          <Grid size={{ xs: 3 }}>
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


          {/* Date of Birth */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid size={{ xs: 2 }}>
              <DatePicker
                label="Date of Birth"
                value={
                  selectedEmployee?.dateOfBirth
                    ? dayjs(selectedEmployee.dateOfBirth)
                    : null
                }
                onChange={(newValue) => {
                  if (editMode)
                    handleInputChange({
                      target: {
                        name: "dateOfBirth",
                        value: newValue?.toDate() || null,
                      },
                    });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "standard",
                    InputProps: { readOnly: !editMode },
                  },
                }}
              />
            </Grid>
          </LocalizationProvider>
            <Grid size={{ xs: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={selectedEmployee?.gender || ""}
                  onChange={handleInputChange}
                  variant="standard"
                  disabled={!editMode}
                >
                  <MenuItem value="Male">
                    Male
                  </MenuItem>
                  <MenuItem value="Female">
                    Female
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

          {/* Position Title */}
          <Grid size={{ xs: 3 }}>
            <TextField
              label="Position Title"
              name="positionTitle"
              fullWidth
              variant="standard"
              value={selectedEmployee?.positionTitle || ""}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>



          {/* <Grid
            size={{ xs: 18 }}
            container
            spacing={2}
            columns={18}
            alignItems="center"
            justifyContent="space-between"
          > */}




            <Grid size={{ xs: 2 }} >
              <TextField
                label="Country Of Birth"
                name="countryOfBirth"
                fullWidth
                variant="standard"
                value={selectedEmployee?.countryOfBirth || ""}
                onChange={handleInputChange}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>


            <Grid size={{ xs: 2 }}>
              <TextField
                label="All Citizenship"
                name="allCitizenship"
                fullWidth
                variant="standard"
                value={selectedEmployee?.allCitizenship || ""}
                onChange={handleInputChange}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
            <Grid size={{ xs: 3 }} >
                <TextField
                  label="Highest Degree"
                  name="highestDegree"
                  fullWidth
                  variant="standard"
                  value={selectedEmployee?.highestDegree || ""}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !editMode }}
                />
            </Grid>
            <Grid size={{ xs: 2 }}>
              <TextField
                label="Filed By"
                name="filedBy"
                fullWidth
                variant="standard"
                value={selectedEmployee?.filedBy || ""}
                onChange={handleInputChange}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
          {/* Employee ID */}
          <Grid size={{ xs: 3 }}>
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

            <Grid size={{ xs: 3 }}>
              <TextField
                label="Personal Email"
                name="personalEmail"
                fullWidth
                variant="standard"
                value={selectedEmployee?.personalEmail || ""}
                onChange={handleInputChange}
                InputProps={{ readOnly: !editMode }}
              />
            </Grid>
          <Grid size={{ xs: 3 }}>
            <TextField
              label="School Email"
              name="email"
              fullWidth
              variant="standard"
              value={selectedEmployee?.email || ""}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>








          </Grid>

          {/* Addresses */}
          <Grid size={{ xs: 10 }}>
            {selectedEmployee?.addresses?.length > 0 ? (
              selectedEmployee.addresses.map(
                (addr: string | { address: string }, idx: number) => {
                  const value = typeof addr === "string" ? addr : addr.address;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        mb: 1,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        label={`Address ${idx + 1}`}
                        fullWidth
                        variant="standard"
                        value={value}
                        onChange={(e) => handleAddressChange(e, idx)}
                        InputProps={{ readOnly: !editMode }}
                      />
                      {idx > 0 && (
                        <Button
                          type="button"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveAddress(idx)}
                        >
                          <DeleteIcon />
                        </Button>
                      )}
                    </Box>
                  );
                }
              )
            ) : (
              <Typography>No addresses</Typography>
            )}
          </Grid>

          {/* Add Address Button */}
          <Grid size={{ xs: 4 }} mt={1}>
            {editMode && (
              <Button
                type="button"
                variant="contained"
                size="small"
                onClick={handleAddAddress}
                sx={{ color: "#fdb515" }}
              >
                Add Address
              </Button>
            )}
          </Grid>
        {/* </Grid> */}
      </CardContent>
    </Card>
  );
};

export default EmployeeBasicInfo;
