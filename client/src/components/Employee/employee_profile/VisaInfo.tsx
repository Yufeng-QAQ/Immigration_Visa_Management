import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// import type{ CommentType } from "../EmpDetail";
interface Visa {
  visaType: string;
  validPeriod: {
    startDate: Date | null;
    expireDate: Date | null;
  };
}

interface CommentType {
  _id: string;   
  record: string;
  content: string;
  date: string;
}

interface VisaInfoProps {
  visa: Visa | undefined;
  comments: CommentType[];
  newComment: string;
  editMode: boolean;
  handleVisaHistoryChange: (
    index: number,
    field: "startDate" | "expireDate" | "visaType",
    value: string | Date | null
  ) => void;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
  handleDeleteComment: (id: string) => void;
  handleEditComment: (id: string, value: string) => void;
  handleSaveComment: (id: string) => void;
}

const VisaInfo: React.FC<VisaInfoProps> = ({
  visa,
  comments,
  newComment,
  editMode,
  handleVisaHistoryChange,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
  handleEditComment,
  handleSaveComment,
}) => {
  return (
    <Card elevation={2} sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Current Visa
        </Typography>

        <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
          {/* Visa Type */}
          <Grid size={{ xs: 7 }}>
            <FormControl fullWidth sx={{ m: 0 }}>
              <InputLabel>Visa Type</InputLabel>
              <Select
                name="VisaType"
                value={visa?.visaType || ""}
                onChange={(e) =>
                  handleVisaHistoryChange(0, "visaType", e.target.value)
                }
                variant="standard"
                disabled={!editMode}
              >
                <MenuItem value="J-1">J-1</MenuItem>
                <MenuItem value="H-1B">H-1B</MenuItem>
                <MenuItem value="OPT - 1 Year">OPT - 1 Year</MenuItem>
                <MenuItem value="OPT - 3 Years">OPT - 3 Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Issue & Expire Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid size={{ xs: 7 }}>
              <DatePicker
                label="Issue Date"
                value={visa?.validPeriod.startDate ? dayjs(visa.validPeriod.startDate) : null}
                onChange={(newValue) =>
                  editMode &&
                  handleVisaHistoryChange(0, "startDate", newValue?.toDate() || null)
                }
                slotProps={{
                  textField: { fullWidth: true, variant: "standard", InputProps: { readOnly: !editMode } },
                }}
              />
            </Grid>

            <Grid size={{ xs: 7 }}>
              <DatePicker
                label="Expire Date"
                value={visa?.validPeriod.expireDate ? dayjs(visa.validPeriod.expireDate) : null}
                onChange={(newValue) =>
                  editMode &&
                  handleVisaHistoryChange(0, "expireDate", newValue?.toDate() || null)
                }
                slotProps={{
                  textField: { fullWidth: true, variant: "standard", InputProps: { readOnly: !editMode } },
                }}
              />
            </Grid>
          </LocalizationProvider>

          {/* Comments */}
          <Grid size={{ xs: 18 }}>
            <Box mt={2}>
              <Typography variant="subtitle1">Comments</Typography>

              {comments.map((c) => (
                <Box
                  key={c._id}
                  sx={{ mb: 2, p: 1, border: "1px solid #ddd", borderRadius: 1 }}
                >
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    value={c.content}
                    InputProps={{ readOnly: !editMode }}
                    onChange={(e) => editMode && handleEditComment(c._id, e.target.value)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(c.date).toLocaleString()}
                  </Typography>

                  {!editMode && (
                    <Button
                      size="small"
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      Delete
                    </Button>
                  )}
                  {editMode && (
                    <Button
                      size="small"
                      sx={{ mt:1 }}
                      onClick={()=>handleSaveComment(c._id)}
                    >
                      Save
                    </Button>
                  )}
                </Box>
              ))}

              {editMode && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Add Comment"
                    fullWidth
                    multiline
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    disabled={!newComment.trim()}
                    onClick={handleAddComment}
                  >
                    Add Comment
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default VisaInfo;

