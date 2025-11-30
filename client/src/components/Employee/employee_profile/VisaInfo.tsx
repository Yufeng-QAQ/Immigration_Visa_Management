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
import  { useState } from "react";
// import type{ CommentType } from "../EmpDetail";
interface Visa {
  _id?: string;
  visaType: string;
  validPeriod: {
    startDate: Date | null;
    expireDate: Date | null;
  };
  status?: string;
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
  editMode: boolean;
  handleVisaHistoryChange: (
    index: number,
    field: "startDate" | "expireDate" | "visaType",
    value: string | Date | null
  ) => void;
  handleAddComment: (visaId: string, content: string) => void;
  handleDeleteComment: (id: string) => void;
  handleEditComment: (id: string, value: string) => void;
  handleSaveComment: (id: string) => void;
}

const VisaInfo: React.FC<VisaInfoProps> = ({
  visa,
  comments,
  editMode,
  handleVisaHistoryChange,
  handleAddComment,
  handleDeleteComment,
  handleEditComment,
  handleSaveComment,
}) => {
  const [newComment, setNewComment] = useState("");

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
                <MenuItem value="H-1B initial COS from J-1">H-1B initial COS from J-1</MenuItem>
                <MenuItem value="H-1B extension">H-1B extension</MenuItem>
                <MenuItem value="H-1B extension recapture">H-1B extension recapture</MenuItem>
                <MenuItem value="H-1B extension AC21 + recapture 7 days">H-1B extension AC21 + recapture 7 days</MenuItem>
                <MenuItem value="TN petition">TN petition</MenuItem>
                <MenuItem value="H-1B port">H-1B port</MenuItem>
                <MenuItem value="OPT - 1 Year">OPT - 1 Year</MenuItem>
                <MenuItem value="OPT - 3 Years">OPT - 3 Years</MenuItem>
                <MenuItem value="Permanent Residency">Permanent Residency</MenuItem>
                <MenuItem value="H-1B (elective)">H-1B (elective)</MenuItem>
                <MenuItem value="H-1B initial COS from F-1 OPT">H-1B initial COS from F-1 OPT</MenuItem>
                
                    

                
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
              <Typography variant="subtitle1" fontWeight={500}>Comments</Typography>

              {comments.map((c) => (
                <Box
                  key={c._id}
                  sx={{ mb: 2, border: "0px solid #ddd", borderRadius: 1 }}
                >
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    value={c.content}
                    InputProps={{ readOnly: !editMode }}
                    onChange={(e) => editMode && handleEditComment(c._id, e.target.value)}
                  />
                  <Grid>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(c.date).toLocaleString()}
                    </Typography>

                    {!editMode && (
                      <Button
                        size="small"
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this comment?")) {
                            handleDeleteComment(c._id!);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    )}


                    {editMode && (
                      <Button
                        size="small"
                        sx={{ p: 0 }}
                        onClick={() => handleSaveComment(c._id)}
                      >
                        Save
                      </Button>
                    )}
                  </Grid>
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
                    disabled={!newComment.trim() || !visa?._id}
                    onClick={() => {
                      if (!visa?._id) return;
                      handleAddComment(visa._id, newComment);
                      setNewComment(""); 
                    }}
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

