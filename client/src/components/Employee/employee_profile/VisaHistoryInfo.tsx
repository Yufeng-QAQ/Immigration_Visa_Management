import React from "react";
import { Card, Grid, Box, Typography, TextField, Button } from "@mui/material";

interface CommentType {
  _id?: string;
  record: string;
  content: string;
  date: string;
}

interface HistoryVisa {
  visaId: string;
  visaType: string;
  status: string;
  comments: CommentType[];
}

interface VisaHistoryInfoProps {
  historyVisaComments: HistoryVisa[];
  editMode: boolean;
  handleEditHistoryComment: (id: string, value: string) => void;
  handleSaveHistoryComment : (id: string) => void;
  handleDeleteComment: (id: string) => void;
}

export const VisaHistoryInfo: React.FC<VisaHistoryInfoProps> = ({
  historyVisaComments,
  editMode,
  handleEditHistoryComment,
  handleSaveHistoryComment ,
  handleDeleteComment,
}) => {
  return (
    <Card elevation={2} sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2} columns={{ xs: 18, md: 18 }}>
        <Grid size={{ xs: 18 }}>
          {historyVisaComments.slice().reverse().map((h, idx) => (
            <Box
              key={idx}
              sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {h.visaType} {h.status ? `(${h.status})` : ""}
              </Typography>

              {(h.comments || []).map((c) => (
                <Box
                  key={c._id}
                  sx={{ mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 1 }}
                >
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    value={c.content}
                    InputProps={{ readOnly: !editMode }}
                    onChange={(e) => editMode && c._id && handleEditHistoryComment(c._id, e.target.value)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(c.date).toLocaleString()}
                  </Typography>
                  {editMode && c._id && (
                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => handleSaveHistoryComment(c._id!)}
                    >
                      Save
                    </Button>
                  )}


                  {!editMode && (
                    <Button
                      size="small"
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => handleDeleteComment(c._id!)}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};


