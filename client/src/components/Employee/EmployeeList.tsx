import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

// 这里定义 props 类型
interface VisaType {
  _id?: string;
  visaType: string;
  validPeriod: {
    startDate: Date | null;
    expireDate: Date | null;
  };
  status?: string; 
}



interface EmployeeType {
  _id: string;
  firstName: string;
  lastName: string;
  visaHistory: VisaType[];
}

interface EmployeeListProps {
  employeeList: EmployeeType[];
  handleShowDetails: (id: string) => void;
 calculateDaysLeft: (expireDate: string | Date | null) => string | number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employeeList,
  handleShowDetails,
  calculateDaysLeft,
}) => {
  return (
    <>
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
                    ? calculateDaysLeft(visa.validPeriod.expireDate.toString())
                    : "-";
                  return (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={visa.visaType || "Unknown"}
                        secondary={`Expires: ${expire} (${days} days left)`}
                      />
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
    </>
  );
};

export default EmployeeList;

