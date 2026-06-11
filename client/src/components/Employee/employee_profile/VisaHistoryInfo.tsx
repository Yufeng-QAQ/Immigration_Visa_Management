import React from "react";
import { Card, Grid, Box, Typography, TextField, Button } from "@mui/material";
import  { useState } from "react";


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
  handleAddComment: (visaId: string, content: string) => void;
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
  handleAddComment,
}) => {
  const [newComments, setNewComments] = useState<Record<string, string>>({});

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
                  sx={{ mb: 2, border: "0px solid #ddd", borderRadius: 1 }}
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
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this comment?")) {
                          handleDeleteComment(c._id!);
                        }
                      }}
                    >
                      Delete
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
                        value={newComments[h.visaId] || ""} // 用 visaId 取值
                        onChange={(e) =>
                          setNewComments((prev) => ({
                            ...prev,
                            [h.visaId]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        disabled={!newComments[h.visaId]?.trim() || !h.visaId}
                        onClick={() => {
                          if (!h.visaId) return;
                          handleAddComment(h.visaId, newComments[h.visaId]!);
                          setNewComments((prev) => ({ ...prev, [h.visaId]: "" })); // 清空对应输入框
                        }}
                      >
                        Add Comment
                      </Button>

                    </Box>
                  )}

            </Box>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};


